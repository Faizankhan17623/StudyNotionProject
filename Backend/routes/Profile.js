const express = require("express")
const router = express.Router()
const { auth } = require("../middlewares/auth")
const {
    updateProfile,
    DeleteAccount,
    getAllUsers,
    updatedisplayPicture,
    GetEnrolledCources,
} = require("../components/Profile")

// ********************************************************************************************************
//                                      Profile routes
// ********************************************************************************************************
// Delet User Account
router.delete("/deleteProfile", auth, DeleteAccount)
router.put("/updateProfile", auth, updateProfile)
router.get("/getUserDetails", auth, getAllUsers)
// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, GetEnrolledCources)
router.put("/updateDisplayPicture", auth, updatedisplayPicture)

module.exports = router