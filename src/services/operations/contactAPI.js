import { toast } from "react-hot-toast"

import { apiConnector } from "../apiConnector"
import { contactusEndpoint } from "../apis"

const { CONTACT_US_API } = contactusEndpoint

// ********************************************************************************************************
//                                      Contact Us Operations
// ********************************************************************************************************

export const sendContactForm = async (data) => {
  const toastId = toast.loading("Sending...")
  let success = false
  try {
    const response = await apiConnector("POST", CONTACT_US_API, data)
    if (!response?.data?.success) {
      throw new Error("Could Not Send Message")
    }
    toast.success("Message Sent Successfully")
    success = true
  } catch (error) {
    toast.error(error.message)
  }
  toast.dismiss(toastId)
  return success
}
