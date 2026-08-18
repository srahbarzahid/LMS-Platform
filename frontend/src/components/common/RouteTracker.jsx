import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAuthToken } from "../../utils/auth";

const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    const token = getAuthToken();
    const currentPath = location.pathname + location.search;

    // Track path if user is authenticated and navigating inside module routes
    if (token && (currentPath.startsWith("/student") || currentPath.startsWith("/instructor") || currentPath.startsWith("/admin"))) {
      localStorage.setItem("lastVisitedPath", currentPath);
    }
  }, [location]);

  return null;
};

export default RouteTracker;
