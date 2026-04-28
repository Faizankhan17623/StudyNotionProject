import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  notifications: [],
  unreadCount: 0,
}

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotifications(state, action) {
      state.notifications = action.payload.notifications
      state.unreadCount = action.payload.unreadCount
    },
    markOneRead(state, action) {
      const id = action.payload
      const notif = state.notifications.find((n) => n._id === id)
      if (notif && !notif.isRead) {
        notif.isRead = true
        state.unreadCount = Math.max(0, state.unreadCount - 1)
      }
    },
    markAllRead(state) {
      state.notifications.forEach((n) => (n.isRead = true))
      state.unreadCount = 0
    },
    clearNotifications(state) {
      state.notifications = []
      state.unreadCount = 0
    },
  },
})

export const { setNotifications, markOneRead, markAllRead, clearNotifications } =
  notificationSlice.actions

export default notificationSlice.reducer
