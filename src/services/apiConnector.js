import axios from "axios"

export const axiosInstance = axios.create({ timeout: 30000 })

// Response interceptor — normalize error messages so every catch block can
// safely do `toast.error(error.message)` and get the real backend message.
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Pull the human-readable message from the server response when available.
    // Falls back to the axios default (e.g. "Network Error", "timeout of 30000ms exceeded").
    const serverMessage =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      null

    if (serverMessage) {
      error.message = serverMessage
    }

    return Promise.reject(error)
  }
)

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  })
}
