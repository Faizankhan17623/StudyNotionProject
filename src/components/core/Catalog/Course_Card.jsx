import React, { useEffect, useState } from "react"
import { FaHeart, FaRegHeart } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"

import GetAvgRating from "../../../utils/avgRating"
import RatingStars from "../../Common/RatingStars"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { addCourseToWishlist, removeCourseFromWishlist } from "../../../slices/wishlistSlice"
import { addToWishlist, removeFromWishlist } from "../../../services/operations/profileAPI"

function Course_Card({ course, Height }) {
  const [avgReviewCount, setAvgReviewCount] = useState(0)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const { wishlist } = useSelector((state) => state.wishlist)

  useEffect(() => {
    const count = GetAvgRating(course.ratingAndReviews)
    setAvgReviewCount(count)
  }, [course])

  const isInWishlist = wishlist.includes(course._id?.toString())
  const isStudent = user?.accountType === ACCOUNT_TYPE.STUDENT

  const handleWishlistToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (!token || !isStudent) return

    if (isInWishlist) {
      dispatch(removeCourseFromWishlist(course._id?.toString()))
      await removeFromWishlist(course._id, token)
    } else {
      dispatch(addCourseToWishlist(course._id?.toString()))
      await addToWishlist(course._id, token)
    }
  }

  return (
    <>
      <Link to={`/courses/${course._id}`}>
        <div className="relative">
          {/* Wishlist heart icon */}
          {token && isStudent && (
            <button
              onClick={handleWishlistToggle}
              className="absolute right-2 top-2 z-10 rounded-full bg-richblack-900 bg-opacity-60 p-1.5 transition-colors hover:bg-opacity-80"
              title={isInWishlist ? "Remove from wishlist" : "Save to wishlist"}
            >
              {isInWishlist ? (
                <FaHeart className="text-lg text-red-500" />
              ) : (
                <FaRegHeart className="text-lg text-richblack-100" />
              )}
            </button>
          )}
          <div className="rounded-lg">
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-full rounded-xl object-cover `}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>
            <p className="text-sm text-richblack-50">
              {course?.instructor?.firstName} {course?.instructor?.lastName}
            </p>
            <div className="flex items-center gap-2">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">
              {course?.price === 0 ? (
                <span className="text-caribbeangreen-100 font-semibold">Free</span>
              ) : (
                `Rs. ${course?.price}`
              )}
            </p>
          </div>
        </div>
      </Link>
    </>
  )
}

export default Course_Card
