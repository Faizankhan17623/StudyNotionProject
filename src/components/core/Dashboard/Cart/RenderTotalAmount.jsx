import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { VscLoading } from "react-icons/vsc"
import { FiTag, FiX, FiCheck } from "react-icons/fi"

import { BuyCourse, EnrollFreeCourse } from "../../../../services/operations/paymentsAPI"
import { applyCouponAPI } from "../../../../services/operations/courseAPI"
import IconBtn from "../../../Common/IconBtn"

export default function RenderTotalAmount() {
  const { total, cart }     = useSelector((state) => state.cart)
  const { token }           = useSelector((state) => state.auth)
  const { user }            = useSelector((state) => state.profile)
  const navigate            = useNavigate()
  const dispatch            = useDispatch()

  const [couponInput, setCouponInput]   = useState("")
  const [applying, setApplying]         = useState(false)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  // appliedCoupon shape: { code, discountPercent, courseId, courseName, originalPrice, discountAmount, discountedPrice }

  const finalTotal = appliedCoupon
    ? total - appliedCoupon.discountAmount
    : total

  const handleApplyCoupon = async () => {
    if (!couponInput.trim() || applying) return
    setApplying(true)
    const result = await applyCouponAPI(
      couponInput.trim(),
      cart.map((c) => c._id),
      token
    )
    if (result) {
      setAppliedCoupon(result)
      setCouponInput("")
    }
    setApplying(false)
  }

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null)
    setCouponInput("")
  }

  const isFreeCart = total === 0

  const handleBuyCourse = () => {
    const courses = cart.map((course) => course._id)
    if (isFreeCart) {
      EnrollFreeCourse(token, courses, navigate, dispatch)
    } else {
      BuyCourse(token, courses, user, navigate, dispatch, appliedCoupon?.code ?? null)
    }
  }

  return (
    <div className="min-w-[280px] rounded-xl border border-richblack-700 bg-richblack-800 p-6">

      {/* ── Price breakdown ─────────────────────────────────── */}
      <div className="mb-5 flex flex-col gap-2">
        {/* Original total */}
        <div className="flex items-center justify-between text-sm text-richblack-300">
          <span>Price ({cart.length} {cart.length === 1 ? "course" : "courses"})</span>
          <span>{isFreeCart ? "Free" : `₹ ${total}`}</span>
        </div>

        {/* Discount row — only shown when coupon is applied */}
        {appliedCoupon && (
          <div className="flex items-center justify-between text-sm text-caribbeangreen-100">
            <span className="flex items-center gap-1">
              <FiTag className="text-xs" />
              {appliedCoupon.discountPercent}% off "{appliedCoupon.courseName}"
            </span>
            <span>− ₹ {appliedCoupon.discountAmount}</span>
          </div>
        )}

        {/* Divider */}
        <div className="my-1 border-t border-richblack-600" />

        {/* Final total */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-richblack-100">Total</span>
          {isFreeCart ? (
            <span className="text-2xl font-bold text-caribbeangreen-100">Free</span>
          ) : (
            <span className="text-2xl font-bold text-yellow-50">₹ {finalTotal}</span>
          )}
        </div>
      </div>

      {/* ── Coupon section — hidden for free carts ───────────── */}
      {!isFreeCart && (
        appliedCoupon ? (
          // Applied state — show code + remove button
          <div className="mb-5 flex items-center justify-between rounded-lg border border-caribbeangreen-200/40
                          bg-caribbeangreen-200/10 px-3 py-2.5">
            <div className="flex items-center gap-2 text-sm font-semibold text-caribbeangreen-100">
              <FiCheck className="text-base" />
              <span>{appliedCoupon.code}</span>
              <span className="text-xs font-normal text-caribbeangreen-200">applied</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-richblack-400 transition-colors hover:text-red-400"
              title="Remove coupon"
            >
              <FiX className="text-base" />
            </button>
          </div>
        ) : (
          // Input state
          <div className="mb-5">
            <p className="mb-2 text-xs font-medium text-richblack-300">Have a coupon?</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                placeholder="Enter code"
                className="flex-1 rounded-lg border border-richblack-600 bg-richblack-900
                           px-3 py-2 text-sm uppercase text-richblack-5
                           placeholder-richblack-500 outline-none transition-colors
                           focus:border-yellow-50"
                onKeyDown={(e) => { if (e.key === "Enter") handleApplyCoupon() }}
              />
              <button
                onClick={handleApplyCoupon}
                disabled={!couponInput.trim() || applying}
                className="flex items-center gap-1.5 rounded-lg border border-yellow-50
                           px-4 py-2 text-xs font-semibold text-yellow-50 transition-colors
                           hover:bg-yellow-50 hover:text-richblack-900 disabled:opacity-50"
              >
                {applying
                  ? <VscLoading className="animate-spin" />
                  : "Apply"
                }
              </button>
            </div>
          </div>
        )
      )}

      {/* ── Enroll / Buy button ──────────────────────────────── */}
      <IconBtn
        text={isFreeCart ? "Enroll for Free" : "Buy Now"}
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />
    </div>
  )
}
