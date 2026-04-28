import { useState } from "react"
import { VscSignOut } from "react-icons/vsc"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { sidebarLinks } from "../../../data/dashboard-links"
import { logout } from "../../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import ConfirmationModal from "../../Common/ConfirmationModal"
import SidebarLink from "./SidebarLink"

export default function Sidebar() {
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  )
  const { loading: authLoading } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [confirmationModal, setConfirmationModal] = useState(null)

  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[240px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <>
      <div className="flex h-[calc(100vh-3.5rem)] min-w-[240px] flex-col border-r-[1px] border-r-richblack-700/50 bg-richblack-800/80 backdrop-blur-xl shadow-[4px_0_24px_rgba(0,0,0,0.4)] z-10 transition-all duration-300">
        {/* User Info */}
        <div className="flex items-center gap-3 border-b border-richblack-700 px-6 py-5">
          <img
            src={user?.image}
            alt={user?.firstName}
            className="h-10 w-10 rounded-full object-cover ring-2 ring-yellow-500"
          />
          <div className="overflow-hidden flex-1 min-w-0">
            <p className="truncate text-sm font-semibold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-richblack-400 capitalize">
              {user?.accountType}
            </p>
            {/* Streak badge — students only */}
            {user?.accountType === ACCOUNT_TYPE.STUDENT && (user?.currentStreak > 0) && (
              <div className="mt-1 flex items-center gap-1">
                <span className="text-sm leading-none">🔥</span>
                <span className="text-xs font-bold text-orange-400">
                  {user.currentStreak} day{user.currentStreak !== 1 ? "s" : ""}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1 pt-4 flex-1">
          {sidebarLinks.map((link) => {
            if (link.type && user?.accountType !== link.type) return null
            return (
              <SidebarLink key={link.id} link={link} iconName={link.icon} />
            )
          })}
        </nav>

        <div className="mx-6 h-[1px] bg-richblack-700" />

        {/* Bottom Links */}
        <div className="flex flex-col gap-1 py-4">
          <SidebarLink
            link={{ name: "Settings", path: "/dashboard/settings" }}
            iconName="VscSettingsGear"
          />
          <button
            onClick={() =>
              setConfirmationModal({
                text1: "Are you sure?",
                text2: "You will be logged out of your account.",
                btn1Text: "Logout",
                btn2Text: "Cancel",
                btn1Handler: () => dispatch(logout(navigate)),
                btn2Handler: () => setConfirmationModal(null),
              })
            }
            className="flex items-center gap-x-2 px-6 py-2 text-sm font-medium text-richblack-300 hover:bg-richblack-700 hover:text-richblack-50 transition-all duration-200 mx-2 rounded-md"
          >
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </button>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}
