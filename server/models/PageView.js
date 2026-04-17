const mongoose = require("mongoose")

// Stores every page visit for analytics (today's views, top pages, all-time count)
const pageViewSchema = new mongoose.Schema(
  {
    page: {
      type: String,
      required: true,
    },
    sessionId: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      default: null,
    },
    ip: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
)

// Index: speeds up "today's views" and "top pages today" aggregation
pageViewSchema.index({ createdAt: -1 })
pageViewSchema.index({ page: 1, createdAt: -1 })

module.exports = mongoose.model("PageView", pageViewSchema)
