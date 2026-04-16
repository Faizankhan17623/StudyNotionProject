// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  createCourse,
  getAllCourses,
  getCourseDetails,
  getFullCourseDetails,
  editCourse,
  getInstructorCourses,
  deleteCourse,
  searchCourses,
  getFilterOptions,
} = require("../controllers/Course")

// Tags Controllers Import

// Categories Controllers Import
const {
  showAllCategories,
  createCategory,
  categoryPageDetails,
} = require("../controllers/Category")

// Sections Controllers Import
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section")

// Sub-Sections Controllers Import
const {
  createSubSection,
  updateSubSection,
  deleteSubSection,
} = require("../controllers/Subsection")

// Rating Controllers Import
const {
  createRating,
  getAverageRating,
  getAllRatingReview,
  deleteReview,
} = require("../controllers/RatingandReview")

// Q&A Controllers Import
const {
  askQuestion,
  getQuestions,
  answerQuestion,
  toggleUpvote,
  toggleDownvote,
  toggleResolved,
} = require("../controllers/Question")

// Coupon Controllers Import
const {
  createCoupon,
  getCourseCoupons,
  deleteCoupon,
  toggleCoupon,
  applyCoupon,
} = require("../controllers/Coupon")

// Notes Controllers Import
const {
  addNote,
  getNotes,
  getAllCourseNotes,
  deleteNote,
  editNote,
} = require("../controllers/Note")
// Admin Analytics Import
const { getAdminAnalytics } = require("../controllers/adminAnalytics")
const {
  updateCourseProgress,
  updateVideoTimestamp,
  getVideoTimestamp,
} = require("../controllers/courseProgress")
// Importing Middlewares
const { auth, isInstructor, isStudent, isAdmin } = require("../middleware/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse)
// Edit Course routes
router.post("/editCourse", auth, isInstructor, editCourse)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, updateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, deleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection)
// Get all Courses Under a Specific Instructor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)
// Get all Registered Courses
router.get("/getAllCourses", getAllCourses)
// Search and filter courses
router.get("/searchCourses", searchCourses)
// Get distinct filter options (categories, languages, levels)
router.get("/getFilterOptions", getFilterOptions)
// Get Details for a Specific Courses
router.post("/getCourseDetails", getCourseDetails)
// Get Details for a Specific Courses
router.post("/getFullCourseDetails", auth, getFullCourseDetails)
// To Update Course Progress
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress)
// FEATURE-9: Video Resume — save/get timestamp
router.post("/updateVideoTimestamp", auth, isStudent, updateVideoTimestamp)
router.get("/getVideoTimestamp", auth, isStudent, getVideoTimestamp)
// To get Course Progress
// router.post("/getProgressPercentage", auth, isStudent, getProgressPercentage)
// Delete a Course
router.delete("/deleteCourse", auth, isInstructor, deleteCourse)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Admin Analytics
router.get("/adminAnalytics", auth, isAdmin, getAdminAnalytics)

// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, createCategory)
router.get("/showAllCategories", showAllCategories)
router.post("/getCategoryPageDetails", categoryPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, createRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", getAllRatingReview)
router.delete("/deleteReview", auth, isAdmin, deleteReview)

// ********************************************************************************************************
//                                      Q&A / Discussion Forum
// ********************************************************************************************************
// ********************************************************************************************************
//                                      Coupon routes
// ********************************************************************************************************
router.post("/createCoupon",      auth, isInstructor, createCoupon)
router.get("/getCourseCoupons",   auth, isInstructor, getCourseCoupons)
router.delete("/deleteCoupon",    auth, isInstructor, deleteCoupon)
router.put("/toggleCoupon",       auth, isInstructor, toggleCoupon)
router.post("/applyCoupon",       auth, isStudent, applyCoupon)

// ********************************************************************************************************
//                                      Notes
// ********************************************************************************************************
router.post("/addNote",            auth, isStudent, addNote)
router.get("/getNotes",            auth, isStudent, getNotes)
router.get("/getAllCourseNotes",   auth, isStudent, getAllCourseNotes)
router.delete("/deleteNote",       auth, isStudent, deleteNote)
router.put("/editNote",            auth, isStudent, editNote)

router.post("/askQuestion",    auth, isStudent, askQuestion)
router.get("/getQuestions",    auth, isStudent, getQuestions)
router.post("/answerQuestion", auth, isStudent, answerQuestion)
router.put("/upvoteQuestion",  auth, isStudent, toggleUpvote)
router.put("/downvoteQuestion",auth, isStudent, toggleDownvote)
router.put("/resolveQuestion", auth, isInstructor, toggleResolved)

module.exports = router
