const mongoose = require("mongoose")

const maintenanceSchema = new mongoose.Schema(
  {
    isActive: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "StudyNotion is currently down for maintenance. We'll be back soon!",
    },
    returnAt: {
      type: Date,
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Maintenance", maintenanceSchema)
