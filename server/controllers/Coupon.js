const Coupon = require("../models/Coupon")
const Course = require("../models/Course")

const ALLOWED_DISCOUNTS = [5, 20, 50, 80, 100]
const MAX_COUPONS_PER_COURSE = 2

// Generate a random 8-character uppercase alphanumeric code
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let code = ""
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)]
  }
  return code
}

// POST /api/v1/course/createCoupon
exports.createCoupon = async (req, res) => {
  try {
    const { courseId, discountPercent, customCode } = req.body
    const instructorId = req.user.id

    if (!courseId || !discountPercent) {
      return res.status(400).json({ success: false, message: "courseId and discountPercent are required" })
    }

    if (!ALLOWED_DISCOUNTS.includes(Number(discountPercent))) {
      return res.status(400).json({
        success: false,
        message: `Discount must be one of: ${ALLOWED_DISCOUNTS.join(", ")}`,
      })
    }

    // Verify the instructor owns this course
    const course = await Course.findOne({ _id: courseId, instructor: instructorId })
    if (!course) {
      return res.status(403).json({ success: false, message: "Course not found or you are not the instructor" })
    }

    // Enforce max 2 coupons per course
    const existingCount = await Coupon.countDocuments({ course: courseId, instructor: instructorId })
    if (existingCount >= MAX_COUPONS_PER_COURSE) {
      return res.status(400).json({
        success: false,
        message: `You can only create ${MAX_COUPONS_PER_COURSE} coupons per course`,
      })
    }

    // Resolve the coupon code
    let code = customCode ? customCode.toUpperCase().trim() : generateCode()

    // Make sure the code is globally unique — retry auto-generate up to 5 times
    let attempts = 0
    while (await Coupon.findOne({ code })) {
      if (customCode) {
        return res.status(400).json({ success: false, message: "This coupon code already exists. Try a different one." })
      }
      code = generateCode()
      attempts++
      if (attempts > 5) {
        return res.status(500).json({ success: false, message: "Could not generate a unique code. Please try again." })
      }
    }

    const coupon = await Coupon.create({
      code,
      discountPercent: Number(discountPercent),
      course: courseId,
      instructor: instructorId,
    })

    return res.status(201).json({ success: true, data: coupon })
  } catch (error) {
    console.error("createCoupon error:", error)
    return res.status(500).json({ success: false, message: "Could not create coupon" })
  }
}

// GET /api/v1/course/getCourseCoupons?courseId=
exports.getCourseCoupons = async (req, res) => {
  try {
    const { courseId } = req.query
    const instructorId = req.user.id

    if (!courseId) {
      return res.status(400).json({ success: false, message: "courseId is required" })
    }

    // Only return coupons the instructor themselves created for this course
    // Select usedBy so the frontend can show usage count and disable delete button
    const coupons = await Coupon.find({ course: courseId, instructor: instructorId })
      .select("code discountPercent isActive usedBy createdAt")
      .sort({ createdAt: -1 })

    // Return usedCount instead of full usedBy array (no need to expose student IDs)
    const data = coupons.map((c) => ({
      _id:             c._id,
      code:            c.code,
      discountPercent: c.discountPercent,
      isActive:        c.isActive,
      usedCount:       c.usedBy.length,
      createdAt:       c.createdAt,
    }))

    return res.status(200).json({ success: true, data })
  } catch (error) {
    console.error("getCourseCoupons error:", error)
    return res.status(500).json({ success: false, message: "Could not fetch coupons" })
  }
}

// DELETE /api/v1/course/deleteCoupon
exports.deleteCoupon = async (req, res) => {
  try {
    const { couponId } = req.body
    const instructorId = req.user.id

    if (!couponId) {
      return res.status(400).json({ success: false, message: "couponId is required" })
    }

    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }
    if (coupon.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ success: false, message: "You can only delete your own coupons" })
    }

    // Block deletion if at least one student has already used this coupon
    if (coupon.usedBy.length > 0) {
      return res.status(400).json({
        success: false,
        message: `This coupon has been used by ${coupon.usedBy.length} student${coupon.usedBy.length > 1 ? "s" : ""} and cannot be deleted. You can deactivate it instead.`,
      })
    }

    await Coupon.findByIdAndDelete(couponId)
    return res.status(200).json({ success: true, message: "Coupon deleted" })
  } catch (error) {
    console.error("deleteCoupon error:", error)
    return res.status(500).json({ success: false, message: "Could not delete coupon" })
  }
}

// PUT /api/v1/course/toggleCoupon
// Instructor can activate or deactivate a coupon at any time
// This is the only action allowed on a coupon that has already been used
exports.toggleCoupon = async (req, res) => {
  try {
    const { couponId } = req.body
    const instructorId = req.user.id

    if (!couponId) {
      return res.status(400).json({ success: false, message: "couponId is required" })
    }

    const coupon = await Coupon.findById(couponId)
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Coupon not found" })
    }
    if (coupon.instructor.toString() !== instructorId.toString()) {
      return res.status(403).json({ success: false, message: "You can only update your own coupons" })
    }

    coupon.isActive = !coupon.isActive
    await coupon.save()

    return res.status(200).json({
      success: true,
      isActive: coupon.isActive,
      message: coupon.isActive ? "Coupon activated" : "Coupon deactivated",
    })
  } catch (error) {
    console.error("toggleCoupon error:", error)
    return res.status(500).json({ success: false, message: "Could not update coupon" })
  }
}

// POST /api/v1/course/applyCoupon
// Called by student at cart — checks if the code applies to any course in their cart
exports.applyCoupon = async (req, res) => {
  try {
    const { code, courses } = req.body // courses = array of course IDs in cart

    if (!code || !courses?.length) {
      return res.status(400).json({ success: false, message: "code and courses are required" })
    }

    const coupon = await Coupon.findOne({
      code:     code.toUpperCase().trim(),
      isActive: true,
      course:   { $in: courses },
    }).populate("course", "price courseName")

    if (!coupon) {
      return res.status(404).json({ success: false, message: "Invalid or expired coupon code" })
    }

    const originalPrice   = coupon.course.price
    const discountAmount  = Math.floor((originalPrice * coupon.discountPercent) / 100)
    const discountedPrice = originalPrice - discountAmount

    return res.status(200).json({
      success: true,
      data: {
        code:           coupon.code,
        discountPercent: coupon.discountPercent,
        courseId:        coupon.course._id,
        courseName:      coupon.course.courseName,
        originalPrice,
        discountAmount,
        discountedPrice,
      },
    })
  } catch (error) {
    console.error("applyCoupon error:", error)
    return res.status(500).json({ success: false, message: "Could not apply coupon" })
  }
}
