// // src/routes/ProtectedRoute.jsx
// // ──────────────────────────────────────────────────────────────────
// // Auth0 ke saath updated ProtectedRoute
// // - Agar loading hai: spinner dikhao
// // - Agar authenticated nahi: Auth0 login page par bhejo
// // - Agar authenticated hai: children render karo
// // ──────────────────────────────────────────────────────────────────

// import { useAuth0 } from "@auth0/auth0-react";
// import { useLocation } from "react-router-dom";
// import { useSelector } from "react-redux";

// function ProtectedRoute({ children }) {
//   const {isLoading, loginWithRedirect } = useAuth0();
//   const isAuthenticated = useSelector((state) => state?.auth?.isAuthenticated);
//   const location = useLocation();
//     console.log("dlkskfjdlskjfldsjf",isAuthenticated)
//   // Auth0 initialize ho raha hai
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[60vh]">
//         <div className="flex flex-col items-center gap-4">
//           <div
//             className="w-10 h-10 rounded-full border-[3px] animate-spin"
//             style={{
//               borderColor: "var(--gold)",
//               borderTopColor: "transparent",
//             }}
//           />
//           <p className="text-[13px]" style={{ color: "var(--muted)" }}>
//             Loading…
//           </p>
//         </div>
//       </div>
//     );
//   }

//   // User logged in nahi hai — Auth0 login page par bhejo
//   if (!isAuthenticated) {
//     // loginWithRedirect({
//     //   appState: { returnTo: location.pathname }, // login ke baad wapas aao
//     // });
//     return null; // redirect ho raha hai, kuch render mat karo
//   }

//   // Sab theek hai — page dikhao
//   return children;
// }

// export default ProtectedRoute;



import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function ProtectedRoute({ children }) {

  const location = useLocation();

  const { isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  return children;
}

export default ProtectedRoute;
