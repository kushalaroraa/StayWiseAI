import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import api from '../services/api.js';
import { Calendar, Users, FileText, ArrowRight, ShieldCheck, Mail, Phone, User, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { userInfo } = useSelector((state) => state.auth);

  // Route parameters
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const guests = searchParams.get('guests') || '1';
  const hotelId = searchParams.get('hotelId');

  // Page States
  const [room, setRoom] = useState(null);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Cost estimates
  const [summary, setSummary] = useState({
    roomPrice: 0,
    taxes: 0,
    serviceCharges: 0,
    totalAmount: 0
  });

  const lastFetchedBookingKeys = useRef(null);

  useEffect(() => {
    if (!userInfo) {
      navigate('/login', {
        state: {
          from: `/booking/${roomId}?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}&hotelId=${hotelId}`
        }
      });
      return;
    }

    const keys = `${roomId}_${hotelId}_${checkIn}_${checkOut}`;
    if (lastFetchedBookingKeys.current === keys) return;
    lastFetchedBookingKeys.current = keys;

    const fetchCheckoutDetails = async () => {
      setLoading(true);
      try {
        // Fetch hotel & room details
        const hotelRes = await api.get(`/hotels/${hotelId}`);
        setHotel(hotelRes.data);

        const targetRoom = hotelRes.data.rooms?.find(r => r._id === roomId);
        setRoom(targetRoom);

        // Prepopulate cost estimations
        if (targetRoom && checkIn && checkOut) {
          const diff = new Date(checkOut) - new Date(checkIn);
          const days = Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24)));
          
          // Calculate price, check dynamic pricing overrides
          let roomPrice = 0;
          let currentDate = new Date(checkIn);
          const checkOutDate = new Date(checkOut);

          while (currentDate < checkOutDate) {
            const dynamicPrice = targetRoom.dynamicPricing?.find(
              (p) => new Date(p.date).toDateString() === currentDate.toDateString()
            );
            roomPrice += dynamicPrice ? dynamicPrice.price : targetRoom.pricePerNight;
            currentDate.setDate(currentDate.getDate() + 1);
          }

          const taxes = Math.round(roomPrice * 0.12);
          const serviceCharges = Math.round(roomPrice * 0.05);
          const totalAmount = roomPrice + taxes + serviceCharges;

          setSummary({
            roomPrice,
            taxes,
            serviceCharges,
            totalAmount
          });
        }
      } catch (err) {
        toast.error('Failed to load checkout details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (roomId && hotelId) {
      fetchCheckoutDetails();
    }
  }, [roomId, hotelId, checkIn, checkOut, userInfo, navigate, guests]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !phone) {
      toast.error('Please complete all guest details');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        hotelId,
        roomId,
        checkInDate: checkIn,
        checkOutDate: checkOut,
        guests,
        name,
        email,
        phone
      };

      const { data } = await api.post('/bookings', payload);
      toast.success('Reservation booking created successfully!');
      
      // Redirect to payment step
      navigate(`/payment/${data.booking._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="h-80 rounded-2xl shimmer" />
        <div className="h-80 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header */}
      <div className="mb-10 text-left border-b dark:border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Confirm Reservation</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review your room selection details and supply guest details to finalize checkout.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Form */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center">
              <User size={18} className="text-primary-500 mr-2" /> Guest Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-3.5 text-slate-400" />
                    <input
                      type="tel"
                      placeholder="+919876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-3.5 text-slate-400" />
                  <input
                    type="email"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                    required
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">We'll dispatch booking confirmation slips and invoices to this address.</p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-850">
                <button
                  type="submit"
                  disabled={submitting}
                  className="premium-btn w-full text-white text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center disabled:opacity-50"
                >
                  {submitting ? 'Creating booking...' : 'Proceed to Payment'}
                  <ArrowRight size={16} className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Reservation Summary Card */}
        <aside className="lg:col-span-5 space-y-6">
          {/* Hotel Details */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Stay Overview</h3>
            <div className="flex gap-4">
              <img src={hotel?.images?.[0]} alt={hotel?.name} className="w-20 h-20 object-cover rounded-xl shrink-0" />
              <div>
                <h4 className="font-bold text-slate-950 dark:text-white text-base leading-tight">{hotel?.name}</h4>
                <p className="text-xs text-slate-450 flex items-center mt-1"><MapPin size={12} className="mr-1" /> {hotel?.location}</p>
                <p className="text-xs font-semibold text-primary-500 mt-2 uppercase tracking-wide">{room?.type} Suite</p>
              </div>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-850 py-4 text-xs font-semibold text-slate-600 dark:text-slate-350">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Check In</span>
                <p className="flex items-center text-slate-900 dark:text-white mt-0.5"><Calendar size={14} className="mr-1.5 text-primary-500" /> {checkIn ? new Date(checkIn).toLocaleDateString() : '—'}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Check Out</span>
                <p className="flex items-center text-slate-900 dark:text-white mt-0.5"><Calendar size={14} className="mr-1.5 text-primary-500" /> {checkOut ? new Date(checkOut).toLocaleDateString() : '—'}</p>
              </div>
            </div>

            {/* Guests */}
            <div className="flex items-center text-xs text-slate-650 justify-between">
              <span className="text-slate-400">Total Guests:</span>
              <span className="font-bold text-slate-900 dark:text-white flex items-center"><Users size={14} className="mr-1.5 text-primary-500" /> {guests} Guest{parseInt(guests) > 1 ? 's' : ''}</span>
            </div>
          </div>

          {/* Pricing Breakout */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider flex items-center">
              <FileText size={16} className="text-primary-500 mr-2" /> Booking Summary
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Room Base Charges:</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">₹{summary.roomPrice}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Taxes & GST (12%):</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">₹{summary.taxes}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
                <span>StayWise Service Charges (5%):</span>
                <span className="font-semibold text-slate-850 dark:text-slate-200">₹{summary.serviceCharges}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2.5">
                <span>Total Amount Due:</span>
                <span className="text-primary-500 text-lg">₹{summary.totalAmount}</span>
              </div>
            </div>

            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 flex items-center space-x-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold justify-center">
              <ShieldCheck size={14} />
              <span>Full compliance refund cancellation supported</span>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default BookingPage;
