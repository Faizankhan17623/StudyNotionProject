import * as Icons from "react-icons/vsc"
import { useDispatch } from "react-redux"
import { NavLink, matchPath, useLocation } from "react-router-dom"

import { resetCourseState } from "../../../slices/courseSlice"

export default function SidebarLink({ link, iconName }) {
  const Icon = Icons[iconName]
  const location = useLocation()
  const dispatch = useDispatch()

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname)
  }

  const isActive = matchRoute(link.path)

  return (
    <NavLink
      to={link.path}
      onClick={() => dispatch(resetCourseState())}
      className={`relative mx-2 flex items-center gap-x-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 ${
        isActive
          ? "bg-yellow-800 text-yellow-50"
          : "text-richblack-300 hover:bg-richblack-700 hover:text-richblack-50"
      }`}
    >
      {isActive && (
        <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-yellow-50" />
      )}
      {Icon && <Icon className="text-lg shrink-0" />}
      <span>{link.name}</span>
    </NavLink>
  )
}
