import { Navigate, useLocation } from "react-router-dom";
import { getAuthToken, getAuthUser, getLastVisitedPath } from "../../utils/auth";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const token = getAuthToken();
  const user = getAuthUser();

  // 1. Authentication Check: Require valid Token & User session
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authorization Check: Require user role matching allowedRoles
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user.role?.toUpperCase();
    const isAllowed = allowedRoles.some((r) => r.toUpperCase() === userRole);

    if (!isAllowed) {
      // If unauthorized role, redirect to their last visited path or assigned dashboard
      const targetPath = getLastVisitedPath(userRole);
      return <Navigate to={targetPath} replace />;
    }
  }

  return children;
};

/**
 * PublicRouteGuard: If user is already logged in with a valid JWT token,
 * prevent access to /login or /register and auto-redirect to their last opened page!
 */
export const PublicRouteGuard = ({ children }) => {
  const token = getAuthToken();
  const user = getAuthUser();

  if (token && user) {
    const targetPath = getLastVisitedPath(user.role);
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

export default ProtectedRoute;
