const mongoose = require("mongoose")

const courseProgress = new mongoose.Schema({
  courseID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  completedVideos: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubSection",
    },
  ],
  // FEATURE-9: Video Resume — stores per-video watch position
  videoProgress: [
    {
      subsectionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubSection",
      },
      timestamp: { type: Number, default: 0 },
    },
  ],
})

module.exports = mongoose.model("courseProgress", courseProgress)
