import { Op } from 'sequelize';
import Booking from '../models/Booking.js';
import Property from '../models/Property.js';
import User from '../models/User.js';

// @desc    Get user's bookings
// @route   GET /api/bookings
export const getBookings = async (req, res) => {
  try {
    const where = req.user.role === 'admin' ? {} : { userId: req.user.id };
    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage', 'price', 'locationCity', 'locationState', 'locationAddress', 'type'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Transform property data for frontend compatibility
    const transformed = bookings.map(b => {
      const json = b.toJSON();
      if (json.property) {
        json.property.location = {
          city: json.property.locationCity,
          state: json.property.locationState,
          address: json.property.locationAddress,
        };
        json.property.price = parseFloat(json.property.price);
        delete json.property.locationCity;
        delete json.property.locationState;
        delete json.property.locationAddress;
      }
      return json;
    });

    res.json({ success: true, bookings: transformed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
export const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [
        { model: Property, as: 'property' },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'avatar', 'phone'] },
      ],
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    // User can only see their own bookings (unless admin)
    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create booking
// @route   POST /api/bookings
export const createBooking = async (req, res) => {
  try {
    const { property: propertyId, checkIn, checkOut, guests, notes } = req.body;

    const property = await Property.findByPk(propertyId);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    if (property.status !== 'available') {
      return res.status(400).json({ success: false, message: 'Property is not available' });
    }

    // Check for overlapping bookings
    const existingBooking = await Booking.findOne({
      where: {
        propertyId,
        status: { [Op.in]: ['pending', 'confirmed'] },
        checkIn: { [Op.lt]: new Date(checkOut) },
        checkOut: { [Op.gt]: new Date(checkIn) },
      },
    });

    if (existingBooking) {
      return res.status(400).json({ success: false, message: 'Property is already booked for these dates' });
    }

    // Calculate total price (per night)
    const nights = Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24));
    const totalPrice = parseFloat(property.price) * nights;

    const booking = await Booking.create({
      propertyId,
      userId: req.user.id,
      checkIn,
      checkOut,
      guests,
      totalPrice,
      notes,
    });

    const populatedBooking = await Booking.findByPk(booking.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage', 'price', 'locationCity', 'locationState', 'locationAddress'],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
      ],
    });

    const json = populatedBooking.toJSON();
    if (json.property) {
      json.property.location = {
        city: json.property.locationCity,
        state: json.property.locationState,
        address: json.property.locationAddress,
      };
      json.property.price = parseFloat(json.property.price);
      delete json.property.locationCity;
      delete json.property.locationState;
      delete json.property.locationAddress;
    }

    res.status(201).json({ success: true, booking: json });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
export const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    await booking.update(req.body);
    await booking.reload({
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage', 'price', 'locationCity', 'locationState', 'locationAddress'],
        },
      ],
    });

    const json = booking.toJSON();
    if (json.property) {
      json.property.location = {
        city: json.property.locationCity,
        state: json.property.locationState,
        address: json.property.locationAddress,
      };
      json.property.price = parseFloat(json.property.price);
    }

    res.json({ success: true, booking: json });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (booking.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    if (booking.status === 'confirmed' && booking.property) {
      await booking.property.update({ status: 'available' });
    }

    await booking.update({ status: 'cancelled' });
    res.json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update booking status (Agent/Admin)
// @route   PUT /api/bookings/:id/status
export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const property = booking.property;
    if (!property) {
      return res.status(404).json({ success: false, message: 'Associated property not found' });
    }

    // Agent can only manage bookings for their properties
    if (property.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to manage this booking' });
    }

    if (status === 'confirmed') {
      if (property.status !== 'available') {
        return res.status(400).json({ success: false, message: 'Property is no longer available' });
      }
      await property.update({ status: 'booked' });
    } else if (status === 'cancelled' || status === 'rejected') {
      if (booking.status === 'confirmed') {
        await property.update({ status: 'available' });
      }
    }

    await booking.update({ status });
    res.json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a booking entirely
// @route   DELETE /api/bookings/:id
export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id, {
      include: [{ model: Property, as: 'property' }]
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const isOwner = booking.userId === req.user.id;
    const isPropertyAgent = booking.property && booking.property.agentId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isPropertyAgent && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this booking' });
    }

    if (booking.status === 'confirmed' && booking.property) {
      await booking.property.update({ status: 'available' });
    }

    await booking.destroy();
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get bookings for a property (agent)
// @route   GET /api/bookings/property/:id
export const getPropertyBookings = async (req, res) => {
  try {
    const property = await Property.findByPk(req.params.id);
    if (!property) {
      return res.status(404).json({ success: false, message: 'Property not found' });
    }

    // Only the agent who owns the property or admin
    if (property.agentId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const bookings = await Booking.findAll({
      where: { propertyId: req.params.id },
      include: [
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'avatar', 'phone'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all bookings for all properties owned by an agent
// @route   GET /api/bookings/agent/me
export const getAgentBookings = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { agentId: req.user.id },
      attributes: ['id']
    });

    const propertyIds = properties.map(p => p.id);

    const bookings = await Booking.findAll({
      where: { propertyId: { [Op.in]: propertyIds } },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage', 'price', 'locationCity', 'locationState', 'locationAddress'],
        },
        { model: User, as: 'user', attributes: ['id', 'name', 'email', 'avatar', 'phone'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Transform property data
    const transformed = bookings.map(b => {
      const json = b.toJSON();
      if (json.property) {
        json.property.location = {
          city: json.property.locationCity,
          state: json.property.locationState,
          address: json.property.locationAddress,
        };
        json.property.price = parseFloat(json.property.price);
        delete json.property.locationCity;
        delete json.property.locationState;
        delete json.property.locationAddress;
      }
      return json;
    });

    res.json({ success: true, bookings: transformed });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
