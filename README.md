# 🛡️ SmartGate — Smart Visitor Pre-Authorization & Safety Compliance System

**PSO1: Industrial Premises Visitor Safety & Automated Access Control**

SmartGate is a secure, intelligent, and time-efficient digital visitor management system designed for industrial facilities. It eliminates long gate queues, replaces redundant 7-minute safety videos with compressed micro-learning, enforces dynamic sector PPE gear compliance, and verifies identity via AI biometric face recognition and digital QR passes.

---

## ✨ Key Features

- **📋 Visitor Pre-Authorization**:
  - Pre-register details before arriving on site (Host Employee, ID Proof, Purpose).
  - Enforces strict **10-Digit Mobile Number** validation.
  - Upload ID Proof Document (Photo or PDF up to **1 MB**) with physical verification reminders.

- **📱 Mobile OTP Authentication**:
  - 6-digit OTP mobile verification ensuring verified visitor identity.

- **📸 AI Biometric Face Recognition**:
  - Camera selfie capture with biometric feature vector matching against live gate frames.

- **🦺 Dynamic Department PPE Compliance**:
  - Tailored safety precautions and mandatory PPE checklists across 6 industrial sectors (*Chemical & Process Plant*, *Heavy Machinery*, *Electrical Substation*, *Logistics Warehouse*, *Cleanroom R&D*, *Admin*).

- **🧠 Compressed Safety Training & Exam Portal Quiz**:
  - Interactive 3-step safety module replacing long 7-minute videos.
  - 3-question department safety quiz with randomized option shuffling (Exam Portal Mode).

- **🎫 Digital QR Pass & High-Res PDF Export**:
  - Official QR pass issuance containing visitor selfie, approved host details, and verified PPE list.
  - 1-click **Download PDF Pass** and Print Badge features.

- **🔍 Security Gate Admin Checkpoint**:
  - Real-time QR scanner using `jsQR` engine.
  - Live AI face match comparison (Registered photo vs Live gate photo).
  - 1-click Entry and Exit logging.

---

## 📁 Project Structure

```
Smart Gate/
├── backend/                  # Node.js + Express API + MongoDB Atlas
│   ├── config/               # Department PPE, hazards, & quiz specs
│   ├── models/               # Mongoose Visitor, Admin, and Pass schemas
│   ├── routes/               # Visitors, Passes, Entry Logs, & Admin endpoints
│   └── server.js             # Main server entry point (Port 5000)
│
├── user-app/                 # React Visitor Pre-Authorization Portal (Port 5173)
│   ├── src/pages/            # LandingPage, Register, OTP, Selfie, Training, Quiz, Pass
│   └── src/components/       # Navbar, Stepper, QRPassCard, FormInput
│
└── admin-dashboard/          # React Security Gate Checkpoint Portal (Port 5174)
    └── src/pages/            # Verification (QR Scan & AI Face Match), Dashboard, Visitors
```

---

## 🚀 Quick Start Guide (Run Locally)

### 1. Backend Server
```bash
cd backend
npm install
node server.js
```
> API runs at `http://localhost:5000` (connected to MongoDB Atlas).

### 2. Visitor Portal (User App)
```bash
cd user-app
npm install
npm run dev
```
> App runs at `http://localhost:5173`.

### 3. Admin Security Gate Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```
> Dashboard runs at `http://localhost:5174`.

---

## 🔑 Default Admin Credentials

- **Email**: `admin@smartgate.com`
- **Password**: `admin123`

---

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite, TailwindCSS, Lucide Icons, jsPDF, html2canvas, jsQR
- **Backend**: Node.js, Express.js, Mongoose, CORS, BcryptJS
- **Database**: MongoDB Atlas Cloud (`smartgateDB`)
