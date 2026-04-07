import { DataTypes } from 'sequelize';
import bcrypt from 'bcryptjs';
import { sequelize } from '../config/database.js';

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(50),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a name' },
      len: { args: [1, 50], msg: 'Name cannot exceed 50 characters' },
    },
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: { msg: 'Please provide a valid email' },
      notEmpty: { msg: 'Please provide an email' },
    },
    set(value) {
      this.setDataValue('email', value.toLowerCase());
    },
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: { args: [6, 255], msg: 'Password must be at least 6 characters' },
    },
  },
  role: {
    type: DataTypes.ENUM('user', 'agent', 'admin'),
    defaultValue: 'user',
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: '',
  },
  phone: {
    type: DataTypes.STRING(30),
    defaultValue: '',
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: '',
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
  defaultScope: {
    attributes: { exclude: ['password'] },
  },
  scopes: {
    withPassword: {
      attributes: { include: ['password'] },
    },
  },
});

// Instance method
User.prototype.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Convert to JSON with _id alias for frontend compatibility
User.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;
  delete values.password;
  return values;
};

export default User;
