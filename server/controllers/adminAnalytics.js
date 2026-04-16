const User = require("../models/User")
const Course = require("../models/Course")
const Enrollment = require("../models/Enrollment")

// Month name lookup
const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

exports.getAdminAnalytics = async (req, res) => {
  try {
    const now = new Date()
    const twelveMonthsAgo = new Date(now)
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11)
    twelveMonthsAgo.setDate(1)
    twelveMonthsAgo.setHours(0, 0, 0, 0)

    // ── 1. Platform overview stats ───────────────────────────────────────────
    const [
      totalStudents,
      totalInstructors,
      totalCourses,
      revenueResult,
      totalEnrollments,
    ] = await Promise.all([
      User.countDocuments({ accountType: "Student" }),
      User.countDocuments({ accountType: "Instructor" }),
      Course.countDocuments({ status: "Published" }),
      Enrollment.aggregate([{ $group: { _id: null, total: { $sum: "$amount" } } }]),
      Enrollment.countDocuments({}),
    ])

    const totalRevenue = revenueResult[0]?.total || 0

    // ── 2. Monthly revenue + enrollments for last 12 months ─────────────────
    const rawMonthly = await Enrollment.aggregate([
      { $match: { createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: {
            year:  { $year:  "$createdAt" },
            month: { $month: "$createdAt" },
          },
          revenue:     { $sum: "$amount" },
          enrollments: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ])

    // Build a complete 12-month array — fill in 0 for months with no data
    const monthlyData = []
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now)
      d.setMonth(d.getMonth() - i)
      const y = d.getFullYear()
      const m = d.getMonth() + 1
      const found = rawMonthly.find((r) => r._id.year === y && r._id.month === m)
      monthlyData.push({
        label:       `${MONTH_NAMES[m - 1]} ${y}`,
        revenue:     found?.revenue     || 0,
        enrollments: found?.enrollments || 0,
      })
    }

    // ── 3. Top 5 courses by revenue ──────────────────────────────────────────
    const topCoursesByRevenue = await Enrollment.aggregate([
      { $group: { _id: "$course", revenue: { $sum: "$amount" }, enrollments: { $sum: 1 } } },
      { $sort: { revenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
          pipeline: [{ $project: { courseName: 1, thumbnail: 1, price: 1 } }],
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          courseName:  "$course.courseName",
          thumbnail:   "$course.thumbnail",
          price:       "$course.price",
          revenue:     1,
          enrollments: 1,
        },
      },
    ])

    // ── 4. Top 5 courses by enrollments ─────────────────────────────────────
    const topCoursesByEnrollment = await Enrollment.aggregate([
      { $group: { _id: "$course", revenue: { $sum: "$amount" }, enrollments: { $sum: 1 } } },
      { $sort: { enrollments: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: "courses",
          localField: "_id",
          foreignField: "_id",
          as: "course",
          pipeline: [{ $project: { courseName: 1, thumbnail: 1, price: 1 } }],
        },
      },
      { $unwind: { path: "$course", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          courseName:  "$course.courseName",
          thumbnail:   "$course.thumbnail",
          price:       "$course.price",
          revenue:     1,
          enrollments: 1,
        },
      },
    ])

    return res.status(200).json({
      success: true,
      data: {
        overview: {
          totalRevenue,
          totalEnrollments,
          totalCourses,
          totalStudents,
          totalInstructors,
        },
        monthlyData,
        topCoursesByRevenue,
        topCoursesByEnrollment,
      },
    })
  } catch (error) {
    console.error("getAdminAnalytics error:", error)
    return res.status(500).json({ success: false, message: "Failed to load analytics" })
  }
}
