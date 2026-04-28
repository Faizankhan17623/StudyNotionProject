const express = require("express")
const router = express.Router()

const {
  getNotifications,
  markAsRead,
  markAllAsRead,
} = require("../controllers/Notification")
const { auth } = require("../middleware/auth")

router.get("/",             auth, getNotifications)
router.put("/markRead",     auth, markAsRead)
router.put("/markAllRead",  auth, markAllAsRead)

module.exports = router
