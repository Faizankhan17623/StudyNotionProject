// Import the required modules
const express = require("express")
const router = express.Router()

// Import the required controllers and middleware functions
const {
    SendOtp,
    Signup,
    Login,
    changePassword,
} = require("../components/Auth")
const {
    ResetPasswordsTokens,
    ResetPasswords,
} = require("../components/ResetPassword")

const { auth } = require("../middlewares/auth")

// Routes for Login, Signup, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user login
router.post("/login", Login)

// Route for user signup
router.post("/signup", Signup)

// Route for sending OTP to the user's email
router.post("/sendotp", SendOtp)

// Route for Changing the password
router.post("/changepassword", auth, changePassword)

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", ResetPasswordsTokens)

// Route for resetting user's password after verification
router.post("/reset-password", ResetPasswords)

// Export the router for use in the main application
module.exports = router