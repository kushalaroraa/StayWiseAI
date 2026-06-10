import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api.js';
import { Star, MapPin, Sparkles, Coffee, Calendar, Users, ShieldAlert, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.auth);

  // States
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState('');
  
  // Review form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  // Booking details (defaulted from query params if present)
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');
  
  // Recommendations state (similar hotels)
  const [similarHotels, setSimilarHotels] = useState([]);

  const lastFetchedId = useRef(null);

  useEffect(() => {
    if (lastFetchedId.current === id) return;
    lastFetchedId.current = id;

    const fetchHotelDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/hotels/${id}`);
        setHotel(data);
        if (data.images && data.images.length > 0) {
          setActiveImage(data.images[0]);
        }
      } catch (err) {
        toast.error('Failed to load hotel details');
        navigate('/search-results');
      } finally {
        setLoading(false);
      }
    };

    const fetchSimilar = async () => {
      try {
        const { data } = await api.get(`/recommendations/similar/${id}`);
        setSimilarHotels(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchHotelDetails();
    fetchSimilar();
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error('Please login to submit a review');
      navigate('/login');
      return;
    }
    if (!comment) {
      toast.error('Please provide a review comment');
      return;
    }

    setSubmittingReview(true);
    try {
      await api.post(`/hotels/${id}/reviews`, { rating, comment });
      toast.success('Review submitted successfully!');
      setComment('');
      // Refresh details to load review
      const { data } = await api.get(`/hotels/${id}`);
      setHotel(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleBookRoom = (room) => {
    if (!userInfo) {
      toast.error('Please log in to make a booking');
      navigate('/login', {
        state: {
          from: `/booking/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&hotelId=${id}`
        }
      });
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error('Please enter Check-In and Check-Out dates');
      const widget = document.getElementById('booking-widget');
      if (widget) widget.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      toast.error('Check-Out date must be after Check-In date');
      return;
    }

    navigate(`/booking/${room._id}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&hotelId=${id}`);
  };

  // Helper to calculate cost for quick preview in room card
  const calculateDays = () => {
    if (!checkIn || !checkOut) return 0;
    const diff = new Date(checkOut) - new Date(checkIn);
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-10">
        <div className="h-96 rounded-3xl shimmer" />
        <div className="h-40 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!hotel) return null;

  const totalDays = calculateDays();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* 1. Large Image Gallery */}
      <section className="space-y-4 text-left">
        <div className="w-full h-[350px] md:h-[500px] rounded-3xl overflow-hidden shadow-premium dark:shadow-premium-dark relative">
          <img src={activeImage} alt={hotel.name} className="w-full h-full object-cover transition-all duration-300" />
          <div className="absolute bottom-6 left-6 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl text-slate-100 flex items-center text-sm font-semibold">
            <Star size={16} className="fill-amber-500 text-amber-500 mr-1.5" />
            <span>{hotel.rating.toFixed(1)} Stars</span>
            <span className="text-slate-400 mx-2">|</span>
            <span className="font-normal">{hotel.reviewsCount} verified guest reviews</span>
          </div>
        </div>

        {/* Thumbnails */}
        {hotel.images && hotel.images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-1 shrink-0">
            {hotel.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Thumbnail ${idx}`}
                onClick={() => setActiveImage(img)}
                className={`w-28 h-20 object-cover rounded-xl cursor-pointer hover:opacity-100 transition-opacity border-2 ${
                  activeImage === img ? 'border-primary-500' : 'border-transparent opacity-70'
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. Hotel Info + Booking Widget Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Details */}
        <div className="lg:col-span-8 space-y-8 text-left">
          <div className="space-y-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{hotel.location}</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white leading-tight">{hotel.name}</h1>
            <p className="flex items-center text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={14} className="text-primary-500 mr-1 shrink-0" />
              <span>{hotel.location}</span>
            </p>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white mb-3">About the property</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-light whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Amenities Offered</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {hotel.amenities?.map((am, index) => (
                <div key={index} className="flex items-center space-x-2.5 bg-slate-100 dark:bg-slate-900/60 p-3 rounded-xl">
                  <CheckCircle2 size={16} className="text-primary-500 shrink-0" />
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 capitalize">{am}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Booking Widget */}
        <aside id="booking-widget" className="lg:col-span-4 sticky top-24">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium dark:shadow-premium-dark space-y-5">
            <div className="flex justify-between items-end border-b dark:border-slate-850 pb-4 text-left">
              <div>
                <p className="text-[10px] text-slate-400 uppercase font-bold">Base Tariff</p>
                <p className="text-2xl font-extrabold text-primary-500">₹{hotel.pricePerNight} <span className="text-xs text-slate-400 font-normal">/ night</span></p>
              </div>
              <span className="text-xs text-slate-500">Starts from</span>
            </div>

            {/* Stay Fields */}
            <div className="space-y-3.5 text-left">
              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Check In</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Check Out</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">Guests</label>
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="1" className="dark:bg-slate-900">1 Guest</option>
                  <option value="2" className="dark:bg-slate-900">2 Guests</option>
                  <option value="3" className="dark:bg-slate-900">3 Guests</option>
                  <option value="4" className="dark:bg-slate-900">4 Guests</option>
                </select>
              </div>
            </div>

            {totalDays > 0 ? (
              <div className="bg-primary-50/50 dark:bg-primary-950/20 p-4 rounded-xl space-y-2 text-sm text-left">
                <div className="flex justify-between font-medium text-slate-600 dark:text-slate-300">
                  <span>Stay Duration:</span>
                  <span>{totalDays} {totalDays === 1 ? 'Night' : 'Nights'}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-900 dark:text-white border-t border-dashed border-primary-500/20 pt-2 text-base">
                  <span>Est. Tariff:</span>
                  <span className="text-primary-500">₹{hotel.pricePerNight * totalDays}</span>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-center flex items-center space-x-2 text-xs text-slate-500 justify-center">
                <Calendar size={14} className="text-primary-500 shrink-0" />
                <span>Select stay dates to calculate price</span>
              </div>
            )}
            
            <a
              href="#rooms-list"
              className="block premium-btn text-center text-white text-sm font-semibold py-3 rounded-xl transition-all"
            >
              Select Room Below
            </a>
          </div>
        </aside>
      </section>

      {/* 3. Rooms List */}
      <section id="rooms-list" className="space-y-6 text-left">
        <div>
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Availability</span>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Choose Your Room</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {hotel.rooms?.map((room) => (
            <div
              key={room._id}
              className="glass-card rounded-2xl overflow-hidden hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300 border border-slate-200/50 dark:border-slate-800/40 flex flex-col md:flex-row"
            >
              {/* Room Image */}
              <img
                src={room.images?.[0] || 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=400&q=80'}
                alt={room.type}
                className="w-full md:w-48 h-40 object-cover shrink-0"
              />

              {/* Room details */}
              <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-950 dark:text-white text-base uppercase tracking-tight">{room.type} Suite</h3>
                    <span className="flex items-center text-xs text-slate-400">
                      <Users size={12} className="mr-1 shrink-0" /> max {room.capacity}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {room.amenities?.map((am, index) => (
                      <span
                        key={index}
                        className="bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-500 dark:text-slate-400 font-semibold px-2 py-0.5 rounded-full capitalize"
                      >
                        {am}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-850">
                  <div>
                    <p className="text-base font-extrabold text-primary-500 leading-none">
                      ₹{room.pricePerNight} <span className="text-[9px] text-slate-400 font-normal">/ night</span>
                    </p>
                    {totalDays > 0 && (
                      <p className="text-[10px] text-slate-400 mt-0.5">Total: ₹{room.pricePerNight * totalDays} ({totalDays} nights)</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleBookRoom(room)}
                    className="premium-btn text-white text-xs font-semibold px-4 py-2 rounded-lg"
                  >
                    Book Room
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Similar Hotels (SmartStay matching) */}
      {similarHotels.length > 0 && (
        <section className="space-y-6 text-left">
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Recommended</span>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Similar Properties</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {similarHotels.map((h) => (
              <div
                key={h._id}
                onClick={() => navigate(`/hotel/${h._id}`)}
                className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:-translate-y-1 transition-all duration-300"
              >
                <img src={h.images?.[0]} alt={h.name} className="w-full h-40 object-cover" />
                <div className="p-4 space-y-2">
                  <h4 className="font-bold text-slate-950 dark:text-white text-sm group-hover:text-primary-500 transition-colors line-clamp-1">{h.name}</h4>
                  <p className="text-xs text-slate-400 flex items-center"><MapPin size={12} className="mr-1 text-primary-500" /> {h.location}</p>
                  <p className="text-sm font-extrabold text-primary-500">₹{h.pricePerNight} <span className="text-[10px] text-slate-400 font-normal">/ night</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Guest Reviews & Comments Feed */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start text-left">
        {/* Reviews Feed */}
        <div className="space-y-6">
          <h2 className="font-bold text-lg text-slate-900 dark:text-white">Verified Reviews ({hotel.reviews?.length || 0})</h2>
          
          {hotel.reviews?.length === 0 ? (
            <div className="p-6 bg-slate-100 dark:bg-slate-900/60 rounded-xl text-center text-xs text-slate-500">
              No reviews have been left for this property yet. Be the first to review!
            </div>
          ) : (
            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
              {hotel.reviews?.map((r) => (
                <div key={r._id} className="glass-card p-4 rounded-xl border border-slate-200/50 dark:border-slate-800/40 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2.5">
                      <img src={r.userId?.avatar} alt={r.userId?.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{r.userId?.name}</span>
                    </div>
                    <span className="flex items-center text-amber-500 text-xs font-semibold">
                      <Star size={11} className="fill-amber-500 mr-0.5" />
                      {r.rating}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-450 leading-relaxed font-light">{r.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Review Form */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-4">
          <h2 className="font-bold text-base text-slate-900 dark:text-white">Leave your feedback</h2>
          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="5" className="dark:bg-slate-900">5 Stars - Exceptional</option>
                <option value="4" className="dark:bg-slate-900">4 Stars - Very Good</option>
                <option value="3" className="dark:bg-slate-900">3 Stars - Average</option>
                <option value="2" className="dark:bg-slate-900">2 Stars - Poor</option>
                <option value="1" className="dark:bg-slate-900">1 Star - Terrible</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Review comment</label>
              <textarea
                rows="3"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your booking and staying experience..."
                className="w-full p-2.5 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="premium-btn w-full text-white text-xs font-semibold py-2.5 rounded-xl transition-all disabled:opacity-50"
            >
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default HotelDetail;
