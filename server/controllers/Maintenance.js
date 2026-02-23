const Maintenance = require("../models/Maintenance")
const User = require("../models/User")
const mailSender = require("../utils/mailSender")
const { maintenanceNotificationEmail } = require("../mail/templates/maintenanceNotification")

// GET /api/v1/maintenance/status  — public, no auth required
exports.getMaintenanceStatus = async (req, res) => {
  try {
    // There is only ever one maintenance doc — find it or return defaults
    let status = await Maintenance.findOne()
    if (!status) {
      return res.status(200).json({
        success: true,
        data: { isActive: false, message: "", returnAt: null },
      })
    }

    // Auto-expire: if returnAt has passed and maintenance is still marked active, turn it off
    if (status.isActive && status.returnAt && new Date(status.returnAt) < new Date()) {
      status.isActive = false
      await status.save()
    }

    return res.status(200).json({ success: true, data: status })
  } catch (error) {
    console.error("getMaintenanceStatus error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// POST /api/v1/maintenance/set  — admin only
// body: { isActive, message, returnAt }
exports.setMaintenance = async (req, res) => {
  try {
    const { isActive, message, returnAt } = req.body

    if (isActive === undefined) {
      return res.status(400).json({ success: false, message: "isActive is required" })
    }

    // Upsert — create if doesn't exist, update otherwise
    let status = await Maintenance.findOne()
    if (!status) {
      status = new Maintenance()
    }

    status.isActive = Boolean(isActive)
    if (message !== undefined) status.message = message
    if (returnAt !== undefined) status.returnAt = returnAt ? new Date(returnAt) : null
    status.updatedBy = req.user.id

    await status.save()

    return res.status(200).json({
      success: true,
      message: `Maintenance mode ${status.isActive ? "enabled" : "disabled"} successfully`,
      data: status,
    })
  } catch (error) {
    console.error("setMaintenance error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}

// POST /api/v1/maintenance/notify  — admin only
// Sends maintenance notification email to ALL registered users
exports.sendMaintenanceNotification = async (req, res) => {
  try {
    const { message, returnAt } = req.body

    if (!message) {
      return res.status(400).json({ success: false, message: "message is required" })
    }

    // Fetch all users
    const users = await User.find({}, "firstName email")

    if (users.length === 0) {
      return res.status(200).json({ success: true, message: "No users to notify", sent: 0 })
    }

    // Send emails — fire-and-forget each one so one failure doesn't block others
    let sent = 0
    const errors = []

    await Promise.allSettled(
      users.map(async (user) => {
        try {
          await mailSender(
            user.email,
            "Scheduled Maintenance – StudyNotion",
            maintenanceNotificationEmail(user.firstName, message, returnAt)
          )
          sent++
        } catch (err) {
          errors.push(user.email)
        }
      })
    )

    return res.status(200).json({
      success: true,
      message: `Notification sent to ${sent} user(s)`,
      sent,
      failed: errors.length,
    })
  } catch (error) {
    console.error("sendMaintenanceNotification error:", error)
    return res.status(500).json({ success: false, message: "Server error" })
  }
}
