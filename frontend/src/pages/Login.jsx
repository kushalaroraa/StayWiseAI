import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError } from '../store/slices/authSlice.js';
import api from '../services/api.js';
import { Mail, Lock, ArrowRight, ShieldAlert, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    // Redirect if already logged in
    if (userInfo) {
      if (userInfo.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const redirectPath = location.state?.from || '/';
        navigate(redirectPath);
      }
    }
  }, [userInfo, navigate, location.state]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await api.post('/auth/login', { email, password });
      dispatch(setCredentials(data));
      toast.success(`Welcome back, ${data.name}!`);
      
      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        const redirectPath = location.state?.from || '/';
        navigate(redirectPath);
      }
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Authentication failed';
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 text-left">
      <div className="glass-card p-8 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 shadow-premium dark:shadow-premium-dark space-y-6">
        
        {/* Title */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Sign In</h1>
          <p className="text-xs text-slate-400">Discover luxury stays with AI recommendations.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-xs text-red-600 dark:text-red-400 flex items-center space-x-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Email Address</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="email"
                placeholder="customer@staywise.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-sm md:text-base font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {loading ? 'Signing In...' : 'Sign In'}
            <ArrowRight size={18} className="ml-2" />
          </button>
        </form>

        <div className="border-t dark:border-slate-850 pt-4 text-center text-xs text-slate-400">
          <p>Don't have an account? <Link to="/register" state={{ from: location.state?.from }} className="text-primary-500 hover:underline">Sign Up</Link></p>
        </div>

      </div>
    </div>
  );
};

export default Login;
