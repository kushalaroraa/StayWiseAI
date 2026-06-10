import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice.js';
import { Sun, Moon, Menu, X, User, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

const Navbar = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');
  const [isOpen, setIsOpen] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (theme === 'dark') {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="glass-nav sticky top-0 z-50 w-full transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                StayWise<span className="text-primary-500 font-extrabold">.ai</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                isActive('/') ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'
              }`}
            >
              Home
            </Link>
            <Link
              to="/search-results"
              className={`text-sm font-medium transition-colors ${
                isActive('/search-results') ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'
              }`}
            >
              Hotels
            </Link>
              <Link
                to="/about"
                className={`text-sm font-medium transition-colors ${isActive('/about') ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'}`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-primary-500' : 'text-slate-600 dark:text-slate-300 hover:text-primary-500'}`}
              >
                Contact
              </Link>
          </div>

          {/* Desktop Auth and Settings */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Theme"
            >
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {userInfo ? (
              <div className="flex items-center space-x-4">
                {userInfo.role === 'admin' ? (
                  <Link
                    to="/admin/dashboard"
                    className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
                  >
                    <LayoutDashboard size={18} className="mr-1.5" />
                    Dashboard
                  </Link>
                ) : (
                  <Link
                    to="/my-bookings"
                    className="flex items-center text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
                  >
                    <Briefcase size={18} className="mr-1.5" />
                    My Bookings
                  </Link>
                )}

                <div className="flex items-center space-x-2 border-l border-slate-200 dark:border-slate-800 pl-4">
                  <img
                    src={userInfo.avatar}
                    alt={userInfo.name}
                    className="w-8 h-8 rounded-full object-cover border border-primary-500/30"
                  />
                  <div className="text-left hidden lg:block">
                    <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight">
                      {userInfo.name}
                    </p>
                    <p className="text-[10px] text-slate-400 capitalize">{userInfo.role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="premium-btn text-sm font-semibold text-white px-4.5 py-2 rounded-lg transition-transform hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-slate-600 dark:text-slate-300 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden glass-card-light dark:glass-card-dark border-t border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-1">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Home
          </Link>
          <Link
            to="/search-results"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Hotels
          </Link>
          <Link
            to="/about"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            About
          </Link>
          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Contact Us
          </Link>

          {userInfo ? (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 mt-2">
              <div className="flex items-center px-3 mb-3">
                <img
                  src={userInfo.avatar}
                  alt={userInfo.name}
                  className="w-10 h-10 rounded-full object-cover mr-3"
                />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">
                    {userInfo.name}
                  </h4>
                  <p className="text-xs text-slate-400 capitalize">{userInfo.role}</p>
                </div>
              </div>
              
              {userInfo.role === 'admin' ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Admin Dashboard
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  My Bookings
                </Link>
              )}
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="text-center px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="premium-btn text-center text-white px-4 py-2.5 rounded-lg"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
