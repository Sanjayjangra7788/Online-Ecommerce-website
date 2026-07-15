// src/auth/useAuth0Sync.js
// Auth0 state ko Redux store se sync karta hai

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginSuccess, logout } from "../features/auth/authSlice";

function useAuth0Sync() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    isLoading,
    isAuthenticated,
    user,
    getAccessTokenSilently,
  } = useAuth0();

  useEffect(() => {
    // ── Wait until Auth0 has fully initialised ──────────────────
    // Never act while isLoading — Auth0 is still restoring its
    // session from localStorage/cookie. Acting here causes the
    // false-logout-on-refresh bug.
    if (isLoading) return;

    if (isAuthenticated && user) {
      // Auth0 session is live — sync token + user into Redux
      getAccessTokenSilently()
        .then((token) => {
          dispatch(
            loginSuccess({
              token,
              user: {
                id:            user.sub,
                name:          user.name,
                email:         user.email,
                picture:       user.picture,
                emailVerified: user.email_verified,
              },
            })
          );
        })
        .catch(() => {
          // Silent token refresh failed (e.g. consent required).
          // Only clear Redux if there is no localStorage token
          // (i.e. the user didn't log in via the email/password flow).
          if (!localStorage.getItem("token")) {
            dispatch(logout());
          }
        });
    }
    // ── IMPORTANT: do NOT dispatch logout() in the else branch ──
    // Reason 1: On refresh, Auth0 takes a moment to restore its
    //           session. During that window isAuthenticated is
    //           false even though the user IS logged in.
    // Reason 2: Users who logged in via the custom email/password
    //           flow (Resource Owner Password Grant) are tracked
    //           only in Redux/localStorage — Auth0 SDK will never
    //           report them as isAuthenticated.
    // The authSlice already hydrates isAuthenticated from
    // localStorage on startup, so no extra action is needed here.
  }, [isAuthenticated, isLoading, user]);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    localStorage.removeItem("cartItems");
    sessionStorage.clear();
    navigate("/login");
  };

  return { handleLogout };
}

export default useAuth0Sync;
