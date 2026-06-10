import express from 'express';
import {
  getRooms,
  getRoomsByHotel,
  createRoom,
  updateRoom,
  deleteRoom,
  checkRoomAvailability,
  setDynamicPricing,
} from '../controllers/roomController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getRooms)
  .post(protect, admin, createRoom);

router.post('/check-availability', checkRoomAvailability);
router.get('/hotel/:hotelId', getRoomsByHotel);

router.route('/:id')
  .put(protect, admin, updateRoom)
  .delete(protect, admin, deleteRoom);

router.post('/:id/dynamic-pricing', protect, admin, setDynamicPricing);

export default router;
