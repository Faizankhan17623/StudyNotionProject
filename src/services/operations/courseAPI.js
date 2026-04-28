import { toast } from "react-hot-toast"

import { updateCompletedLectures } from "../../slices/viewCourseSlice"
import { apiConnector } from "../apiConnector"
import { catalogData, courseEndpoints, questionEndpoints, noteEndpoints, couponEndpoints } from "../apis"

const {
  GET_ALL_COURSE_API,
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SUBSECTION_API,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
  CREATE_CATEGORY_API,
  SEARCH_COURSES_API,
  GET_FILTER_OPTIONS_API,
} = courseEndpoints

const { CATALOGPAGEDATA_API } = catalogData

// ********************************************************************************************************
//                                      Course Operations
// ********************************************************************************************************

export const getAllCourses = async (page = 1, limit = 10) => {
  const toastId = toast.loading("Loading...")
  let result = { data: [], pagination: null }
  try {
    const response = await apiConnector(
      "GET",
      `${GET_ALL_COURSE_API}?page=${page}&limit=${limit}`
    )
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = {
      data: response?.data?.data,
      pagination: response?.data?.pagination,
    }
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, {
      courseId,
    })
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data
  } catch (error) {
    toast.error(error.message || "Could not load course details.")
  }
  toast.dismiss(toastId)
  return result
}

