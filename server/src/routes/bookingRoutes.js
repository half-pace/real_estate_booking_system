import { Router } from 'express';
import {
  getBookings, getBooking, createBooking,
  updateBooking, cancelBooking, getPropertyBookings
} from '../controllers/bookingController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.delete('/:id', protect, cancelBooking);
router.get('/property/:id', protect, getPropertyBookings);

export default router;
