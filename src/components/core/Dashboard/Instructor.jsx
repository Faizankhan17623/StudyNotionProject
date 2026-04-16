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
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="flex items-center gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-5"
              >
                <div className={`rounded-lg p-3 ${stat.bg}`}>
                  {stat.icon}
                </div>
                <div>
                  <p className="text-sm text-richblack-400">{stat.label}</p>
                  <p className="text-2xl font-bold text-richblack-5">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="flex gap-4">
            {totalAmount > 0 || totalStudents > 0 ? (
              <InstructorChart courses={instructorData} />
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-richblack-700 bg-richblack-800 py-16">
                <p className="text-lg font-bold text-richblack-5">No Data Yet</p>
                <p className="mt-2 text-sm text-richblack-400">
                  Enroll students to see analytics
                </p>
              </div>
            )}
          </div>

          {/* Courses Preview */}
          <div className="rounded-xl border border-richblack-700 bg-richblack-800 p-6">
            <div className="mb-5 flex items-center justify-between">
              <p className="text-lg font-bold text-richblack-5">Your Courses</p>
              <Link
                to="/dashboard/my-courses"
                className="text-xs font-semibold text-yellow-50 hover:text-yellow-25 transition-colors"
              >
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {courses.slice(0, 3).map((course) => (
                <Link
                  to={`/dashboard/edit-course/${course._id}`}
                  key={course._id}
                  className="group rounded-lg border border-richblack-700 overflow-hidden hover:border-yellow-500 transition-all duration-200"
                >
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-36 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="p-3">
                    <p className="text-sm font-semibold text-richblack-50 line-clamp-1">
                      {course.courseName}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-richblack-400">
                        {course.studentsEnroled.length} students
                      </p>
                      <p className="text-xs font-semibold text-yellow-50">
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
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-richblack-600 bg-richblack-800 py-24">
          <HiOutlineAcademicCap className="text-5xl text-richblack-500" />
          <p className="mt-4 text-xl font-bold text-richblack-5">
            No courses yet
          </p>
          <p className="mt-2 text-sm text-richblack-400">
            Create your first course to get started
          </p>
          <Link
            to="/dashboard/add-course"
            className="mt-6 flex items-center gap-2 rounded-lg bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-25 transition-all"
          >
            <HiOutlinePlusCircle className="text-lg" />
            Create a Course
          </Link>
        </div>
      )}
    </div>
  )
}
