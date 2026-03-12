import mongoose from "mongoose"

const visitorSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    department: { type: String, trim: true },
    purpose: { type: String, trim: true },
    visitDate: { type: Date },
    selfie: { type: String },
    otp: { type: String },
    checkInTime: { type: Date },
    checkOutTime: { type: Date },
    status: {
      type: String,
      enum: ["pending", "checked-in", "checked-out"],
      default: "pending",
    },
  },
  { timestamps: true }
)

visitorSchema.index({ email: 1 })
visitorSchema.index({ status: 1 })

export default mongoose.model("Visitor", visitorSchema)
