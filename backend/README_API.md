# 🚀 GarageNow Enterprise API Documentation

This document provides a comprehensive overview of the GarageNow backend API ecosystem. Use these endpoints to power the Driver, Mechanic, and Admin portals.

**Base URL:** `http://localhost:5000/api/v1`

---

## 🔐 1. Authentication Module (`/auth`)

Security protocols for identity management and session decommissioning.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **POST** | `/auth/request-otp` | Initiate session via OTP handshake. | `200 (Success)` |
| **POST** | `/auth/login` | Obtain JWT access token via credentials. | `200 (Success)`, `401 (Unauthorized)` |
| **POST** | `/auth/register` | Create a new unified account node. | `201 (Created)` |
| **POST** | `/auth/logout` | Decommission active session (Invalidates client token). | `200 (Success)` |
| **GET** | `/auth/me` | Retrieve current authenticated identity profile. | `200 (Success)`, `401 (Auth Required)` |

---

## 🛠️ 2. Garage Management Module (`/garages`)

Operational registry for service partners and geo-spatial discovery.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/garages/nearby` | Find available mechanics within 15km sector. | `200 (Success)` |
| **POST** | `/garages` | Register a new garage anchor (Owner only). | `201 (Created)`, `400 (Invalid Data)` |
| **GET** | `/garages/:id` | Fetch high-fidelity details of a specific garage. | `200 (Success)`, `404 (Not Found)` |
| **PATCH** | `/garages/:id` | Update operational parameters (Status/Availability). | `200 (Success)` |
| **GET** | `/garages/:id/jobs` | Audit historical and active jobs for the garage. | `200 (Success)` |

---

## 🆘 3. Job Dispatch Module (`/jobs`)

Real-time lifecycle management for vehicle assistance requests.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **POST** | `/jobs` | Dispatch new SOS request (Driver only). | `201 (Created)` |
| **GET** | `/jobs/:id` | Monitor real-time status of a specific job. | `200 (Success)`, `404 (Not Found)` |
| **PATCH** | `/jobs/:id/accept` | Mechanic accepts the dispatch handshake. | `200 (Success)`, `400 (Already Taken)` |
| **PATCH** | `/jobs/:id/start` | Update status to EN_ROUTE (Mechanic moving). | `200 (Success)` |
| **PATCH** | `/jobs/:id/complete`| Finalize job and prepare for payment logic. | `200 (Success)` |
| **PATCH** | `/jobs/:id/cancel` | Terminate aid request (Driver/Mech only). | `200 (Success)` |
| **POST** | `/jobs/:id/track` | Broadcast live GPS via Socket.io uplink. | `200 (Success)` |

---

## 💳 4. Finance & Reviews Module (`/payments` & `/reviews`)

Monetary settlement and quality moderation protocols.

| Method | Endpoint | Description | Category | Status Codes |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/payments/order` | Initialize Razorpay secure gateway order. | Payment | `200 (Success)` |
| **POST** | `/payments/verify` | Verify cryptographic payment signature. | Payment | `200 (Success)`, `400 (Failure)` |
| **GET** | `/payments/earnings` | Aggregate revenue metrics for garage owners. | Finance | `200 (Success)` |
| **POST** | `/reviews` | Submit feedback and star-rating for a job. | Quality | `201 (Created)` |

---

## 🛡️ 5. Admin Command Center (`/admin`)

Privileged endpoints for marketplace moderation and audit logs.

| Method | Endpoint | Description | Status Codes |
| :--- | :--- | :--- | :--- |
| **GET** | `/admin/garages` | Global audit of all registered partners. | `200 (Success)`, `403 (Forbidden)` |
| **PATCH** | `/admin/garages/:id/verify` | Administratively verify a garage node. | `200 (Success)` |
| **GET** | `/admin/jobs` | High-level audit of all platform transactions. | `200 (Success)` |

---

### 💡 Implementation Notes:
- **Authentication**: All `Private` routes require a `Bearer <JWT>` token in the Authorization header.
- **Geo-Spatial**: Coordination arrays follow the `[Longitude, Latitude]` GeoJSON standard.
- **Real-Time**: State transitions (`ACCEPTED`, `EN_ROUTE`) trigger automatic Socket.io broadcasts to connected clients.
