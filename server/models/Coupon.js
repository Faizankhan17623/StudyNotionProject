const mongoose = require("mongoose")

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    discountPercent: {
      type: Number,
      required: true,
      enum: [5, 20, 50, 80, 100],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    // Tracks every student who has used this coupon
    // If usedBy.length > 0 the coupon cannot be deleted
    usedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { timestamps: true }
)

// Fast lookup: all coupons for a specific course
couponSchema.index({ course: 1, instructor: 1 })
// Fast lookup: validate a coupon code at checkout
couponSchema.index({ code: 1, isActive: 1 })

module.exports = mongoose.model("Coupon", couponSchema)
