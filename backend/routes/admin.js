import express from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"
import { protectAdmin } from "../middleware/auth.js"

const router = express.Router()
const JWT_SECRET = process.env.JWT_SECRET
const SALT_ROUNDS = 10

// POST /api/admin/register - Register new admin (public)
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password } = req.body ?? {}
    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email, and password are required" })
    }
    const emailNorm = String(email).trim().toLowerCase()
    const existing = await Admin.findOne({ email: emailNorm })
    if (existing) {
      return res.status(400).json({ error: "Email already registered" })
    }
    const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS)
    const admin = await Admin.create({
      name: String(name).trim(),
      email: emailNorm,
      passwordHash,
    })
    const token = JWT_SECRET
      ? jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" })
      : null
    res.status(201).json({
      message: "Admin registered",
      admin: { id: admin._id, name: admin.name, email: admin.email },
      token,
    })
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// POST /api/admin/login - Login (public), returns JWT
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body ?? {}
    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" })
    }
    if (!JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET not configured" })
    }
    let admin = await Admin.findOne({ email: String(email).trim().toLowerCase() })
    if (!admin) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    let hash = admin.passwordHash
    if (!hash && admin.password) {
      const plain = String(admin.password)
      if (plain === String(password)) {
        hash = await bcrypt.hash(plain, SALT_ROUNDS)
        await Admin.findByIdAndUpdate(admin._id, { $set: { passwordHash: hash }, $unset: { password: 1 } })
      }
    }
    if (!hash) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const match = await bcrypt.compare(String(password), hash)
    if (!match) {
      return res.status(401).json({ error: "Invalid email or password" })
    }
    const token = jwt.sign({ id: admin._id }, JWT_SECRET, { expiresIn: "7d" })
    res.json({
      message: "Login successful",
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email },
    })
  } catch (err) {
    next(err)
  }
})

// GET /api/admin/me - Current admin (JWT protected)
router.get("/me", protectAdmin, (req, res) => {
  res.json({
    id: req.admin._id,
    name: req.admin.name,
    email: req.admin.email,
  })
})

export default router
