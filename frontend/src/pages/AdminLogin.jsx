import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, setLoading, setError, logout } from '../store/slices/authSlice.js';
import api from '../services/api.js';
import { Mail, Lock, ArrowRight, ShieldCheck, ShieldAlert, Key } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo && userInfo.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Enter admin email and password credentials');
      return;
    }

    dispatch(setLoading(true));
    dispatch(setError(null));
    try {
      const { data } = await api.post('/auth/login', { email, password });
      
      if (data.role !== 'admin') {
        dispatch(logout());
        const accessErr = 'Access Denied: Executive Manager roles required';
        dispatch(setError(accessErr));
        toast.error(accessErr);
        return;
      }

      dispatch(setCredentials(data));
      toast.success(`Access Authorized. Welcome back, ${data.name}!`);
      navigate('/admin/dashboard');
    } catch (err) {
      const errMsg = err.response?.data?.message || 'Admin Authentication failed';
      dispatch(setError(errMsg));
      toast.error(errMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20 text-left">
      <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl shadow-premium-dark space-y-6 text-slate-100">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/30 flex items-center justify-center mx-auto text-primary-500">
            <ShieldCheck size={26} />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl font-extrabold tracking-tight text-white">Admin Workspace Portal</h1>
            <p className="text-[10px] text-slate-400">Secure entrypoint for manager operations.</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 p-3 rounded-xl border border-red-500/20 text-xs text-red-400 flex items-center space-x-2">
            <ShieldAlert size={14} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Manager Username / Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="email"
                placeholder="admin@staywise.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-white placeholder-slate-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Passkey Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-3.5 text-slate-500" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-primary-500 text-white placeholder-slate-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-500 hover:to-indigo-500 text-white text-sm md:text-base font-semibold py-3.5 px-4 rounded-xl flex items-center justify-center transition-all duration-300 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 active:scale-[0.98] disabled:opacity-50 mt-6"
          >
            {loading ? 'Authenticating access...' : 'Authorize Login'}
            <ArrowRight size={18} className="ml-2" />
          </button>
        </form>



      </div>
    </div>
  );
};

export default AdminLogin;
