import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Review = sequelize.define('Review', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  propertyId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'property_id',
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'user_id',
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: { args: [1], msg: 'Rating must be at least 1' },
      max: { args: [5], msg: 'Rating cannot exceed 5' },
      notNull: { msg: 'Please provide a rating' },
    },
  },
  comment: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a comment' },
      len: { args: [1, 500], msg: 'Comment cannot exceed 500 characters' },
    },
  },
}, {
  tableName: 'reviews',
  timestamps: true,
  indexes: [
    { fields: ['property_id'] },
    { fields: ['user_id'] },
    { unique: true, fields: ['property_id', 'user_id'] },
  ],
});

Review.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  if (values.user) values.user._id = values.user.id;
  if (values.property) values.property._id = values.property.id;
  return values;
};

export default Review;
