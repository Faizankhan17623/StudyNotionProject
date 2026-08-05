import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { RiVipCrownFill } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"

import { addToCart } from "../../../slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"
import { isPro } from "../../../utils/planUtils"

// const CourseIncludes = [
//   "8 hours on-demand video",
//   "Full Lifetime access",
//   "Access on Mobile and TV",
//   "Certificate of completion",
// ]

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }
    if (
      user?.accountType === ACCOUNT_TYPE.STUDENT &&
      !isPro(user.subscriptionPlan) &&
      !course?.studentsEnroled.includes(user?._id) &&
      (user.courses?.length || 0) >= 1
    ) {
      toast.error("Free plan is limited to 1 active course. Upgrade to Pro for unlimited courses.")
      return
    }
    if (token) {
      dispatch(addToCart(course))
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  // console.log("Student already enrolled ", course?.studentsEnroled, user?._id)

  const alreadyEnrolledHere = user && course?.studentsEnroled.includes(user?._id)
  const atFreePlanLimit =
    user &&
    user.accountType === ACCOUNT_TYPE.STUDENT &&
    !isPro(user.subscriptionPlan) &&
    !alreadyEnrolledHere &&
    (user.courses?.length || 0) >= 1

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={ThumbnailImage}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            {CurrentPrice === 0 ? (
              <span className="text-caribbeangreen-100">Free</span>
            ) : (
              `Rs. ${CurrentPrice}`
            )}
          </div>
          {atFreePlanLimit && (
            <div className="mb-4 flex items-start gap-2 rounded-md border border-yellow-500/30 bg-yellow-900/20 p-3 text-sm text-yellow-50">
              <RiVipCrownFill className="mt-0.5 flex-shrink-0" />
              <span>
                Free plan is limited to 1 active course.{" "}
                <Link to="/pricing" className="font-semibold underline hover:text-yellow-25">
                  Upgrade to Pro
                </Link>{" "}
                for unlimited courses.
              </span>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                alreadyEnrolledHere
                  ? () => navigate("/dashboard/enrolled-courses")
                  : atFreePlanLimit
                  ? () => navigate("/pricing")
                  : handleBuyCourse
              }
            >
              {alreadyEnrolledHere
                ? "Go To Course"
                : atFreePlanLimit
                ? "Upgrade to Enroll"
                : CurrentPrice === 0
                ? "Enroll for Free"
                : "Buy Now"}
            </button>
            {!alreadyEnrolledHere && CurrentPrice !== 0 && !atFreePlanLimit && (
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
              </button>
            )}
          </div>
          <div>
            {CurrentPrice === 0 ? (
              <p className="pb-3 pt-6 text-center text-sm text-caribbeangreen-200">
                Free — Enroll instantly, no payment needed
              </p>
            ) : (
              <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
                30-Day Money-Back Guarantee
              </p>
            )}
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, i) => {
                return (
                  <p className={`flex gap-2`} key={i}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                )
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default CourseDetailsCard
