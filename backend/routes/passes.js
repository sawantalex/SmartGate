import express from "express"
import Pass from "../models/Pass.js"
import mongoose from "mongoose"

const router = express.Router()

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

// GET /api/passes/visitor/:visitorId - Get pass by visitor (_id or id string e.g. VIS-xxx)
router.get("/visitor/:visitorId", async (req, res, next) => {
  try {
    let visitorObjectId
    if (isValidObjectId(req.params.visitorId)) {
      visitorObjectId = new mongoose.Types.ObjectId(req.params.visitorId)
    } else {
      const Visitor = (await import("../models/Visitor.js")).default
      const v = await Visitor.findOne({ id: req.params.visitorId }).lean()
      if (!v) return res.status(404).json({ error: "Visitor not found" })
      visitorObjectId = v._id
    }
    const pass = await Pass.findOne({ visitorId: visitorObjectId })
      .sort({ issuedAt: -1 })
      .populate("visitorId")
      .lean()
    if (!pass) return res.status(404).json({ error: "Pass not found" })
    res.json(pass)
  } catch (err) {
    next(err)
  }
})

// GET /api/passes - List all
router.get("/", async (req, res, next) => {
  try {
    const passes = await Pass.find().populate("visitorId", "name email phone").sort({ issuedAt: -1 }).lean()
    res.json(passes)
  } catch (err) {
    next(err)
  }
})

// GET /api/passes/:id - Get one
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid pass ID" })
    }
    const pass = await Pass.findById(req.params.id).populate("visitorId").lean()
    if (!pass) return res.status(404).json({ error: "Pass not found" })
    res.json(pass)
  } catch (err) {
    next(err)
  }
})

// POST /api/passes - Create
router.post("/", async (req, res, next) => {
  try {
    const { visitorId, passType, issuedAt, validTill } = req.body ?? {}
    if (!visitorId) return res.status(400).json({ error: "visitorId is required" })
    let visitorObjectId
    if (isValidObjectId(visitorId)) {
      visitorObjectId = new mongoose.Types.ObjectId(visitorId)
    } else {
      const Visitor = (await import("../models/Visitor.js")).default
      const v = await Visitor.findOne({ id: visitorId }).lean()
      if (!v) return res.status(404).json({ error: "Visitor not found" })
      visitorObjectId = v._id
    }
    const now = new Date()
    const endOfDay = new Date(now)
    endOfDay.setHours(23, 59, 59, 999)
    const passId = `PASS-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const pass = await Pass.create({
      passId,
      visitorId: visitorObjectId,
      passType: (passType || "day").trim(),
      ...(issuedAt != null && { issuedAt: new Date(issuedAt) }),
      validTill: validTill ? new Date(validTill) : endOfDay,
    })
    const populated = await Pass.findById(pass._id).populate("visitorId").lean()
    res.status(201).json(populated)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// PUT /api/passes/:id - Full update
router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid pass ID" })
    }
    const { visitorId, passType, issuedAt, validTill } = req.body ?? {}
    const updates = {}
    if (visitorId != null) {
      if (!isValidObjectId(visitorId)) return res.status(400).json({ error: "Invalid visitorId" })
      updates.visitorId = new mongoose.Types.ObjectId(visitorId)
    }
    if (passType != null) updates.passType = String(passType).trim()
    if (issuedAt != null) updates.issuedAt = new Date(issuedAt)
    if (validTill != null) updates.validTill = new Date(validTill)

    const pass = await Pass.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("visitorId")
      .lean()
    if (!pass) return res.status(404).json({ error: "Pass not found" })
    res.json(pass)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// PATCH /api/passes/:id - Partial update
router.patch("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid pass ID" })
    }
    const allowed = ["visitorId", "passType", "issuedAt", "validTill"]
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === "visitorId") {
          if (!isValidObjectId(req.body[key])) return res.status(400).json({ error: "Invalid visitorId" })
          updates[key] = new mongoose.Types.ObjectId(req.body[key])
        } else if (key === "issuedAt" || key === "validTill") {
          updates[key] = new Date(req.body[key])
        } else {
          updates[key] = String(req.body[key]).trim()
        }
      }
    }
    const pass = await Pass.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("visitorId")
      .lean()
    if (!pass) return res.status(404).json({ error: "Pass not found" })
    res.json(pass)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// DELETE /api/passes/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid pass ID" })
    }
    const pass = await Pass.findByIdAndDelete(req.params.id)
    if (!pass) return res.status(404).json({ error: "Pass not found" })
    res.json({ message: "Pass deleted" })
  } catch (err) {
    next(err)
  }
})

export default router
