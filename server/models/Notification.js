const mongoose = require("mongoose")

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    type: {
      type: String,
      enum: ["enrollment", "qa_answer", "new_lecture", "approval"],
      required: true,
    },
    title:   { type: String, required: true },
    message: { type: String, required: true },
    link:    { type: String, default: null },
    isRead:  { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Fast lookup: all notifications for a user, unread first, newest first
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 })

module.exports = mongoose.model("Notification", notificationSchema)
