// Import the required modules
const express = require("express")
const router = express.Router()

// Import the Controllers

// Course Controllers Import
const {
  CreateCOurces,
  ShowAllCources,
  GetCourcesDetails,
} = require("../components/Cources")


// Categories Controllers Import
const {
  Createcategory,
  GetAllCategories,
  CategroyPageDetails,
} = require("../components/Category")

// Sections Controllers Import
const {
  CreateSection,
  UpdateSection,
  DeleteSection,
} = require("../components/Section")

// Sub-Sections Controllers Import
const {
  Createsubsection,
  updateSubSection,
  // DeleteSection,
} = require("../components/Subsection")

// Rating Controllers Import
const {
  CreateRating,
  getAverageRating,
  GetAllRating,
} = require("../components/RatingAndReviews")

// Importing Middlewares
const { auth, isStudent, isAdmin, isInstructor } = require("../middlewares/auth")

// ********************************************************************************************************
//                                      Course routes
// ********************************************************************************************************

// Courses can Only be Created by Instructors
router.post("/createCourse", auth, isInstructor, CreateCOurces)
//Add a Section to a Course
router.post("/addSection", auth, isInstructor, CreateSection)
// Update a Section
router.post("/updateSection", auth, isInstructor, UpdateSection)
// Delete a Section
router.post("/deleteSection", auth, isInstructor, DeleteSection)
// Edit Sub Section
router.post("/updateSubSection", auth, isInstructor, updateSubSection)
// Delete Sub Section
router.post("/deleteSubSection", auth, isInstructor, DeleteSection)
// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, Createsubsection)
// Get all Registered Courses
router.get("/getAllCourses", ShowAllCources)
// Get Details for a Specific Courses
router.post("/getCourseDetails", GetCourcesDetails)

// ********************************************************************************************************
//                                      Category routes (Only by Admin)
// ********************************************************************************************************
// Category can Only be Created by Admin
// TODO: Put IsAdmin Middleware here
router.post("/createCategory", auth, isAdmin, Createcategory)
router.get("/showAllCategories", GetAllCategories)
router.post("/getCategoryPageDetails", CategroyPageDetails)

// ********************************************************************************************************
//                                      Rating and Review
// ********************************************************************************************************
router.post("/createRating", auth, isStudent, CreateRating)
router.get("/getAverageRating", getAverageRating)
router.get("/getReviews", GetAllRating)

module.exports = router