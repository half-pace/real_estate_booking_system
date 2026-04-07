import User from './User.js';
import Property from './Property.js';
import Booking from './Booking.js';
import Review from './Review.js';

// User -> Property (agent)
User.hasMany(Property, { foreignKey: 'agentId', as: 'properties' });
Property.belongsTo(User, { foreignKey: 'agentId', as: 'agent' });

// User -> Booking
User.hasMany(Booking, { foreignKey: 'userId', as: 'bookings' });
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Property -> Booking
Property.hasMany(Booking, { foreignKey: 'propertyId', as: 'bookings' });
Booking.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// User -> Review
User.hasMany(Review, { foreignKey: 'userId', as: 'reviews' });
Review.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// Property -> Review
Property.hasMany(Review, { foreignKey: 'propertyId', as: 'reviews' });
Review.belongsTo(Property, { foreignKey: 'propertyId', as: 'property' });

// User favorites (many-to-many)
const UserFavorite = User.belongsToMany(Property, {
  through: 'user_favorites',
  as: 'favorites',
  foreignKey: 'userId',
  otherKey: 'propertyId',
  timestamps: true,
});

Property.belongsToMany(User, {
  through: 'user_favorites',
  as: 'favoritedBy',
  foreignKey: 'propertyId',
  otherKey: 'userId',
});

export { User, Property, Booking, Review };
