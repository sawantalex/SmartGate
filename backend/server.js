import "dotenv/config"
import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import visitorsRouter from "./routes/visitors.js"
import passesRouter from "./routes/passes.js"
import entryLogsRouter from "./routes/entryLogs.js"
import adminRouter from "./routes/admin.js"
import Admin from "./models/Admin.js"

const app = express()

async function seedAdmin() {
  const bcrypt = (await import("bcryptjs")).default
  const passwordHash = await bcrypt.hash("admin123", 10)
  const result = await Admin.findOneAndUpdate(
    { email: "admin@smartgate.com" },
    { $set: { name: "Admin", email: "admin@smartgate.com", passwordHash }, $unset: { password: 1 } },
    { upsert: true, new: true }
  )
  if (result) console.log("Default admin ready: admin@smartgate.com / admin123")
}
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json({ limit: "10mb" }))

// Routes
app.use("/api/visitors", visitorsRouter)
app.use("/api/passes", passesRouter)
app.use("/api/entry-logs", entryLogsRouter)
app.use("/api/admin", adminRouter)

app.get("/", (req, res) => {
  res.json({
    name: "SmartGate API",
    database: "MongoDB Atlas (smartgateDB)",
    health: "/health",
    docs: "/api/visitors, /api/passes, /api/entry-logs, /api/admin",
  })
})

app.get("/health", (req, res) => {
  res.json({ message: "API is healthy" })
})

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Not found" })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status || 500).json({ error: err.message || "Internal server error" })
})

connectDB()
  .then(() => seedAdmin())
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`SmartGate API running at http://localhost:${PORT} (and on your network IP for mobile)`)
    })
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB:", err.message)
    process.exit(1)
  })
