# SmartGate API

Node.js + Express backend with MongoDB Atlas (database: **smartgateDB**).

## Setup

1. Copy `.env.example` to `.env` and set:
   - `MONGO_URI` – MongoDB Atlas connection string (replace `<USERNAME>` and `<PASSWORD>`)
   - `JWT_SECRET` – Secret for JWT signing (use a long random string in production)
   - `PORT` – Server port (default 5000)

2. Install and run:
   ```bash
   npm install
   npm run dev
   ```

## Environment (.env)

| Variable    | Description                    |
|------------|--------------------------------|
| MONGO_URI  | MongoDB Atlas connection string |
| JWT_SECRET | Secret for admin JWT tokens    |
| PORT       | Server port (default 5000)     |

## API

### Health
- **GET /health** – Returns `{ "message": "API is healthy" }`

### Visitors (CRUD)
- **GET /api/visitors** – List all
- **GET /api/visitors/:id** – Get one
- **POST /api/visitors** – Create (body: name, email, phone; optional: otp, checkInTime, checkOutTime, status)
- **PUT /api/visitors/:id** – Full update
- **PATCH /api/visitors/:id** – Partial update
- **DELETE /api/visitors/:id** – Delete

### Passes (CRUD)
- **GET /api/passes** – List all (visitorId populated)
- **GET /api/passes/:id** – Get one
- **POST /api/passes** – Create (body: visitorId, passType, validTill; optional: issuedAt)
- **PUT /api/passes/:id** – Full update
- **PATCH /api/passes/:id** – Partial update
- **DELETE /api/passes/:id** – Delete

### Entry logs (CRUD)
- **GET /api/entry-logs** – List all (visitorId populated)
- **GET /api/entry-logs/:id** – Get one
- **POST /api/entry-logs** – Create (body: visitorId; optional: entryTime, exitTime, status)
- **PUT /api/entry-logs/:id** – Full update
- **PATCH /api/entry-logs/:id** – Partial update
- **DELETE /api/entry-logs/:id** – Delete

### Admin (JWT)
- **POST /api/admin/register** – Register (body: name, email, password). Returns token.
- **POST /api/admin/login** – Login (body: email, password). Returns token.
- **GET /api/admin/me** – Current admin (header: `Authorization: Bearer <token>`).

All IDs are MongoDB ObjectIds unless noted.
