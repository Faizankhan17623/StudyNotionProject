import { createSlice } from "@reduxjs/toolkit"

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    wishlist: [], // array of course ID strings
  },
  reducers: {
    setWishlist(state, { payload }) {
      state.wishlist = payload
    },
    addCourseToWishlist(state, { payload }) {
      if (!state.wishlist.includes(payload)) {
        state.wishlist.push(payload)
      }
    },
    removeCourseFromWishlist(state, { payload }) {
      state.wishlist = state.wishlist.filter((id) => id !== payload)
    },
  },
})

export const { setWishlist, addCourseToWishlist, removeCourseFromWishlist } =
  wishlistSlice.actions

export default wishlistSlice.reducer
