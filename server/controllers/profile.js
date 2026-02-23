const Profile = require("../models/Profile")
const CourseProgress = require("../models/CourseProgress")

const Course = require("../models/Course")
const User = require("../models/User")
const { uploadImageToCloudinary } = require("../utils/imageUploader")
const mongoose = require("mongoose")
const { convertSecondsToDuration } = require("../utils/secToDuration")
// Method for updating a profile
exports.updateProfile = async (req, res) => {
  try {
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body
    const id = req.user.id

    // Find the profile by id
    const userDetails = await User.findById(id)
    const profile = await Profile.findById(userDetails.additionalDetails)

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    })
    await user.save()

    // Update the profile fields
    profile.dateOfBirth = dateOfBirth
    profile.about = about
    profile.contactNumber = contactNumber
    profile.gender = gender

    // Save the updated profile
    await profile.save()

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()

    return res.json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    })
  } catch (error) {
    // console.log(error)
    return res.status(500).json({
      success: false,
      error: error.message,
    })
  }
}

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    // console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnroled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) {
    // console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec()
    // console.log(userDetails)
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture
    const userId = req.user.id
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    )
    // console.log(image)
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    )
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id
    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec()
    userDetails = userDetails.toObject()
    var SubsectionLength = 0
    for (var i = 0; i < userDetails.courses.length; i++) {
      let totalDurationInSeconds = 0
      SubsectionLength = 0
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        )
        SubsectionLength +=
          userDetails.courses[i].courseContent[j].subSection.length
      }
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      })
      courseProgressCount = courseProgressCount?.completedVideos.length
      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100
      } else {
        // To make it up to 2 decimal point
        const multiplier = Math.pow(10, 2)
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier
      }
    }

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      })
    }
    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body
    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" })
    }
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { wishlist: courseId } },
      { new: true }
    ).select("wishlist")
    return res.status(200).json({
      success: true,
      message: "Course added to wishlist",
      wishlist: user.wishlist,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const { courseId } = req.body
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { wishlist: courseId } },
      { new: true }
    ).select("wishlist")
    return res.status(200).json({
      success: true,
      message: "Course removed from wishlist",
      wishlist: user.wishlist,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id
    const user = await User.findById(userId)
      .populate({
        path: "wishlist",
        populate: { path: "instructor", select: "firstName lastName image" },
      })
      .select("wishlist")
    return res.status(200).json({ success: true, data: user.wishlist })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// FEATURE-2: Course Completion Certificate
// GET /api/v1/profile/getCertificate/:courseId  — auth + isStudent
exports.getCertificate = async (req, res) => {
  try {
    const { courseId } = req.params
    const userId = req.user.id

    // Fetch course with all subsections to count total
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection", select: "_id" },
      })
      .populate("instructor", "firstName lastName")

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" })
    }

    // Count total subsections
    let totalSubsections = 0
    course.courseContent.forEach((section) => {
      totalSubsections += section.subSection.length
    })

    // Check student progress
    const progress = await CourseProgress.findOne({ courseID: courseId, userId })
    const completedCount = progress?.completedVideos?.length || 0

    if (completedCount < totalSubsections) {
      return res.status(403).json({
        success: false,
        message: `Course not completed yet (${completedCount}/${totalSubsections} videos done)`,
        completedCount,
        totalSubsections,
      })
    }

    // Fetch student name
    const student = await User.findById(userId).select("firstName lastName")

    return res.status(200).json({
      success: true,
      data: {
        studentName: `${student.firstName} ${student.lastName}`,
        courseName: course.courseName,
        instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
        completionDate: new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        totalLectures: totalSubsections,
        certificateId: `SN-${courseId.slice(-6).toUpperCase()}-${userId.slice(-6).toUpperCase()}`,
      },
    })
  } catch (error) {
    console.error("getCertificate error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// FEATURE-10: Instructor Public Profile Page
// GET /api/v1/profile/instructorProfile/:instructorId  — public, no auth
exports.getInstructorProfile = async (req, res) => {
  try {
    const { instructorId } = req.params

    const instructor = await User.findById(instructorId)
      .populate("additionalDetails")
      .select("firstName lastName email image accountType")

    if (!instructor || instructor.accountType !== "Instructor") {
      return res.status(404).json({ success: false, message: "Instructor not found" })
    }

    const courses = await Course.findById
      ? await Course.find({ instructor: instructorId, status: "Published" })
          .populate("ratingAndReviews", "rating")
          .select("courseName thumbnail price studentsEnroled ratingAndReviews createdAt")
      : []

    // Aggregate stats
    let totalStudents = 0
    let ratingSum = 0
    let ratingCount = 0

    for (const course of courses) {
      totalStudents += course.studentsEnroled.length
      for (const review of course.ratingAndReviews) {
        ratingSum += review.rating
        ratingCount++
      }
    }

    const avgRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : "0.0"

    return res.status(200).json({
      success: true,
      data: {
        instructor,
        courses,
        stats: {
          totalStudents,
          avgRating,
          totalCourses: courses.length,
          totalReviews: ratingCount,
        },
      },
    })
  } catch (error) {
    console.error("getInstructorProfile error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

exports.instructorDashboard = async (req, res) => {
  try {
    const courseDetails = await Course.find({ instructor: req.user.id })

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEnroled.length
      const totalAmountGenerated = totalStudentsEnrolled * course.price

      // Create a new object with the additional fields
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        // Include other course properties as needed
        totalStudentsEnrolled,
        totalAmountGenerated,
      }

      return courseDataWithStats
    })

    res.status(200).json({ courses: courseData })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server Error" })
  }
}
