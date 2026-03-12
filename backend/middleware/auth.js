import jwt from "jsonwebtoken"
import Admin from "../models/Admin.js"

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  console.warn("JWT_SECRET is not set; admin auth will fail")
}

/**
 * Protect routes: require valid JWT in Authorization header (Bearer <token>).
 */
export function protectAdmin(req, res, next) {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." })
  }
  const token = authHeader.slice(7)
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    Admin.findById(decoded.id)
      .then((admin) => {
        if (!admin) {
          return res.status(401).json({ error: "Invalid token." })
        }
        req.admin = admin
        next()
      })
      .catch(() => res.status(500).json({ error: "Auth failed." }))
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." })
  }
}
