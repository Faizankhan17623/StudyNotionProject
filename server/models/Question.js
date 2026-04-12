const mongoose = require("mongoose")

const answerSchema = new mongoose.Schema(
  {
    body: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    isInstructorAnswer: { type: Boolean, default: false },
  },
  { timestamps: true }
)

const questionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    subsection: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection", required: true },
    answers: [answerSchema],
    upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
    isResolved: { type: Boolean, default: false },
  },
  { timestamps: true }
)

// Fast lookup: all questions for a specific lecture
questionSchema.index({ subsection: 1, course: 1 })

module.exports = mongoose.model("Question", questionSchema)
