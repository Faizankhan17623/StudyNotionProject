import { useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Link } from "react-router-dom"
import { FaHeart, FaTrash } from "react-icons/fa"
import { AiOutlineHeart } from "react-icons/ai"

import { getWishlist, removeFromWishlist } from "../services/operations/profileAPI"
import { removeCourseFromWishlist } from "../slices/wishlistSlice"
import GetAvgRating from "../utils/avgRating"
import RatingStars from "../components/Common/RatingStars"

function Wishlist() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWishlist = async () => {
      setLoading(true)
      const data = await getWishlist(token)
      setCourses(data || [])
      setLoading(false)
    }
    fetchWishlist()
  }, [token])

  const handleRemove = async (courseId) => {
    dispatch(removeCourseFromWishlist(courseId.toString()))
    setCourses((prev) => prev.filter((c) => c._id !== courseId))
    await removeFromWishlist(courseId, token)
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
      <div className="flex items-center gap-3 mb-8">
        <FaHeart className="text-2xl text-red-500" />
        <h1 className="text-3xl font-bold text-richblack-5">My Wishlist</h1>
        <span className="rounded-full bg-richblack-700 px-3 py-1 text-sm text-richblack-200">
          {courses.length} {courses.length === 1 ? "course" : "courses"}
        </span>
      </div>

      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <AiOutlineHeart className="mb-4 text-7xl text-richblack-600" />
          <h3 className="mb-2 text-xl font-semibold text-richblack-100">
            Your wishlist is empty
          </h3>
          <p className="mb-6 text-richblack-400">
            Browse courses and click the heart icon to save them here.
          </p>
          <Link
            to="/"
            className="rounded-lg bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {courses.map((course) => {
            const avgRating = GetAvgRating(course.ratingAndReviews)
            return (
              <div
                key={course._id}
                className="flex flex-col gap-4 rounded-xl border border-richblack-700 bg-richblack-800 p-4 sm:flex-row sm:items-center sm:gap-6"
              >
                {/* Thumbnail */}
                <Link to={`/courses/${course._id}`} className="flex-shrink-0">
                  <img
                    src={course.thumbnail}
                    alt={course.courseName}
                    className="h-[120px] w-full rounded-lg object-cover sm:w-[200px]"
                  />
                </Link>

                {/* Info */}
                <div className="flex flex-1 flex-col gap-1">
                  <Link to={`/courses/${course._id}`}>
                    <p className="text-lg font-semibold text-richblack-5 hover:text-yellow-50 transition-colors">
                      {course.courseName}
                    </p>
                  </Link>
                  <p className="text-sm text-richblack-300">
                    {course.instructor?.firstName} {course.instructor?.lastName}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-yellow-5">{avgRating || 0}</span>
                    <RatingStars Review_Count={avgRating} Star_Size={16} />
                    <span className="text-xs text-richblack-400">
                      ({course.ratingAndReviews?.length || 0})
                    </span>
                  </div>
                  <p className="text-sm text-richblack-300">
                    {course.studentsEnroled?.length || 0} students enrolled
                  </p>
                </div>

                {/* Price + Remove */}
                <div className="flex flex-row items-center gap-4 sm:flex-col sm:items-end">
                  <p className="text-2xl font-bold text-richblack-5">
                    ₹{course.price}
                  </p>
                  <button
                    onClick={() => handleRemove(course._id)}
                    className="flex items-center gap-1 rounded-lg border border-richblack-600 px-3 py-1.5 text-sm text-richblack-300 hover:border-red-400 hover:text-red-400 transition-colors"
                  >
                    <FaTrash className="text-xs" />
                    Remove
                  </button>
                  <Link
                    to={`/courses/${course._id}`}
                    className="rounded-lg bg-yellow-50 px-4 py-2 text-sm font-semibold text-richblack-900 hover:bg-yellow-25 transition-colors"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default Wishlist
