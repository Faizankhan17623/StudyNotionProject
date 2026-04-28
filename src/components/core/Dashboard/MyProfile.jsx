import { RiEditBoxLine } from "react-icons/ri"
import { HiOutlineUser, HiOutlineIdentification, HiOutlineMail, HiOutlinePhone, HiOutlineCalendar } from "react-icons/hi"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { formattedDate } from "../../../utils/dateFormatter"
import IconBtn from "../../Common/IconBtn"
import { ACCOUNT_TYPE } from "../../../utils/constants"

export default function MyProfile() {
  const { user } = useSelector((state) => state.profile)
  const navigate = useNavigate()
  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT

  const personalDetails = [
    { label: "First Name", value: user?.firstName, icon: <HiOutlineUser /> },
    { label: "Last Name", value: user?.lastName, icon: <HiOutlineUser /> },
    { label: "Email", value: user?.email, icon: <HiOutlineMail /> },
    {
      label: "Phone Number",
      value: user?.additionalDetails?.contactNumber || "Not added",
      icon: <HiOutlinePhone />,
    },
    {
      label: "Gender",
      value: user?.additionalDetails?.gender || "Not added",
      icon: <HiOutlineIdentification />,
    },
    {
      label: "Date of Birth",
      value:
        formattedDate(user?.additionalDetails?.dateOfBirth) || "Not added",
      icon: <HiOutlineCalendar />,
    },
  ]

  const streak = user?.currentStreak || 0
  const longest = user?.longestStreak || 0

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-richblack-5">My Profile</h1>

      {/* Learning Streak Card — students only */}
      {isStudent && (
        <div className="rounded-xl border border-orange-500/30 bg-gradient-to-r from-orange-900/40 to-yellow-900/30 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 flex-col items-center justify-center rounded-full border-2 border-orange-400 bg-orange-900/60 shadow-lg shadow-orange-900/40">
                <span className="text-2xl leading-none">🔥</span>
                <span className="text-xs font-bold text-orange-300 leading-tight">streak</span>
              </div>
              <div>
                <p className="text-3xl font-extrabold text-orange-300">
                  {streak}{" "}
                  <span className="text-base font-semibold text-orange-400">
                    day{streak !== 1 ? "s" : ""}
                  </span>
                </p>
                <p className="text-sm text-richblack-300">Current Learning Streak</p>
              </div>
            </div>

            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-50">{longest}</p>
                <p className="text-xs text-richblack-400">Longest Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-caribbeangreen-200">
                  {streak > 0 ? "Active" : "—"}
                </p>
                <p className="text-xs text-richblack-400">Status</p>
              </div>
            </div>
          </div>

          {/* Streak progress dots — last 7 days visual */}
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-richblack-400 mr-1">Last 7 days</span>
            {Array.from({ length: 7 }).map((_, i) => {
              const active = i >= 7 - Math.min(streak, 7)
              return (
                <div
                  key={i}
                  className={`h-3 w-3 rounded-full transition-all ${
                    active
                      ? "bg-orange-400 shadow-sm shadow-orange-400/50"
                      : "bg-richblack-700"
                  }`}
                />
              )
            })}
            <span className="ml-2 text-xs text-richblack-400">
              {streak === 0
                ? "Watch a lecture to start your streak!"
                : streak >= 7
                ? "🔥 You're on fire! Keep it up!"
                : "Keep going to extend your streak!"}
            </span>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="flex items-center justify-between rounded-2xl border border-white/10 glass-card p-8 animate-revealUp shadow-xl">
        <div className="flex items-center gap-5">
          <div className="relative">
            <img
              src={user?.image}
              alt={`profile-${user?.firstName}`}
              className="h-20 w-20 rounded-full object-cover ring-4 ring-yellow-500 ring-offset-2 ring-offset-richblack-800"
            />
            <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-caribbeangreen-300 ring-2 ring-richblack-800" />
          </div>
          <div>
            <p className="text-xl font-bold text-richblack-5">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="mt-0.5 text-sm text-richblack-400">{user?.email}</p>
            <span className="mt-2 inline-block rounded-full bg-yellow-900 px-3 py-0.5 text-xs font-semibold text-yellow-50 capitalize">
              {user?.accountType}
            </span>
          </div>
        </div>
        <IconBtn
          text="Edit Profile"
          onclick={() => navigate("/dashboard/settings")}
        >
          <RiEditBoxLine />
        </IconBtn>
      </div>

      {/* About Section */}
      <div className="rounded-2xl border border-white/10 glass-card p-8 animate-revealUp shadow-xl" style={{animationDelay: '0.1s'}}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-richblack-5">About</h2>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`text-sm leading-relaxed ${
            user?.additionalDetails?.about
              ? "text-richblack-100"
              : "italic text-richblack-500"
          }`}
        >
          {user?.additionalDetails?.about || "Tell others a little about yourself..."}
        </p>
      </div>

      {/* Personal Details */}
      <div className="rounded-2xl border border-white/10 glass-card p-8 animate-revealUp shadow-xl" style={{animationDelay: '0.2s'}}>
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-bold text-richblack-5">Personal Details</h2>
          <IconBtn
            text="Edit"
            onclick={() => navigate("/dashboard/settings")}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {personalDetails.map(({ label, value, icon }) => (
            <div key={label} className="flex items-start gap-3">
              <div className="mt-0.5 rounded-md bg-richblack-700 p-2 text-richblack-300">
                {icon}
              </div>
              <div>
                <p className="text-xs text-richblack-500">{label}</p>
                <p className="mt-0.5 text-sm font-medium text-richblack-100">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
