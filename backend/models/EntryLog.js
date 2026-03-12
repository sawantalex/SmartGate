import mongoose from "mongoose"

const entryLogSchema = new mongoose.Schema(
  {
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    visitorName: { type: String },
    company: { type: String },
    action: { type: String, enum: ["entry", "exit"], required: true },
    timestamp: { type: Date, default: Date.now },
    entryTime: { type: Date },
    exitTime: { type: Date },
    status: { type: String, enum: ["inside", "exited"], default: "inside" },
  },
  { timestamps: true }
)

entryLogSchema.index({ visitorId: 1 })
entryLogSchema.index({ timestamp: -1 })

export default mongoose.model("EntryLog", entryLogSchema)
