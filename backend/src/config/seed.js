import User from '../models/User.js';
import Hotel from '../models/Hotel.js';
import Room from '../models/Room.js';

export const seedDatabase = async () => {
  try {
    // 1. Seed Users (if empty)
    const userCount = await User.countDocuments({});
    if (userCount === 0) {

      // Admin User
      await User.create({
        name: 'Executive Manager',
        email: 'admin@staywise.ai',
        password: 'admin123',
        role: 'admin',
        phone: '+919999988888',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80',
        interests: ['analytics', 'billing', 'management']
      });

      // Customer User
      await User.create({
        name: 'Aria Sharma',
        email: 'customer@staywise.ai',
        password: 'customer123',
        role: 'customer',
        phone: '+919876543210',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80',
        searchHistory: ['Goa', 'Udaipur'],
        preferredLocations: ['Goa'],
        interests: ['pool', 'spa', 'wifi', 'gym']
      });

    }

    // 2. Seed Hotels (if empty)
    const hotelCount = await Hotel.countDocuments({});
    if (hotelCount === 0) {

      const hotelsData = [
        {
          name: 'The Grand Vista & Spa',
          description: 'Experience pure opulence nested in the pristine cliffs overlooking the sea. Our award-winning resort offers world-class dining, a panoramic infinity pool, and a holistic wellness sanctuary.',
          location: 'Goa, India',
          rating: 4.8,
          reviewsCount: 142,
          pricePerNight: 8500,
          contactEmail: 'grandvista@staywise.ai',
          contactPhone: '+918329990001',
          images: [
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['wifi', 'pool', 'spa', 'gym', 'beach access', 'bar', 'valet parking']
        },
        {
          name: 'Aurelia Lakeside Palace',
          description: 'A romantic heritage palace on the tranquil waters of Lake Pichola. Immerse yourself in royal Rajput hospitality, signature vintage boat rides, and candlelit terrace dining under the stars.',
          location: 'Udaipur, India',
          rating: 4.9,
          reviewsCount: 96,
          pricePerNight: 12500,
          contactEmail: 'aurelia@staywise.ai',
          contactPhone: '+912949990002',
          images: [
            'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['wifi', 'pool', 'spa', 'lake view', 'restaurant', 'airport shuttle', 'butler service']
        },
        {
          name: 'Lumina Urban Suites',
          description: 'A striking architectural wonder in the heart of Mumbai. Sleek, high-rise glass spaces featuring smart automation, panoramic skyline views, and seamless executive lounges.',
          location: 'Mumbai, India',
          rating: 4.6,
          reviewsCount: 210,
          pricePerNight: 9500,
          contactEmail: 'lumina.mumbai@staywise.ai',
          contactPhone: '+91229990003',
          images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['wifi', 'gym', 'business center', 'rooftop bar', 'restaurant', 'valet parking']
        },
        {
          name: 'Hotel Elysée Montaigne',
          description: 'A boutique Parisian classic situated steps from the Champs-Élysées. Offering romantic balconies, freshly baked croissants on private terraces, and timeless European style.',
          location: 'Paris, France',
          rating: 4.7,
          reviewsCount: 88,
          pricePerNight: 18500,
          contactEmail: 'elysee@staywise.ai',
          contactPhone: '+33149990004',
          images: [
            'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1549294413-26f195afcbbe?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['wifi', 'breakfast', 'bar', 'concierge', 'laundry service', 'pet friendly']
        },
        {
          name: 'Kyoto Sanctuary Inn',
          description: 'A tranquil Zen oasis surrounded by bamboo groves and traditional rock gardens. Experience absolute quietude, tatami mat flooring, hot spring baths (Onsen), and tea ceremony spaces.',
          location: 'Tokyo, Japan',
          rating: 4.95,
          reviewsCount: 104,
          pricePerNight: 15000,
          contactEmail: 'kyoto.sanctuary@staywise.ai',
          contactPhone: '+8139990005',
          images: [
            'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80',
            'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80'
          ],
          amenities: ['wifi', 'spa', 'hot spring', 'garden', 'restaurant', 'tea room']
        }
      ];

      for (let hotelData of hotelsData) {
        const hotel = await Hotel.create(hotelData);

        // Seed Rooms for each hotel
        const roomsData = [
          {
            hotelId: hotel._id,
            roomNumber: '101',
            type: 'single',
            pricePerNight: Math.round(hotel.pricePerNight * 0.7),
            capacity: 1,
            amenities: ['wifi', 'cable tv', 'minibar'],
            images: ['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80']
          },
          {
            hotelId: hotel._id,
            roomNumber: '202',
            type: 'double',
            pricePerNight: hotel.pricePerNight,
            capacity: 2,
            amenities: ['wifi', 'cable tv', 'minibar', 'coffee maker'],
            images: ['https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80']
          },
          {
            hotelId: hotel._id,
            roomNumber: '303',
            type: 'deluxe',
            pricePerNight: Math.round(hotel.pricePerNight * 1.3),
            capacity: 3,
            amenities: ['wifi', 'cable tv', 'minibar', 'balcony', 'sofa bed'],
            images: ['https://images.unsplash.com/photo-1568495248636-6432b97bd949?auto=format&fit=crop&w=800&q=80']
          },
          {
            hotelId: hotel._id,
            roomNumber: '404',
            type: 'suite',
            pricePerNight: Math.round(hotel.pricePerNight * 1.8),
            capacity: 4,
            amenities: ['wifi', 'cable tv', 'kitchenette', 'jacuzzi', 'private lounge'],
            images: ['https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80']
          }
        ];

        await Room.insertMany(roomsData);
      }
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};
