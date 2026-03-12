# SmartGate – Visitor Management System

Visitor registration, selfie verification, QR pass, and admin dashboard with MongoDB Atlas.

## Project structure

- **backend/** – Node.js + Express + MongoDB API
- **user-app/** – Visitor registration & pass flow (React + Vite)
- **admin-dashboard/** – Admin panel: visitors, entry logs, QR scan (React + Vite)

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Create `.env` (or copy `.env.example`):

```
MONGO_URI=mongodb+srv://<USER>:<PASS>@cluster0.povoaon.mongodb.net/smartgateDB?retryWrites=true&w=majority
JWT_SECRET=your-secret
PORT=5000
```

Run:

```bash
npm run dev
```

Default admin: **admin@smartgate.com** / **admin123**

### 2. User app

```bash
cd user-app
npm install
```

Ensure `.env` has `VITE_API_URL=http://localhost:5000`

```bash
npm run dev
```

### 3. Admin dashboard

```bash
cd admin-dashboard
npm install
```

Ensure `.env` has `VITE_API_URL=http://localhost:5000`

```bash
npm run dev
```

## Flow

1. **Visitor** – Register → Selfie → Training → Quiz → Get QR Pass
2. **Admin** – Login → Dashboard (visitors) → Entry Logs → Verification (scan QR, log entry)
3. QR code on pass contains visitor data; admin scans it and logs entry to backend
