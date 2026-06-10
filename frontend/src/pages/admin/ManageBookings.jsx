import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { CalendarRange, Search, CheckCircle, XCircle, RefreshCw, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search / filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      toast.error('Failed to retrieve reservations');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking status set to ${newStatus}`);
      fetchBookings();
    } catch (err) {
      toast.error('Failed to update booking status');
    }
  };

  // Filter bookings locally
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          b._id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? b.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="h-64 rounded-2xl bg-slate-900 shimmer" />
    );
  }

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Manage Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">Review guest check-ins, cancel rooms, or authorize pending payments.</p>
        </div>
        <button
          onClick={fetchBookings}
          className="p-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl border border-slate-850 transition-colors"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-3 top-3.5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by Guest, email, or Code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500"
          />
        </div>

        {/* Status Filter */}
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-primary-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending Approval</option>
            <option value="confirmed">Confirmed Stays</option>
            <option value="cancelled">Cancelled Bookings</option>
          </select>
        </div>

      </div>

      {/* Bookings Table */}
      <div className="bg-slate-900/50 border border-slate-900 rounded-2xl p-6">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-500 uppercase text-[9px] font-bold tracking-widest border-b border-slate-850">
              <tr>
                <th className="p-4 rounded-l-xl">Reservation Code</th>
                <th className="p-4">Lead Guest</th>
                <th className="p-4">Hotel Property</th>
                <th className="p-4">Stay Range</th>
                <th className="p-4">Taxes & Price</th>
                <th className="p-4">Payment</th>
                <th className="p-4">Status</th>
                <th className="p-4 rounded-r-xl text-center">Update Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {filteredBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-mono font-bold text-white uppercase flex items-center">
                    <CalendarRange size={14} className="mr-2 text-primary-500" /> {b._id?.substring(0, 10)}
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-white">{b.name}</p>
                    <p className="text-[10px] text-slate-550 mt-0.5">{b.email} | {b.phone}</p>
                  </td>
                  <td className="p-4">
                    <p className="font-semibold text-slate-200">{b.hotelId?.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase mt-0.5">Room {b.roomId?.roomNumber}</p>
                  </td>
                  <td className="p-4 font-medium">
                    <p>{new Date(b.checkInDate).toLocaleDateString()}</p>
                    <p className="text-slate-500 text-[10px]">to {new Date(b.checkOutDate).toLocaleDateString()}</p>
                  </td>
                  <td className="p-4 font-bold text-white">₹{b.totalAmount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      b.paymentStatus === 'paid' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      b.status === 'confirmed'
                        ? 'bg-indigo-500/20 text-indigo-400'
                        : b.status === 'cancelled'
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-yellow-500/10 text-yellow-400'
                    }`}>
                      {b.status}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    {b.status !== 'confirmed' && (
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'confirmed')}
                        className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/20 text-emerald-400 rounded-lg flex items-center gap-1 transition-colors"
                        title="Confirm Booking"
                      >
                        <CheckCircle size={12} /> Confirm
                      </button>
                    )}
                    {b.status !== 'cancelled' && (
                      <button
                        onClick={() => handleStatusUpdate(b._id, 'cancelled')}
                        className="px-2 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-1 transition-colors"
                        title="Cancel Booking"
                      >
                        <XCircle size={12} /> Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ManageBookings;
