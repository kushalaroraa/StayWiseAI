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
  const { bookingId, razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentMethod } = req.body;

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
      // Idempotency check: Ensure payment is not already processed
      const existingPayment = await Payment.findOne({ transactionId: razorpayPaymentId });
      if (existingPayment) {
        return res.status(400).json({
          success: false,
          message: 'Payment has already been processed.'
        });
      }

      // 1. Create Payment record
      const payment = await Payment.create({
        bookingId: booking._id,
        transactionId: razorpayPaymentId || `tx_mock_${Date.now()}`,
        amount: booking.totalAmount,
        paymentMethod: paymentMethod || 'card',
        status: 'completed',
        rawGatewayResponse: req.body
      });

      // 2. Update Booking record
      booking.paymentStatus = 'paid';
      booking.status = 'confirmed';
      booking.paymentId = payment._id;
      await booking.save();

      // 3. Update User booking history for SmartStay recommender
      await User.findByIdAndUpdate(booking.userId, {
        $addToSet: { 
          bookingHistory: booking.hotelId.toString(),
          preferredLocations: hotel ? hotel.location : []
        }
      });

      // 4. Send Confirmation Email
      try {
        await sendBookingConfirmationEmail(booking, hotelName);
      } catch (emailErr) {
        console.error('Failed to send booking confirmation email:', emailErr);
      }

      res.json({
        success: true,
        message: 'Payment verified and booking confirmed successfully',
        booking
      });
    } else {
      // Update both statuses on failure — never leave a failed booking as 'pending'
      booking.paymentStatus = 'failed';
      booking.status = 'failed';
      await booking.save();

      res.status(400).json({
        success: false,
        message: 'Invalid payment signature. Payment verification failed.'
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
