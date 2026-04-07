# 🚀 GarageNow Frontend: Strategic App Interface

The GarageNow frontend is an elite React workspace encompassing three dedicated interfaces for Rescue Drivers, Service Partners (Mechanics), and Platform Admins.

## 🛠️ Tech Stack & Architecture
- **Framework**: React 18 + Vite (Lightning-fast HMR)
- **Styling**: Tailwind CSS v4 + Shadcn/UI Design Philosophy
- **State Management**: Zustand (High-performance, lightweight payload tracking)
- **Geocoding API**: OpenStreetMap Nominatim (High-precision, zero-cost reverse geocoding)
- **Real-Time Tunnel**: Socket.io-client (Instant dispatch visualization)

## 📁 Ecosystem Layout
- `/src/pages`: Distinct HUD configurations.
  - `/auth`: Unified OTP Handshake Gateways (`Login` & `RegisterComponent`).
  - `/user`: Driver's SOS Hub.
  - `/mechanic`: Partner Onboarding and Job RADAR.
  - `/admin`: Secure overview command center.
- `/src/store`: Absolute truths (Zustand Auth and Job state trackers).
- `/src/components`: Reusable tactical components (LocationPicker, Spinners).

## 🪪 Identity Initialization (The OTP Flow)
GarageNow has retired ancient password structures for a purely dynamic **OTP Handshake**. 
- **Returning Connections**: Users authenticate through `/login` utilizing their secure Phone ID.
- **New Establishments**: Navigating to `/register` allows users to claim a persona (`DRIVER` or `GARAGE_OWNER`). Our backend inherently processes OTP validations and seamlessly syncs profile artifacts in one motion.

## 🚀 Environment Initialization

```bash
# Sync dependency clusters
npm install

# Initiate the frontend tunnel locally
npm run dev
```

*Note: Verify that the Backend Hub is running natively on Port 5000 to ensure API handshakes fulfill cleanly.*

---
*Developed for the GarageNow Production Ecosystem.*
