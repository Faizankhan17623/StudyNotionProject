const mongoose = require("mongoose")

const noteSchema = new mongoose.Schema(
  {
    user:       { type: mongoose.Schema.Types.ObjectId, ref: "user",       required: true },
    course:     { type: mongoose.Schema.Types.ObjectId, ref: "Course",     required: true },
    section:    { type: mongoose.Schema.Types.ObjectId, ref: "Section",    required: true },
    subsection: { type: mongoose.Schema.Types.ObjectId, ref: "SubSection", required: true },
    body:           { type: String, required: true, trim: true },
    videoTimestamp: { type: Number, default: 0 }, // seconds — used to seek back to this moment
  },
  { timestamps: true }
)

// Fast lookup: all notes a student wrote for one lecture
noteSchema.index({ user: 1, subsection: 1 })
// Fast lookup: all notes a student wrote across a whole course
noteSchema.index({ user: 1, course: 1 })

module.exports = mongoose.model("Note", noteSchema)
