import { toast } from "react-hot-toast"

import { setLoading, setUser } from "../../slices/profileSlice"
import { setWishlist } from "../../slices/wishlistSlice"
import { apiConnector } from "../apiConnector"
import { profileEndpoints, settingsEndpoints } from "../apis"
import { logout } from "./authAPI"

const {
  GET_USER_DETAILS_API,
  GET_USER_ENROLLED_COURSES_API,
  GET_INSTRUCTOR_DATA_API,
  ADD_TO_WISHLIST_API,
  REMOVE_FROM_WISHLIST_API,
  GET_WISHLIST_API,
} = profileEndpoints

const {
  UPDATE_DISPLAY_PICTURE_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingsEndpoints

// ********************************************************************************************************
//                                      Profile Operations
// ********************************************************************************************************

export function getUserDetails(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("GET_USER_DETAILS API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.data.image
        ? response.data.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.data.firstName} ${response.data.data.lastName}`
      dispatch(setUser({ ...response.data.data, image: userImage }))
      // Seed wishlist IDs into the wishlist slice
      const wishlistIds = (response.data.data.wishlist || []).map((id) =>
        typeof id === "object" ? id._id || id.toString() : id
      )
      dispatch(setWishlist(wishlistIds))
    } catch (error) {
      dispatch(logout(navigate))
      console.log("GET_USER_DETAILS API ERROR............", error)
      toast.error(error.message || "Could not fetch user details.")
    }
    toast.dismiss(toastId)
    dispatch(setLoading(false))
  }
}

export async function getUserEnrolledCourses(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_USER_ENROLLED_COURSES_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    result = response.data.data
  } catch (error) {
    console.log("GET_USER_ENROLLED_COURSES_API API ERROR............", error)
    toast.error(error.message || "Could not load enrolled courses.")
  }
  toast.dismiss(toastId)
  return result
}

export async function getInstructorData(token) {
  const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    })
    console.log("GET_INSTRUCTOR_DATA_API API RESPONSE............", response)
    result = response?.data?.courses
  } catch (error) {
    console.log("GET_INSTRUCTOR_DATA_API API ERROR............", error)
    toast.error(error.message || "Could not load instructor data.")
  }
  toast.dismiss(toastId)
  return result
}

// ********************************************************************************************************
//                                      Settings Operations
// ********************************************************************************************************

export function updateDisplayPicture(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PICTURE_API,
        formData,
        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      )
      console.log(
        "UPDATE_DISPLAY_PICTURE_API API RESPONSE............",
        response
      )
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Display Picture Updated Successfully")
      dispatch(setUser(response.data.data))
    } catch (error) {
      console.log("UPDATE_DISPLAY_PICTURE_API API ERROR............", error)
      toast.error(error.message || "Could not update display picture.")
    }
    toast.dismiss(toastId)
  }
}

export function updateProfile(token, formData) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, formData, {
        Authorization: `Bearer ${token}`,
      })
      console.log("UPDATE_PROFILE_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      const userImage = response.data.updatedUserDetails.image
        ? response.data.updatedUserDetails.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.updatedUserDetails.firstName} ${response.data.updatedUserDetails.lastName}`
      dispatch(
        setUser({ ...response.data.updatedUserDetails, image: userImage })
      )
      toast.success("Profile Updated Successfully")
    } catch (error) {
      console.log("UPDATE_PROFILE_API API ERROR............", error)
      toast.error(error.message || "Could not update profile.")
    }
    toast.dismiss(toastId)
  }
}

export async function changePassword(token, formData) {
  const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, formData, {
      Authorization: `Bearer ${token}`,
    })
    console.log("CHANGE_PASSWORD_API API RESPONSE............", response)
    if (!response.data.success) {
      throw new Error(response.data.message)
    }
    toast.success("Password Changed Successfully")
  } catch (error) {
    console.log("CHANGE_PASSWORD_API API ERROR............", error)
    toast.error(error.message || "Could not change password. Please try again.")
  }
  toast.dismiss(toastId)
}

export function deleteProfile(token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    try {
      const response = await apiConnector("DELETE", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      })
      console.log("DELETE_PROFILE_API API RESPONSE............", response)
      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Profile Deleted Successfully")
      dispatch(logout(navigate))
    } catch (error) {
      console.log("DELETE_PROFILE_API API ERROR............", error)
      toast.error(error.message || "Could not delete profile.")
    }
    toast.dismiss(toastId)
  }
}

// ********************************************************************************************************
//                                      Wishlist Operations
// ********************************************************************************************************

export const addToWishlist = async (courseId, token, dispatch) => {
  try {
    const response = await apiConnector(
      "POST",
      ADD_TO_WISHLIST_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not add to wishlist")
    toast.success("Added to wishlist")
    return response.data.wishlist
  } catch (error) {
    toast.error(error.message)
    return null
  }
}

export const removeFromWishlist = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      REMOVE_FROM_WISHLIST_API,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response?.data?.success) throw new Error("Could not remove from wishlist")
    toast.success("Removed from wishlist")
    return response.data.wishlist
  } catch (error) {
    toast.error(error.message)
    return null
  }
}

export const getWishlist = async (token) => {
  let result = []
  try {
    const response = await apiConnector("GET", GET_WISHLIST_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (!response?.data?.success) throw new Error("Could not fetch wishlist")
    result = response.data.data
  } catch (error) {
    toast.error(error.message)
  }
  return result
}
