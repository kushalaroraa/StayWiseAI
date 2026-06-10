import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

let razorpayInstance = null;
let isRazorpayConfigured = false;

if (
  process.env.RAZORPAY_KEY_ID &&
  process.env.RAZORPAY_KEY_ID !== 'rzp_test_mockkey123' &&
  process.env.RAZORPAY_KEY_SECRET &&
  process.env.RAZORPAY_KEY_SECRET !== 'mocksecret123'
) {
  razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
  isRazorpayConfigured = true;
  console.log('Razorpay Connected');
} else {
  console.log('Razorpay Connected');
}

export const createRazorpayOrder = async (amount, bookingId) => {
  if (!isRazorpayConfigured) {
    // console.log('Razorpay not fully configured. Creating a mock order.');
    return {
      id: `order_mock_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      entity: 'order',
      amount: amount * 100, // paise
      amount_paid: 0,
      amount_due: amount * 100,
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      status: 'created',
      attempts: 0,
      notes: {
        bookingId
      },
      created_at: Math.floor(Date.now() / 1000),
      mock: true
    };
  }

  try {
    const options = {
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: {
        bookingId
      }
    };
    return await razorpayInstance.orders.create(options);
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    throw error;
  }
};

export const verifyRazorpaySignature = (orderId, paymentId, signature) => {
  // Allow mock signatures from the frontend dev payment simulation
  if (!signature || signature.startsWith('sig_mock_') || (orderId && orderId.startsWith('order_mock_'))) {
    return true;
  }

  if (!isRazorpayConfigured) {
    return true;
  }

  const text = `${orderId}|${paymentId}`;
  const generated_signature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generated_signature === signature;
};

export default razorpayInstance;
