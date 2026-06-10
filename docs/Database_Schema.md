# Database Documentation

The platform uses MongoDB and Mongoose. Below are the primary collections.

## 1. User
Stores authentication credentials and application usage data.
* `name` (String, Required)
* `email` (String, Required, Unique)
* `password` (String, Required, Hashed)
* `role` (String, enum: `[customer, admin]`, default: `customer`)
* `avatar` (String, default: `''`)
* `bookingHistory` (Array of ObjectId refs to Hotel)

## 2. Hotel
Stores property details.
* `name` (String)
* `location` (String)
* `description` (String)
* `rating` (Number, default: 0)
* `amenities` (Array of Strings)
* `images` (Array of Strings)
* `reviews` (Subdocument Array: userRef, rating, comment)

## 3. Room
Stores room inventory related to a Hotel.
* `hotelId` (ObjectId ref to Hotel)
* `roomNumber` (String)
* `type` (String, enum: `[single, double, suite]`)
* `pricePerNight` (Number)
* `capacity` (Number)

## 4. Booking
Stores the lifecycle of a reservation.
* `userId` (ObjectId ref to User)
* `hotelId` (ObjectId ref to Hotel)
* `roomId` (ObjectId ref to Room)
* `checkInDate`, `checkOutDate` (Date)
* `status` (String, enum: `[pending, confirmed, failed]`)
* `paymentStatus` (String, enum: `[pending, paid, failed]`)
* `totalAmount` (Number)

## 5. Payment
Stores financial transaction receipts.
* `bookingId` (ObjectId ref to Booking)
* `transactionId` (String, Unique) — Used for idempotency keys.
* `amount` (Number)
* `status` (String, enum: `[pending, completed, failed]`)