export const addCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Add Course Details")
    }
    toast.success("Course Details Added Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const editCourseDetails = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Update Course Details")
    }
    toast.success("Course Details Updated Successfully")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const fetchInstructorCourses = async (token, page = 1, limit = 10) => {
  let result = { data: [], pagination: null }
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector(
      "GET",
      `${GET_ALL_INSTRUCTOR_COURSES_API}?page=${page}&limit=${limit}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Instructor Courses")
    }
    result = {
      data: response?.data?.data,
      pagination: response?.data?.pagination,
    }
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Course")
    }
    toast.success("Course Deleted")
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
}

export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading...")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message || "Could not load course details.")
  }
  toast.dismiss(toastId)
  return result
}

// ********************************************************************************************************
//                                      Section Operations
// ********************************************************************************************************

export const createSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Section")
    }
    toast.success("Course Section Created")
    result = response?.data?.updatedCourse
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Update Section")
    }
    toast.success("Course Section Updated")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Section")
    }
    toast.success("Course Section Deleted")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// ********************************************************************************************************
//                                      Sub-Section Operations
// ********************************************************************************************************

export const createSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Add Lecture")
    }
    toast.success("Lecture Added")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const updateSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    toast.success("Lecture Updated")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

export const deleteSubSection = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Delete Lecture")
    }
    toast.success("Lecture Deleted")
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return result
}

// ********************************************************************************************************
//                                      Category Operations
// ********************************************************************************************************

export const createCategory = async (data, token) => {
  const toastId = toast.loading("Creating category...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_CATEGORY_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Category")
    }
    toast.success("Category Created Successfully")
    success = true
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}

export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}

export const getCatalogPageData = async (categoryId) => {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("POST", CATALOGPAGEDATA_API, {
      categoryId,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Category Page Data.")
    }
    result = response?.data
  } catch (error) {
    toast.error(error.message)
    result = error.response?.data
  }
  toast.dismiss(toastId)
  return result
}

// ********************************************************************************************************
//                                      Search Operations
// ********************************************************************************************************

export const searchCourses = async (params) => {
  let result = { data: [], pagination: null }
  try {
    const response = await apiConnector("GET", SEARCH_COURSES_API, null, null, params)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Search Results")
    }
    result = {
      data: response?.data?.data,
      pagination: response?.data?.pagination,
    }
  } catch (error) {
    toast.error(error.message || "Could not fetch search results.")
  }
  return result
}

export const getFilterOptions = async () => {
  try {
    const response = await apiConnector("GET", GET_FILTER_OPTIONS_API)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Filter Options")
    }
    return response?.data?.data
  } catch (error) {
    return { languages: [], levels: [], categories: [] }
  }
}

// ********************************************************************************************************
//                                      Rating and Review Operations
// ********************************************************************************************************

export const createRating = async (data, token) => {
  const toastId = toast.loading("Loading...")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) {
      throw new Error("Could Not Create Rating")
    }
    toast.success("Rating Created")
    success = true
  } catch (error) {
    success = false
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}

// ********************************************************************************************************
//                                      Q&A Operations
// ********************************************************************************************************

export const getQuestionsForLecture = async (courseId, subsectionId, token, page = 1) => {
  try {
    const response = await apiConnector(
      "GET",
      `${questionEndpoints.GET_QUESTIONS_API}?courseId=${courseId}&subsectionId=${subsectionId}&page=${page}&limit=20`,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not fetch questions")
    return response.data
  } catch (error) {
    return { data: [], total: 0 }
  }
}

export const askQuestion = async (data, token) => {
  try {
    const response = await apiConnector("POST", questionEndpoints.ASK_QUESTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not post question")
    return response.data.data
  } catch (error) {
    toast.error("Could not post question")
    return null
  }
}

export const answerQuestion = async (data, token) => {
  try {
    const response = await apiConnector("POST", questionEndpoints.ANSWER_QUESTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not post answer")
    return response.data.data
  } catch (error) {
    toast.error("Could not post answer")
    return null
  }
}

export const toggleUpvoteQuestion = async (questionId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      questionEndpoints.UPVOTE_QUESTION_API,
      { questionId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not upvote")
    return response.data
  } catch (error) {
    return null
  }
}

export const toggleDownvoteQuestion = async (questionId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      questionEndpoints.DOWNVOTE_QUESTION_API,
      { questionId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not downvote")
    return response.data
  } catch (error) {
    return null
  }
}

export const toggleResolveQuestion = async (questionId, token) => {
  try {
    const response = await apiConnector(
      "PUT",
      questionEndpoints.RESOLVE_QUESTION_API,
      { questionId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not resolve")
    return response.data
  } catch (error) {
    return null
  }
}

// ********************************************************************************************************
//                                      Coupon Operations
// ********************************************************************************************************

export const createCoupon = async (data, token) => {
  try {
    const response = await apiConnector("POST", couponEndpoints.CREATE_COUPON_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Coupon created successfully")
    return response.data.data
  } catch (error) {
    toast.error(error.message || "Could not create coupon")
    return null
  }
}

export const getCourseCoupons = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${couponEndpoints.GET_COURSE_COUPONS_API}?courseId=${courseId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not fetch coupons")
    return response.data.data
  } catch (error) {
    return []
  }
}

export const deleteCouponAPI = async (couponId, token) => {
  try {
    const response = await apiConnector("DELETE", couponEndpoints.DELETE_COUPON_API, { couponId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error(response?.data?.message)
    toast.success("Coupon deleted")
    return true
  } catch (error) {
    toast.error(error.message || "Could not delete coupon")
    return false
  }
}

export const toggleCouponAPI = async (couponId, token) => {
  try {
    const response = await apiConnector("PUT", couponEndpoints.TOGGLE_COUPON_API, { couponId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not update coupon")
    return response.data
  } catch (error) {
    toast.error("Could not update coupon")
    return null
  }
}

export const applyCouponAPI = async (code, courses, token) => {
  try {
    const response = await apiConnector(
      "POST",
      couponEndpoints.APPLY_COUPON_API,
      { code, courses },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error(response?.data?.message)
    return response.data.data
  } catch (error) {
    toast.error(error.message || "Invalid or expired coupon code")
    return null
  }
}

// ********************************************************************************************************
//                                      Notes Operations
// ********************************************************************************************************

export const addNote = async (data, token) => {
  try {
    const response = await apiConnector("POST", noteEndpoints.ADD_NOTE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not save note")
    return response.data.data
  } catch (error) {
    toast.error("Could not save note")
    return null
  }
}

export const getNotes = async (courseId, subsectionId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${noteEndpoints.GET_NOTES_API}?courseId=${courseId}&subsectionId=${subsectionId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not fetch notes")
    return response.data.data
  } catch (error) {
    return []
  }
}

export const getAllCourseNotes = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${noteEndpoints.GET_ALL_COURSE_NOTES_API}?courseId=${courseId}`,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not fetch notes")
    return response.data.data
  } catch (error) {
    return []
  }
}

export const deleteNote = async (noteId, token) => {
  try {
    const response = await apiConnector("DELETE", noteEndpoints.DELETE_NOTE_API, { noteId }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not delete note")
    return true
  } catch (error) {
    toast.error("Could not delete note")
    return false
  }
}

export const editNote = async (noteId, body, token) => {
  try {
    const response = await apiConnector("PUT", noteEndpoints.EDIT_NOTE_API, { noteId, body }, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not edit note")
    return response.data.data
  } catch (error) {
    toast.error("Could not edit note")
    return null
  }
}

// ********************************************************************************************************
//                                      Course Progress Operations
// ********************************************************************************************************

export const markLectureAsComplete = async (data, token) => {
  let result = null
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.message) {
      throw new Error(response.data.error)
    }
    toast.success("Lecture Completed")
    result = true
  } catch (error) {
    toast.error(error.message)
    result = false
  }
  toast.dismiss(toastId)
  return result
}
