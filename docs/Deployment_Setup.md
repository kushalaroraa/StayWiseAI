# Deployment & Setup Guide

## Prerequisites
* Node.js (v18+)
* MongoDB (Local or Atlas URL)
* NPM or Yarn

## Local Setup

### 1. Backend Configuration
Navigate to `/backend` and create a `.env` file based on `.env.example`:
```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/staywise
JWT_SECRET=your_secret_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Run dependencies and start server:
```bash
cd backend
npm install
npm run dev
```

### 2. Frontend Configuration
Navigate to `/frontend` and create a `.env` file:
```env
VITE_API_URL=https://staywiseai.onrender.com
```

Run dependencies and start client:
```bash
cd frontend
npm install
npm run dev
```

### 3. Database Seeding
To populate the database with initial Hotels, Rooms, and an Admin user, run:
```bash
cd backend
npm run seed
```

## Production Deployment Guidelines
1. **Frontend**: Build the Vite application (`npm run build`) and deploy the `dist` folder to Vercel, Netlify, or Firebase Hosting. Ensure environment variables are configured in the hosting provider's dashboard.
2. **Backend**: Deploy the Express application to Render, Heroku, or a VPS. Ensure MongoDB Atlas network access is configured to allow IPs from your backend hosting provider.
3. **Database**: Use MongoDB Atlas for production databases to ensure automatic backups and scaling.
