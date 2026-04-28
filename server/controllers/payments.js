const { instance } = require("../config/razorpay")
const Course = require("../models/Course")
const Coupon = require("../models/Coupon")
const crypto = require("crypto")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { createNotification } = require("./Notification")
const mongoose = require("mongoose")
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail")
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail")
const CourseProgress = require("../models/CourseProgress")
const Enrollment = require("../models/Enrollment")

// Enroll student in free (price = 0) courses without any payment
exports.enrollFree = async (req, res) => {
  const { courses } = req.body
  const userId = req.user.id

  if (!courses || courses.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide Course IDs" })
  }

  try {
    for (const course_id of courses) {
      const course = await Course.findById(course_id)

      if (!course) {
        return res.status(404).json({ success: false, message: `Course not found: ${course_id}` })
      }

      if (course.price !== 0) {
        return res.status(400).json({
          success: false,
          message: `"${course.courseName}" is not a free course`,
        })
      }

      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res.status(400).json({ success: false, message: "Already enrolled in this course" })
      }
    }

    await enrollStudents(courses, userId)
    return res.status(200).json({ success: true, message: "Enrolled successfully" })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  const { courses, couponCode } = req.body
  const userId = req.user.id
  if (courses.length === 0) {
    return res.status(400).json({ success: false, message: "Please provide at least one Course ID" })
  }

  let total_amount = 0

  for (const course_id of courses) {
    let course
    try {
      // Find the course by its ID
      course = await Course.findById(course_id)

      // If the course is not found, return an error
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" })
      }

      // Check if the user is already enrolled in the course
      const uid = new mongoose.Types.ObjectId(userId)
      if (course.studentsEnroled.includes(uid)) {
        return res
          .status(400)
          .json({ success: false, message: "You are already enrolled in this course" })
      }

      // Add the price of the course to the total amount
      total_amount += course.price
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message })
    }
  }

  // Apply coupon discount if provided
  if (couponCode) {
    try {
      const coupon = await Coupon.findOne({
        code:     couponCode.toUpperCase().trim(),
        isActive: true,
        course:   { $in: courses },
      }).populate("course", "price")

      if (coupon) {
        const discountAmount = Math.floor((coupon.course.price * coupon.discountPercent) / 100)
        total_amount = Math.max(0, total_amount - discountAmount)
      }
    } catch (err) {
      console.log("Coupon apply error during payment:", err)
      // Non-fatal — proceed without discount if coupon lookup fails
    }
  }

  // If total is 0 (all courses are free or fully discounted), skip Razorpay
  if (total_amount === 0) {
    await enrollStudents(courses, userId)
    return res.status(200).json({ success: true, message: "Enrolled successfully (free)" })
  }

  const options = {
    amount: total_amount * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  }

  try {
    // Initiate the payment using Razorpay
    const paymentResponse = await instance.orders.create(options)
    res.json({
      success: true,
      data: paymentResponse,
    })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "Could not initiate order." })
  }
}

// verify the payment
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id   = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature  = req.body?.razorpay_signature
  const courses             = req.body?.courses
  const couponCode          = req.body?.couponCode

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Payment details are incomplete. Please try again." })
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature === razorpay_signature) {
    await enrollStudents(courses, userId)

    // Mark the coupon as used by this student
    if (couponCode) {
      try {
        await Coupon.findOneAndUpdate(
          {
            code:     couponCode.toUpperCase().trim(),
            isActive: true,
            course:   { $in: courses },
          },
          { $addToSet: { usedBy: userId } }
        )
      } catch (err) {
        console.log("Could not mark coupon as used:", err)
        // Non-fatal — enrollment already succeeded
      }
    }

    return res.status(200).json({ success: true, message: "Payment Verified" })
  }

  return res.status(400).json({ success: false, message: "Payment verification failed. Signature mismatch." })
}

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body

  const userId = req.user.id

  if (!orderId || !paymentId || !amount || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all the details" })
  }

  try {
    const enrolledStudent = await User.findById(userId)

    await mailSender(
      enrolledStudent.email,
      `Payment Received`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId,
        process.env.FRONTEND_URL
      )
    )
  } catch (error) {
    // console.log("error in sending mail", error)
    return res
      .status(400)
      .json({ success: false, message: "Could not send email" })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please Provide Course ID and User ID")
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  // Collect data needed for notifications — fired after the transaction commits
  const notificationQueue = []

  try {
    for (const courseId of courses) {
      // Find the course and enroll the student in it
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnroled: userId } },
        { new: true, session }
      )

      if (!enrolledCourse) {
        throw new Error("Course not found")
      }

      const [courseProgress] = await CourseProgress.create(
        [{ courseID: courseId, userId: userId, completedVideos: [] }],
        { session }
      )

      // Record the enrollment for analytics
      await Enrollment.create([{
        student: userId,
        course: courseId,
        amount: enrolledCourse.price || 0,
      }], { session })

      // Find the student and add the course to their list of enrolled courses
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        {
          $push: {
            courses: courseId,
            courseProgress: courseProgress._id,
          },
        },
        { new: true, session }
      )

      // Send an email notification to the enrolled student
      await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        courseEnrollmentEmail(
          enrolledCourse.courseName,
          `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
          process.env.FRONTEND_URL
        )
      )

      notificationQueue.push({
        instructorId: enrolledCourse.instructor,
        studentName: `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        courseName: enrolledCourse.courseName,
      })
    }

    await session.commitTransaction()
    session.endSession()

    // Notify each instructor after the transaction is safely committed
    for (const { instructorId, studentName, courseName } of notificationQueue) {
      createNotification(
        instructorId,
        "enrollment",
        "New Student Enrolled",
        `${studentName} just enrolled in your course "${courseName}"`,
        "/dashboard/instructor"
      )
    }
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }
}