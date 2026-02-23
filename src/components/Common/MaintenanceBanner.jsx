import { FiTool } from "react-icons/fi"

// This banner is shown ONLY to admins when maintenance is active.
// Non-admins see the full MaintenancePage instead (handled in App.jsx).
function MaintenanceBanner({ data }) {
  if (!data?.isActive) return null

  const returnDateStr = data.returnAt
    ? new Date(data.returnAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null

  return (
    <div className="w-full bg-yellow-50 text-richblack-900 px-4 py-2.5">
      <div className="mx-auto flex max-w-maxContent flex-wrap items-center justify-center gap-2 text-sm font-medium">
        <FiTool className="shrink-0 text-base" />
        <span>
          <strong>[Admin View]</strong> Maintenance is active —{" "}
          {data.message}
        </span>
        {returnDateStr && (
          <span className="rounded-full bg-richblack-900 px-3 py-0.5 text-xs text-yellow-50">
            Back by {returnDateStr}
          </span>
        )}
      </div>
    </div>
  )
}

export default MaintenanceBanner
