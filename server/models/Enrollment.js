const mongoose = require("mongoose")

// Lightweight record created every time a student enrolls in a course.
// Used exclusively for admin analytics (monthly revenue/enrollment trends).
const enrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    // Price of the course at the time of enrollment (0 for free courses)
    amount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

// Index for fast monthly aggregations
enrollmentSchema.index({ createdAt: -1 })
enrollmentSchema.index({ course: 1 })

module.exports = mongoose.model("Enrollment", enrollmentSchema)
