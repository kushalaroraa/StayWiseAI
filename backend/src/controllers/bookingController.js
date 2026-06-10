import Booking from '../models/Booking.js';
import Room from '../models/Room.js';
import Hotel from '../models/Hotel.js';

// Helper to calculate total price including dynamic pricing overrides
const calculateTotalPrice = (room, checkIn, checkOut) => {
  let total = 0;
  let currentDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  while (currentDate < checkOutDate) {
    const dynamicPrice = room.dynamicPricing.find(
      (p) => p.date.toDateString() === currentDate.toDateString()
    );
    total += dynamicPrice ? dynamicPrice.price : room.pricePerNight;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return total;
};

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res) => {
  const { hotelId, roomId, checkInDate, checkOutDate, guests, name, email, phone } = req.body;

  try {
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);

    // Double check availability
    const overlappingBookings = await Booking.find({
      roomId,
      status: { $nin: ['failed'] },
      $or: [
        {
          checkInDate: { $lt: checkOut },
          checkOutDate: { $gt: checkIn }
        }
      ]
    });

    if (overlappingBookings.length > 0) {
      return res.status(400).json({ message: 'Room is already booked for these dates' });
    }

    const roomPrice = calculateTotalPrice(room, checkInDate, checkOutDate);
    const taxes = Math.round(roomPrice * 0.12); // 12% GST
    const serviceCharges = Math.round(roomPrice * 0.05); // 5% Service fee
    const totalAmount = roomPrice + taxes + serviceCharges;

    const booking = await Booking.create({
      userId: req.user._id,
      hotelId,
      roomId,
      name,
      email,
      phone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      guests: Number(guests),
      totalAmount,
      status: 'pending',
      paymentStatus: 'pending'
    });

    res.status(201).json({
      booking,
      summary: {
        roomPrice,
        taxes,
        serviceCharges,
        totalAmount
      }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get booking details
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hotelId')
      .populate('roomId');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Authorization check
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('hotelId')
      .populate('roomId')
      .sort('-createdAt');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
export const getBookings = async (req, res) => {
  const { status, customerName, date } = req.query;

  try {
    let query = {};

    if (status) {
      query.status = status;
    }

    if (customerName) {
      query.name = { $regex: customerName, $options: 'i' };
    }

    if (date) {
      const filterDate = new Date(date);
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      query.checkInDate = {
        $gte: filterDate,
        $lt: nextDay
      };
    }

    const bookings = await Booking.find(query)
      .populate('hotelId', 'name location')
      .populate('roomId', 'roomNumber type')
      .populate('userId', 'name email')
      .sort('-createdAt');

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
export const updateBookingStatus = async (req, res) => {
  const { status } = req.body; // 'confirmed', 'failed'

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Auth validation
    if (booking.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.status = status;

    if (status === 'failed') {
      // If failed, set paymentStatus to failed as well
      booking.paymentStatus = 'failed';
    }

    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
