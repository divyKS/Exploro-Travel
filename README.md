# Travel Booking Application

A web application for booking travel experiences, with separate interfaces for users and trip organizers.

## 🚀 Features

- User authentication and authorization (User/Organizer roles)
- Trip browsing and booking system
- Shopping cart functionality
- Trip management for organizers
- Image upload with optimization
- Responsive design

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Cloudinary account
- npm or yarn package manager

## 🛠️ Setup Instructions

### Backend Setup

1. Clone the repository

   ```bash
   git clone [repository-url]
   cd [project-name]/backend
   ```

2. Install dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:

   ```env
   PORT=3500
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   ```

4. Start the backend server

   ```bash
   npm run start
   ```

### Frontend Setup

1. Navigate to the frontend directory

   ```bash
   cd ../frontend
   ```

2. Install dependencies

   ```bash
   npm install
   ```


3. Start the frontend application

   ```bash
   npm run dev
   ```

Access the application at  - http://localhost:5173

# API Documentation

## Auth Endpoints

### POST /api/auth/register
**Body:** 
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:** 
```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### POST /api/auth/login
**Body:** 
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:** 
```json
{
  "token": "string",
  "user": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

### GET /api/auth/profile (requires authentication)
**Response:** 
```json
{
  "data": {
    "_id": "string",
    "name": "string",
    "email": "string"
  }
}
```

---

## Bookings Endpoints (protected, requires authentication)

### POST /api/bookings
**Body:** 
```json
{
  "tripId": "string"
}
```

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "trip": { /* populated with trip details */ },
    "user": { /* populated with user details */ },
    "paymentAmount": "number",
    "bookingDate": "string",
    "status": "string",
    "paymentStatus": "string"
  }
}
```

### GET /api/bookings/my-bookings
**Response:** 
```json
{
  "data": [
    {
      "_id": "string",
      "trip": { /* populated with trip details */ },
      "user": { /* populated with user details */ },
      "paymentAmount": "number",
      "bookingDate": "string",
      "status": "string",
      "paymentStatus": "string"
    }
  ]
}
```

### POST /api/bookings/:id/cancel
**Path Parameter:**
- `id` (String, required): Unique identifier of the booking to cancel.

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "status": "string",
    "paymentStatus": "string",
    "refundAmount": "number"
  }
}
```

### POST /api/bookings/checkout
**Body:** (No request body required)

**Response:** 
```json
{
  "data": [
    {
      "_id": "string",
      "trip": { /* populated with trip details */ },
      "user": { /* populated with user details */ },
      "paymentAmount": "number",
      "bookingDate": "string",
      "status": "string",
      "paymentStatus": "string"
    }
  ]
}
```

---

## Cart Endpoints (protected, requires authentication)

### POST /api/cart/add
**Body:** 
```json
{
  "tripId": "string"
}
```

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "user": { /* populated with user details */ },
    "items": [ /* array containing trip objects */ ]
  }
}
```

### GET /api/cart
**Response:** 
```json
{
  "data": {
    "_id": "string",
    "user": { /* populated with user details */ },
    "items": [ /* array containing trip objects */ ]
  }
}
```

### DELETE /api/cart/items/:tripId
**Path Parameter:**
- `tripId` (String, required): Unique identifier of the trip to remove from the cart.

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "user": { /* populated with user details */ },
    "items": [ /* array containing trip objects */ ]
  }
}
```

---

## Trip Endpoints (protected, requires authentication for create, edit, and delete)

### GET /api/trips
**Response:** 
```json
{
  "data": [
    {
      "_id": "string",
      "title": "string",
      "description": "string",
      "destination": "string",
      "startDate": "string",
      "endDate": "string",
      "totalSlots": "number",
      "availableSlots": "number",
      "price": "number",
      "images": {
        "small": "string",
        "large": "string"
      },
      "organizer": { /* populated with details */ }
    }
  ]
}
```

### GET /api/trips/:id
**Path Parameter:**
- `id` (String, required): Unique identifier of the trip.

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "destination": "string",
    "startDate": "string",
    "endDate": "string",
    "totalSlots": "number",
    "availableSlots": "number",
    "price": "number",
    "images": {
      "small": "string",
      "large": "string"
    },
    "organizer": { /* populated with details */ }
  }
}
```

### POST /api/trips (protected)
**Body:** 
```json
{
  "title": "string",
  "description": "string",
  "destination": "string",
  "startDate": "string",
  "endDate": "string",
  "totalSlots": "number",
  "price": "number",
  "image": "File" // optional
}
```

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "destination": "string",
    "startDate": "string",
    "endDate": "string",
    "totalSlots": "number",
    "availableSlots": "number",
    "price": "number",
    "images": {
      "small": "string",
      "large": "string"
    },
    "organizer": { /* populated with details */ }
  }
}
```

### PUT /api/trips/:id (protected)
**Path Parameter:**
- `id` (String, required): Unique identifier of the trip to update.

**Body:** (Optional properties can be updated)
```json
{
  "title": "string",
  "description": "string",
  "destination": "string",
  "startDate": "string",
  "endDate": "string",
  "totalSlots": "number",
  "price": "number",
  "image": "File" // optional
}
```

**Response:** 
```json
{
  "data": {
    "_id": "string",
    "title": "string",
    "description": "string",
    "destination": "string",
    "startDate": "string",
    "endDate": "string",
    "totalSlots": "number",
    "availableSlots": "number",
    "price": "number",
    "images": {
      "small": "string",
      "large": "string"
    },
    "organizer": { /* populated with details */ }
  }
}
```

