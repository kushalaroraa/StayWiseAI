# Complete API Documentation

## Base URL
`/api`

## Authentication Routes
* `POST /auth/register`: Register a new user. Supports `multipart/form-data` for `avatar` upload.
* `POST /auth/login`: Authenticate and return JWT.
* `GET /auth/profile`: Get logged-in user profile (Protected).
* `PUT /auth/profile`: Update user profile (Protected).

## Hotel Routes
* `GET /hotels`: Fetch all hotels with optional query filters (location, price, rating).
* `GET /hotels/:id`: Fetch specific hotel details.
* `POST /hotels/:id/reviews`: Add a review to a hotel (Protected).
* `POST /hotels`: Create a new hotel (Admin Only).
* `PUT /hotels/:id`: Update hotel (Admin Only).
* `DELETE /hotels/:id`: Delete hotel (Admin Only).

## Room Routes
* `GET /rooms/hotel/:hotelId`: Get all rooms for a hotel.
* `GET /rooms/:id`: Get specific room details.
* `POST /rooms`: Create a new room (Admin Only).
* `PUT /rooms/:id`: Update room details (Admin Only).

## Booking Routes
* `POST /bookings`: Create a new `pending` booking (Protected).
* `GET /bookings/my-bookings`: Fetch active bookings for logged-in user (Protected).
* `GET /bookings/:id`: Fetch specific booking (Protected).
* `GET /bookings`: Fetch all bookings (Admin Only).
* `PUT /bookings/:id/status`: Update booking status (Admin Only).

## Payment Routes
* `POST /payments/create-order`: Generate Razorpay Order ID for a specific `bookingId` (Protected).
* `POST /payments/verify`: Verify the signature of a transaction and confirm the booking (Protected).

## Recommendations
* `GET /recommendations`: Get AI/Heuristic hotel recommendations for the logged-in user (Protected).
* `GET /recommendations/similar/:hotelId`: Get visually or contextually similar properties to a given hotel.
