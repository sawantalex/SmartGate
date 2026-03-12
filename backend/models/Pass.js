import mongoose from "mongoose"

const passSchema = new mongoose.Schema(
  {
    passId: { type: String, required: true, unique: true },
    visitorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Visitor",
      required: true,
    },
    passType: { type: String, required: true, trim: true },
    issuedAt: { type: Date, default: Date.now },
    validTill: { type: Date, required: true },
  },
  { timestamps: true }
)

passSchema.index({ visitorId: 1 })
passSchema.index({ validTill: 1 })

export default mongoose.model("Pass", passSchema)
