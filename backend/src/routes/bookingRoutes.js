import express from 'express';
import {
  createBooking,
  getBookingById,
  getMyBookings,
  getBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createBooking)
  .get(protect, admin, getBookings);

router.get('/my-bookings', protect, getMyBookings);

router.route('/:id')
  .get(protect, getBookingById);

router.put('/:id/status', protect, updateBookingStatus);

export default router;
