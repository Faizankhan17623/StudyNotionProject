import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FaTrash, FaStar } from "react-icons/fa"
import { MdReviews } from "react-icons/md"
import { apiConnector } from "../../../../services/apiConnector"
import { courseEndpoints, ratingsEndpoints } from "../../../../services/apis"
import { toast } from "react-hot-toast"

function ReviewModeration() {
  const { token } = useSelector((state) => state.auth)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    fetchAllReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchAllReviews = async () => {
    setLoading(true)
    try {
      const response = await apiConnector("GET", ratingsEndpoints.REVIEWS_DETAILS_API)
      if (response?.data?.success) {
        setReviews(response.data.data)
      }
    } catch (error) {
      toast.error("Could not fetch reviews")
    }
    setLoading(false)
  }

  const handleDeleteReview = async (reviewId) => {
    setDeletingId(reviewId)
    try {
      const response = await apiConnector(
        "DELETE",
        courseEndpoints.DELETE_REVIEW_API,
        { reviewId },
        { Authorization: `Bearer ${token}` }
      )
      if (response?.data?.success) {
        toast.success("Review deleted")
        setReviews((prev) => prev.filter((r) => r._id !== reviewId))
      } else {
        toast.error("Could not delete review")
      }
    } catch (error) {
      toast.error("Could not delete review")
    }
    setDeletingId(null)
  }

  const renderStars = (rating) =>
    Array.from({ length: 5 }, (_, i) => (
      <FaStar
        key={i}
        className={`text-sm ${i < rating ? "text-yellow-50" : "text-richblack-600"}`}
      />
    ))

  if (loading) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] py-10">
      <div className="mb-8 flex items-center gap-3">
        <MdReviews className="text-3xl text-yellow-50" />
        <div>
          <h1 className="text-3xl font-bold text-richblack-5">Review Moderation</h1>
          <p className="text-sm text-richblack-400">
            {reviews.length} total reviews — delete spam or inappropriate reviews
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-richblack-400">
          <MdReviews className="mb-4 text-6xl" />
          <p className="text-lg">No reviews yet</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="flex flex-col gap-3 rounded-xl border border-richblack-700 bg-richblack-800 p-5 sm:flex-row sm:items-start sm:justify-between"
            >
              {/* Left: user + review */}
              <div className="flex flex-1 gap-4">
                <img
                  src={
                    review.user?.image ||
                    `https://api.dicebear.com/5.x/initials/svg?seed=${review.user?.firstName}`
                  }
                  alt={review.user?.firstName}
                  className="h-10 w-10 flex-shrink-0 rounded-full object-cover"
                />
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-richblack-5">
                      {review.user?.firstName} {review.user?.lastName}
                    </span>
                    <span className="text-xs text-richblack-400">
                      {review.user?.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    {renderStars(review.rating)}
                    <span className="ml-1 text-sm text-richblack-300">
                      {review.rating}/5
                    </span>
                  </div>
                  <p className="text-sm text-richblack-100">{review.review}</p>
                  <p className="text-xs text-richblack-400">
                    Course:{" "}
                    <span className="text-yellow-50">
                      {review.course?.courseName || "Unknown"}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right: delete button */}
              <button
                onClick={() => handleDeleteReview(review._id)}
                disabled={deletingId === review._id}
                className="flex items-center gap-2 self-start rounded-lg border border-richblack-600 px-3 py-2 text-sm text-richblack-300 transition-colors hover:border-red-400 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <FaTrash className="text-xs" />
                {deletingId === review._id ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewModeration
