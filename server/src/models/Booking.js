import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Booking = sequelize.define('Booking', {
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
  checkIn: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_in',
    validate: {
      notEmpty: { msg: 'Please provide check-in date' },
    },
  },
  checkOut: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    field: 'check_out',
    validate: {
      notEmpty: { msg: 'Please provide check-out date' },
    },
  },
  guests: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: { args: [1], msg: 'At least one guest required' },
    },
  },
  totalPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: { min: 0 },
    field: 'total_price',
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled', 'completed'),
    defaultValue: 'pending',
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'paid', 'refunded'),
    defaultValue: 'pending',
    field: 'payment_status',
  },
  notes: {
    type: DataTypes.STRING(500),
  },
}, {
  tableName: 'bookings',
  timestamps: true,
  indexes: [
    { fields: ['user_id'] },
    { fields: ['property_id'] },
    { fields: ['status'] },
  ],
});

Booking.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  values.totalPrice = parseFloat(values.totalPrice);
  if (values.property) values.property._id = values.property.id;
  if (values.user) values.user._id = values.user.id;
  return values;
};

export default Booking;
