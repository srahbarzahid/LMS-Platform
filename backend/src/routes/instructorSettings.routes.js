import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  validateInstructorProfile,
  validatePasswordChange,
  validateInstructorNotifications,
  validateInstructorPreferences,
  validateDeactivateAccount
} from "../validators/instructorSettings.validators.js";
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
  deactivateAccount
} from "../controllers/instructor/instructorSettings.controller.js";
const router = Router();
router.use(authenticate, authorize(["INSTRUCTOR", "instructor", "ADMIN", "admin"]));
router.get("/profile", getProfile);
router.patch("/profile", upload.single("profilePhoto"), validateInstructorProfile, updateProfile);
router.post("/change-password", validatePasswordChange, changePassword);
router.post("/resend-verification", resendVerification);
router.post("/confirm-verification", confirmVerification);
router.get("/sessions", getSessions);
router.delete("/sessions/:id", deleteSession);
router.delete("/sessions", deleteAllOtherSessions);
router.get("/notifications", getNotifications);
router.patch("/notifications", validateInstructorNotifications, updateNotifications);
router.get("/preferences", getPreferences);
router.patch("/preferences", validateInstructorPreferences, updatePreferences);
router.post("/deactivate", validateDeactivateAccount, deactivateAccount);
var stdin_default = router;
export {
  stdin_default as default
};
