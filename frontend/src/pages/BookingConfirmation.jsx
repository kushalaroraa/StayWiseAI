import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api.js';
import { Check, Mail, Calendar, ArrowRight, Printer, ShieldCheck, MapPin, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        toast.error('Booking not found');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBookingDetails();
  }, [bookingId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="h-72 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!booking) return null;

  if (booking.status === 'failed') {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950/50 rounded-full flex items-center justify-center mx-auto text-red-500 border border-red-200/50 dark:border-red-800/30">
          <AlertCircle size={32} />
        </div>
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Payment Failed</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            We couldn't process your payment. Your booking has been marked as failed and no charges were made.
          </p>
        </div>
        <Link
          to="/"
          className="inline-block mt-4 premium-btn text-white text-xs font-semibold px-5 py-3 rounded-xl"
        >
          Try Booking Again
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-8 print:py-0 print:max-w-full">
      
      {/* Success Banner */}
      <div className="text-center space-y-4 print:hidden">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto text-emerald-500 border border-emerald-200/50 dark:border-emerald-800/30">
          <Check size={32} className="animate-pulse" />
        </div>
        <div className="space-y-1.5">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Booking Confirmed!</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Your transaction completed successfully and your stay is locked in. Let the countdown begin!
          </p>
        </div>
      </div>

      {/* Confirmation Email Status */}
      <div className="glass-card p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5 dark:bg-emerald-950/10 flex items-center space-x-3 text-left print:hidden">
        <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
          <Mail size={18} />
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Receipt Sent</h4>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">We've dispatched a copy of your verified confirmation slip and invoice to <span className="font-semibold">{booking.email}</span>.</p>
        </div>
      </div>

      {/* Booking Invoice Slip */}
      <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium dark:shadow-premium-dark text-left space-y-6 bg-white dark:bg-slate-900">
        
        {/* Slip Header */}
        <div className="flex justify-between items-start border-b dark:border-slate-800 pb-5">
          <div>
            <span className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">StayWise.ai</span>
            <p className="text-[10px] text-slate-400 mt-1 capitalize">Receipt Status: <span className="text-emerald-500 font-bold">Paid</span></p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Booking Code</span>
            <span className="font-mono text-sm font-semibold text-slate-900 dark:text-white uppercase">{booking._id?.substring(0, 10)}</span>
          </div>
        </div>

        {/* Guest and Hotel Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-500">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Property Details</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug">{booking.hotelId?.name}</h3>
            <p className="flex items-center text-slate-450 mt-1"><MapPin size={12} className="mr-1 shrink-0 text-primary-500" /> {booking.hotelId?.location}</p>
            <p className="font-semibold text-slate-700 dark:text-slate-300 mt-1.5 capitalize">{booking.roomId?.type} Suite (Room {booking.roomId?.roomNumber})</p>
          </div>

          <div className="space-y-1 md:text-right">
            <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">Lead Guest</span>
            <h3 className="font-bold text-slate-900 dark:text-white text-sm">{booking.name}</h3>
            <p className="mt-1">{booking.email}</p>
            <p>{booking.phone}</p>
          </div>
        </div>

        {/* Check In / Out Cards */}
        <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-850 py-5 text-xs text-slate-600 dark:text-slate-350">
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Check In Date</span>
            <p className="flex items-center font-bold text-slate-900 dark:text-white"><Calendar size={14} className="mr-1.5 text-primary-500" /> {new Date(booking.checkInDate).toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-450">Standard check-in 12:00 PM</p>
          </div>
          <div className="space-y-1.5 border-l dark:border-slate-800 pl-4">
            <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">Check Out Date</span>
            <p className="flex items-center font-bold text-slate-900 dark:text-white"><Calendar size={14} className="mr-1.5 text-primary-500" /> {new Date(booking.checkOutDate).toLocaleDateString()}</p>
            <p className="text-[10px] text-slate-450">Standard check-out 11:00 AM</p>
          </div>
        </div>

        {/* Cost Summary Tally */}
        <div className="space-y-3.5 pt-2 text-xs">
          <h4 className="font-bold text-[9px] text-slate-400 uppercase tracking-wider">Charges Summary</h4>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Room Base Tariff (including dynamic overrides):</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">₹{booking.totalAmount - Math.round(booking.totalAmount * 0.12) - Math.round(booking.totalAmount * 0.05)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400">
            <span>Taxes & GST (12%):</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">₹{Math.round(booking.totalAmount * 0.12)}</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-400 pb-3 border-b border-dashed border-slate-200 dark:border-slate-800">
            <span>Service & Platform Fee (5%):</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100">₹{Math.round(booking.totalAmount * 0.05)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2">
            <span>Paid Total:</span>
            <span className="text-primary-500 text-lg">₹{booking.totalAmount}</span>
          </div>
        </div>

        {/* Security badge */}
        <div className="pt-4 border-t dark:border-slate-800 flex justify-between items-center text-[10px] text-slate-400">
          <div className="flex items-center space-x-1.5">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Verified Payment Transaction ID: {booking._id?.substring(0, 14)}_secured</span>
          </div>
          <span className="italic">Powered by StayWise.ai</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="w-full sm:w-auto border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-350 text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center"
        >
          <Printer size={15} className="mr-2" /> Print PDF Invoice
        </button>

        <Link
          to="/"
          className="w-full sm:w-auto premium-btn text-white text-xs font-semibold px-5 py-3 rounded-xl flex items-center justify-center"
        >
          Discover More Stays
          <ArrowRight size={15} className="ml-2" />
        </Link>
      </div>

    </div>
  );
};

export default BookingConfirmation;
