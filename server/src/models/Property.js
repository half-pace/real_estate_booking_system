import { DataTypes } from 'sequelize';
import { sequelize } from '../config/database.js';

const Property = sequelize.define('Property', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a property title' },
      len: { args: [1, 100], msg: 'Title cannot exceed 100 characters' },
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: { msg: 'Please provide a description' },
    },
  },
  type: {
    type: DataTypes.ENUM('apartment', 'house', 'villa', 'condo', 'penthouse', 'studio'),
    allowNull: false,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: { args: [0], msg: 'Price cannot be negative' },
    },
  },
  // Location fields (flattened from nested MongoDB object)
  locationAddress: {
    type: DataTypes.STRING(255),
    allowNull: false,
    field: 'location_address',
  },
  locationCity: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'location_city',
  },
  locationState: {
    type: DataTypes.STRING(100),
    allowNull: false,
    field: 'location_state',
  },
  locationCountry: {
    type: DataTypes.STRING(100),
    defaultValue: 'United States',
    field: 'location_country',
  },
  locationZipCode: {
    type: DataTypes.STRING(20),
    field: 'location_zip_code',
  },
  locationLat: {
    type: DataTypes.DECIMAL(10, 6),
    defaultValue: 40.7128,
    field: 'location_lat',
  },
  locationLng: {
    type: DataTypes.DECIMAL(10, 6),
    defaultValue: -74.0060,
    field: 'location_lng',
  },
  // Features (flattened)
  bedrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  bathrooms: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  area: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: { min: 0 },
  },
  parking: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  furnished: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  // JSON arrays
  amenities: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  images: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  mainImage: {
    type: DataTypes.STRING(500),
    defaultValue: '',
    field: 'main_image',
  },
  status: {
    type: DataTypes.ENUM('available', 'booked', 'sold'),
    defaultValue: 'available',
  },
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: 'agent_id',
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  rating: {
    type: DataTypes.DECIMAL(2, 1),
    defaultValue: 0,
    validate: { min: 0, max: 5 },
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    field: 'review_count',
  },
  featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: 'properties',
  timestamps: true,
  indexes: [
    { fields: ['location_city'] },
    { fields: ['price'] },
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['agent_id'] },
    { fields: ['featured'] },
  ],
});

// Virtual-like toJSON to reproduce MongoDB-like nested structure for the frontend
Property.prototype.toJSON = function () {
  const values = { ...this.get() };
  values._id = values.id;

  // Reconstruct nested objects for frontend compatibility
  values.location = {
    address: values.locationAddress,
    city: values.locationCity,
    state: values.locationState,
    country: values.locationCountry,
    zipCode: values.locationZipCode,
    coordinates: {
      lat: parseFloat(values.locationLat) || 0,
      lng: parseFloat(values.locationLng) || 0,
    },
  };

  values.features = {
    bedrooms: values.bedrooms,
    bathrooms: values.bathrooms,
    area: values.area,
    parking: values.parking,
    furnished: values.furnished,
  };

  values.price = parseFloat(values.price);
  values.rating = parseFloat(values.rating);

  // Clean up flat fields
  delete values.locationAddress;
  delete values.locationCity;
  delete values.locationState;
  delete values.locationCountry;
  delete values.locationZipCode;
  delete values.locationLat;
  delete values.locationLng;

  // Populate agent info if included
  if (values.agent) {
    values.agent._id = values.agent.id;
  }

  return values;
};

export default Property;
