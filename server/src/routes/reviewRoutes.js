import { Router } from 'express';
import { getPropertyReviews, createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/property/:id', getPropertyReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
