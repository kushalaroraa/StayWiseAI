# System Design (HLD & LLD)

## High Level Design (HLD)
StayWise AI follows a standard decoupled Client-Server architecture.

### 1. Client Tier (Frontend)
* Built using **React + Vite** and styled with **Tailwind CSS**.
* Manages global state using **Redux Toolkit** (specifically for Authentication state).
* Communicates with the backend exclusively via RESTful JSON APIs using **Axios**.

### 2. Application Tier (Backend)
* Built using **Node.js + Express.js**.
* Implements a standard Controller-Route-Model architecture.
* Incorporates middleware for JWT validation (`authMiddleware.js`) and Multer file upload handling (`uploadMiddleware.js`).

### 3. Data Tier (Database & Blob Storage)
* **MongoDB**: Hosted via MongoDB Atlas or Local instance, accessed via **Mongoose ORM**. Stores relational-like document data.
* **Cloudinary**: Cloud-based media storage for user avatars and hotel imagery.

### 4. External Services
* **Razorpay API**: Handles financial transactions, order creation, and signature validation.
* **Google Gemini API**: Serves as a fallback recommendation engine via `@google/genai` when standard heuristics fail.
* **SMTP / Nodemailer**: Dispatches transactional emails.

---

## Low Level Design (LLD)

### 1. Payment Verification Flow
```text
Client -> POST /api/payments/create-order {bookingId}
Server -> Validates booking.status === 'pending'
Server -> Razorpay.orders.create() -> returns OrderId
Server -> Returns OrderId to Client
Client -> Simulates Payment -> Generates mock paymentId and mock signature
Client -> POST /api/payments/verify {orderId, paymentId, signature}
Server -> Verifies idempotency (Payment.findOne(paymentId) === null)
Server -> Verifies HMAC SHA256 Signature
Server -> IF Valid:
            Payment.create()
            Booking.status = 'confirmed'
            Send Email
          ELSE:
            Booking.status = 'failed'
```

### 2. UI Component Architecture
* `Landing.jsx`: Combines Hero, Search, Features, and AI Recommendation cards.
* `Navbar.jsx`: Dynamic glassmorphic header tracking scroll state and authentication state.
* `GlassCard`: A reusable CSS abstraction (`.glass-card`) used universally to maintain the premium aesthetic.
