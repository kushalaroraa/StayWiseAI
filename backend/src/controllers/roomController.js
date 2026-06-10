import Room from '../models/Room.js';
import Booking from '../models/Booking.js';

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
export const getRooms = async (req, res) => {
  try {
    const rooms = await Room.find({}).populate('hotelId', 'name location');
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get rooms by Hotel ID
// @route   GET /api/rooms/hotel/:hotelId
// @access  Public
export const getRoomsByHotel = async (req, res) => {
  try {
    const rooms = await Room.find({ hotelId: req.params.hotelId });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a room
// @route   POST /api/rooms
// @access  Private/Admin
export const createRoom = async (req, res) => {
  const { hotelId, roomNumber, type, pricePerNight, capacity, amenities, images } = req.body;

  try {
    const room = await Room.create({
      hotelId,
      roomNumber,
      type,
      pricePerNight,
      capacity,
      amenities: amenities || [],
      images: images || [],
    });

    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a room
// @route   PUT /api/rooms/:id
// @access  Private/Admin
export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      room.roomNumber = req.body.roomNumber || room.roomNumber;
      room.type = req.body.type || room.type;
      room.pricePerNight = req.body.pricePerNight || room.pricePerNight;
      room.capacity = req.body.capacity || room.capacity;
      room.amenities = req.body.amenities || room.amenities;
      room.images = req.body.images || room.images;

      const updatedRoom = await room.save();
      res.json(updatedRoom);
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a room
// @route   DELETE /api/rooms/:id
// @access  Private/Admin
export const deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (room) {
      await room.deleteOne();
      res.json({ message: 'Room removed' });
    } else {
      res.status(404).json({ message: 'Room not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Check single room availability for date range
// @route   POST /api/rooms/check-availability
// @access  Public
export const checkRoomAvailability = async (req, res) => {
  const { roomId, checkIn, checkOut } = req.body;

  try {
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    const overlappingBookings = await Booking.find({
      roomId,
      status: { $nin: ['failed'] },
      $or: [
        {
          checkInDate: { $lt: checkOutDate },
          checkOutDate: { $gt: checkInDate }
        }
      ]
    });

    res.json({ available: overlappingBookings.length === 0 });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set Room dynamic pricing override
// @route   POST /api/rooms/:id/dynamic-pricing
// @access  Private/Admin
export const setDynamicPricing = async (req, res) => {
  const { date, price } = req.body;

  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    const priceDate = new Date(date);
    
    // Find if price for date already exists, if so update it, otherwise push new record
    const existingIndex = room.dynamicPricing.findIndex(
      (p) => p.date.toDateString() === priceDate.toDateString()
    );

    if (existingIndex > -1) {
      room.dynamicPricing[existingIndex].price = Number(price);
    } else {
      room.dynamicPricing.push({ date: priceDate, price: Number(price) });
    }

    await room.save();
    res.json({ message: 'Dynamic pricing configured successfully', dynamicPricing: room.dynamicPricing });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
