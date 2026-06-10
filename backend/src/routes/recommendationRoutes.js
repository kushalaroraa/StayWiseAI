import express from 'express';
import { getUserRecommendations, getSimilarHotels } from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getUserRecommendations);
router.get('/similar/:hotelId', getSimilarHotels);

export default router;
