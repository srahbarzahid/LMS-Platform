const validateProfile = (req, res, next) => {
  const { name, email } = req.body;
  if (name !== void 0 && (typeof name !== "string" || name.trim().length === 0)) {
    res.status(400).json({ status: "error", message: "Full name cannot be empty." });
    return;
  }
  if (email !== void 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof email !== "string" || !emailRegex.test(email.trim())) {
      res.status(400).json({ status: "error", message: "Please provide a valid email address." });
      return;
    }
  }
  next();
};
const validatePasswordChange = (req, res, next) => {
  const { currentPassword, newPassword, confirmPassword } = req.body;
  if (!currentPassword || typeof currentPassword !== "string") {
    res.status(400).json({ status: "error", message: "Current password is required." });
    return;
  }
  if (!newPassword || typeof newPassword !== "string") {
    res.status(400).json({ status: "error", message: "New password is required." });
    return;
  }
  if (newPassword.length < 8) {
    res.status(400).json({ status: "error", message: "New password must be at least 8 characters long." });
    return;
  }
  const hasUpper = /[A-Z]/.test(newPassword);
  const hasLower = /[a-z]/.test(newPassword);
  const hasNumber = /[0-9]/.test(newPassword);
  const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);
  if (!hasUpper || !hasLower || !hasNumber || !hasSpecial) {
    res.status(400).json({
      status: "error",
      message: "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character."
    });
    return;
  }
  if (newPassword !== confirmPassword) {
    res.status(400).json({ status: "error", message: "New password and confirm password do not match." });
    return;
  }
  next();
};
const validateNotifications = (req, res, next) => {
  const { notificationPreferences } = req.body;
  if (!notificationPreferences || typeof notificationPreferences !== "object") {
    res.status(400).json({ status: "error", message: "Notification preferences must be a valid JSON object." });
    return;
  }
  next();
};
const validatePreferences = (req, res, next) => {
  const { preferredLanguage, theme } = req.body;
  if (theme && !["Light", "Dark", "System"].includes(theme)) {
    res.status(400).json({ status: "error", message: "Theme must be one of: Light, Dark, System." });
    return;
  }
  if (preferredLanguage && typeof preferredLanguage !== "string") {
    res.status(400).json({ status: "error", message: "Preferred language must be a valid string." });
    return;
  }
  next();
};
const validatePlatformSettings = (req, res, next) => {
  const { lmsName, supportEmail, sessionTimeout } = req.body;
  if (lmsName !== void 0 && (typeof lmsName !== "string" || lmsName.trim().length === 0)) {
    res.status(400).json({ status: "error", message: "LMS name cannot be empty." });
    return;
  }
  if (supportEmail !== void 0) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (typeof supportEmail !== "string" || !emailRegex.test(supportEmail.trim())) {
      res.status(400).json({ status: "error", message: "Support email must be a valid email address." });
      return;
    }
  }
  if (sessionTimeout !== void 0) {
    const timeout = Number(sessionTimeout);
    if (isNaN(timeout) || timeout < 5 || timeout > 1440) {
      res.status(400).json({ status: "error", message: "Session timeout must be between 5 and 1440 minutes." });
      return;
    }
  }
  next();
};
export {
  validateNotifications,
  validatePasswordChange,
  validatePlatformSettings,
  validatePreferences,
  validateProfile
};
