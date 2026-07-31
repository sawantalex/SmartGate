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
    otpVerified: { type: Boolean, default: false },
    vehicleNo: { type: String, trim: true },
    idProofType: { type: String, trim: true },
    idProofNumber: { type: String, trim: true },
    idProofDocument: { type: String },
    hostEmployee: { type: String, trim: true },
    visitType: { type: String, default: "Standard Visit" },
    safetyTrainingStatus: { type: String, enum: ["pending", "completed"], default: "pending" },
    quizScore: { type: Number, default: 0 },
    faceEmbedding: { type: String },
    preAuthStatus: {
      type: String,
      enum: ["Pre-Authorized", "Pending Approval", "Rejected"],
      default: "Pre-Authorized",
    },
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
visitorSchema.index({ department: 1 })

export default mongoose.model("Visitor", visitorSchema)
