import express from "express"
import EntryLog from "../models/EntryLog.js"
import Visitor from "../models/Visitor.js"
import mongoose from "mongoose"

const router = express.Router()

function isValidObjectId(id) {
  return mongoose.Types.ObjectId.isValid(id) && new mongoose.Types.ObjectId(id).toString() === id
}

// GET /api/entry-logs - List all
router.get("/", async (req, res, next) => {
  try {
    const logs = await EntryLog.find()
      .populate("visitorId", "name email phone company")
      .sort({ timestamp: -1 })
      .limit(500)
      .lean()
    const mapped = logs.map((l) => ({
      ...l,
      id: l._id?.toString(),
      visitorName: l.visitorName || l.visitorId?.name,
      company: l.company || l.visitorId?.company,
      action: l.action || (l.status === "exited" ? "exit" : "entry"),
      timestamp: l.timestamp || l.entryTime || l.createdAt,
    }))
    res.json(mapped)
  } catch (err) {
    next(err)
  }
})

// GET /api/entry-logs/:id - Get one
router.get("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid entry log ID" })
    }
    const log = await EntryLog.findById(req.params.id).populate("visitorId").lean()
    if (!log) return res.status(404).json({ error: "Entry log not found" })
    res.json(log)
  } catch (err) {
    next(err)
  }
})

// POST /api/entry-logs - Create (or scan from QR payload)
router.post("/", async (req, res, next) => {
  try {
    let { visitorId, entryTime, exitTime, status, action } = req.body ?? {}
    if (typeof req.body === "string") {
      try {
        const parsed = JSON.parse(req.body)
        visitorId = parsed.visitorId
        action = parsed.action
      } catch {}
    }
    if (!visitorId) return res.status(400).json({ error: "visitorId is required" })
    if (!isValidObjectId(visitorId)) return res.status(400).json({ error: "Invalid visitorId" })
    const visitor = await Visitor.findById(visitorId).lean()
    if (!visitor) return res.status(404).json({ error: "Visitor not found" })
    const act = action || (status === "exited" ? "exit" : "entry")
    const now = new Date()
    const log = await EntryLog.create({
      visitorId: new mongoose.Types.ObjectId(visitorId),
      visitorName: visitor.name,
      company: visitor.company || "",
      action: act,
      timestamp: now,
      ...(act === "entry" && { entryTime: now, status: "inside" }),
      ...(act === "exit" && { exitTime: now, status: "exited" }),
      ...(entryTime != null && { entryTime: new Date(entryTime) }),
      ...(exitTime != null && { exitTime: new Date(exitTime) }),
    })
    if (act === "entry") {
      await Visitor.findByIdAndUpdate(visitorId, { status: "checked-in", checkInTime: now })
    } else {
      await Visitor.findByIdAndUpdate(visitorId, { status: "checked-out", checkOutTime: now })
    }
    const populated = await EntryLog.findById(log._id).populate("visitorId").lean()
    const out = { ...populated, id: populated._id.toString(), visitorName: populated.visitorName || visitor.name, company: populated.company || visitor.company }
    res.status(201).json(out)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// PUT /api/entry-logs/:id - Full update
router.put("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid entry log ID" })
    }
    const { visitorId, entryTime, exitTime, status } = req.body ?? {}
    const updates = {}
    if (visitorId != null) {
      if (!isValidObjectId(visitorId)) return res.status(400).json({ error: "Invalid visitorId" })
      updates.visitorId = new mongoose.Types.ObjectId(visitorId)
    }
    if (entryTime != null) updates.entryTime = new Date(entryTime)
    if (exitTime != null) updates.exitTime = new Date(exitTime)
    if (status && ["inside", "exited"].includes(status)) updates.status = status

    const log = await EntryLog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("visitorId")
      .lean()
    if (!log) return res.status(404).json({ error: "Entry log not found" })
    res.json(log)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// PATCH /api/entry-logs/:id - Partial update
router.patch("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid entry log ID" })
    }
    const allowed = ["visitorId", "entryTime", "exitTime", "status"]
    const updates = {}
    for (const key of allowed) {
      if (req.body[key] !== undefined) {
        if (key === "visitorId") {
          if (!isValidObjectId(req.body[key])) return res.status(400).json({ error: "Invalid visitorId" })
          updates[key] = new mongoose.Types.ObjectId(req.body[key])
        } else if (key === "entryTime" || key === "exitTime") {
          updates[key] = new Date(req.body[key])
        } else if (key === "status" && ["inside", "exited"].includes(req.body[key])) {
          updates[key] = req.body[key]
        }
      }
    }
    const log = await EntryLog.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    )
      .populate("visitorId")
      .lean()
    if (!log) return res.status(404).json({ error: "Entry log not found" })
    res.json(log)
  } catch (err) {
    if (err.name === "ValidationError") return res.status(400).json({ error: err.message })
    next(err)
  }
})

// DELETE /api/entry-logs/:id
router.delete("/:id", async (req, res, next) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ error: "Invalid entry log ID" })
    }
    const log = await EntryLog.findByIdAndDelete(req.params.id)
    if (!log) return res.status(404).json({ error: "Entry log not found" })
    res.json({ message: "Entry log deleted" })
  } catch (err) {
    next(err)
  }
})

export default router
