const express = require("express")
const router = express.Router()
const { auth, isInstructor, isStudent } = require("../middleware/auth")
const {
  deleteAccount,
  updateProfile,
  getAllUserDetails,
  updateDisplayPicture,
  getEnrolledCourses,
  instructorDashboard,
  addToWishlist,
  removeFromWishlist,
  getWishlist,
  getCertificate,
  getInstructorProfile,
} = require("../controllers/profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, deleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUserDetails)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)
// Wishlist routes (students only)
router.post("/addToWishlist", auth, isStudent, addToWishlist)
router.delete("/removeFromWishlist", auth, isStudent, removeFromWishlist)
router.get("/getWishlist", auth, isStudent, getWishlist)
// FEATURE-2: Course completion certificate (students only)
router.get("/getCertificate/:courseId", auth, isStudent, getCertificate)
// FEATURE-10: Instructor public profile (no auth required)
router.get("/instructorProfile/:instructorId", getInstructorProfile)

module.exports = router
