const VisitorHeartbeat = require("../models/VisitorHeartbeat")
const PageView = require("../models/PageView")
const User = require("../models/User")

// POST /api/v1/analytics/heartbeat  — public (optionalAuth), no login required
// Called by the frontend every 60 seconds to mark this session as still active.
// Upserts a VisitorHeartbeat document — TTL keeps it alive while the user is on the site.
exports.heartbeat = async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({ success: false, message: "sessionId is required" })
    }

    const userId = req.user?.id || null
    const ip = req.ip || ""

    await VisitorHeartbeat.findOneAndUpdate(
      { sessionId },
      { sessionId, userId, lastSeen: new Date(), ip },
      { upsert: true, new: true }
    )

    // Keep User.lastSeen fresh so admin can see when each member was last active
    if (userId) {
      await User.findByIdAndUpdate(userId, { lastSeen: new Date() })
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("heartbeat error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// POST /api/v1/analytics/pageview  — public (optionalAuth), no login required
// Logs a single page visit. Called on every React Router navigation.
exports.trackPageView = async (req, res) => {
  try {
    const { page, sessionId } = req.body

    if (!page) {
      return res.status(400).json({ success: false, message: "page is required" })
    }

    const userId = req.user?.id || null
    const ip = req.ip || ""

    await PageView.create({ page, sessionId: sessionId || "", userId, ip })

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("trackPageView error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// GET /api/v1/analytics/live  — admin only
// Returns real-time visitor stats for the admin analytics dashboard.
exports.getLiveStats = async (req, res) => {
  try {
    const now = new Date()
    const startOfDay = new Date(now)
    startOfDay.setHours(0, 0, 0, 0)

    const [
      totalOnline,
      loggedInOnline,
      todayViews,
      allTimeViews,
      topPages,
    ] = await Promise.all([
      // All heartbeat docs alive = total people on site right now (TTL ensures accuracy)
      VisitorHeartbeat.countDocuments({}),

      // Logged-in users currently online
      VisitorHeartbeat.countDocuments({ userId: { $ne: null } }),

      // Total page views today
      PageView.countDocuments({ createdAt: { $gte: startOfDay } }),

      // All-time total page views
      PageView.countDocuments({}),

      // Top 5 most visited pages today
      PageView.aggregate([
        { $match: { createdAt: { $gte: startOfDay } } },
        { $group: { _id: "$page", visits: { $sum: 1 } } },
        { $sort: { visits: -1 } },
        { $limit: 5 },
        { $project: { page: "$_id", visits: 1, _id: 0 } },
      ]),
    ])

    return res.status(200).json({
      success: true,
      data: {
        totalOnline,
        loggedInOnline,
        guestOnline: Math.max(0, totalOnline - loggedInOnline),
        todayViews,
        allTimeViews,
        topPages,
      },
    })
  } catch (error) {
    console.error("getLiveStats error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
