# 🚀 SmartGate Industrial Visitor System — GitHub & Cloud Deployment Guide

This guide details how to host your project on **GitHub**, **Vercel**, and **Render** with **Real-Time Mobile SMS OTP** enabled.

---

## 📁 Project Architecture & Components

1. **`backend/`**: Node.js / Express API connected to MongoDB Atlas.
2. **`user-app/`**: React Visitor Pre-Authorization Portal.
3. **`admin-dashboard/`**: React Security Gate Checkpoint Portal with AI Face Match.

---

## 📱 1. Enabling Real-Time SMS Delivery to Mobile Phones

In `backend/.env` (or environment variables on your cloud backend host Render/Koyeb), set your free SMS API key:

### Option A: Fast2SMS (Instant SMS for India)
1. Register free at [https://www.fast2sms.com](https://www.fast2sms.com) and copy your API Key.
2. Add to `backend/.env`:
   ```env
   FAST2SMS_API_KEY=your_fast2sms_api_key_here
   ```

### Option B: Twilio (Global SMS Delivery)
1. Create a free account at [https://www.twilio.com](https://www.twilio.com).
2. Add to `backend/.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_account_sid
   TWILIO_AUTH_TOKEN=your_auth_token
   TWILIO_PHONE_NUMBER=+1800XXXXXXX
   ```

---

## 🌐 2. Hosting the Backend API (Render.com - 100% Free)

1. Push your repository to **GitHub**.
2. Go to **[https://render.com](https://render.com)** -> Create a new **Web Service**.
3. Select your GitHub repository `PrasadKamtekar/git`.
4. Configure service settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `MONGO_URI`: `mongodb+srv://prasadkamtekar36:oA4j5R432E6xWj8W@cluster0.p1b4a.mongodb.net/smartgateDB?retryWrites=true&w=majority`
   - `FAST2SMS_API_KEY`: *(Your SMS Key)*
6. Copy your deployed API URL (e.g. `https://smartgate-api.onrender.com`).

---

## ⚡ 3. Hosting User App & Admin Dashboard (Vercel / GitHub)

1. Go to **[https://vercel.com](https://vercel.com)** -> **Add New Project**.
2. Select your GitHub repository.
3. **For User Portal**:
   - Root Directory: `user-app`
   - Environment Variable: `VITE_API_URL` = `https://smartgate-api.onrender.com`
4. **For Admin Dashboard**:
   - Root Directory: `admin-dashboard`
   - Environment Variable: `VITE_API_URL` = `https://smartgate-api.onrender.com`

---

## ✅ Deployment Completed!
Once deployed, visitors will receive **real-time SMS OTP messages** on their mobile phones upon pre-registration!
