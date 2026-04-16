/**
 * StudyNotion — Course Metadata Migration Script
 * ─────────────────────────────────────────────────────────────────────────────
 * One-time script that backfills the new fields added to the Course model:
 *   - averageRating  (calculated from ratingAndReviews)
 *   - totalDuration  (sum of all subsection timeDuration values, in seconds)
 *   - totalLectures  (count of all subsections across all sections)
 *
 * Usage (run from the project root or from /server):
 *   cd server
 *   node scripts/updateCourseMetadata.js
 */

require("dotenv").config({ path: require("path").join(__dirname, "../.env") })

const mongoose = require("mongoose")
const Course = require("../models/Course")
const Section = require("../models/Section")
const RatingAndReview = require("../models/RatingandReview")

const MONGODB_URL = process.env.MONGODB_URL

async function run() {
  if (!MONGODB_URL) {
    console.error("ERROR: MONGODB_URL is not set in your .env file")
    process.exit(1)
  }

  await mongoose.connect(MONGODB_URL)
  console.log("Connected to MongoDB\n")

  const courses = await Course.find({}).lean()
  console.log(`Found ${courses.length} courses to update...\n`)

  let updated = 0
  let errors = 0

  for (const course of courses) {
    try {
      // 1. Calculate averageRating
      const reviews = await RatingAndReview.find({ course: course._id }, "rating").lean()
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0

      // 2. Calculate totalDuration and totalLectures
      let totalDuration = 0
      let totalLectures = 0

      const sections = await Section.find(
        { _id: { $in: course.courseContent } },
        "subSection"
      )
        .populate("subSection", "timeDuration")
        .lean()

      for (const section of sections) {
        for (const sub of section.subSection || []) {
          totalDuration += parseInt(sub.timeDuration) || 0
          totalLectures += 1
        }
      }

      // 3. Save to DB
      await Course.findByIdAndUpdate(course._id, {
        averageRating: parseFloat(avgRating.toFixed(2)),
        totalDuration,
        totalLectures,
      })

      console.log(
        `  ✓ "${course.courseName}" — rating: ${avgRating.toFixed(2)}, duration: ${totalDuration}s, lectures: ${totalLectures}`
      )
      updated++
    } catch (err) {
      console.error(`  ✗ "${course.courseName}" — ERROR: ${err.message}`)
      errors++
    }
  }

  console.log(`\nDone! Updated: ${updated}, Errors: ${errors}`)
  await mongoose.disconnect()
}

run().catch((err) => {
  console.error("Fatal error:", err)
  process.exit(1)
})
