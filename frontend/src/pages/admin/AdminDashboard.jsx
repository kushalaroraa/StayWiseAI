import React, { useState, useEffect } from 'react';
import api from '../../services/api.js';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, DollarSign, Calendar, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // 1. Get analytics data
      const analyticsRes = await api.get('/analytics/dashboard');
      setAnalytics(analyticsRes.data);

      // 2. Get recent bookings
      const bookingsRes = await api.get('/bookings');
      setRecentBookings(bookingsRes.data.slice(0, 5));
    } catch (err) {
      toast.error('Failed to load dashboard metrics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

  if (loading) {
    return (
      <div className="space-y-8 text-left">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-slate-900 border border-slate-850 h-28 rounded-2xl shimmer" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 bg-slate-900 border border-slate-850 h-96 rounded-2xl shimmer" />
          <div className="md:col-span-4 bg-slate-900 border border-slate-850 h-96 rounded-2xl shimmer" />
        </div>
      </div>
    );
  }

  const { metrics, revenueTrends, roomTypeDistribution } = analytics;

  return (
    <div className="space-y-8 text-left">
      
      {/* Title */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Executive Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">Real-time revenue flows, stay occupancy logs, and business insights.</p>
        </div>
        <button
          onClick={fetchAnalytics}
          className="p-2.5 bg-slate-900 hover:bg-slate-850 text-slate-400 hover:text-white rounded-xl border border-slate-800 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw size={15} />
        </button>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Total Revenue */}
        <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Gross Revenue</span>
            <p className="text-2xl font-extrabold text-white leading-none">₹{metrics.totalRevenue.toLocaleString('en-IN')}</p>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1">14.2% Growth vs Last month</p>
          </div>
          <div className="w-11 h-11 bg-primary-500/10 text-primary-400 border border-primary-500/20 rounded-xl flex items-center justify-center">
            <DollarSign size={20} />
          </div>
        </div>

        {/* Total Bookings */}
        <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Total Stays</span>
            <p className="text-2xl font-extrabold text-white leading-none">{metrics.totalBookings}</p>
            <p className="text-[9px] text-emerald-400 font-semibold mt-1">8.5% Occupancy lift</p>
          </div>
          <div className="w-11 h-11 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl flex items-center justify-center">
            <Calendar size={20} />
          </div>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Occupancy Rate</span>
            <p className="text-2xl font-extrabold text-white leading-none">{metrics.occupancyRate}%</p>
            <p className="text-[9px] text-slate-500 mt-1">Active live check-ins today</p>
          </div>
          <div className="w-11 h-11 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-xl flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>

        {/* Available Rooms */}
        <div className="bg-slate-900/60 border border-slate-900 p-6 rounded-2xl flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-450 tracking-wider">Vacant Rooms</span>
            <p className="text-2xl font-extrabold text-white leading-none">{metrics.availableRooms}</p>
            <p className="text-[9px] text-slate-500 mt-1">Available for check-in</p>
          </div>
          <div className="w-11 h-11 bg-pink-500/10 text-pink-400 border border-pink-500/20 rounded-xl flex items-center justify-center">
            <Users size={20} />
          </div>
        </div>

      </div>

      {/* 2. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue Trends Chart */}
        <div className="lg:col-span-8 bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Gross Revenue Trends (INR)</h2>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrends}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: 8, fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorRevenue)" name="Revenue (₹)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Room Type Pie Distribution */}
        <div className="lg:col-span-4 bg-slate-900/50 border border-slate-900 p-6 rounded-2xl flex flex-col justify-between space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Room Category Occupancy</h2>
          <div className="h-[200px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roomTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roomTypeDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#fff', borderRadius: 8, fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-400 font-semibold mt-2">
            {roomTypeDistribution.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="capitalize">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* 3. Recent Bookings Table */}
      <div className="bg-slate-900/50 border border-slate-900 p-6 rounded-2xl space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-350">Recent Reservations</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-500 uppercase text-[9px] font-bold tracking-widest border-b border-slate-850">
              <tr>
                <th className="p-4 rounded-l-xl">Lead Guest</th>
                <th className="p-4">Hotel Property</th>
                <th className="p-4">Room No</th>
                <th className="p-4">Check In</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Payment</th>
                <th className="p-4 rounded-r-xl">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-850">
              {recentBookings.map((b) => (
                <tr key={b._id} className="hover:bg-slate-900/30 transition-colors">
                  <td className="p-4 font-bold text-white">
                    <p>{b.name}</p>
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">{b.email}</p>
                  </td>
                  <td className="p-4">{b.hotelId?.name}</td>
                  <td className="p-4 uppercase">{b.roomId?.roomNumber || 'A2'} - {b.roomId?.type || 'Double'}</td>
                  <td className="p-4">{new Date(b.checkInDate).toLocaleDateString()}</td>
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
                      b.status === 'confirmed' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {b.status}
                    </span>
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

export default AdminDashboard;
