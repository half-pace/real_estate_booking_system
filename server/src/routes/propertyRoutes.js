import { Router } from 'express';
import {
  getProperties, getProperty, createProperty,
  updateProperty, deleteProperty, getSimilarProperties, getMyProperties
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

router.get('/', getProperties);
router.get('/agent/me', protect, authorize('agent', 'admin'), getMyProperties);
router.get('/:id', getProperty);
router.get('/:id/similar', getSimilarProperties);
router.post('/', protect, authorize('agent', 'admin'), createProperty);
router.put('/:id', protect, authorize('agent', 'admin'), updateProperty);
router.delete('/:id', protect, authorize('agent', 'admin'), deleteProperty);

export default router;
