const mongoose = require("mongoose")

// Record created every time a user pays to upgrade their subscription plan.
// Used for admin analytics (plan distribution / subscription revenue) and as
// an audit trail of what was actually paid for and verified via Razorpay.
const planPurchaseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    plan: {
      type: String,
      enum: ["Pro", "ProMax"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    razorpay_order_id: {
      type: String,
      required: true,
    },
    razorpay_payment_id: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

planPurchaseSchema.index({ createdAt: -1 })
planPurchaseSchema.index({ user: 1 })

module.exports = mongoose.model("PlanPurchase", planPurchaseSchema)
