import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { Calendar, MapPin, Sparkles, AlertCircle, FileText, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings/my-bookings');
      // Filter out failed bookings so they appear as "No booking" to the user
      const activeBookings = data.filter(booking => booking.status !== 'failed');
      setBookings(activeBookings);
    } catch (err) {
      toast.error('Failed to load your reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchMyBookings();
  }, []);

  // Cancellation functionality completely removed for MVP

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-20">
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-left space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-sans">My Bookings</h1>
        <p className="text-sm text-slate-505 dark:text-slate-400 mt-1 font-light">
          Track and manage your upcoming and completed hotel stays.
        </p>
      </div>

      {bookings.length === 0 ? (
        <div className="glass-card p-12 text-center rounded-2xl space-y-4 max-w-xl mx-auto">
          <AlertCircle size={40} className="text-slate-350 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">No bookings found</h3>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            You haven't made any hotel reservations yet. Start exploring properties to book your first stay!
          </p>
          <button
            onClick={() => navigate('/')}
            className="premium-btn text-white text-xs font-semibold px-4.5 py-2.5 rounded-lg"
          >
            Find Hotels
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium dark:shadow-premium-dark flex flex-col md:flex-row justify-between gap-6"
            >
              
              {/* Left Side: Stay Details */}
              <div className="flex gap-5">
                <img
                  src={booking.hotelId?.images?.[0] || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'}
                  alt={booking.hotelId?.name}
                  className="w-24 h-24 object-cover rounded-xl shrink-0"
                />
                
                <div className="space-y-2">
                  <div>
                    <h3 className="font-extrabold text-slate-905 dark:text-white text-base leading-tight">
                      {booking.hotelId?.name}
                    </h3>
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <MapPin size={12} className="mr-1 text-primary-500 shrink-0" />
                      <span>{booking.hotelId?.location}</span>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <span className="flex items-center"><Calendar size={13} className="mr-1 text-primary-500" /> {new Date(booking.checkInDate).toLocaleDateString()} to {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                    <span className="capitalize bg-slate-100 dark:bg-slate-850 px-2 py-0.5 rounded-md font-semibold text-[10px]">{booking.roomId?.type} Suite</span>
                  </div>
                </div>
              </div>

              {/* Right Side: Price Statuses and Cancellation Actions */}
              <div className="flex flex-col justify-between items-end shrink-0 border-t md:border-t-0 pt-4 md:pt-0 border-slate-100 dark:border-slate-850">
                <div className="text-right space-y-1.5">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                      booking.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      {booking.paymentStatus}
                    </span>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold capitalize ${
                      booking.status === 'confirmed'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : 'bg-yellow-500/10 text-yellow-500'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-lg font-extrabold text-primary-500 leading-none">₹{booking.totalAmount}</p>
                  <p className="text-[10px] text-slate-400 font-mono uppercase">Code: {booking._id?.substring(0, 10)}</p>
                </div>

                <div className="flex gap-2.5 mt-4 md:mt-0">
                  {booking.status === 'confirmed' && (
                    <button
                      onClick={() => navigate(`/booking/confirmation/${booking._id}`)}
                      className="px-3.5 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold rounded-lg flex items-center hover:bg-slate-250 dark:hover:bg-slate-750 transition-colors"
                    >
                      <FileText size={14} className="mr-1.5" /> Details Invoice
                    </button>
                  )}
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default MyBookings;
