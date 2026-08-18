import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  validateProfile,
  validatePasswordChange,
  validateNotifications,
  validatePreferences,
  validatePlatformSettings
} from "../validators/settings.validators.js";
import {
  getProfile,
  updateProfile,
  changePassword,
  resendVerification,
  confirmVerification,
  getSessions,
  deleteSession,
  deleteAllOtherSessions,
  getNotifications,
  updateNotifications,
  getPreferences,
  updatePreferences,
  getPlatformSettings,
  updatePlatformSettings
} from "../controllers/admin/settings.controller.js";
const router = Router();
router.use(authenticate);
router.get("/profile", getProfile);
router.patch("/profile", upload.single("profilePhoto"), validateProfile, updateProfile);
router.post("/change-password", validatePasswordChange, changePassword);
router.post("/resend-verification", resendVerification);
router.post("/confirm-verification", confirmVerification);
router.get("/sessions", getSessions);
router.delete("/sessions/:id", deleteSession);
router.delete("/sessions", deleteAllOtherSessions);
router.get("/notifications", getNotifications);
router.patch("/notifications", validateNotifications, updateNotifications);
router.get("/preferences", getPreferences);
router.patch("/preferences", validatePreferences, updatePreferences);
router.get("/platform", authorize(["ADMIN", "admin"]), getPlatformSettings);
router.patch("/platform", authorize(["ADMIN", "admin"]), upload.single("logo"), validatePlatformSettings, updatePlatformSettings);
var stdin_default = router;
export {
  stdin_default as default
};
