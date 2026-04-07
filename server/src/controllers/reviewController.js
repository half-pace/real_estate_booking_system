import Review from '../models/Review.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get reviews for a property
// @route   GET /api/reviews/property/:id
export const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { propertyId: req.params.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'avatar'] },
      ],
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { property: propertyId, rating, comment } = req.body;

    // Check property exists
    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Check if user already reviewed
    const existing = await Review.findOne({
      where: { propertyId, userId: req.user.id },
    });
    if (existing) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this property' });
    }

    const review = await Review.create({
      propertyId,
      userId: req.user.id,
      rating,
      comment,
    });

    // Update property rating
    const reviews = await Review.findAll({ where: { propertyId } });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await property.update({
      rating: Math.round(avgRating * 10) / 10,
      reviewCount: reviews.length,
    });

    const populated = await Review.findByPk(review.id, {
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });
    res.status(201).json({ success: true, review: populated });
  } catch (error) {
    const message = error.errors?.[0]?.message || error.message;
    res.status(500).json({ success: false, message });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
export const updateReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.update(req.body);
    await review.reload({
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'avatar'] }],
    });
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByPk(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    if (review.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    await review.destroy();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
