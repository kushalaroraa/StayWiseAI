import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

let genAI = null;
let isGeminiConfigured = false;

if (
  process.env.GEMINI_API_KEY &&
  process.env.GEMINI_API_KEY !== 'mock_gemini_key'
) {
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  isGeminiConfigured = true;
}

export const getAIRecommendations = async (userData, availableHotels) => {
  if (!isGeminiConfigured) {
    // console.log('Gemini API not configured. Falling back to local algorithmic recommendations.');
    return getLocalRecommendations(userData, availableHotels);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    const prompt = `
      You are StayWise.ai's recommendation engine, named SmartStay Recommender.
      Analyze the user's booking profile:
      - Search History: ${JSON.stringify(userData.searchHistory || [])}
      - Booking History: ${JSON.stringify(userData.bookingHistory || [])}
      - Preferred Locations: ${JSON.stringify(userData.preferredLocations || [])}
      - User Interests: ${JSON.stringify(userData.interests || [])}
      
      Here is the list of available hotels to recommend from:
      ${JSON.stringify(availableHotels.map(h => ({ id: h._id, name: h.name, location: h.location, amenities: h.amenities, price: h.pricePerNight || 3000, rating: h.rating || 4 })))}

      Based on this data, provide the top personalized recommendations.
      Return the output strictly in JSON format as follows:
      {
        "personalizedRecommendations": ["hotel_id_1", "hotel_id_2"],
        "trendingHotels": ["hotel_id_3"],
        "seasonalRecommendations": ["hotel_id_4"],
        "smartSuggestions": [
          {
            "hotelId": "hotel_id_1",
            "reason": "Based on your interest in spa and pools, we recommend this property which has top-tier spa amenities."
          }
        ]
      }
      Do not add markdown formatting, backticks, or any conversational text. Output pure JSON.
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    // Clean potential markdown wrap
    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error('Error generating AI recommendations, using local fallback:', error);
    return getLocalRecommendations(userData, availableHotels);
  }
};

const getLocalRecommendations = (userData, availableHotels) => {
  const hotelIds = availableHotels.map(h => h._id.toString());
  
  if (hotelIds.length === 0) {
    return {
      personalizedRecommendations: [],
      trendingHotels: [],
      seasonalRecommendations: [],
      smartSuggestions: []
    };
  }

  // Create clean recommendations
  const personalized = hotelIds.slice(0, Math.min(3, hotelIds.length));
  const trending = [...hotelIds].reverse().slice(0, Math.min(3, hotelIds.length));
  const seasonal = hotelIds.slice(Math.min(1, hotelIds.length - 1), Math.min(4, hotelIds.length));
  
  const suggestions = personalized.map((id, index) => {
    const hotel = availableHotels.find(h => h._id.toString() === id);
    const reasons = [
      `Based on your location preference for ${hotel?.location || 'coastal areas'}.`,
      `Matches your high preference for hotels with ${hotel?.amenities?.[0] || 'Wi-Fi'}.`,
      `Matches your previous booking style and price budget of ₹${hotel?.pricePerNight || 3000}/night.`
    ];
    return {
      hotelId: id,
      reason: reasons[index % reasons.length]
    };
  });

  return {
    personalizedRecommendations: personalized,
    trendingHotels: trending,
    seasonalRecommendations: seasonal,
    smartSuggestions: suggestions
  };
};
