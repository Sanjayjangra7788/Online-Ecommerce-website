import { createSlice } from "@reduxjs/toolkit";

const shippingAddressFromStorage =
  localStorage.getItem("shippingAddress")
    ? JSON.parse(localStorage.getItem("shippingAddress"))
    : {};

const paymentMethodFromStorage =
  localStorage.getItem("paymentMethod")
    ? JSON.parse(localStorage.getItem("paymentMethod"))
    : "Stripe";

const ordersFromStorage =
  localStorage.getItem("orders")
    ? JSON.parse(localStorage.getItem("orders"))
    : [];

const initialState = {
  shippingAddress: shippingAddressFromStorage,
  paymentMethod: paymentMethodFromStorage,
  orders: ordersFromStorage,
};

const orderSlice = createSlice({
  name: "order",

  initialState,

  reducers: {
    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;

      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(action.payload)
      );
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;

      localStorage.setItem(
        "paymentMethod",
        JSON.stringify(action.payload)
      );
    },

    addOrder: (state, action) => {
      state.orders.unshift(action.payload);

      localStorage.setItem(
        "orders",
        JSON.stringify(state.orders)
      );
    },

    clearOrders: (state) => {
      state.orders = [];

      localStorage.removeItem("orders");
    },
  },
});

export const {
  saveShippingAddress,
  savePaymentMethod,
  addOrder,
  clearOrders,
} = orderSlice.actions;

export default orderSlice.reducer;