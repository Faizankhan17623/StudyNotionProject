const mongoose = require("mongoose")
const Section = require("../models/Section")
const SubSection = require("../models/Subsection")
const CourseProgress = require("../models/CourseProgress")
const Course = require("../models/Course")
const User = require("../models/User")

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subsectionId } = req.body
  const userId = req.user.id

  try {
    // Check if the subsection is valid
    const subsection = await SubSection.findById(subsectionId)
    if (!subsection) {
      return res.status(404).json({ error: "Invalid subsection" })
    }

    // Find the course progress document for the user and course
    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    })

    if (!courseProgress) {
      // If course progress doesn't exist, create a new one
      return res.status(404).json({
        success: false,
        message: "Course progress Does Not Exist",
      })
    } else {
      // If course progress exists, check if the subsection is already completed
      if (courseProgress.completedVideos.includes(subsectionId)) {
        return res.status(400).json({ error: "Subsection already completed" })
      }

      // Push the subsection into the completedVideos array
      courseProgress.completedVideos.push(subsectionId)
    }

    // Save the updated course progress
    await courseProgress.save()

    // ── Update learning streak ──────────────────────────────────────────────
    try {
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const user = await User.findById(userId)

      if (user) {
        if (user.lastStudyDate) {
          const last = new Date(user.lastStudyDate)
          last.setHours(0, 0, 0, 0)
          const diffDays = Math.round((today - last) / (1000 * 60 * 60 * 24))

          if (diffDays === 0) {
            // Already counted today — no change
          } else if (diffDays === 1) {
            // Consecutive day — extend streak
            user.currentStreak += 1
            user.longestStreak = Math.max(user.longestStreak, user.currentStreak)
            user.lastStudyDate = today
          } else {
            // Gap — reset streak
            user.currentStreak = 1
            user.lastStudyDate = today
          }
        } else {
          // Very first study session
          user.currentStreak = 1
          user.longestStreak = 1
          user.lastStudyDate = today
        }
        await user.save()
      }
    } catch (streakErr) {
      // Streak update is non-critical — don't fail the main request
      console.error("Streak update error:", streakErr.message)
    }
    // ───────────────────────────────────────────────────────────────────────

    return res.status(200).json({ success: true, message: "Course progress updated" })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

// FEATURE-9: Video Resume — save the current timestamp for a video
exports.updateVideoTimestamp = async (req, res) => {
  const { courseId, subsectionId, timestamp } = req.body
  const userId = req.user.id

  if (!courseId || !subsectionId || timestamp === undefined) {
    return res.status(400).json({ success: false, message: "courseId, subsectionId, and timestamp are required" })
  }

  try {
    const courseProgress = await CourseProgress.findOne({ courseID: courseId, userId })
    if (!courseProgress) {
      return res.status(404).json({ success: false, message: "Course progress not found" })
    }

    const existing = courseProgress.videoProgress.find(
      (p) => p.subsectionId.toString() === subsectionId
    )
    if (existing) {
      existing.timestamp = timestamp
    } else {
      courseProgress.videoProgress.push({ subsectionId, timestamp })
    }
    await courseProgress.save()

    return res.status(200).json({ success: true, message: "Timestamp saved" })
  } catch (error) {
    console.error("updateVideoTimestamp error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// FEATURE-9: Video Resume — get saved timestamp for a specific subsection
exports.getVideoTimestamp = async (req, res) => {
  const { courseId, subsectionId } = req.query
  const userId = req.user.id

  try {
    const courseProgress = await CourseProgress.findOne({ courseID: courseId, userId })
    if (!courseProgress) {
      return res.status(200).json({ success: true, timestamp: 0 })
    }
    const entry = courseProgress.videoProgress.find(
      (p) => p.subsectionId.toString() === subsectionId
    )
    return res.status(200).json({ success: true, timestamp: entry?.timestamp || 0 })
  } catch (error) {
    console.error("getVideoTimestamp error:", error)
    return res.status(500).json({ success: false, message: "Internal server error" })
  }
}

// exports.getProgressPercentage = async (req, res) => {
//   const { courseId } = req.body
//   const userId = req.user.id

//   if (!courseId) {
//     return res.status(400).json({ error: "Course ID not provided." })
//   }

//   try {
//     // Find the course progress document for the user and course
//     let courseProgress = await CourseProgress.findOne({
//       courseID: courseId,
//       userId: userId,
//     })
//       .populate({
//         path: "courseID",
//         populate: {
//           path: "courseContent",
//         },
//       })
//       .exec()

//     if (!courseProgress) {
//       return res
//         .status(400)
//         .json({ error: "Can not find Course Progress with these IDs." })
//     }
//     console.log(courseProgress, userId)
//     let lectures = 0
//     courseProgress.courseID.courseContent?.forEach((sec) => {
//       lectures += sec.subSection.length || 0
//     })

//     let progressPercentage =
//       (courseProgress.completedVideos.length / lectures) * 100

//     // To make it up to 2 decimal point
//     const multiplier = Math.pow(10, 2)
//     progressPercentage =
//       Math.round(progressPercentage * multiplier) / multiplier

//     return res.status(200).json({
//       data: progressPercentage,
//       message: "Succesfully fetched Course progress",
//     })
//   } catch (error) {
//     console.error(error)
//     return res.status(500).json({ error: "Internal server error" })
//   }
// }
