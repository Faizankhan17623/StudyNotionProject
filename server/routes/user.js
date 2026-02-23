// Import the required modules
const express = require("express")
const router = express.Router()
const rateLimit = require("express-rate-limit")

// Import the required controllers and middleware functions
const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../controllers/Auth")
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/resetPassword")

const { auth } = require("../middleware/auth")

// Rate limiter — 5 requests per 15 minutes for auth routes (login, signup)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many attempts. Please try again after 15 minutes." },
})

// Stricter limiter — 3 requests per 15 minutes for routes that send emails (OTP, password reset)
const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { success: false, message: "Too many email requests. Please try again after 15 minutes." },
})

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", authLimiter, login)

// Route for user signup
router.post("/signup", authLimiter, signup)

// Route for sending OTP to the user's email
router.post("/sendotp", emailLimiter, sendotp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", emailLimiter, resetPasswordToken)

// Route for resetting user's password after verification
router.post("/reset-password", authLimiter, resetPassword)

// Export the router for use in the main application
module.exports = router
