import Booking from '../models/Booking.js';
import Payment from '../models/Payment.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../config/razorpay.js';
import { sendBookingConfirmationEmail } from '../utils/emailService.js';

// @desc    Create Razorpay Order for a booking
// @route   POST /api/payments/create-order
// @access  Private
export const createOrder = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorized booking payment' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: `Cannot initiate payment for a booking with status: ${booking.status}` });
    }

    // Call Razorpay API wrapper
    const order = await createRazorpayOrder(booking.totalAmount, booking._id);

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt: order.receipt,
      mock: order.mock || false
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify payment signature & finalize booking
// @route   POST /api/payments/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  const {
    bookingId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    paymentMethod
  } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const hotel = await Hotel.findById(booking.hotelId);
    const hotelName = hotel ? hotel.name : 'StayWise';

    // Verify signature
    const isSignatureValid = verifyRazorpaySignature(
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    );

    if (isSignatureValid) {
      // Idempotency check
      const existingPayment = await Payment.findOne({
        transactionId: razorpayPaymentId
      });

      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment has already been processed.'
        });
      }

      // Create Payment record
      const payment = await Payment.create({
        bookingId: booking._id,
        transactionId: razorpayPaymentId || `tx_mock_${Date.now()}`,
        amount: booking.totalAmount,
        paymentMethod: paymentMethod || 'card',
        status: 'completed',
        rawGatewayResponse: req.body
      });

      // Update Booking
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentId = payment._id;
      await booking.save();

      // Update User booking history
      await User.findByIdAndUpdate(booking.userId, {
        $addToSet: {
          bookingHistory: booking.hotelId.toString(),
          preferredLocations: hotel ? hotel.location : []
        }
      });

      // SEND RESPONSE IMMEDIATELY
      res.json({
        success: true,
        message: 'Payment verified and booking confirmed successfully',
        booking
      });

      // SEND EMAIL IN BACKGROUND
      sendBookingConfirmationEmail(booking, hotelName)
        .then(() => {
          console.log(`Booking confirmation email sent to ${booking.email}`);
        })
        .catch((emailErr) => {
          console.error(
            'Failed to send booking confirmation email:',
            emailErr
          );
        });

      return;
    }

    // Payment verification failed
    booking.paymentStatus = 'failed';
    booking.status = 'failed';
    await booking.save();

    return res.status(400).json({
      success: false,
      message: 'Invalid payment signature. Payment verification failed.'
    });

  } catch (error) {
    console.error('Payment verification error:', error);

    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};