import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiTool, FiBell, FiToggleLeft, FiToggleRight } from "react-icons/fi"
import { toast } from "react-hot-toast"
import { apiConnector } from "../../../../services/apiConnector"
import { maintenanceEndpoints } from "../../../../services/apis"

function MaintenanceMode() {
  const { token } = useSelector((state) => state.auth)

  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notifying, setNotifying] = useState(false)

  // Form state
  const [isActive, setIsActive] = useState(false)
  const [message, setMessage] = useState(
    "StudyNotion is currently down for scheduled maintenance. We'll be back soon!"
  )
  const [returnAt, setReturnAt] = useState("")

  // Notification form
  const [notifMessage, setNotifMessage] = useState("")
  const [notifReturnAt, setNotifReturnAt] = useState("")

  useEffect(() => {
    fetchStatus()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchStatus = async () => {
    setLoading(true)
    try {
      const res = await apiConnector(
        "GET",
        maintenanceEndpoints.GET_MAINTENANCE_STATUS_API
      )
      if (res?.data?.success) {
        const data = res.data.data
        setStatus(data)
        setIsActive(data.isActive)
        setMessage(data.message || "")
        setReturnAt(
          data.returnAt
            ? new Date(data.returnAt).toISOString().slice(0, 16)
            : ""
        )
      }
    } catch {
      toast.error("Could not load maintenance status")
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await apiConnector(
        "POST",
        maintenanceEndpoints.SET_MAINTENANCE_API,
        {
          isActive,
          message,
          returnAt: returnAt || null,
        },
        { Authorization: `Bearer ${token}` }
      )
      if (res?.data?.success) {
        toast.success(res.data.message)
        setStatus(res.data.data)
      } else {
        toast.error("Could not update maintenance mode")
      }
    } catch {
      toast.error("Could not update maintenance mode")
    }
    setSaving(false)
  }

  const handleSendNotification = async () => {
    if (!notifMessage.trim()) {
      toast.error("Please enter a notification message")
      return
    }
    setNotifying(true)
    try {
      const res = await apiConnector(
        "POST",
        maintenanceEndpoints.SEND_MAINTENANCE_NOTIFICATION_API,
        {
          message: notifMessage,
          returnAt: notifReturnAt || null,
        },
        { Authorization: `Bearer ${token}` }
      )
      if (res?.data?.success) {
        toast.success(`Email sent to ${res.data.sent} user(s)!`)
        setNotifMessage("")
        setNotifReturnAt("")
      } else {
        toast.error("Could not send notification")
      }
    } catch {
      toast.error("Could not send notification")
    }
    setNotifying(false)
  }

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-10">
      {/* Page Header */}
      <div className="mb-8 flex items-center gap-3">
        <FiTool className="text-3xl text-yellow-50" />
        <div>
          <h1 className="text-4xl font-bold font-outfit text-white">Maintenance Mode</h1>
          <p className="text-sm text-richblack-400">
            Enable maintenance mode to show a banner across the site and notify all users
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Left: Toggle & settings */}
        <div className="flex-1 rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp">
          <h2 className="mb-5 text-lg font-semibold text-richblack-5">Banner Settings</h2>

          {/* Toggle */}
          <div className="mb-6 flex items-center justify-between rounded-lg bg-richblack-900 px-4 py-3">
            <div>
              <p className="font-medium text-richblack-5">Maintenance Mode</p>
              <p className="text-xs text-richblack-400">
                {isActive ? "Banner is visible to all users" : "Site is operating normally"}
              </p>
            </div>
            <button
              onClick={() => setIsActive((v) => !v)}
              className="text-3xl transition-colors"
            >
              {isActive ? (
                <FiToggleRight className="text-yellow-50" />
              ) : (
                <FiToggleLeft className="text-richblack-400" />
              )}
            </button>
          </div>

          {/* Message */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-richblack-200">
              Banner Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-2.5 text-sm text-richblack-5 outline-none focus:border-yellow-50"
              placeholder="Tell users what's happening..."
            />
          </div>

          {/* Return Date */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-richblack-200">
              Expected Return Date &amp; Time <span className="text-richblack-400">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={returnAt}
              onChange={(e) => setReturnAt(e.target.value)}
              className="w-full rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-2.5 text-sm text-richblack-5 outline-none focus:border-yellow-50"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full rounded-lg bg-yellow-50 py-2.5 text-sm font-semibold text-richblack-900 transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Banner Settings"}
          </button>

          {/* Current status */}
          {status && (
            <div className="mt-4 rounded-lg bg-richblack-900 px-4 py-3 text-xs text-richblack-400">
              Last updated:{" "}
              <span className="text-richblack-200">
                {new Date(status.updatedAt).toLocaleString("en-IN")}
              </span>
            </div>
          )}
        </div>

        {/* Right: Notify all users */}
        <div className="flex-1 rounded-3xl border border-white/10 glass-card p-8 shadow-xl animate-revealUp" style={{animationDelay: '0.1s'}}>
          <div className="mb-5 flex items-center gap-2">
            <FiBell className="text-yellow-50" />
            <h2 className="text-lg font-semibold text-richblack-5">
              Notify All Users via Email
            </h2>
          </div>
          <p className="mb-5 text-sm text-richblack-400">
            Send a maintenance notification email to every registered user on the platform.
          </p>

          {/* Notification Message */}
          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-richblack-200">
              Email Message
            </label>
            <textarea
              value={notifMessage}
              onChange={(e) => setNotifMessage(e.target.value)}
              rows={4}
              className="w-full resize-none rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-2.5 text-sm text-richblack-5 outline-none focus:border-yellow-50"
              placeholder="We will be performing scheduled maintenance on StudyNotion to deploy new features..."
            />
          </div>

          {/* Return Date for notification */}
          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-richblack-200">
              Expected Return Date &amp; Time <span className="text-richblack-400">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={notifReturnAt}
              onChange={(e) => setNotifReturnAt(e.target.value)}
              className="w-full rounded-lg border border-richblack-600 bg-richblack-900 px-4 py-2.5 text-sm text-richblack-5 outline-none focus:border-yellow-50"
            />
          </div>

          <button
            onClick={handleSendNotification}
            disabled={notifying}
            className="w-full rounded-lg border border-yellow-50 py-2.5 text-sm font-semibold text-yellow-50 transition-colors hover:bg-yellow-50 hover:text-richblack-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {notifying ? "Sending..." : "Send Email to All Users"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default MaintenanceMode
