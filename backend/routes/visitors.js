import express from "express"
import Visitor from "../models/Visitor.js"
import mongoose from "mongoose"

const router = express.Router()

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}
function withId(doc) {
  if (!doc) return doc
  const o = { ...doc }
  o.id = (doc._id || doc.id)?.toString()
  return o
}

// GET /api/visitors - List all
router.get("/", async (req, res, next) => {
  try {
    const list = await Visitor.find().sort({ createdAt: -1 }).lean()
    res.json(list.map(withId))
  } catch (err) {
    next(err)
  }
})

function findVisitorById(id) {
  if (isValidObjectId(id)) return Visitor.findById(id).lean()
  return Visitor.findOne({ id }).lean()
}

// GET /api/visitors/:id - Get one (by _id or id string e.g. VIS-xxx)
router.get("/:id", async (req, res, next) => {
  try {
    const visitor = await findVisitorById(req.params.id)
    if (!visitor) return res.status(404).json({ error: "Visitor not found" })
    res.json(withId(visitor))
  } catch (err) {
    next(err)
  }
})

// POST /api/visitors - Create
router.post("/", async (req, res, next) => {
  try {
    const { name, fullName, email, phone, mobile, company, department, purpose, visitDate, otp, checkInTime, checkOutTime, status } = req.body ?? {}
    const n = (name || fullName || "").trim()
    const e = (email || "").trim().toLowerCase()
    const p = (phone || mobile || "").trim()
    if (!n || !e || !p) {
      return res.status(400).json({ error: "name (or fullName), email, and phone (or mobile) are required" })
    }
    const visitorId = `VIS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const visitor = await Visitor.create({
      id: visitorId,
      name: n,
      email: e,
      phone: p,
      ...(company != null && { company: String(company).trim() }),
      ...(department != null && { department: String(department).trim() }),
      ...(purpose != null && { purpose: String(purpose).trim() }),
      ...(visitDate != null && { visitDate: new Date(visitDate) }),
      ...(otp != null && { otp: String(otp) }),
      ...(checkInTime != null && { checkInTime: new Date(checkInTime) }),
      ...(checkOutTime != null && { checkOutTime: new Date(checkOutTime) }),
      ...(status && ["pending", "checked-in", "checked-out"].includes(status) && { status }),
    })
    res.status(201).json(withId(visitor.toObject()))
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message })
    }
    next(err)
  }
})

// PUT /api/visitors/:id - Full update (by _id or id string)
router.put("/:id", async (req, res, next) => {
  try {
    const visitorDoc = await findVisitorById(req.params.id)
    if (!visitorDoc) return res.status(404).json({ error: "Visitor not found" })
    const idToUpdate = visitorDoc._id
    const { name, email, phone, otp, checkInTime, checkOutTime, status } = req.body ?? {}
    const updates = {}
    if (name != null) updates.name = String(name).trim()
    if (email != null) updates.email = String(email).trim().toLowerCase()
    if (phone != null) updates.phone = String(phone).trim()
    if (otp !== undefined) updates.otp = otp === null ? undefined : String(otp)
    if (checkInTime != null) updates.checkInTime = new Date(checkInTime)
    if (checkOutTime != null) updates.checkOutTime = new Date(checkOutTime)
    if (status && ["pending", "checked-in", "checked-out"].includes(status)) updates.status = status

    const visitor = await Visitor.findByIdAndUpdate(
      idToUpdate,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean()
    if (!visitor) return res.status(404).json({ error: "Visitor not found" })
    res.json(withId(visitor))
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// PATCH /api/visitors/:id - Partial update (by _id or id string)
router.patch("/:id", async (req, res, next) => {
  try {
    const visitorDoc = await findVisitorById(req.params.id)
    if (!visitorDoc) return res.status(404).json({ error: "Visitor not found" })
    const allowed = ["name", "email", "phone", "company", "department", "purpose", "visitDate", "selfie", "otp", "checkInTime", "checkOutTime", "status"]
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === "checkInTime" || key === "checkOutTime" || key === "visitDate") {
          updates[key] = new Date(req.body[key])
        } else if (key === "status" && !["pending", "checked-in", "checked-out"].includes(req.body[key])) {
          continue
        } else if (key === "selfie") {
          updates[key] = req.body[key]
        } else {
          updates[key] = typeof req.body[key] === "string" ? req.body[key].trim() : req.body[key]
        }
      }
    }
    const visitor = await Visitor.findByIdAndUpdate(
      visitorDoc._id,
      { $set: updates },
      { new: true, runValidators: true }
    ).lean()
    if (!visitor) return res.status(404).json({ error: "Visitor not found" })
    res.json(withId(visitor))
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// DELETE /api/visitors/:id (by _id or id string)
router.delete("/:id", async (req, res, next) => {
  try {
    const visitorDoc = await findVisitorById(req.params.id)
    if (!visitorDoc) return res.status(404).json({ error: "Visitor not found" })
    await Visitor.findByIdAndDelete(visitorDoc._id)
    res.json({ message: "Visitor deleted" })
  } catch (err) {
    next(err)
  }
})

export default router
