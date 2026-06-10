import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { CreditCard, Wallet, Landmark, ShieldCheck, HelpCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  // Page states
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card', 'upi', 'netbanking'

  // Card form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');

  // UPI states
  const [upiId, setUpiId] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/bookings/${bookingId}`);
        setBooking(data);
      } catch (err) {
        toast.error('Booking not found');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    if (bookingId) fetchBookingDetails();
  }, [bookingId, navigate]);

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (paymentMethod === 'card' && (!cardNumber || !cardExpiry || !cardCvv || !cardName)) {
      toast.error('Please enter valid credit card details');
      return;
    }
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI Address ID');
      return;
    }

    setPaying(true);
    try {
      // 1. Create Razorpay/Mock Order ID from backend
      const orderRes = await api.post('/payments/create-order', { bookingId });
      const { orderId, amount, mock } = orderRes.data;

      // Simulate network verification delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. verify payment signatures on backend
      const payload = {
        bookingId,
        razorpayOrderId: orderId,
        razorpayPaymentId: `pay_${Math.random().toString(36).substring(2, 12)}`,
        razorpaySignature: `sig_mock_${Math.random().toString(36).substring(2, 16)}`,
        paymentMethod
      };

      const verifyRes = await api.post('/payments/verify', payload);

      if (verifyRes.data.success) {
        toast.success('Payment completed and booking confirmed!');
        navigate(`/booking/confirmation/${bookingId}`);
      } else {
        toast.error('Signature verification failed');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Payment transaction aborted');
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 space-y-6">
        <div className="h-64 rounded-2xl shimmer" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="mb-10 text-center space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Secure Checkout</h1>
        <p className="text-sm text-slate-400">Complete transaction using our secure payment gateway powered by Razorpay Sandbox.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Payment Forms */}
        <div className="md:col-span-7 space-y-6 text-left">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 space-y-6">
            
            {/* Navigation Tabs */}
            <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl">
              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'card'
                    ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <CreditCard size={16} />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Wallet size={16} />
                <span>UPI ID</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('netbanking')}
                className={`py-2 rounded-lg text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                  paymentMethod === 'netbanking'
                    ? 'bg-white dark:bg-slate-800 text-primary-500 shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Landmark size={16} />
                <span>Netbank</span>
              </button>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              {/* credit cards */}
              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="Jane Doe"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Card Number</label>
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      maxLength="19"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        maxLength="5"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">CVV Code</label>
                      <input
                        type="password"
                        placeholder="***"
                        maxLength="3"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* UPI */}
              {paymentMethod === 'upi' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">UPI Address Handle (VPA)</label>
                    <input
                      type="text"
                      placeholder="aria@oksbi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none focus:border-primary-500 text-slate-800 dark:text-white"
                      required
                    />
                  </div>
                  <p className="text-[10px] text-slate-400 leading-normal">Enter your UPI VPA to receive a push notification link to authorize the sandbox charge.</p>
                </div>
              )}

              {/* Net banking */}
              {paymentMethod === 'netbanking' && (
                <div className="space-y-3">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Select Bank</label>
                  <select className="w-full p-2.5 border border-slate-200 dark:border-slate-800 bg-transparent rounded-xl text-sm focus:outline-none text-slate-800 dark:text-white cursor-pointer">
                    <option className="dark:bg-slate-900">State Bank of India (SBI)</option>
                    <option className="dark:bg-slate-900">HDFC Bank</option>
                    <option className="dark:bg-slate-900">ICICI Bank</option>
                    <option className="dark:bg-slate-900">Axis Bank</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={paying}
                className="premium-btn w-full text-white text-sm font-semibold py-3.5 rounded-xl flex items-center justify-center disabled:opacity-50 mt-6"
              >
                {paying ? (
                  <>
                    <Loader2 size={16} className="animate-spin mr-2" />
                    Finalizing checkout...
                  </>
                ) : (
                  `Pay ₹${booking.totalAmount} Now`
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side: Total summary card */}
        <aside className="md:col-span-5 space-y-4">
          <div className="glass-card p-6 rounded-2xl border border-slate-200/50 dark:border-slate-800/40 text-left space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Checkout Summary</h3>
            <div className="space-y-1">
              <h4 className="font-bold text-slate-950 dark:text-white text-base leading-tight">{booking.hotelId?.name}</h4>
              <p className="text-xs text-slate-400 capitalize">{booking.roomId?.type} Suite</p>
            </div>
            
            <div className="border-t border-slate-100 dark:border-slate-850 pt-3 text-xs space-y-1 text-slate-500">
              <p>Guests: <span className="font-semibold text-slate-800 dark:text-slate-200">{booking.guests}</span></p>
              <p>Check In: <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(booking.checkInDate).toLocaleDateString()}</span></p>
              <p>Check Out: <span className="font-semibold text-slate-800 dark:text-slate-200">{new Date(booking.checkOutDate).toLocaleDateString()}</span></p>
            </div>

            <div className="pt-3 border-t border-dashed border-slate-200 dark:border-slate-800 flex justify-between items-center text-sm font-extrabold text-slate-900 dark:text-white">
              <span>Grand Total:</span>
              <span className="text-primary-500 text-lg">₹{booking.totalAmount}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 justify-center text-[10px] text-slate-400">
            <ShieldCheck size={14} className="text-primary-500" />
            <span>PCI-DSS compliant, fully encrypted gateway channels.</span>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default PaymentPage;
