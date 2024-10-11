// Import the required modules
const express = require("express")
const router = express.Router()

const { CreatePayment, VerifySignature } = require("../components/Payments")
const { auth, isStudent, isAdmin, isInstructor } = require("../middlewares/auth")
router.post("/capturePayment", auth, isStudent, CreatePayment)
router.post("/verifySignature", VerifySignature)

module.exports = router