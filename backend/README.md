# 🚀 GarageNow Backend: Elite Orchestration Hub

The GarageNow backend is a high-performance, real-time rescue dispatch engine designed for street-level precision and uncompromising identity security.

## 🛠️ Tech Stack & Architecture
- **Core Engine**: Node.js 20 LTS with Express.js
- **Database**: MongoDB (Mongoose) with Geo-Spatial 2dsphere indexing built-in.
- **Identity Framework**: Twilio Verify (SMS OTP Handshakes) & JWT Tokens.
- **Real-Time Data**: Socket.io (Bi-directional GPS & job radar pipeline).
- **Documentation**: Swagger UI integration (OpenAPI 3.0 compliance).

## 📁 Critical System Directories
- `/controllers`: Houses the functional logic (Auth overrides, Dispatch tracking, KYC moderation).
- `/models`: High-fidelity data structures optimized for fast spatial queries.
- `/routes`: Protected REST API layers locked down with robust JWT middleware.

## 🚀 Environment Initialization

Create a `.env` file in the root backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_cluster_uri
JWT_SECRET=your_super_secret_enterprise_key

# Twilio Identity Verification
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_SERVICE_SID=your_verify_service_sid
```

## 💻 Operational Startup
```bash
# Sync dependency matrices
npm install

# Ignite development server (Nodemon monitored)
npm run dev
```

## 👑 Master Admin Override (Development Hack)
To instantly bypass SMS limits during development and gain Supreme Admin access:
1. When prompted for Phone, use: `9999999999`.
2. When prompted for OTP, use: `123456`.
3. The system will automatically fabricate the Admin Token and bypass Twilio.

## 📡 Live API Hub
With the server running, explore the dynamic OpenAPI Swagger documentation at:
`http://localhost:5000/api-docs`

---
*Developed for the GarageNow Production Ecosystem.*
