// Import the required modules
const express = require("express")
const router = express.Router()
const {
  capturePayment,
  enrollFree,
  // verifySignature,
  verifyPayment,
  sendPaymentSuccessEmail,
  createPlanOrder,
  verifyPlanPayment,
} = require("../controllers/payments")
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")
router.post("/capturePayment", auth, isStudent, capturePayment)
router.post("/enrollFree", auth, isStudent, enrollFree)
router.post("/verifyPayment", auth, isStudent, verifyPayment)
router.post(
  "/sendPaymentSuccessEmail",
  auth,
  isStudent,
  sendPaymentSuccessEmail
)
// router.post("/verifySignature", verifySignature)

// Subscription plan checkout (Pro / Pro Max) — any logged-in account type
router.post("/createPlanOrder", auth, createPlanOrder)
router.post("/verifyPlanPayment", auth, verifyPlanPayment)

module.exports = router
