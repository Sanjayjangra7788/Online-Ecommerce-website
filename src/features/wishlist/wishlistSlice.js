import { createSlice } from "@reduxjs/toolkit";

const wishlistFromStorage =
  localStorage.getItem("wishlistItems")
    ? JSON.parse(localStorage.getItem("wishlistItems"))
    : [];

const initialState = {
  wishlistItems: wishlistFromStorage,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggleWishlist: (state, action) => {
      const exist = state.wishlistItems.find(
        (item) => item.id === action.payload.id
      );

      if (exist) {
        state.wishlistItems = state.wishlistItems.filter(
          (item) => item.id !== action.payload.id
        );
      } else {
        state.wishlistItems.push(action.payload);
      }

      localStorage.setItem(
        "wishlistItems",
        JSON.stringify(state.wishlistItems)
      );
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
