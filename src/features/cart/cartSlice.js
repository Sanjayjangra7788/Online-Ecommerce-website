import { createSlice } from "@reduxjs/toolkit";


// ======================================
// GET CART FROM LOCAL STORAGE
// ======================================

const cartFromStorage =
  localStorage.getItem("cartItems")
    ? JSON.parse(
        localStorage.getItem("cartItems")
      )
    : [];


// ======================================
// INITIAL STATE
// ======================================

const initialState = {

  cartItems: cartFromStorage,
};


// ======================================
// SLICE
// ======================================

const cartSlice = createSlice({

  name: "cart",

  initialState,

  reducers: {

    // ==================================
    // ADD TO CART
    // ==================================

    addToCart: (state, action) => {

      const itemExist =
        state.cartItems.find(
          (item) =>
            item.id === action.payload.id
        );

      if (itemExist) {

        itemExist.quantity += 1;

      } else {

        state.cartItems.push({
          ...action.payload,
          quantity: 1,
        });
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },


    // ==================================
    // REMOVE FROM CART
    // ==================================

    removeFromCart: (state, action) => {

      state.cartItems =
        state.cartItems.filter(
          (item) =>
            item.id !== action.payload
        );

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },


    // ==================================
    // INCREASE QUANTITY
    // ==================================

    increaseQty: (state, action) => {

      const item =
        state.cartItems.find(
          (item) =>
            item.id === action.payload
        );

      if (item) {
        item.quantity += 1;
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },


    // ==================================
    // DECREASE QUANTITY
    // ==================================

    decreaseQty: (state, action) => {

      const item =
        state.cartItems.find(
          (item) =>
            item.id === action.payload
        );

      if (item && item.quantity > 1) {

        item.quantity -= 1;
      }

      localStorage.setItem(
        "cartItems",
        JSON.stringify(state.cartItems)
      );
    },

    // ==================================
    // CLEAR CART
    // ==================================

    clearCart: (state) => {
      state.cartItems = [];
      localStorage.removeItem("cartItems");
    },
  },
});

export const {

  addToCart,

  removeFromCart,

  increaseQty,

  decreaseQty,

  clearCart,

} = cartSlice.actions;

export default cartSlice.reducer;