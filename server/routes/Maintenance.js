const express = require("express")
const router = express.Router()
const { auth, isAdmin } = require("../middleware/auth")
const {
  getMaintenanceStatus,
  setMaintenance,
  sendMaintenanceNotification,
} = require("../controllers/Maintenance")

// Public — frontend polls this to show/hide the maintenance banner
router.get("/status", getMaintenanceStatus)

// Admin only
router.post("/set", auth, isAdmin, setMaintenance)
router.post("/notify", auth, isAdmin, sendMaintenanceNotification)

module.exports = router
