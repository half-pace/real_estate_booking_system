import { Op } from 'sequelize';
import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get all properties (with filtering, sorting, pagination)
// @route   GET /api/properties
export const getProperties = async (req, res) => {
  try {
    const {
      type, city, minPrice, maxPrice,
      bedrooms, bathrooms, amenities,
      sort, page = 1, limit = 12,
      search, featured, status
    } = req.query;

    const where = {};

    if (type) where.type = type;
    if (city) where.locationCity = { [Op.like]: `%${city}%` };
    if (status) where.status = status;
    if (featured === 'true') where.featured = true;
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    }
    if (bedrooms) where.bedrooms = { [Op.gte]: Number(bedrooms) };
    if (bathrooms) where.bathrooms = { [Op.gte]: Number(bathrooms) };
    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { locationCity: { [Op.like]: `%${search}%` } },
        { locationAddress: { [Op.like]: `%${search}%` } },
      ];
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort === 'price_asc') order = [['price', 'ASC']];
    if (sort === 'price_desc') order = [['price', 'DESC']];
    if (sort === 'newest') order = [['createdAt', 'DESC']];
    if (sort === 'popular') order = [['views', 'DESC']];
    if (sort === 'rating') order = [['rating', 'DESC']];

    const offset = (Number(page) - 1) * Number(limit);

    const { count: total, rows: properties } = await Property.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'agent',
        attributes: ['id', 'name', 'email', 'avatar', 'phone'],
      }],
      order,
      offset,
      limit: Number(limit),
    });

    // Handle amenities filter in JS (since it's a JSON column)
    let filtered = properties;
    if (amenities) {
      const amenityList = amenities.split(',');
      filtered = properties.filter(p => {
        const propAmenities = p.amenities || [];
        return amenityList.every(a => propAmenities.includes(a));
      });
    }

    res.json({
      success: true,
      properties: filtered,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: amenities ? filtered.length : total,
        pages: Math.ceil((amenities ? filtered.length : total) / Number(limit))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'agent',
        attributes: ['id', 'name', 'email', 'avatar', 'phone', 'bio'],
      }],
    });

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Increment views
    await property.increment('views');
    await property.reload();

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create property
// @route   POST /api/properties
export const createProperty = async (req, res) => {
  try {
    const data = {
      ...req.body,
      agentId: req.user.id,
    };

    // Flatten nested objects from frontend
    if (req.body.location) {
      data.locationAddress = req.body.location.address;
      data.locationCity = req.body.location.city;
      data.locationState = req.body.location.state;
      data.locationCountry = req.body.location.country || 'United States';
      data.locationZipCode = req.body.location.zipCode;
      if (req.body.location.coordinates) {
        data.locationLat = req.body.location.coordinates.lat;
        data.locationLng = req.body.location.coordinates.lng;
      }
    }
    if (req.body.features) {
      data.bedrooms = req.body.features.bedrooms;
      data.bathrooms = req.body.features.bathrooms;
      data.area = req.body.features.area;
      data.parking = req.body.features.parking || 0;
      data.furnished = req.body.features.furnished || false;
    }

    const property = await Property.create(data);
    res.status(201).json({ success: true, property });
  } catch (error) {
    const message = error.errors?.[0]?.message || error.message;
    res.status(500).json({ success: false, message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Make sure agent owns the property (or admin)
    if (property.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to update this property' });
    }

    const data = { ...req.body };
    // Flatten nested objects
    if (req.body.location) {
      data.locationAddress = req.body.location.address;
      data.locationCity = req.body.location.city;
      data.locationState = req.body.location.state;
      data.locationCountry = req.body.location.country;
      data.locationZipCode = req.body.location.zipCode;
      if (req.body.location.coordinates) {
        data.locationLat = req.body.location.coordinates.lat;
        data.locationLng = req.body.location.coordinates.lng;
      }
    }
    if (req.body.features) {
      data.bedrooms = req.body.features.bedrooms;
      data.bathrooms = req.body.features.bathrooms;
      data.area = req.body.features.area;
      data.parking = req.body.features.parking;
      data.furnished = req.body.features.furnished;
    }

    await property.update(data);
    await property.reload({
      include: [{ model: User, as: 'agent', attributes: ['id', 'name', 'email', 'avatar', 'phone'] }]
    });

    res.json({ success: true, property });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);

    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this property' });
    }

    await property.destroy();
    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
export const getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    const similar = await Property.findAll({
      where: {
        id: { [Op.ne]: property.id },
        type: property.type,
        price: {
          [Op.gte]: parseFloat(property.price) * 0.7,
          [Op.lte]: parseFloat(property.price) * 1.3,
        },
      },
      include: [{
        model: User,
        as: 'agent',
        attributes: ['id', 'name', 'avatar'],
      }],
      limit: 4,
    });

    res.json({ success: true, properties: similar });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get agent's properties
// @route   GET /api/properties/agent/me
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { agentId: req.user.id },
      order: [['createdAt', 'DESC']],
    });
    res.json({ success: true, properties });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
