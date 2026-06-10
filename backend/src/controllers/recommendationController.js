import Recommendation from '../models/Recommendation.js';
import Hotel from '../models/Hotel.js';
import User from '../models/User.js';
import { getAIRecommendations } from '../config/gemini.js';

// @desc    Get smart hotel recommendations for user
// @route   GET /api/recommendations
// @access  Private
export const getUserRecommendations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user details
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if cached recommendations exist and are less than 1 hour old
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const cachedRec = await Recommendation.findOne({ userId, lastUpdated: { $gt: oneHourAgo } })
      .populate('personalizedRecommendations')
      .populate('trendingHotels')
      .populate('seasonalRecommendations')
      .populate('smartSuggestions.hotelId');

    if (cachedRec) {
      return res.json(cachedRec);
    }

    // If cache missed or expired, generate new recommendations
    const allHotels = await Hotel.find({});
    
    // Call Gemini API engine
    const aiResults = await getAIRecommendations(user, allHotels);

    // Save recommendations in the database cache
    const formattedSuggestions = (aiResults.smartSuggestions || [])
      .filter(item => item.hotelId && item.hotelId.match(/^[0-9a-fA-F]{24}$/)) // Validate MongoDB ID format
      .map(item => ({
        hotelId: item.hotelId,
        reason: item.reason
      }));

    const validPersonalized = (aiResults.personalizedRecommendations || [])
      .filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    const validTrending = (aiResults.trendingHotels || [])
      .filter(id => id.match(/^[0-9a-fA-F]{24}$/));
    const validSeasonal = (aiResults.seasonalRecommendations || [])
      .filter(id => id.match(/^[0-9a-fA-F]{24}$/));

    const updatedRec = await Recommendation.findOneAndUpdate(
      { userId },
      {
        personalizedRecommendations: validPersonalized,
        trendingHotels: validTrending,
        seasonalRecommendations: validSeasonal,
        smartSuggestions: formattedSuggestions,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    )
      .populate('personalizedRecommendations')
      .populate('trendingHotels')
      .populate('seasonalRecommendations')
      .populate('smartSuggestions.hotelId');

    res.json(updatedRec);
  } catch (error) {
    console.error('Error generating user recommendations:', error);
    // Return simple local-fallback directly on total failure
    try {
      const allHotels = await Hotel.find({});
      const user = await User.findById(req.user._id);
      const fallbackResults = await getAIRecommendations(user, allHotels);
      
      res.json({
        personalizedRecommendations: allHotels.slice(0, 3),
        trendingHotels: [...allHotels].reverse().slice(0, 3),
        seasonalRecommendations: allHotels.slice(Math.min(1, allHotels.length - 1), Math.min(4, allHotels.length)),
        smartSuggestions: allHotels.slice(0, 3).map((h, i) => ({
          hotelId: h,
          reason: `Recommended based on your preference for properties in ${h.location}.`
        }))
      });
    } catch (fallbackErr) {
      res.status(500).json({ message: error.message });
    }
  }
};

// @desc    Get similar hotels matching current hotel
// @route   GET /api/recommendations/similar/:hotelId
// @access  Public
export const getSimilarHotels = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.hotelId);
    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // Find other hotels in the same location or with matching amenities/price range
    const similar = await Hotel.find({
      _id: { $ne: hotel._id },
      $or: [
        { location: hotel.location },
        { amenities: { $in: hotel.amenities } }
      ]
    }).limit(3);

    res.json(similar);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
