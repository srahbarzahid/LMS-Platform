import { Router } from "express";
import { authenticate, authorize } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  validateStudentProfile,
  validatePasswordChange,
  validateStudentNotifications,
  validateStudentPreferences,
  validateDeactivateAccount
} from "../validators/studentSettings.validators.js";
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
} from "../controllers/student/studentSettings.controller.js";
const router = Router();
router.use(authenticate, authorize(["STUDENT", "student", "ADMIN", "admin"]));
router.get("/profile", getProfile);
router.patch("/profile", upload.single("profilePhoto"), validateStudentProfile, updateProfile);
router.post("/change-password", validatePasswordChange, changePassword);
router.post("/resend-verification", resendVerification);
router.post("/confirm-verification", confirmVerification);
router.get("/sessions", getSessions);
router.delete("/sessions/:id", deleteSession);
router.delete("/sessions", deleteAllOtherSessions);
router.get("/notifications", getNotifications);
router.patch("/notifications", validateStudentNotifications, updateNotifications);
router.get("/preferences", getPreferences);
router.patch("/preferences", validateStudentPreferences, updatePreferences);
router.post("/deactivate", validateDeactivateAccount, deactivateAccount);
var stdin_default = router;
export {
  stdin_default as default
};
