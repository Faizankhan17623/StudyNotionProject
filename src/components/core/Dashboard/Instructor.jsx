import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { HiOutlineAcademicCap, HiOutlineUsers, HiOutlineCurrencyRupee, HiOutlinePlusCircle } from "react-icons/hi"

import { fetchInstructorCourses } from "../../../services/operations/courseAPI"
import { getInstructorData } from "../../../services/operations/profileAPI"
import InstructorChart from "./InstructorDashboard/InstructorChart"

export default function Instructor() {
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [loading, setLoading] = useState(false)
  const [instructorData, setInstructorData] = useState(null)
  const [courses, setCourses] = useState([])
  const [totalCoursesCount, setTotalCoursesCount] = useState(0)

  useEffect(() => {
    ;(async () => {
      setLoading(true)
      const instructorApiData = await getInstructorData(token)
      const result = await fetchInstructorCourses(token, 1, 3)
      if (instructorApiData.length) setInstructorData(instructorApiData)
      if (result) {
        setCourses(result.data)
        setTotalCoursesCount(result.pagination?.totalCourses || 0)
      }
      setLoading(false)
    })()
  }, [])

  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr.totalAmountGenerated,
    0
  )

  const totalStudents = instructorData?.reduce(
    (acc, curr) => acc + curr.totalStudentsEnrolled,
    0
  )

  const stats = [
    {
      label: "Total Courses",
      value: totalCoursesCount,
      icon: <HiOutlineAcademicCap className="text-2xl text-yellow-50" />,
      bg: "bg-yellow-900",
    },
    {
      label: "Total Students",
      value: totalStudents ?? 0,
      icon: <HiOutlineUsers className="text-2xl text-caribbeangreen-200" />,
      bg: "bg-caribbeangreen-900",
    },
    {
      label: "Total Income",
      value: `₹${totalAmount ?? 0}`,
      icon: <HiOutlineCurrencyRupee className="text-2xl text-blue-200" />,
      bg: "bg-blue-900",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-richblack-5">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="mt-1 text-sm text-richblack-300">
            Here's what's happening with your courses
          </p>
        </div>
        <Link
          to="/dashboard/add-course"
          className="flex items-center gap-2 rounded-lg bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25 transition-all duration-200"
        >
          <HiOutlinePlusCircle className="text-lg" />
          New Course
        </Link>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <div className="spinner"></div>
        </div>
      ) : courses.length > 0 ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-2xl border border-white/10 glass-card p-6 shadow-xl animate-revealUp transition-all hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className={`rounded-xl p-4 shadow-inner ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-richblack-300">{stat.label}</p>
                  <p className="text-3xl font-bold font-outfit text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex gap-4">
            {totalAmount > 0 || totalStudents > 0 ? (
              <div className="glass-card border border-white/10 rounded-2xl p-4 flex-1">
                <InstructorChart courses={instructorData} />
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 glass-card py-20">
                <p className="text-2xl font-bold font-outfit text-white">No Data Yet</p>
                <p className="mt-2 text-sm text-richblack-400">
                  Enroll students to see analytics
                </p>
              </div>
            )}
          </div>

          {/* Courses Preview */}
          <div className="rounded-2xl border border-white/10 glass-card p-8 animate-revealUp shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-2xl font-bold font-outfit text-white">Your Courses</p>
              <Link
                to="/dashboard/my-courses"
                className="text-sm font-semibold text-yellow-50 hover:text-yellow-25 transition-colors underline underline-offset-4"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-6">
              {courses.slice(0, 3).map((course) => (
                <Link
                  to={`/dashboard/edit-course/${course._id}`}
                  key={course._id}
                  className="group rounded-2xl border border-white/5 bg-[#050505] overflow-hidden hover:border-yellow-500/50 hover:shadow-[0_0_20px_rgba(255,214,10,0.15)] transition-all duration-300"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-40 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="p-4 border-t border-white/5">
                    <p className="text-base font-semibold text-richblack-50 line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-xs font-medium text-richblack-400">
                        {course.studentsEnroled.length} students
                      </p>
                      <p className="text-sm font-bold text-yellow-50">
                        ₹{course.price}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/20 glass-card py-24 shadow-xl">
          <HiOutlineAcademicCap className="text-6xl text-richblack-500 mb-4" />
          <p className="mt-4 text-2xl font-bold font-outfit text-white">
            No courses yet
          </p>
          <p className="mt-2 text-sm text-richblack-400">
            Create your first course to get started
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-6 flex items-center gap-2 rounded-full bg-yellow-50 px-6 py-3 text-sm font-bold text-richblack-900 hover:bg-yellow-25 hover:shadow-[0_0_15px_rgba(255,214,10,0.5)] transition-all"
          >
            <HiOutlinePlusCircle className="text-lg" />
            Create a Course
          </Link>
        </div>
      )}
    </div>
  )
}
