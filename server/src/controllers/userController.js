import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Get user profile
// @route   GET /api/users/profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [{ association: 'favorites' }],
    });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, bio, avatar } = req.body;
    const user = await User.findByPk(req.user.id);

    await user.update({ name, phone, bio, avatar });
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update password
// @route   PUT /api/users/password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.scope('withPassword').findByPk(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Toggle favorite property
// @route   POST /api/users/favorites/:propertyId
export const toggleFavorite = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const propertyId = parseInt(req.params.propertyId);
    const property = await Property.findByPk(propertyId);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const hasFavorite = await user.hasFavorite(property);
    if (hasFavorite) {
      await user.removeFavorite(property);
    } else {
      await user.addFavorite(property);
    }

    const favorites = await user.getFavorites({ attributes: ['id'] });
    const favoriteIds = favorites.map(f => f.id);

    res.json({ success: true, favorites: favoriteIds });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
