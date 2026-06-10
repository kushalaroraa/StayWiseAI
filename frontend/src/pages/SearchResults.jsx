import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Search, MapPin, Star, Sparkles, Filter, X, Grid, SlidersHorizontal, Calendar, Users } from 'lucide-react';
import toast from 'react-hot-toast';

const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Loading and data states
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Filters State (initialized from Search URL params or defaults)
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [rating, setRating] = useState(searchParams.get('rating') || '');
  const [selectedAmenities, setSelectedAmenities] = useState(
    searchParams.get('amenities') ? searchParams.get('amenities').split(',') : []
  );
  const [roomType, setRoomType] = useState(searchParams.get('roomType') || '');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [guests, setGuests] = useState(searchParams.get('guests') || '1');

  const availableAmenities = ['wifi', 'pool', 'spa', 'gym', 'breakfast', 'restaurant', 'beach access', 'bar', 'lake view'];

  const lastFetchedParams = useRef(null);

  // Trigger search fetch whenever URL search parameters change
  useEffect(() => {
    const paramsStr = searchParams.toString();
    if (lastFetchedParams.current === paramsStr) return;
    lastFetchedParams.current = paramsStr;

    const fetchHotels = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        if (searchParams.get('location')) queryParams.location = searchParams.get('location');
        if (searchParams.get('minPrice')) queryParams.minPrice = searchParams.get('minPrice');
        if (searchParams.get('maxPrice')) queryParams.maxPrice = searchParams.get('maxPrice');
        if (searchParams.get('rating')) queryParams.rating = searchParams.get('rating');
        if (searchParams.get('amenities')) queryParams.amenities = searchParams.get('amenities');
        if (searchParams.get('roomType')) queryParams.roomType = searchParams.get('roomType');
        if (searchParams.get('checkIn')) queryParams.checkIn = searchParams.get('checkIn');
        if (searchParams.get('checkOut')) queryParams.checkOut = searchParams.get('checkOut');
        if (searchParams.get('guests')) queryParams.guests = searchParams.get('guests');

        const { data } = await api.get('/hotels', { params: queryParams });
        setHotels(data);
      } catch (err) {
        toast.error('Failed to load hotels matching query');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [searchParams]);

  // Apply filters by sync to URL Search Parameters
  const applyFilters = () => {
    const params = {};
    if (location) params.location = location;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (rating) params.rating = rating;
    if (selectedAmenities.length > 0) params.amenities = selectedAmenities.join(',');
    if (roomType) params.roomType = roomType;
    if (checkIn) params.checkIn = checkIn;
    if (checkOut) params.checkOut = checkOut;
    if (guests) params.guests = guests;

    setSearchParams(params);
    setShowMobileFilters(false);
  };

  const clearFilters = () => {
    setLocation('');
    setMinPrice('');
    setMaxPrice('');
    setRating('');
    setSelectedAmenities([]);
    setRoomType('');
    setCheckIn('');
    setCheckOut('');
    setGuests('1');
    setSearchParams({});
    setShowMobileFilters(false);
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter((a) => a !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const navigateToDetail = (hotelId) => {
    // Preserve dates and guests parameters if present when visiting hotel detail
    let query = '';
    if (checkIn && checkOut) {
      query = `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;
    }
    navigate(`/hotel/${hotelId}${query}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Search Header */}
      <div className="mb-10">
        <div className="max-w-4xl mx-auto glass-card rounded-3xl md:rounded-full shadow-2xl overflow-hidden border border-white/30 dark:border-slate-700/40 !translate-y-0 !shadow-premium dark:!shadow-premium-dark hover:!translate-y-0 p-0">
          <div className="flex flex-col md:flex-row items-center px-4 md:px-6 py-4 md:py-3 gap-4 md:gap-6 w-full">
            {/* Destination (large) */}
            <div className="flex items-center gap-4 flex-1 w-full border-b md:border-none border-slate-200 dark:border-slate-800 pb-3 md:pb-0">
              <MapPin className="text-slate-400 shrink-0" size={20} />
              <div className="w-full">
                <label className="block text-[10px] uppercase font-semibold text-slate-400 tracking-wider text-left">Destination</label>
                <input type="text" placeholder="Where are you going?" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full bg-transparent text-base font-semibold focus:outline-none placeholder-slate-400 text-slate-800 dark:text-white" />
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
              <button onClick={applyFilters} className="w-full md:w-auto bg-primary-500 hover:bg-primary-600 text-white p-3 md:px-8 md:py-3.5 rounded-2xl md:rounded-full font-bold flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-primary-500/30 whitespace-nowrap">
                <Search size={18} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6 font-light">
          {hotels.length} luxury {hotels.length === 1 ? 'property' : 'properties'} available matching your search options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Sidebar Filters - Desktop */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 sticky top-24 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-850 pb-4">
              <h2 className="font-bold text-slate-900 dark:text-white flex items-center">
                <SlidersHorizontal size={16} className="text-primary-500 mr-2" />
                Filters
              </h2>
              <button onClick={clearFilters} className="text-xs text-slate-400 hover:text-primary-500 transition-colors">
                Clear All
              </button>
            </div>

            {/* Location search */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Location / Hotel</label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="City or property name..."
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Price Range */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Price Range (INR)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-1/2 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-1/2 p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                />
              </div>
            </div>

            {/* Star Rating */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Minimum Rating</label>
              <select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">Any rating</option>
                <option value="4.0" className="dark:bg-slate-900">4.0+ Stars</option>
                <option value="4.5" className="dark:bg-slate-900">4.5+ Stars</option>
                <option value="4.8" className="dark:bg-slate-900">4.8+ Stars</option>
              </select>
            </div>

            {/* Room Type */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Room Type</label>
              <select
                value={roomType}
                onChange={(e) => setRoomType(e.target.value)}
                className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer"
              >
                <option value="" className="dark:bg-slate-900">Any Room Type</option>
                <option value="single" className="dark:bg-slate-900">Single</option>
                <option value="double" className="dark:bg-slate-900">Double</option>
                <option value="deluxe" className="dark:bg-slate-900">Deluxe</option>
                <option value="suite" className="dark:bg-slate-900">Suite</option>
              </select>
            </div>

            {/* Amenities Checkboxes */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Amenities</label>
              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {availableAmenities.map((amenity) => (
                  <label key={amenity} className="flex items-center space-x-2.5 text-xs text-slate-600 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => handleAmenityChange(amenity)}
                      className="rounded border-slate-300 dark:border-slate-800 text-primary-500 focus:ring-primary-500"
                    />
                    <span className="capitalize">{amenity}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Dates / Guests */}
            <div className="space-y-2 text-left">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Stays Details</label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs focus:outline-none text-slate-800 dark:text-white"
                  title="Check In"
                />
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs focus:outline-none text-slate-800 dark:text-white"
                  title="Check Out"
                />
                <select
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-transparent text-xs focus:outline-none text-slate-800 dark:text-white cursor-pointer"
                >
                  <option value="1" className="dark:bg-slate-900">1 Guest</option>
                  <option value="2" className="dark:bg-slate-900">2 Guests</option>
                  <option value="3" className="dark:bg-slate-900">3 Guests</option>
                  <option value="4" className="dark:bg-slate-900">4+ Guests</option>
                </select>
              </div>
            </div>

            <button
              onClick={applyFilters}
              className="premium-btn w-full text-white text-sm font-semibold py-2.5 rounded-xl transition-all"
            >
              Apply Parameters
            </button>
          </div>
        </aside>

        {/* Results grid */}
        <main className="col-span-1 lg:col-span-9 space-y-6">
          {/* Mobile Filter Button */}
          <div className="flex justify-between items-center lg:hidden bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
            <span className="text-xs text-slate-400">{hotels.length} results</span>
            <button
              onClick={() => setShowMobileFilters(true)}
              className="flex items-center text-xs font-bold text-primary-500 bg-primary-50 dark:bg-primary-950/40 px-3.5 py-2 rounded-lg"
            >
              <Filter size={14} className="mr-1.5" /> Filter Search
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="glass-card h-80 rounded-2xl shimmer" />
              ))}
            </div>
          ) : hotels.length === 0 ? (
            <div className="glass-card p-12 text-center rounded-2xl space-y-4">
              <Sparkles size={40} className="text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No properties found</h3>
              <p className="text-sm text-slate-500 max-w-sm mx-auto">
                No hotels match your filters. Try adjusting price scopes, selecting fewer amenities, or clearing destinations.
              </p>
              <button
                onClick={clearFilters}
                className="bg-primary-50 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 text-xs font-semibold px-4 py-2 rounded-lg"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {hotels.map((hotel) => (
                <div
                  key={hotel._id}
                  onClick={() => navigateToDetail(hotel._id)}
                  className="glass-card rounded-2xl overflow-hidden group cursor-pointer hover:shadow-premium dark:hover:shadow-premium-dark transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative overflow-hidden h-48">
                    <img
                      src={hotel.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                      alt={hotel.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold text-amber-500 flex items-center">
                      <Star size={12} className="fill-amber-500 mr-1" />
                      {hotel.rating}
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-grow flex flex-col justify-between">
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400">{hotel.location}</span>
                      <h3 className="font-bold text-slate-950 dark:text-white text-base mt-0.5 group-hover:text-primary-500 transition-colors line-clamp-1 leading-snug">
                        {hotel.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                        {hotel.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {hotel.amenities?.slice(0, 3).map((am, index) => (
                        <span
                          key={index}
                          className="bg-slate-100 dark:bg-slate-800 text-[9px] text-slate-500 dark:text-slate-300 font-semibold px-2 py-0.5 rounded-full capitalize"
                        >
                          {am}
                        </span>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-850 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] text-slate-400 uppercase font-bold">Price Start</p>
                        <p className="text-base font-extrabold text-primary-500 leading-none">₹{hotel.pricePerNight} <span className="text-[9px] text-slate-400 font-normal">/ night</span></p>
                      </div>
                      <span className="bg-primary-50 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 text-xs font-bold px-3 py-1.5 rounded-lg group-hover:bg-primary-500 group-hover:text-white transition-all">
                        View Rooms
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {showMobileFilters && (
        <div className="fixed inset-0 z-50 overflow-hidden lg:hidden flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
          <div className="relative ml-auto max-w-xs w-full bg-white dark:bg-slate-950 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b dark:border-slate-800 pb-3">
                <h3 className="font-bold text-slate-900 dark:text-white flex items-center"><Filter size={16} className="mr-2 text-primary-500" /> Filters</h3>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400"><X size={20} /></button>
              </div>

              {/* Mobile Inputs */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-850 bg-transparent rounded-lg text-sm text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-850 bg-transparent rounded-lg text-sm text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-850 bg-transparent rounded-lg text-sm text-slate-800 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2 border border-slate-200 dark:border-slate-850 bg-transparent rounded-lg text-sm text-slate-850 dark:text-white cursor-pointer"
                  >
                    <option value="">Any rating</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button onClick={clearFilters} className="w-1/2 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400">Clear</button>
              <button onClick={applyFilters} className="premium-btn w-1/2 py-2 text-white rounded-xl text-sm font-semibold">Apply</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
