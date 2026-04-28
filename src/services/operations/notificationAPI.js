import { apiConnector } from "../apiConnector"
import { notificationEndpoints } from "../apis"
import { setNotifications, markOneRead, markAllRead } from "../../slices/notificationSlice"

const { GET_NOTIFICATIONS_API, MARK_READ_API, MARK_ALL_READ_API } = notificationEndpoints

export const fetchNotifications = (token) => async (dispatch) => {
  try {
    const response = await apiConnector("GET", GET_NOTIFICATIONS_API, null, {
      Authorization: `Bearer ${token}`,
    })
    if (response?.data?.success) {
      dispatch(
        setNotifications({
          notifications: response.data.data,
          unreadCount: response.data.unreadCount,
        })
      )
    }
  } catch (error) {
    // silent — notifications are non-critical
  }
}

export const markNotificationRead = (notificationId, token) => async (dispatch) => {
  // Optimistic update — update UI immediately
  dispatch(markOneRead(notificationId))
  try {
    await apiConnector("PUT", MARK_READ_API, { notificationId }, {
      Authorization: `Bearer ${token}`,
    })
  } catch (error) {
    // silent
  }
}

export const markAllNotificationsRead = (token) => async (dispatch) => {
  // Optimistic update — update UI immediately
  dispatch(markAllRead())
  try {
    await apiConnector("PUT", MARK_ALL_READ_API, null, {
      Authorization: `Bearer ${token}`,
    })
  } catch (error) {
    // silent
  }
}
