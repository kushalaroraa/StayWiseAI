import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/slices/authSlice.js';
import { LayoutDashboard, BedDouble, CalendarRange, LogOut, ArrowLeftRight, ShieldCheck, User } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLayout = ({ children }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    // Check if user is logged in and is admin
    if (!userInfo || userInfo.role !== 'admin') {
      toast.error('Access Denied: Managers only');
      navigate('/admin/login');
    }
  }, [userInfo, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const isActive = (path) => location.pathname === path;

  if (!userInfo || userInfo.role !== 'admin') return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans transition-colors duration-300">
      
      {/* Sidebar navigation */}
      <aside className="w-64 border-r border-slate-900 bg-slate-950 flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-8 text-left">
          
          {/* Logo brand */}
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-white">
              StayWise<span className="text-primary-500 font-extrabold">.ai</span>
            </span>
            <span className="bg-primary-500/10 text-primary-400 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border border-primary-500/30">
              Admin
            </span>
          </div>

          {/* Links list */}
          <nav className="flex flex-col space-y-2">
            <Link
              to="/admin/dashboard"
              className={`flex items-center px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive('/admin/dashboard')
                  ? 'bg-primary-500 text-white shadow-premium shadow-primary-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <LayoutDashboard size={16} className="mr-3" />
              Dashboard Overview
            </Link>

            <Link
              to="/admin/rooms"
              className={`flex items-center px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive('/admin/rooms')
                  ? 'bg-primary-500 text-white shadow-premium shadow-primary-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <BedDouble size={16} className="mr-3" />
              Manage Rooms
            </Link>

            <Link
              to="/admin/bookings"
              className={`flex items-center px-4 py-3 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                isActive('/admin/bookings')
                  ? 'bg-primary-500 text-white shadow-premium shadow-primary-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
              }`}
            >
              <CalendarRange size={16} className="mr-3" />
              Manage Bookings
            </Link>
          </nav>
        </div>

        {/* Bottom utility */}
        <div className="space-y-4 text-left border-t border-slate-900 pt-6">
          <div className="flex items-center space-x-2.5 px-3">
            <img src={userInfo.avatar} alt={userInfo.name} className="w-8 h-8 rounded-full border border-primary-500/30" />
            <div className="leading-tight">
              <p className="text-xs font-bold text-white">{userInfo.name}</p>
              <p className="text-[10px] text-slate-500">Executive Manager</p>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5 pt-1">
            <Link
              to="/"
              className="flex items-center px-3.5 py-2.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-900/40"
            >
              <ArrowLeftRight size={14} className="mr-2.5 text-primary-500" />
              Exit Workspace
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-3.5 py-2.5 rounded-lg text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5"
            >
              <LogOut size={14} className="mr-2.5" />
              Sign Out Portal
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace container */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* Header toolbar */}
        <header className="h-16 border-b border-slate-900 px-8 flex items-center justify-between shrink-0 bg-slate-950">
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-400">
            <ShieldCheck size={16} className="text-primary-500" />
            <span>StayWise Secure Admin Terminal</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500">Node: v22.14 / Mongoose DB</span>
        </header>

        {/* Panel Page */}
        <main className="flex-grow p-8 overflow-y-auto bg-slate-950/40">
          {children}
        </main>
      </div>

    </div>
  );
};

export default AdminLayout;
