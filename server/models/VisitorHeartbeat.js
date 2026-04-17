const mongoose = require("mongoose")

// Tracks who is currently online.
// TTL index auto-deletes a document when lastSeen has not been refreshed in 5 minutes.
// Frontend sends a heartbeat every 60s — while active the doc stays alive.
const visitorHeartbeatSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    default: null,
  },
  lastSeen: {
    type: Date,
    default: Date.now,
  },
  ip: {
    type: String,
    default: "",
  },
})

// TTL: MongoDB will delete this document if lastSeen is older than 300 seconds (5 min)
visitorHeartbeatSchema.index({ lastSeen: 1 }, { expireAfterSeconds: 300 })

module.exports = mongoose.model("VisitorHeartbeat", visitorHeartbeatSchema)
