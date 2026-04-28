import { useEffect, useRef, useState } from "react"
import { IoNotificationsOutline } from "react-icons/io5"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../../services/operations/notificationAPI"

export default function NotificationBell() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { notifications, unreadCount } = useSelector((state) => state.notification)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch on mount, then poll every 30 seconds
  useEffect(() => {
    if (!token) return
    dispatch(fetchNotifications(token))
    const interval = setInterval(() => dispatch(fetchNotifications(token)), 30000)
    return () => clearInterval(interval)
  }, [token, dispatch])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleNotificationClick = (notif) => {
    dispatch(markNotificationRead(notif._id, token))
    setOpen(false)
    if (notif.link) navigate(notif.link)
  }

  const handleMarkAllRead = (e) => {
    e.stopPropagation()
    dispatch(markAllNotificationsRead(token))
  }

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative text-richblack-100 hover:text-yellow-50 transition-colors"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-yellow-50 text-[10px] font-bold text-richblack-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-10 z-[1000] w-80 rounded-lg border border-richblack-700 bg-richblack-800 shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-richblack-700 px-4 py-3">
            <span className="text-sm font-semibold text-richblack-5">Notifications</span>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="text-xs text-yellow-50 hover:text-yellow-25 transition-colors"
              >
                Mark all as read
              </button>
            )}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="py-8 text-center text-sm text-richblack-400">
                No notifications yet
              </p>
            ) : (
              notifications.map((notif) => (
                <button
                  key={notif._id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`flex w-full flex-col gap-1 border-b border-richblack-700 px-4 py-3 text-left transition-colors hover:bg-richblack-700 ${
                    !notif.isRead ? "bg-richblack-700/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span
                      className={`text-sm font-medium leading-snug ${
                        !notif.isRead ? "text-richblack-5" : "text-richblack-300"
                      }`}
                    >
                      {notif.title}
                    </span>
                    {!notif.isRead && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-yellow-50" />
                    )}
                  </div>
                  <span className="text-xs text-richblack-400 line-clamp-2">
                    {notif.message}
                  </span>
                  <span className="text-xs text-richblack-500">
                    {new Date(notif.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
