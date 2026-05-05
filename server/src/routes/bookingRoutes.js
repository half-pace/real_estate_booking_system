import { Router } from 'express';
import {
  getBookings, getBooking, createBooking,
  updateBooking, cancelBooking, getPropertyBookings,
  updateBookingStatus, deleteBooking, getAgentBookings
} from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', protect, getBookings);
router.get('/agent/me', protect, authorize('agent', 'admin'), getAgentBookings);
router.get('/:id', protect, getBooking);
router.post('/', protect, createBooking);
router.put('/:id', protect, updateBooking);
router.put('/:id/cancel', protect, cancelBooking);
router.put('/:id/status', protect, authorize('agent', 'admin'), updateBookingStatus);
router.delete('/:id', protect, deleteBooking);
router.get('/property/:id', protect, getPropertyBookings);

export default router;
