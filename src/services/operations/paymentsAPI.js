import { toast } from "react-hot-toast"

import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { resetCart } from "../../slices/cartSlice"
import { setPaymentLoading } from "../../slices/courseSlice"
import { apiConnector } from "../apiConnector"
import { studentEndpoints } from "../apis"

const {
  COURSE_PAYMENT_API,
  COURSE_VERIFY_API,
  SEND_PAYMENT_SUCCESS_EMAIL_API,
  ENROLL_FREE_API,
} = studentEndpoints

// ********************************************************************************************************
//                                      Payment Operations
// ********************************************************************************************************

// Load the Razorpay SDK from the CDN
function loadScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = src
    script.onload = () => {
      resolve(true)
    }
    script.onerror = () => {
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Enroll in a free (price = 0) course — no Razorpay needed
export async function EnrollFreeCourse(token, courses, navigate, dispatch) {
  const toastId = toast.loading("Enrolling...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector(
      "POST",
      ENROLL_FREE_API,
      { courses },
      { Authorization: `Bearer ${token}` }
    )
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Enrolled successfully!")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("FREE ENROLL ERROR............", error)
    toast.error(error.message || "Could not enroll. Please try again.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

export async function BuyCourse(
  token,
  courses,
  user_details,
  navigate,
  dispatch,
  couponCode = null
) {
  const toastId = toast.loading("Loading...")
  try {
    // Loading the script of Razorpay SDK
    const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js")

    if (!res) {
      toast.error(
        "Razorpay SDK failed to load. Check your Internet Connection."
      )
      return
    }

    // Initiating the Order in Backend — pass couponCode so backend applies discount
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses, couponCode },
      { Authorization: `Bearer ${token}` }
    )

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message)
    }
    console.log("PAYMENT RESPONSE FROM BACKEND............", orderResponse.data)

    // Opening the Razorpay SDK
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      currency: orderResponse.data.data.currency,
      amount: `${orderResponse.data.data.amount}`,
      order_id: orderResponse.data.data.id,
      name: "StudyNotion",
      description: "Thank you for Purchasing the Course.",
      image: rzpLogo,
      prefill: {
        name: `${user_details.firstName} ${user_details.lastName}`,
        email: user_details.email,
      },
      handler: function (response) {
        sendPaymentSuccessEmail(response, orderResponse.data.data.amount, token)
        verifyPayment({ ...response, courses, couponCode }, token, navigate, dispatch)
      },
    }
    const paymentObject = new window.Razorpay(options)
    paymentObject.open()
    paymentObject.on("payment.failed", function (response) {
      toast.error("Oops! Payment Failed.")
      console.log(response.error)
    })
  } catch (error) {
    console.log("PAYMENT API ERROR............", error)
    toast.error(error.message || "Could not initiate payment. Please try again.")
  }
  toast.dismiss(toastId)
}

async function verifyPayment(bodyData, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment...")
  dispatch(setPaymentLoading(true))
  try {
    const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("VERIFY PAYMENT RESPONSE FROM BACKEND............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Payment Successful. You are Added to the course ")
    navigate("/dashboard/enrolled-courses")
    dispatch(resetCart())
  } catch (error) {
    console.log("PAYMENT VERIFY ERROR............", error)
    toast.error(error.message || "Payment verification failed. Please contact support.")
  }
  toast.dismiss(toastId)
  dispatch(setPaymentLoading(false))
}

async function sendPaymentSuccessEmail(response, amount, token) {
  try {
    await apiConnector(
      "POST",
      SEND_PAYMENT_SUCCESS_EMAIL_API,
      {
        orderId: response.razorpay_order_id,
        paymentId: response.razorpay_payment_id,
        amount,
      },
      { Authorization: `Bearer ${token}` }
    )
  } catch (error) {
    console.log("PAYMENT SUCCESS EMAIL ERROR............", error)
  }
}
