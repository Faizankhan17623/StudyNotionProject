import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { FiX, FiTag, FiTrash2, FiCopy } from "react-icons/fi"
import { VscLoading } from "react-icons/vsc"
import { toast } from "react-hot-toast"

import {
  createCoupon,
  getCourseCoupons,
  deleteCouponAPI,
  toggleCouponAPI,
} from "../../../../services/operations/courseAPI"

const DISCOUNT_OPTIONS = [5, 20, 50, 80, 100]

export default function CouponModal({ courseId, courseName, onClose }) {
  const { token } = useSelector((state) => state.auth)

  const [coupons, setCoupons]         = useState([])
  const [loading, setLoading]         = useState(false)
  const [discountPercent, setDiscountPercent] = useState(20)
  const [customCode, setCustomCode]   = useState("")
  const [creating, setCreating]       = useState(false)
  const [deletingId, setDeletingId]   = useState(null)
  const [togglingId, setTogglingId]   = useState(null)

  const MAX_COUPONS = 2

  useEffect(() => {
    fetchCoupons()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchCoupons = async () => {
    setLoading(true)
    const data = await getCourseCoupons(courseId, token)
    setCoupons(data)
    setLoading(false)
  }

  const handleCreate = async (e) => {
    e.preventDefault()
    if (creating) return
    setCreating(true)
    const newCoupon = await createCoupon(
      { courseId, discountPercent, customCode: customCode.trim() || undefined },
      token
    )
    if (newCoupon) {
      // Refresh list
      const updated = await getCourseCoupons(courseId, token)
      setCoupons(updated)
      setCustomCode("")
    }
    setCreating(false)
  }

  const handleDelete = async (couponId) => {
    if (deletingId) return
    setDeletingId(couponId)
    const ok = await deleteCouponAPI(couponId, token)
    if (ok) setCoupons((prev) => prev.filter((c) => c._id !== couponId))
    setDeletingId(null)
  }

  const handleToggle = async (couponId) => {
    if (togglingId) return
    setTogglingId(couponId)
    const result = await toggleCouponAPI(couponId, token)
    if (result) {
      setCoupons((prev) =>
        prev.map((c) => (c._id === couponId ? { ...c, isActive: result.isActive } : c))
      )
    }
    setTogglingId(null)
  }

  const copyCode = (code) => {
    navigator.clipboard.writeText(code)
    toast.success("Code copied!")
  }

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 px-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-2xl border border-richblack-700
                   bg-richblack-800 p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-richblack-5">Manage Coupons</h2>
            <p className="mt-0.5 text-xs text-richblack-400 line-clamp-1">{courseName}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-richblack-400 transition-colors hover:bg-richblack-700 hover:text-richblack-100"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Existing coupons */}
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-6 text-richblack-400">
            <VscLoading className="animate-spin text-xl" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : coupons.length === 0 ? (
          <div className="mb-5 rounded-xl border border-richblack-700 py-6 text-center">
            <FiTag className="mx-auto mb-2 text-2xl text-richblack-500" />
            <p className="text-sm text-richblack-400">No coupons yet</p>
          </div>
        ) : (
          <div className="mb-5 flex flex-col gap-3">
            {coupons.map((coupon) => (
              <div
                key={coupon._id}
                className={`rounded-xl border p-3 transition-colors ${
                  coupon.isActive
                    ? "border-richblack-600 bg-richblack-700"
                    : "border-richblack-700 bg-richblack-800 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  {/* Code + copy */}
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-bold text-yellow-50">
                      {coupon.code}
                    </span>
                    <button
                      onClick={() => copyCode(coupon.code)}
                      className="text-richblack-400 hover:text-yellow-50"
                      title="Copy code"
                    >
                      <FiCopy className="text-sm" />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    {/* Toggle active */}
                    <button
                      onClick={() => handleToggle(coupon._id)}
                      disabled={!!togglingId}
                      className={`rounded-full px-2.5 py-1 text-[11px] font-bold transition-colors ${
                        coupon.isActive
                          ? "bg-caribbeangreen-200/20 text-caribbeangreen-100 hover:bg-caribbeangreen-200/30"
                          : "bg-richblack-600 text-richblack-300 hover:bg-richblack-500"
                      }`}
                    >
                      {togglingId === coupon._id
                        ? <VscLoading className="animate-spin" />
                        : coupon.isActive ? "Active" : "Inactive"
                      }
                    </button>

                    {/* Delete — disabled if already used */}
                    <button
                      onClick={() => handleDelete(coupon._id)}
                      disabled={!!deletingId || coupon.usedCount > 0}
                      title={coupon.usedCount > 0 ? `Used by ${coupon.usedCount} student(s) — cannot delete` : "Delete coupon"}
                      className="rounded-lg p-1.5 text-richblack-400 transition-colors
                                 hover:bg-richblack-600 hover:text-red-400
                                 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {deletingId === coupon._id
                        ? <VscLoading className="animate-spin text-sm" />
                        : <FiTrash2 className="text-sm" />
                      }
                    </button>
                  </div>
                </div>

                {/* Discount + usage */}
                <div className="mt-1.5 flex items-center gap-3 text-xs text-richblack-400">
                  <span className="font-semibold text-yellow-100">{coupon.discountPercent}% off</span>
                  <span>·</span>
                  <span>Used by {coupon.usedCount} student{coupon.usedCount !== 1 ? "s" : ""}</span>
                  {coupon.usedCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-pink-300">Cannot delete</span>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create form — hidden when limit reached */}
        {coupons.length >= MAX_COUPONS ? (
          <p className="text-center text-xs text-richblack-400">
            Maximum {MAX_COUPONS} coupons per course reached.
          </p>
        ) : (
          <form onSubmit={handleCreate} className="flex flex-col gap-3 rounded-xl border border-yellow-50/20 bg-richblack-900 p-4">
            <h3 className="text-sm font-semibold text-richblack-5">
              Create new coupon ({coupons.length}/{MAX_COUPONS})
            </h3>

            {/* Discount selector */}
            <div>
              <p className="mb-1.5 text-xs text-richblack-400">Discount percentage</p>
              <div className="flex gap-2 flex-wrap">
                {DISCOUNT_OPTIONS.map((pct) => (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setDiscountPercent(pct)}
                    className={`rounded-full px-3 py-1 text-xs font-bold transition-colors ${
                      discountPercent === pct
                        ? "bg-yellow-50 text-richblack-900"
                        : "border border-richblack-600 text-richblack-300 hover:border-yellow-50 hover:text-yellow-50"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            {/* Optional custom code */}
            <div>
              <p className="mb-1.5 text-xs text-richblack-400">
                Custom code <span className="text-richblack-500">(optional — auto-generated if blank)</span>
              </p>
              <input
                type="text"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value.toUpperCase())}
                placeholder="e.g. SUMMER50"
                maxLength={20}
                className="w-full rounded-lg border border-richblack-600 bg-richblack-800
                           px-3 py-2 font-mono text-sm uppercase text-richblack-5
                           placeholder-richblack-500 outline-none transition-colors
                           focus:border-yellow-50"
              />
            </div>

            <button
              type="submit"
              disabled={creating}
              className="flex items-center justify-center gap-2 rounded-lg bg-yellow-50
                         py-2.5 text-sm font-bold text-richblack-900 transition-opacity
                         hover:opacity-90 disabled:opacity-50"
            >
              {creating && <VscLoading className="animate-spin" />}
              Create Coupon
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
