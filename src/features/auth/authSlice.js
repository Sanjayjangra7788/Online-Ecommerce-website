// src/features/auth/authSlice.js
// ──────────────────────────────────────────────────────────────────
// Auth0 ke saath updated Redux slice
// Ab user aur token Auth0 se aayega, hardcoded nahi hoga
// ──────────────────────────────────────────────────────────────────

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    // Auth0 se user+token milne par call karo
    // loginSuccess: (state, action) => {
    //   state.user = action.payload.user;
    //   state.token = action.payload.token;
    //   state.isAuthenticated = true;
    //   sessionStorage.setItem('isAuthenticated', true)
    // },
    loginSuccess: (state, action) => {

      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;

      localStorage.setItem("token",action.payload.token);
      localStorage.setItem("user",JSON.stringify(action.payload.user))},

    // Auth0 logout ke baad Redux bhi clear karo
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },

    // User profile update (profile page ke liye)
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;

// ──────────────────────────────────────────────────────────────────
// NOTE: localStorage se ab seedha Auth0 token handle hoga
// (cacheLocation="localstorage" Auth0Provider mein set kiya hai)
// Redux sirf in-memory state ke liye hai
// ──────────────────────────────────────────────────────────────────
