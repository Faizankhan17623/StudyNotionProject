const Notification = require("../models/Notification")

// Internal helper — imported and called by other controllers.
// Never throws — a notification failure must never block the main flow.
const createNotification = async (recipientId, type, title, message, link = null) => {
  try {
    await Notification.create({ recipient: recipientId, type, title, message, link })
  } catch (error) {
    console.error("createNotification failed (non-fatal):", error.message)
  }
}

// GET /api/v1/notifications
exports.getNotifications = async (req, res) => {
  try {
    const userId = req.user.id

    const [notifications, unreadCount] = await Promise.all([
      Notification.find({ recipient: userId }).sort({ createdAt: -1 }).limit(20),
      Notification.countDocuments({ recipient: userId, isRead: false }),
    ])

    return res.status(200).json({ success: true, data: notifications, unreadCount })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not fetch notifications" })
  }
}

// PUT /api/v1/notifications/markRead
exports.markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body
    await Notification.findOneAndUpdate(
      { _id: notificationId, recipient: req.user.id },
      { isRead: true }
    )
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not mark as read" })
  }
}

// PUT /api/v1/notifications/markAllRead
exports.markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    )
    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ success: false, message: "Could not mark all as read" })
  }
}

module.exports.createNotification = createNotification
