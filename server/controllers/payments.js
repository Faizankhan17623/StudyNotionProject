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
const PlanPurchase = require("../models/PlanPurchase")

// Server-side source of truth for plan prices — never trust a client-sent amount
const PLAN_PRICES = {
  Pro: 499,
  ProMax: 999,
}

// Free-plan students may only have 1 active enrolled course at a time,
// per the Pricing page. Pro/ProMax are unlimited. Returns an error message
// string if the enrollment should be blocked, or null if it's allowed.
async function checkEnrollmentLimit(userId, newCourseCount) {
  const user = await User.findById(userId).select("subscriptionPlan courses")
  const plan = user?.subscriptionPlan || "Free"
  if (plan !== "Free") return null

  const currentCount = user?.courses?.length || 0
  if (currentCount + newCourseCount > 1) {
    return "Free plan is limited to 1 active course. Upgrade to Pro to enroll in unlimited courses."
  }
  return null
}

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

    const limitError = await checkEnrollmentLimit(userId, courses.length)
    if (limitError) {
      return res.status(403).json({ success: false, message: limitError })
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

  const limitError = await checkEnrollmentLimit(userId, courses.length)
  if (limitError) {
    return res.status(403).json({ success: false, message: limitError })
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
    try {
      await enrollStudents(courses, userId)
    } catch (error) {
      // Payment is already verified/captured at this point — never leave the
      // student having paid with no record of it. Log loudly so it can be
      // manually reconciled, and tell the client honestly what happened.
      console.error(
        `Payment verified (order ${razorpay_order_id}) but enrollment failed for user ${userId}:`,
        error
      )
      return res.status(500).json({
        success: false,
        message:
          "Your payment was successful, but we couldn't complete enrollment automatically. Our team has been notified — please contact support with your payment ID: " +
          razorpay_payment_id,
      })
    }

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

// Create a Razorpay order to upgrade the caller's subscription plan
exports.createPlanOrder = async (req, res) => {
  const { plan } = req.body
  const userId = req.user.id

  if (!PLAN_PRICES[plan]) {
    return res.status(400).json({
      success: false,
      message: "Invalid plan. Must be Pro or ProMax",
    })
  }

  const amount = PLAN_PRICES[plan]

  const options = {
    amount: amount * 100,
    currency: "INR",
    receipt: `plan_receipt_${Date.now()}`,
  }

  try {
    const paymentResponse = await instance.orders.create(options)
    res.json({
      success: true,
      data: paymentResponse,
      plan,
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({ success: false, message: "Could not initiate plan order." })
  }
}

// Verify the Razorpay signature, then upgrade the plan and record the purchase
exports.verifyPlanPayment = async (req, res) => {
  const razorpay_order_id   = req.body?.razorpay_order_id
  const razorpay_payment_id = req.body?.razorpay_payment_id
  const razorpay_signature  = req.body?.razorpay_signature
  const plan                = req.body?.plan

  const userId = req.user.id

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !PLAN_PRICES[plan] ||
    !userId
  ) {
    return res.status(400).json({ success: false, message: "Payment details are incomplete. Please try again." })
  }

  const body = razorpay_order_id + "|" + razorpay_payment_id

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex")

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ success: false, message: "Payment verification failed. Signature mismatch." })
  }

  try {
    const now = new Date()
    const oneMonthFromNow = new Date(now)
    oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1)

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        subscriptionPlan: plan,
        planStartedAt: now,
        planExpiresAt: oneMonthFromNow,
      },
      { new: true }
    )
      .populate("additionalDetails")
      .exec()

    await PlanPurchase.create({
      user: userId,
      plan,
      amount: PLAN_PRICES[plan],
      razorpay_order_id,
      razorpay_payment_id,
    })

    return res.status(200).json({
      success: true,
      message: "Payment Verified",
      data: updatedUser,
    })
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message })
  }
}

// enroll the student in the courses
const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please Provide Course ID and User ID")
  }

  const session = await mongoose.startSession()
  session.startTransaction()

  // Collect data needed for notifications/emails — fired after the
  // transaction commits, so a failed email or notification can never
  // roll back an enrollment the student already paid for.
  const postCommitQueue = []

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

      postCommitQueue.push({
        instructorId: enrolledCourse.instructor,
        studentEmail: enrolledStudent.email,
        studentName: `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        courseName: enrolledCourse.courseName,
      })
    }

    await session.commitTransaction()
    session.endSession()
  } catch (error) {
    await session.abortTransaction()
    session.endSession()
    throw error
  }

  // Enrollment is committed and safe. Email/notification failures from here
  // on are logged, not thrown — they must never undo a paid enrollment.
  for (const { instructorId, studentEmail, studentName, courseName } of postCommitQueue) {
    try {
      await mailSender(
        studentEmail,
        `Successfully Enrolled into ${courseName}`,
        courseEnrollmentEmail(courseName, studentName, process.env.FRONTEND_URL)
      )
    } catch (error) {
      console.log("Enrollment succeeded but confirmation email failed:", error.message)
    }

    createNotification(
      instructorId,
      "enrollment",
      "New Student Enrolled",
      `${studentName} just enrolled in your course "${courseName}"`,
      "/dashboard/instructor"
    )
  }
}