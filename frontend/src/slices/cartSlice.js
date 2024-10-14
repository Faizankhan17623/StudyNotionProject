import { createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

// Initial state with lowercase "i"
const initialState  = {
  cart: localStorage.getItem('cart') ? JSON.parse(localStorage.getItem('cart')) : [],
  total: localStorage.getItem('total') ? JSON.parse(localStorage.getItem('total')) : 0,
  totalItems: localStorage.getItem('totalitems') ? JSON.parse(localStorage.getItem('totalitems')) : 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState ,  // Correct property name
  reducers: {
    addToCart: (state, action) => {
      const course = action.payload;
      const index = state.cart.findIndex((item) => item._id === course.id);  // Corrected function name

      // Changed the condition to `index >= 0` to check if item exists
      if (index >= 0) {
        toast.error("Course already saved in the cart.");
      } else {
        state.cart.push(course);
        state.totalItems++;
        state.total += course.price;

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalitems", JSON.stringify(state.totalItems));

        toast.success("Course added to the cart.");
      }
    },
    removeFromCart: (state, action) => {
      const courseId = action.payload;
      const index = state.cart.findIndex((item) => item._id === courseId);  // Corrected function name

      // Changed the condition to `index >= 0` to check if item exists
      if (index >= 0) {
        state.totalItems--;
        state.total -= state.cart[index].price;
        state.cart.splice(index, 1);

        localStorage.setItem("cart", JSON.stringify(state.cart));
        localStorage.setItem("total", JSON.stringify(state.total));
        localStorage.setItem("totalitems", JSON.stringify(state.totalItems));

        toast.success("Removed from the cart.");
      }
    },
    resetCart: (state) => {
      state.cart = [];
      state.total = 0;
      state.totalItems = 0;

      localStorage.removeItem('cart');
      localStorage.removeItem('total');
      localStorage.removeItem('totalitems');
    }
  }
});

export const { addToCart, removeFromCart, resetCart } = cartSlice.actions;
export default cartSlice.reducer;
