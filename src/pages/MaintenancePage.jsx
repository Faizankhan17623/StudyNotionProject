import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { FiTool } from "react-icons/fi"

function MaintenancePage({ data }) {
  const [timeLeft, setTimeLeft] = useState(null)

  // Live countdown to returnAt
  useEffect(() => {
    if (!data?.returnAt) return

    const tick = () => {
      const diff = new Date(data.returnAt) - new Date()
      if (diff <= 0) {
        setTimeLeft(null)
        return
      }
      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)
      setTimeLeft({ hours, minutes, seconds })
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [data?.returnAt])

  const returnDateStr = data?.returnAt
    ? new Date(data.returnAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null

  return (
    <div className="flex min-h-screen w-screen flex-col items-center justify-center bg-richblack-900 px-4">
      {/* Card */}
      <div className="w-full max-w-lg rounded-2xl border border-richblack-700 bg-richblack-800 p-10 text-center shadow-2xl">

        {/* Brand */}
        <div className="mb-8">
          <div className="text-3xl font-bold text-yellow-50 tracking-widest">StudyNotion</div>
          <div className="mt-1 text-xs text-richblack-400 tracking-wider uppercase">
            Ignite Your Learning Journey
          </div>
        </div>

        {/* Icon */}
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-yellow-50 bg-richblack-700">
          <FiTool className="text-4xl text-yellow-50" />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-2xl font-bold text-richblack-5">
          We'll Be Back Soon!
        </h1>

        {/* Message */}
        <p className="mb-8 text-sm leading-relaxed text-richblack-300">
          {data?.message ||
            "StudyNotion is currently undergoing scheduled maintenance. We're working hard to improve your experience!"}
        </p>

        {/* Countdown or return time */}
        {timeLeft ? (
          <div className="mb-8">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-richblack-400">
              Back online in
            </p>
            <div className="flex items-center justify-center gap-3">
              {[
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds },
              ].map(({ label, value }) => (
                <div key={label} className="flex flex-col items-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-richblack-900 text-2xl font-bold text-yellow-50">
                    {String(value).padStart(2, "0")}
                  </div>
                  <span className="mt-1 text-xs text-richblack-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : returnDateStr ? (
          <div className="mb-8 rounded-xl bg-richblack-900 px-6 py-3">
            <p className="text-xs text-richblack-400">Expected return</p>
            <p className="text-base font-semibold text-yellow-50">{returnDateStr}</p>
          </div>
        ) : null}

        {/* Divider */}
        <div className="my-6 border-t border-richblack-700" />

        {/* Admin login link */}
        <p className="text-xs text-richblack-500">
          Are you an admin?{" "}
          <Link to="/login" className="text-yellow-50 hover:underline">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  )
}

export default MaintenancePage
