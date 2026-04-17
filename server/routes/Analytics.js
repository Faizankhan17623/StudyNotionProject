const express = require("express")
const router = express.Router()
const { auth, isAdmin, optionalAuth } = require("../middleware/auth")
const {
  heartbeat,
  trackPageView,
  getLiveStats,
} = require("../controllers/liveAnalytics")

// Public — no login required (optionalAuth sets req.user if logged in, never rejects guests)
router.post("/heartbeat", optionalAuth, heartbeat)
router.post("/pageview",  optionalAuth, trackPageView)

// Admin only
router.get("/live", auth, isAdmin, getLiveStats)

module.exports = router
