import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { FaCheck, FaMinus } from "react-icons/fa"
import { toast } from "react-hot-toast"

import Footer from "../components/Common/Footer"
import ConfirmationModal from "../components/Common/ConfirmationModal"
import { updateSubscriptionPlan } from "../services/operations/profileAPI"
import { PLAN, PLAN_LABEL } from "../utils/planUtils"

const plans = [
  {
    id: PLAN.FREE,
    name: "Free",
    price: 0,
    tagline: "For getting started",
    highlight: false,
    features: [
      { label: "Access to free courses", included: true },
      { label: "Community forum access", included: true },
      { label: "Course completion certificates", included: true },
      { label: "1 active enrolled course at a time", included: true },
      { label: "Downloadable resources", included: false },
      { label: "Priority support", included: false },
      { label: "Ad-free experience", included: false },
      { label: "1-on-1 mentorship sessions", included: false },
    ],
  },
  {
    id: PLAN.PRO,
    name: "Pro",
    price: 499,
    tagline: "For serious learners",
    highlight: true,
    features: [
      { label: "Access to free courses", included: true },
      { label: "Community forum access", included: true },
      { label: "Course completion certificates", included: true },
      { label: "Unlimited enrolled courses", included: true },
      { label: "Downloadable resources", included: true },
      { label: "Priority support", included: true },
      { label: "Ad-free experience", included: true },
      { label: "1-on-1 mentorship sessions", included: false },
    ],
  },
  {
    id: PLAN.PRO_MAX,
    name: "Pro Max",
    price: 999,
    tagline: "For career changers",
    highlight: false,
    features: [
      { label: "Access to free courses", included: true },
      { label: "Community forum access", included: true },
      { label: "Course completion certificates", included: true },
      { label: "Unlimited enrolled courses", included: true },
      { label: "Downloadable resources", included: true },
      { label: "Priority support", included: true },
      { label: "Ad-free experience", included: true },
      { label: "1-on-1 mentorship sessions", included: true },
    ],
  },
]

const Pricing = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { user } = useSelector((state) => state.profile)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [updating, setUpdating] = useState(false)

  const currentPlan = user?.subscriptionPlan || PLAN.FREE

  const handleChoosePlan = (planId) => {
    if (!token) {
      navigate("/login")
      return
    }
    if (planId === currentPlan) {
      toast.success(`You're already on the ${PLAN_LABEL[planId]} plan`)
      return
    }

    setConfirmationModal({
      text1: `Switch to ${PLAN_LABEL[planId]}?`,
      text2:
        planId === PLAN.FREE
          ? "You'll lose access to Pro features immediately."
          : `You'll get instant access to all ${PLAN_LABEL[planId]} features.`,
      btn1Text: updating ? "Updating..." : "Confirm",
      btn2Text: "Cancel",
      btn1Handler: async () => {
        setUpdating(true)
        await dispatch(updateSubscriptionPlan(token, planId))
        setUpdating(false)
        setConfirmationModal(null)
      },
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div>
      <section className="relative overflow-hidden py-24">
        <div className="ambient-orb ambient-orb-1 top-0 left-[10%] w-[500px] h-[500px]"></div>
        <div className="ambient-orb ambient-orb-2 top-[20%] right-[5%] w-[400px] h-[400px]"></div>

        <div className="relative z-10 mx-auto w-11/12 max-w-maxContent">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-richblack-5 font-outfit">
              Simple, <span className="text-gradient">transparent</span> pricing
            </h1>
            <p className="mt-4 text-richblack-300 text-lg max-w-2xl mx-auto">
              Pick the plan that fits how you learn. Upgrade, downgrade, or
              cancel anytime — no questions asked.
            </p>
            {user && (
              <p className="mt-3 text-sm text-caribbeangreen-100">
                Your current plan: <span className="font-semibold">{PLAN_LABEL[currentPlan]}</span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`glass-card rounded-3xl p-8 flex flex-col relative ${
                  plan.highlight
                    ? "border-2 border-yellow-50/60 shadow-[0_0_40px_rgba(255,214,10,0.15)] lg:-translate-y-4"
                    : ""
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-50 text-richblack-900 text-xs font-bold px-4 py-1 rounded-full">
                    MOST POPULAR
                  </span>
                )}

                <h2 className="text-2xl font-bold text-richblack-5 font-outfit">
                  {plan.name}
                </h2>
                <p className="text-richblack-300 text-sm mt-1">{plan.tagline}</p>

                <div className="mt-6 flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-richblack-5">
                    ₹{plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-richblack-400">/month</span>
                  )}
                </div>

                <button
                  onClick={() => handleChoosePlan(plan.id)}
                  className={`mt-8 w-full py-3 rounded-md font-bold transition-all duration-300 hover:scale-[1.02] ${
                    currentPlan === plan.id
                      ? "bg-richblack-700 text-richblack-300 cursor-default"
                      : plan.highlight
                      ? "bg-yellow-50 text-richblack-900 shadow-[0_0_15px_rgba(255,214,10,0.5)]"
                      : "bg-richblack-800 border border-richblack-600 text-richblack-5 hover:bg-richblack-700"
                  }`}
                  disabled={currentPlan === plan.id}
                >
                  {currentPlan === plan.id
                    ? "Current Plan"
                    : plan.id === PLAN.FREE
                    ? "Downgrade to Free"
                    : `Get ${plan.name}`}
                </button>

                <ul className="mt-8 flex flex-col gap-3">
                  {plan.features.map((feature, i) => (
                    <li
                      key={i}
                      className={`flex items-start gap-3 text-sm ${
                        feature.included ? "text-richblack-100" : "text-richblack-500"
                      }`}
                    >
                      {feature.included ? (
                        <FaCheck className="mt-1 flex-shrink-0 text-caribbeangreen-100" />
                      ) : (
                        <FaMinus className="mt-1 flex-shrink-0 text-richblack-600" />
                      )}
                      <span>{feature.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="text-center text-richblack-400 text-sm mt-12">
            Prices shown in INR. Cancel or switch plans anytime from your
            dashboard.
          </p>
        </div>
      </section>

      <Footer />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Pricing
