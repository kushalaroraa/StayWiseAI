# Feature Walkthrough

This document outlines the core functional components and end-to-end user journeys implemented within StayWise AI.

## 1. Authentication & Authorization (JWT)
* **Registration & Login**: Users register providing basic details and an optional profile picture (uploaded to Cloudinary via Multer). Passwords are securely hashed using bcrypt.
* **JWT Implementation**: Upon successful login, the backend issues an HTTP-only JSON Web Token (JWT) that encodes the user ID. This token must be included in the `Authorization: Bearer <token>` header for protected routes.
* **Role-based Access**: Users are assigned roles (`customer` or `admin`). Admin roles unlock features like managing hotels, rooms, and viewing all user bookings.

## 2. AI Recommendation System
* **SmartStay Recommender 2.0**: The platform analyzes a user's `bookingHistory` and `preferredLocations` to surface contextual, personalized hotel recommendations. 
* **Gemini Fallback**: In the event that insufficient personal data exists (e.g. a new user without booking history), the system falls back to a Gemini-powered conversational agent or deterministic heuristics (top-rated hotels in popular locations) to ensure users always see relevant suggestions without "0% Match" errors.

## 3. Payment Gateway (Razorpay)
* **Secure Checkout Flow**: Users initiating a booking proceed to a checkout page where they select a payment method (Card, UPI, Netbanking).
* **Order Creation**: The backend creates an order via the Razorpay API (`/payments/create-order`), generating a unique `orderId`. The booking remains in a `pending` state.
* **Signature Verification**: Once payment is made on the client, the backend verifies the `razorpaySignature` via HMAC SHA256 against the `orderId` and `paymentId`.
* **Idempotency & Double Payment Protection**: The backend enforces idempotency. A `paymentId` can only be processed once. Furthermore, a booking in a non-pending state cannot be processed again, preventing double-charging.
* **Payment Failure**: Failed signatures or transactions result in the booking status switching to `failed`. These failed bookings are deliberately filtered out of the user's dashboard to prevent confusion and avoid the creation of invalid invoices.

## 4. Email Notifications (Nodemailer)
* **Confirmation Receipts**: Upon successful payment verification and booking confirmation, the system utilizes `nodemailer` to dispatch an HTML-formatted receipt to the lead guest's email address.
* **Security & Reliability**: The system suppresses the booking failure from impacting the email send queue.

## 5. Media Management (Cloudinary & Multer)
* **Hotel and Profile Images**: All user uploads (avatars) and admin uploads (hotel imagery) are processed by `multer` into memory buffers.
* **Cloudinary Upload**: These buffers are then transmitted to Cloudinary via their Node SDK. The resulting `secure_url` is stored in MongoDB, ensuring optimized image delivery and caching without bloat on the local application server.

## 6. The Booking Lifecycle
1. **Search & Browse**: Users leverage the mobile-responsive search pill/card to find hotels by destination, date, and party size.
2. **Details & Booking Intent**: Clicking a room initiates a booking intent. The user is redirected to the payment page.
3. **Transaction**: The transaction is processed. **Crucially, there is no "Cancel Booking" feature in the MVP**—sales are final to ensure accounting simplicity in this iteration.
4. **Invoice Generation**: The user is provided a digital receipt/invoice (accessible only if the booking is `confirmed`), which breaks down base costs, taxes, and service fees.
