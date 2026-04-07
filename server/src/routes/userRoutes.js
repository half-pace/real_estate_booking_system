import { Router } from 'express';
import { getProfile, updateProfile, updatePassword, toggleFavorite } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, updatePassword);
router.post('/favorites/:propertyId', protect, toggleFavorite);

export default router;
