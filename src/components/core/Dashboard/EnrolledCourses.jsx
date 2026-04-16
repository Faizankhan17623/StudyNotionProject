import { useEffect, useState } from "react"
import ProgressBar from "@ramonak/react-progress-bar"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { HiOutlineBookOpen, HiOutlineAcademicCap } from "react-icons/hi"
import { Link } from "react-router-dom"

import { getUserEnrolledCourses } from "../../../services/operations/profileAPI"

export default function EnrolledCourses() {
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const [enrolledCourses, setEnrolledCourses] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await getUserEnrolledCourses(token)
        const filterPublishCourse = res.filter((ele) => ele.status !== "Draft")
        setEnrolledCourses(filterPublishCourse)
      } catch (error) {
        console.log("Could not fetch enrolled courses.")
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-richblack-5">Enrolled Courses</h1>

      {!enrolledCourses ? (
        <div className="grid min-h-[50vh] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-richblack-600 bg-richblack-800 py-24">
          <HiOutlineBookOpen className="text-5xl text-richblack-500" />
          <p className="mt-4 text-xl font-bold text-richblack-5">
            No courses yet
          </p>
          <p className="mt-2 text-sm text-richblack-400">
            Browse our catalog and enroll in a course to get started
          </p>
          <Link
            to="/catalog"
            className="mt-6 rounded-lg bg-yellow-50 px-5 py-2.5 text-sm font-semibold text-richblack-900 hover:bg-yellow-25 transition-all"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-richblack-700">
          {/* Table Header */}
          <div className="grid grid-cols-12 bg-richblack-700 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-richblack-300">
            <p className="col-span-6">Course</p>
            <p className="col-span-2 text-center">Duration</p>
            <p className="col-span-4">Progress</p>
          </div>

          {/* Rows */}
          {enrolledCourses.map((course, i, arr) => (
            <div
              key={i}
              className={`grid grid-cols-12 items-center gap-2 px-6 py-4 bg-richblack-800 hover:bg-richblack-750 transition-colors ${
                i !== arr.length - 1 ? "border-b border-richblack-700" : ""
              }`}
            >
              {/* Course Info */}
              <div
                className="col-span-6 flex cursor-pointer items-center gap-4"
                onClick={() =>
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  )
                }
              >
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-16 w-24 rounded-lg object-cover shrink-0"
                />
                <div>
                  <p className="font-semibold text-richblack-5 hover:text-yellow-50 transition-colors">
                    {course.courseName}
                  </p>
                  <p className="mt-1 text-xs text-richblack-400 line-clamp-2">
                    {course.courseDescription}
                  </p>
                </div>
              </div>

              {/* Duration */}
              <div className="col-span-2 text-center text-sm text-richblack-300">
                {course?.totalDuration || "—"}
              </div>

              {/* Progress */}
              <div className="col-span-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-richblack-400">Progress</span>
                  <span className="text-xs font-semibold text-richblack-100">
                    {course.progressPercentage || 0}%
                  </span>
                </div>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="6px"
                  isLabelVisible={false}
                  bgColor="#FFD60A"
                  baseBgColor="#2C333F"
                />
                {course.progressPercentage === 100 && (
                  <button
                    onClick={() => navigate(`/certificate/${course._id}`)}
                    className="mt-1 flex items-center gap-1 rounded-md bg-caribbeangreen-600 px-3 py-1 text-xs font-bold text-white hover:bg-caribbeangreen-500 transition-colors"
                  >
                    <HiOutlineAcademicCap />
                    Get Certificate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
