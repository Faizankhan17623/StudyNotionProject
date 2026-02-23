import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import { FiUsers, FiStar, FiBook, FiMessageSquare } from "react-icons/fi"
import RatingStars from "../components/Common/RatingStars"
import { apiConnector } from "../services/apiConnector"
import { profileEndpoints } from "../services/apis"
import Footer from "../components/Common/Footer"

function InstructorProfile() {
  const { instructorId } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await apiConnector(
          "GET",
          `${profileEndpoints.GET_INSTRUCTOR_PROFILE_API}/${instructorId}`
        )
        if (res?.data?.success) setData(res.data.data)
      } catch {
        // fall through to loading = false
      }
      setLoading(false)
    }
    fetch()
  }, [instructorId])

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center bg-richblack-900">
        <div className="spinner" />
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center gap-4 bg-richblack-900 text-center">
        <div className="text-5xl">😕</div>
        <h2 className="text-2xl font-bold text-richblack-5">Instructor not found</h2>
        <button
          onClick={() => navigate("/")}
          className="mt-2 rounded-lg bg-yellow-50 px-6 py-2.5 text-sm font-bold text-richblack-900"
        >
          Go Home
        </button>
      </div>
    )
  }

  const { instructor, courses, stats } = data
  const bio = instructor.additionalDetails?.about || ""

  return (
    <div className="min-h-screen bg-richblack-900">
      {/* Hero banner */}
      <div className="bg-richblack-800 border-b border-richblack-700">
        <div className="mx-auto max-w-maxContent px-4 py-12">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            {/* Avatar */}
            <img
              src={
                instructor.image ||
                `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName}`
              }
              alt={instructor.firstName}
              className="h-28 w-28 rounded-full object-cover border-4 border-yellow-50 flex-shrink-0"
            />

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-richblack-5">
                {instructor.firstName} {instructor.lastName}
              </h1>
              <p className="mt-1 text-richblack-300">Instructor at StudyNotion</p>
              {bio && (
                <p className="mt-3 max-w-2xl text-sm text-richblack-200 leading-relaxed">
                  {bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { icon: <FiBook />, label: "Courses", value: stats.totalCourses },
              { icon: <FiUsers />, label: "Students", value: stats.totalStudents.toLocaleString() },
              { icon: <FiStar />, label: "Avg Rating", value: stats.avgRating },
              { icon: <FiMessageSquare />, label: "Reviews", value: stats.totalReviews.toLocaleString() },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                className="flex flex-col items-center rounded-xl border border-richblack-700 bg-richblack-900 px-4 py-5"
              >
                <div className="mb-2 text-xl text-yellow-50">{icon}</div>
                <div className="text-2xl font-bold text-richblack-5">{value}</div>
                <div className="text-xs text-richblack-400">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Courses section */}
      <div className="mx-auto max-w-maxContent px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold text-richblack-5">
          Published Courses ({courses.length})
        </h2>

        {courses.length === 0 ? (
          <div className="rounded-xl border border-richblack-700 bg-richblack-800 py-16 text-center text-richblack-400">
            No published courses yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const avgRating =
                course.ratingAndReviews.length > 0
                  ? (
                      course.ratingAndReviews.reduce((s, r) => s + r.rating, 0) /
                      course.ratingAndReviews.length
                    ).toFixed(1)
                  : "0.0"

              return (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="group flex flex-col rounded-xl border border-richblack-700 bg-richblack-800 overflow-hidden hover:border-yellow-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={course.thumbnail || "/placeholder.png"}
                      alt={course.courseName}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="mb-1 font-semibold text-richblack-5 line-clamp-2 leading-snug">
                      {course.courseName}
                    </h3>

                    {/* Rating */}
                    <div className="mt-auto flex items-center gap-2 pt-3">
                      <span className="text-sm font-semibold text-yellow-50">{avgRating}</span>
                      <RatingStars Review_Count={parseFloat(avgRating)} Star_Size={14} />
                      <span className="text-xs text-richblack-400">
                        ({course.ratingAndReviews.length})
                      </span>
                    </div>

                    {/* Footer */}
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-richblack-400">
                        {course.studentsEnroled.length} student
                        {course.studentsEnroled.length !== 1 ? "s" : ""}
                      </span>
                      <span className="text-sm font-bold text-yellow-50">
                        {course.price === 0 ? "Free" : `₹${course.price}`}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}

export default InstructorProfile
