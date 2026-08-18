/**
 * Helper functions for Cookie & LocalStorage Token Management & Session Persistence
 */

export const getAuthToken = () => {
  // Check localStorage first
  const localToken = localStorage.getItem("token");
  if (localToken) return localToken;

  // Fallback to document.cookie
  const match = document.cookie.match(new RegExp("(^| )token=([^;]+)"));
  if (match) return match[2];

  return null;
};

export const getAuthUser = () => {
  const userJson = localStorage.getItem("user");
  if (!userJson) return null;
  try {
    return JSON.parse(userJson);
  } catch (e) {
    return null;
  }
};

export const setAuthSession = (token, user) => {
  if (token) {
    localStorage.setItem("token", token);
    // Set document cookie with 7 days expiration
    document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
  }
  if (user) {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("lastVisitedPath");
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

export const getLastVisitedPath = (userRole) => {
  const lastPath = localStorage.getItem("lastVisitedPath");
  if (lastPath) {
    // Ensure the saved path belongs to the user's role module
    const rolePrefix = userRole ? `/${userRole.toLowerCase()}` : "";
    if (!rolePrefix || lastPath.startsWith(rolePrefix)) {
      return lastPath;
    }
  }

  // Default fallback dashboard based on user role
  const role = userRole?.toUpperCase();
  if (role === "ADMIN") return "/admin/dashboard";
  if (role === "INSTRUCTOR") return "/instructor/dashboard";
  return "/student/dashboard";
};
