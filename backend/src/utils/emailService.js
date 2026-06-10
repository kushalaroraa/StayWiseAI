import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

let transporter = null;
let isEmailConfigured = false;

if (
  process.env.EMAIL_USER &&
  process.env.EMAIL_USER !== 'mock_user@example.com' &&
  process.env.EMAIL_PASS &&
  process.env.EMAIL_PASS !== 'mock_password'
) {
  transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
  isEmailConfigured = true;
}

export const sendEmail = async ({ to, subject, html }) => {
  if (!isEmailConfigured) {
    console.log('✉️  [MOCK EMAIL]');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content Snippet: ${html.replace(/<[^>]*>/g, '').substring(0, 200)}...`);
    console.log('✉️  [MOCK EMAIL END]');
    return { mock: true, messageId: `mock_email_${Date.now()}` };
  }

  try {
    const info = await transporter.sendMail({
      from: `"StayWise.ai Support" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

export const sendBookingConfirmationEmail = async (booking, hotelName) => {
  const checkIn = new Date(booking.checkInDate).toLocaleDateString();
  const checkOut = new Date(booking.checkOutDate).toLocaleDateString();
  const subject = `StayWise.ai — Reservation Confirmed at ${hotelName}`;
  
  const html = `
    <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 24px; font-weight: bold; color: #020617; letter-spacing: -0.05em;">StayWise<span style="color: #6366f1;">.ai</span></span>
      </div>
      <h2 style="color: #0f172a; margin-bottom: 16px; text-align: center; font-weight: 700;">Booking Confirmed!</h2>
      <p style="color: #475569; font-size: 16px;">Hello ${booking.name},</p>
      <p style="color: #475569; font-size: 16px; line-height: 1.5;">Your stay at <strong>${hotelName}</strong> has been secured successfully. Below are your reservation details:</p>
      
      <div style="background-color: #f8fafc; border-radius: 8px; padding: 20px; margin: 24px 0; border: 1px solid #f1f5f9;">
        <h3 style="color: #0f172a; margin-top: 0; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; font-size: 16px;">Reservation Details</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Booking ID</td>
            <td style="padding: 8px 0; color: #0f172a; text-align: right; font-family: monospace; font-size: 13px;">${booking._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Check-In</td>
            <td style="padding: 8px 0; color: #0f172a; text-align: right; font-weight: 600;">${checkIn}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Check-Out</td>
            <td style="padding: 8px 0; color: #0f172a; text-align: right; font-weight: 600;">${checkOut}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; color: #64748b; font-weight: 500;">Guests</td>
            <td style="padding: 8px 0; color: #0f172a; text-align: right;">${booking.guests} Guests</td>
          </tr>
          <tr>
            <td style="padding: 12px 0 0 0; color: #0f172a; font-weight: 700; border-top: 1px dashed #e2e8f0;">Total Paid</td>
            <td style="padding: 12px 0 0 0; color: #6366f1; text-align: right; font-weight: 800; font-size: 16px; border-top: 1px dashed #e2e8f0;">₹${booking.totalAmount}</td>
          </tr>
        </table>
      </div>
      
      <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 32px; line-height: 1.4;">
        If you need to make changes or cancel your booking, please log in to your dashboard or contact our support team.
      </p>
      <div style="text-align: center; margin-top: 16px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
        <span style="font-size: 11px; color: #94a3b8;">&copy; 2026 StayWise.ai. All rights reserved.</span>
      </div>
    </div>
  `;

  return await sendEmail({ to: booking.email, subject, html });
};
