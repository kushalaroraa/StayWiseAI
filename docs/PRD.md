# Product Requirements Document (PRD)

## 1. Product Overview
StayWise AI is a modern, full-stack, AI-driven hotel booking application. It provides users with a seamless, premium, Airbnb-style experience to discover, compare, and book luxury hotel accommodations. 

## 2. Target Audience
* **Travelers**: Seeking reliable, fast, and secure hotel bookings with intelligent recommendations.
* **Administrators**: Managing hotel inventory, monitoring bookings, and reviewing platform analytics.

## 3. Core Features (MVP)
* **Intelligent Discovery**: Users can search for hotels by destination, date, and guests using a responsive, glassmorphic search interface.
* **Smart Recommendations**: Leveraging user history and AI to predict and suggest relevant properties.
* **Secure Payment Flow**: Integration with Razorpay (mock/sandbox for dev) including Card, Netbanking, and UPI options.
* **Idempotent Transactions**: Robust backend checks to prevent double payments, double bookings, and fake confirmations.
* **User Accounts**: Registration and login system using JWTs, including profile photo uploads.
* **Booking Management**: A centralized dashboard for users to view confirmed bookings and download invoices. (Note: Cancellations are out of scope for MVP).

## 4. Non-Functional Requirements
* **Performance**: The frontend must load quickly, utilizing standard React optimization and lightweight WebGL where appropriate.
* **Responsiveness**: Complete mobile, tablet, and desktop layout compatibility—specifically regarding search bars and navigation modals.
* **Security**: No sensitive data in plaintext. Strict HMAC verification for payments. Passwords hashed via bcrypt. Role-based API protection.

## 5. Out of Scope
* Refund processing and cancellation workflows.
* Live chat support.
* Multi-language/currency support (MVP is INR/English only).
