import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layouts & Navs
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import AdminLayout from './components/admin/AdminLayout.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';

// Customer Pages
import Landing from './pages/Landing.jsx';
import SearchResults from './pages/SearchResults.jsx';
import HotelDetail from './pages/HotelDetail.jsx';
import BookingPage from './pages/BookingPage.jsx';
import PaymentPage from './pages/PaymentPage.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import MyBookings from './pages/MyBookings.jsx';
import About from './pages/About.jsx';
import Contact from './pages/Contact.jsx';

// Admin Pages
import AdminLogin from './pages/AdminLogin.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import ManageRooms from './pages/admin/ManageRooms.jsx';
import ManageBookings from './pages/admin/ManageBookings.jsx';

// Helper layout component to keep standard pages wrapped in Nav/Footer
const CustomerLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main className="flex-grow">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* Toast notifications handler */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          className: 'glass-card dark:text-white border border-white/30 dark:border-slate-800/50 text-xs font-bold rounded-2xl shadow-2xl',
          style: {
            background: 'rgba(255, 255, 255, 0.4)',
            backdropFilter: 'blur(20px)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
        }} 
      />

      <Routes>
        {/* Admin Console Entry */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        {/* Admin Dashboard Operations */}
        <Route path="/admin/dashboard" element={<AdminLayout><AdminDashboard /></AdminLayout>} />
        <Route path="/admin/rooms" element={<AdminLayout><ManageRooms /></AdminLayout>} />
        <Route path="/admin/bookings" element={<AdminLayout><ManageBookings /></AdminLayout>} />

        {/* Guest Booking / Searching Flow */}
        <Route path="/" element={<CustomerLayout><Landing /></CustomerLayout>} />
        <Route path="/search-results" element={<CustomerLayout><SearchResults /></CustomerLayout>} />
        <Route path="/hotel/:id" element={<CustomerLayout><HotelDetail /></CustomerLayout>} />
        <Route path="/booking/:roomId" element={<CustomerLayout><BookingPage /></CustomerLayout>} />
        <Route path="/payment/:bookingId" element={<CustomerLayout><PaymentPage /></CustomerLayout>} />
        <Route path="/booking/confirmation/:bookingId" element={<CustomerLayout><BookingConfirmation /></CustomerLayout>} />
        <Route path="/login" element={<CustomerLayout><Login /></CustomerLayout>} />
        <Route path="/register" element={<CustomerLayout><Register /></CustomerLayout>} />
        <Route path="/my-bookings" element={<CustomerLayout><MyBookings /></CustomerLayout>} />
        <Route path="/about" element={<CustomerLayout><About /></CustomerLayout>} />
        <Route path="/contact" element={<CustomerLayout><Contact /></CustomerLayout>} />
      </Routes>
    </Router>
  );
}

export default App;
