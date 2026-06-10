import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';
import Review from '../models/Review.js';

// @desc    Get all hotels (with advanced filtering)
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res) => {
  const { location, minPrice, maxPrice, rating, amenities, roomType, checkIn, checkOut, guests } = req.query;

  try {
    let query = {};

    // 1. Search by location
    if (location) {
      query.$or = [
        { location: { $regex: location, $options: 'i' } },
        { name: { $regex: location, $options: 'i' } }
      ];
      
      // Update User Search History if authorized
      if (req.headers.authorization) {
        try {
          const token = req.headers.authorization.split(' ')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'staywise_secret_jwt_key_12345!');
          await User.findByIdAndUpdate(decoded.id, {
            $addToSet: { searchHistory: location, preferredLocations: location }
          });
        } catch (err) {
          // Token invalid or expired, ignore history update
        }
      }
    }

    // 2. Filter by rating
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // 3. Filter by amenities
    if (amenities) {
      const amenitiesList = amenities.split(',');
      query.amenities = { $all: amenitiesList };
    }

    // 4. Filter by price range
    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = parseFloat(minPrice);
      if (maxPrice) query.pricePerNight.$lte = parseFloat(maxPrice);
    }

    let hotels = await Hotel.find(query);

    // 5. Filter by availability and capacity
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);

      // Find all bookings that overlap with the requested dates
      const overlappingBookings = await Booking.find({
        status: { $nin: ['failed'] },
        $or: [
          {
            checkInDate: { $lt: checkOutDate },
            checkOutDate: { $gt: checkInDate }
          }
        ]
      });

      const bookedRoomIds = overlappingBookings.map(b => b.roomId.toString());

      // Filter hotels based on room availability
      const filteredHotels = [];

      for (let hotel of hotels) {
        let roomQuery = { hotelId: hotel._id, _id: { $nin: bookedRoomIds } };

        if (guests) {
          roomQuery.capacity = { $gte: parseInt(guests) };
        }

        if (roomType) {
          roomQuery.type = roomType;
        }

        const availableRooms = await Room.find(roomQuery);

        if (availableRooms.length > 0) {
          // Temporarily attach available rooms to the hotel object
          const hotelObj = hotel.toObject();
          hotelObj.availableRooms = availableRooms;
          filteredHotels.push(hotelObj);
        }
      }

      return res.json(filteredHotels);
    }

    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get hotel by ID
// @route   GET /api/hotels/:id
// @access  Public
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const rooms = await Room.find({ hotelId: hotel._id });
    const reviews = await Review.find({ hotelId: hotel._id }).populate('userId', 'name avatar');

    res.json({
      ...hotel.toObject(),
      rooms,
      reviews
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel
// @route   POST /api/hotels
// @access  Private/Admin
export const createHotel = async (req, res) => {
  const { name, description, location, images, amenities, pricePerNight, contactEmail, contactPhone } = req.body;

  try {
    const hotel = await Hotel.create({
      name,
      description,
      location,
      images: images || [],
      amenities: amenities || [],
      pricePerNight,
      contactEmail,
      contactPhone
    });

    res.status(201).json(hotel);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a hotel
// @route   PUT /api/hotels/:id
// @access  Private/Admin
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      hotel.name = req.body.name || hotel.name;
      hotel.description = req.body.description || hotel.description;
      hotel.location = req.body.location || hotel.location;
      hotel.images = req.body.images || hotel.images;
      hotel.amenities = req.body.amenities || hotel.amenities;
      hotel.pricePerNight = req.body.pricePerNight || hotel.pricePerNight;
      hotel.contactEmail = req.body.contactEmail || hotel.contactEmail;
      hotel.contactPhone = req.body.contactPhone || hotel.contactPhone;

      const updatedHotel = await hotel.save();
      res.json(updatedHotel);
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a hotel
// @route   DELETE /api/hotels/:id
// @access  Private/Admin
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (hotel) {
      await hotel.deleteOne();
      res.json({ message: 'Hotel removed' });
    } else {
      res.status(404).json({ message: 'Hotel not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a hotel review
// @route   POST /api/hotels/:id/reviews
// @access  Private
export const createHotelReview = async (req, res) => {
  const { rating, comment } = req.body;

  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    const alreadyReviewed = await Review.findOne({
      hotelId: hotel._id,
      userId: req.user._id
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Hotel already reviewed' });
    }

    const review = await Review.create({
      hotelId: hotel._id,
      userId: req.user._id,
      rating: Number(rating),
      comment
    });

    // Recalculate average rating for hotel
    const hotelReviews = await Review.find({ hotelId: hotel._id });
    hotel.reviewsCount = hotelReviews.length;
    hotel.rating = hotelReviews.reduce((acc, r) => r.rating + acc, 0) / hotelReviews.length;
    await hotel.save();

    res.status(201).json(review);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
