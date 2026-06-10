import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api.js';
import { Search, MapPin, Calendar, Users, Sparkles, Star, Shield, HelpCircle, ArrowRight, Zap, TrendingUp, SunSnow } from 'lucide-react';
import React from 'react';
import toast from 'react-hot-toast';

const Landing = () => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  // Search fields
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('1');

  // API states
  const [hotels, setHotels] = useState([]);
  const [recommendations, setRecommendations] = useState(null);
  const [loadingHotels, setLoadingHotels] = useState(true);
  const [loadingRecs, setLoadingRecs] = useState(false);

  const lastFetchedUser = useRef(null);
  const hasFetchedHotels = useRef(false);

  useEffect(() => {
    // Fetch featured hotels
    const fetchHotels = async () => {
      if (hasFetchedHotels.current) return;
      hasFetchedHotels.current = true;
      try {
        const { data } = await api.get('/hotels');
        setHotels(data.slice(0, 3));
      } catch (err) {
        console.error('Error fetching hotels:', err);
      } finally {
        setLoadingHotels(false);
      }
    };

    // Fetch AI recommendations if logged in
    const fetchRecs = async () => {
      if (!userInfo) {
        lastFetchedUser.current = null;
        return;
      }

      // Do not show AI recommendations immediately after signup
      if (sessionStorage.getItem('justSignedUp') === 'true') {
        sessionStorage.removeItem('justSignedUp'); // Clear flag for subsequent page navigation or refresh
        return;
      }

      if (lastFetchedUser.current === userInfo._id) return;
      lastFetchedUser.current = userInfo._id;

      setLoadingRecs(true);
      try {
        const { data } = await api.get('/recommendations');
        setRecommendations(data);
      } catch (err) {
        console.error('Error fetching recommendations:', err);
      } finally {
        setLoadingRecs(false);
      }
    };

    fetchHotels();
    fetchRecs();
  }, [userInfo]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!destination) {
      toast.error('Please enter a destination');
      return;
    }
    navigate(`/search-results?location=${destination}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`);
  };

  const navigateToHotel = (id) => {
    navigate(`/hotel/${id}`);
  };

  return (
    <div className="space-y-24 pb-20">

      {/* 1. Hero Section */}
      <section className="relative pt-8 md:pt-12 lg:pt-16 overflow-visible flex flex-col justify-start">
        {/* Background gradient flares */}
        <div className="absolute inset-0 -top-20 -z-10 overflow-hidden pointer-events-none">
          <div className="absolute -top-[10%] left-[5%] w-[600px] h-[600px] rounded-full bg-primary-500/10 blur-[120px] dark:bg-primary-500/5" />
          <div className="absolute top-[0%] right-[2%] w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[100px] dark:bg-indigo-500/5" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[900px] h-[380px] rounded-full opacity-60 bg-gradient-to-r from-purple-500/8 via-indigo-400/6 to-transparent blur-[140px] animate-hero-glow" />
        </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10 pt-2">
          <div className="inline-flex items-center space-x-2 bg-white/10 dark:bg-primary-500/5 border border-white/20 dark:border-primary-500/10 px-4 py-2 rounded-full text-xs font-bold text-primary-600 dark:text-primary-400 backdrop-blur-xl shadow-sm animate-fade-in-up">
            <Sparkles size={14} className="animate-pulse text-primary-500" />
            <span className="tracking-wide uppercase text-[10px]">SmartStay Recommender 2.0</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight lg:leading-[1.06] relative z-20">
            <span className="inline-block animate-fade-in-up">The Intelligent Way to</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-indigo-600 dark:from-primary-400 dark:to-indigo-400 inline-block animate-hero-glow">
              Discover Luxury Stays
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 font-light leading-relaxed animate-fade-in-up delay-150 relative z-20">
            StayWise.ai uses AI-powered insights to help you discover, compare, and book the perfect stay for every journey.
          </p>

          {/* Search interface - single-row pill layout */}
          <form onSubmit={handleSearch} className="max-w-4xl mx-auto p-0 glass-card shadow-2xl dark:shadow-premium-dark rounded-3xl md:rounded-full flex flex-col md:flex-row items-center text-slate-800 dark:text-slate-100 overflow-hidden border border-white/30 dark:border-slate-700/40 mt-4 !translate-y-0 !shadow-premium dark:!shadow-premium-dark !border-white/30 dark:!border-slate-700/40 hover:!translate-y-0">
            <div className="flex flex-col md:flex-row items-center px-4 md:px-6 py-4 md:py-3 gap-4 md:gap-6 w-full">
              {/* Destination (large) */}
              <div className="flex items-center gap-4 flex-1 w-full border-b md:border-none border-slate-200 dark:border-slate-800 pb-3 md:pb-0">
                <MapPin className="text-slate-400 shrink-0" size="20" />
                <div className="w-full">
                  <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider text-left">Destination</label>
                  <input type="text" placeholder="Where are you going?" value={destination} onChange={(e) => setDestination(e.target.value)} className="w-full bg-transparent text-base font-semibold focus:outline-none placeholder-slate-400 text-slate-800 dark:text-white" />
                </div>
              </div>

              {/* Divider (hidden on mobile) */}
              <div className="hidden md:block w-px h-10 bg-slate-200 dark:bg-slate-800/40" />

              {/* Dates & Guests compact group */}
              <div className="flex flex-col sm:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
                <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-none border-slate-200 dark:border-slate-800 pb-3 sm:pb-0">
                  <Calendar className="text-slate-400 shrink-0" size={18} />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Check In</label>
                    <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full sm:w-32 bg-transparent text-sm font-semibold focus:outline-none text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto border-b sm:border-none border-slate-200 dark:border-slate-800 pb-3 sm:pb-0">
                  <Calendar className="text-slate-400 shrink-0" size={18} />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Check Out</label>
                    <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full sm:w-32 bg-transparent text-sm font-semibold focus:outline-none text-slate-800 dark:text-white" />
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto pb-2 sm:pb-0">
                  <Users className="text-slate-400 shrink-0" size={18} />
                  <div className="text-left w-full">
                    <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Guests</label>
                    <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full sm:w-24 bg-transparent text-sm font-semibold focus:outline-none text-slate-800 dark:text-white cursor-pointer">
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-auto pt-2 md:pt-0">
                <button type="submit" className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white p-3 md:px-8 md:py-3.5 rounded-2xl md:rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary-500/30 whitespace-nowrap">
                  <Search size={18} />
                  <span>Search</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* 2. Featured Hotels */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <div>
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Handpicked</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Featured Properties</h2>
          </div>
          <button
            onClick={() => navigate('/search-results')}
            className="text-primary-500 hover:text-primary-600 font-semibold text-sm flex items-center group"
          >
            See All Hotels <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loadingHotels ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card h-96 rounded-2xl shimmer" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {hotels.map((hotel) => (
              <div
                key={hotel._id}
                onClick={() => navigateToHotel(hotel._id)}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:shadow-premium dark:hover:shadow-premium-dark hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between"
              >
                {/* Card header image */}
                <div className="relative overflow-hidden h-56">
                  <img
                    src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-amber-500 flex items-center">
                    <Star size={13} className="fill-amber-500 mr-1 shrink-0" />
                    {hotel.rating}
                  </div>
                </div>

                {/* Card Details */}
                <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{hotel.location}</span>
                    <h3 className="font-bold text-slate-950 dark:text-white text-lg group-hover:text-primary-500 transition-colors leading-tight">
                      {hotel.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {hotel.description}
                    </p>
                  </div>

                  {/* Amenities Preview */}
                  <div className="flex flex-wrap gap-1.5">
                    {hotel.amenities?.slice(0, 3).map((am, index) => (
                      <span
                        key={index}
                        className="bg-slate-100 dark:bg-slate-800 text-[10px] text-slate-600 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full capitalize"
                      >
                        {am}
                      </span>
                    ))}
                    {hotel.amenities?.length > 3 && (
                      <span className="text-[10px] font-bold text-slate-400">+{hotel.amenities.length - 3} more</span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Price Start</p>
                      <p className="text-lg font-extrabold text-primary-500 leading-tight">₹{hotel.pricePerNight} <span className="text-[10px] text-slate-400 font-normal">/ night</span></p>
                    </div>
                    <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-2 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-all">
                      Book Now
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. SmartStay Recommender (moved below Featured Hotels in final flow) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-primary-500 mb-2 font-semibold text-sm">
              <Sparkles size={16} />
              <span>SmartStay Recommender</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Personalized Picks for You</h2>
          </div>
        </div>

        {userInfo ? (
          loadingRecs ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="glass-card h-72 rounded-2xl shimmer" />
              ))}
            </div>
          ) : recommendations ? (
            <div className="space-y-10">
              {/* Spotlight recommendations: more AI-forward cards */}
              {recommendations.smartSuggestions && recommendations.smartSuggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {recommendations.smartSuggestions.map((item, index) => {
                    const hotel = item.hotelId;
                    if (!hotel) return null;
                    const match = Math.round((item.matchScore || 0) * 100);
                    return (
                      <div
                        key={index}
                        onClick={() => navigateToHotel(hotel._id)}
                        className="relative rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-[1.02]"
                      >
                        <img
                          src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                          alt={hotel.name}
                          className="w-full h-64 object-cover rounded-2xl filter brightness-90 group-hover:brightness-100 transition-all duration-400"
                        />
                        {match > 0 && (
                          <div className="absolute top-4 left-4 z-20 bg-primary-600/90 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center space-x-2 shadow-xl border border-white/20">
                            <Zap size={12} className="text-white fill-white animate-pulse" />
                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{match}% Match</span>
                          </div>
                        )}

                        <div className="absolute bottom-0 left-0 right-0 p-6 z-20 space-y-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold text-primary-400 uppercase tracking-widest">{hotel.location}</p>
                            <h3 className="text-xl font-bold text-white leading-tight group-hover:text-primary-300 transition-colors line-clamp-1">{hotel.name}</h3>
                          </div>
                          <p className="text-xs text-slate-300 line-clamp-2 font-light leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                            {hotel.description}
                          </p>
                          <div className="flex justify-between items-center pt-3 border-t border-white/10">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 uppercase font-medium">Starting from</span>
                              <span className="text-lg font-black text-white tracking-tight">₹{hotel.pricePerNight}<span className="text-[10px] font-normal text-slate-400 ml-1">/night</span></span>
                            </div>
                            <div className="flex items-center text-amber-400 text-xs font-bold bg-white/10 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10">
                              <Star size={14} className="fill-amber-400 mr-1.5" />
                              {hotel.rating}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* keep other sections compact */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Seasonal Picks */}
                <div>
                  <h3 className="flex items-center font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">
                    <SunSnow size={18} className="text-primary-500 mr-2" />
                    Seasonal Recommendations
                  </h3>
                  <div className="space-y-3">
                    {recommendations.seasonalRecommendations?.slice(0, 3).map((hotel) => (
                      <div
                        key={hotel._id}
                        onClick={() => navigateToHotel(hotel._id)}
                        className="glass-card p-3.5 rounded-xl hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5">
                          <img src={hotel.images?.[0]} alt={hotel.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-950 dark:text-white">{hotel.name}</h4>
                            <p className="text-xs text-slate-400">{hotel.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-primary-500">₹{hotel.pricePerNight}</p>
                          <p className="text-[10px] text-slate-400">per night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trending Hotels */}
                <div>
                  <h3 className="flex items-center font-bold text-lg text-slate-800 dark:text-slate-200 mb-4">
                    <TrendingUp size={18} className="text-primary-500 mr-2" />
                    Trending Worldwide
                  </h3>
                  <div className="space-y-3">
                    {recommendations.trendingHotels?.slice(0, 3).map((hotel) => (
                      <div
                        key={hotel._id}
                        onClick={() => navigateToHotel(hotel._id)}
                        className="glass-card p-3.5 rounded-xl hover:bg-slate-100/40 dark:hover:bg-slate-800/40 transition-colors flex justify-between items-center cursor-pointer"
                      >
                        <div className="flex items-center space-x-3.5">
                          <img src={hotel.images?.[0]} alt={hotel.name} className="w-12 h-12 object-cover rounded-lg" />
                          <div>
                            <h4 className="font-bold text-sm text-slate-950 dark:text-white">{hotel.name}</h4>
                            <p className="text-xs text-slate-400">{hotel.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-extrabold text-primary-500">₹{hotel.pricePerNight}</p>
                          <p className="text-[10px] text-slate-400">per night</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400">Generate recommendations by search and bookings.</p>
          )
        ) : (
          <div className="glass-card p-8 rounded-3xl text-center max-w-3xl mx-auto border border-dashed border-primary-500/20 dark:border-primary-400/14 space-y-5">
            <Sparkles size={36} className="text-primary-500 mx-auto animate-bounce" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Unlock Personalized Travel Intelligence</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
              Sign in to let StayWise.ai generate recommendations tailored to your travel preferences and booking history.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="premium-btn text-white text-sm font-semibold px-6 py-2.5 rounded-lg inline-flex items-center hover:scale-105 transition-all"
            >
              Sign In <ArrowRight size={14} className="ml-2" />
            </button>
          </div>
        )}
      </section>

      {/* 4. Why StayWise */}
      <section className="bg-slate-50/30 dark:bg-slate-900/20 py-20 relative overflow-hidden">
        {/* Subtle background glow for this section */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500/5 blur-[100px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/5 blur-[100px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3">
            <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest">Platform Core</span>
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Why StayWise.ai?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Box 1 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 text-left shadow-premium hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/50 text-primary-500 flex items-center justify-center">
                <Sparkles size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">AI-Powered Suggestion Engine</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Unlock custom recommendations from our SmartStay system powered by Google Gemini, tailoring hotels to your past stays and booking habits.
              </p>
            </div>

            {/* Box 2 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 text-left shadow-premium hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/50 text-emerald-500 flex items-center justify-center">
                <Zap size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Dynamic Rate Adjustments</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Stay updated with seasonal rate charts. Hotels adjust room prices for peak seasons using our dynamic calendar configuration tools.
              </p>
            </div>

            {/* Box 3 */}
            <div className="glass-card p-8 rounded-2xl space-y-4 text-left shadow-premium hover:scale-[1.02] transition-transform duration-300">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/50 text-indigo-500 flex items-center justify-center">
                <Shield size={24} />
              </div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">Encrypted Razorpay Checkout</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                Finalize room bookings using secure payment channels (UPI, cards, Netbanking) with real-time status updates and PDF invoice receipts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. FAQs */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-primary-500 font-semibold text-sm uppercase tracking-widest text-center">Frictionless</span>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white text-center">Frequently Asked Questions</h2>
        </div>

        <div className="space-y-4">
          <FAQItem
            question="How does the SmartStay recommender customize hotel recommendations?"
            answer="SmartStay feeds your previous searches, bookings, and preferred amenities into a Google Gemini-1.5 AI model. The system filters candidate hotels to suggest properties matching your preferences."
          />
          <FAQItem
            question="Are my payments on StayWise.ai safe and encrypted?"
            answer="Yes, all transactions are processed through Razorpay's API using 256-bit SSL encryption. We support UPI, credit/debit cards, and Netbanking."
          />
          <FAQItem
            question="What is the check-in and check-out timing for hotels?"
            answer="Standard check-in time is 12:00 PM and check-out is 11:00 AM. Some luxury properties may offer flexible timings based on availability, which you can coordinate after your booking is confirmed."
          />
          <FAQItem
            question="Can I book multiple rooms in a single transaction?"
            answer="Currently, the MVP supports booking one room per transaction to ensure accurate real-time inventory and personalized pricing. For group bookings, please contact our concierge team."
          />
        </div>
      </section>

    </div>
  );
};

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="glass-card p-5 rounded-xl border border-slate-200/60 dark:border-slate-800/40">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left text-sm md:text-base font-bold text-slate-900 dark:text-white focus:outline-none"
      >
        <span>{question}</span>
        <HelpCircle size={18} className={`text-primary-500 shrink-0 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <p className="mt-3 text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed pl-1">
          {answer}
        </p>
      )}
    </div>
  );
};

export default Landing;
