
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

function RoleProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user?.role)) {
    // Logged in hai but is section ka access nahi — home pe bhej do
    return <Navigate to="/" replace />;
  }

  return children;
}

export default RoleProtectedRoute;
