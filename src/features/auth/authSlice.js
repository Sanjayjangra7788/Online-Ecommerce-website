
// import { createSlice } from "@reduxjs/toolkit";

// const initialState = {
//   user: JSON.parse(localStorage.getItem("user")) || null,
//   token: localStorage.getItem("token") || null,
//   isAuthenticated: !!localStorage.getItem("token"),
// };

// const authSlice = createSlice({
//   name: "auth",

//   initialState,

//   reducers: {
//     loginSuccess: (state, action) => {

//       state.user = action.payload.user;
//       state.token = action.payload.token;
//       state.isAuthenticated = true;

//       localStorage.setItem("token",action.payload.token);
//       localStorage.setItem("user",JSON.stringify(action.payload.user))},

//     // Auth0 logout ke baad Redux bhi clear karo
//     logout: (state) => {
//       state.user = null;
//       state.token = null;
//       state.isAuthenticated = false;
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//     },

//     // User profile update (profile page ke liye)
//     updateUser: (state, action) => {
//       state.user = { ...state.user, ...action.payload };
//     },
//   },
// });

// export const { loginSuccess, logout, updateUser } = authSlice.actions;
// export default authSlice.reducer;




import { createSlice } from "@reduxjs/toolkit";
import { getRole } from "../../utils/sellerStore";

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  isAuthenticated: !!localStorage.getItem("user"),
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
   
    loginSuccess: (state, action) => {
      const role = getRole(action.payload.user.email);
      state.user = { ...action.payload.user, role };
      state.isAuthenticated = true;
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    // Auth0 logout ke baad Redux bhi clear karo
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
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
