import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import * as notificationController from "../controllers/notification.controller.js";
import * as profileController from "../controllers/profile.controller.js";
import * as settingsController from "../controllers/settings.controller.js";
import { studentOffersController } from "../controllers/student/offers.controller.js";
import { userAnnouncementsController } from "../controllers/announcements.user.controller.js";
import * as studentController from "../controllers/student.controller.js";

const router = express.Router();
router.use(authMiddleware);

// Student Dashboard & Learning Data
router.get("/overview", studentController.getStudentOverview);
router.get("/my-courses", studentController.getStudentMyCourses);
router.get("/assignments-list", studentController.getStudentAssignments);
router.get("/quizzes-list", studentController.getStudentQuizzes);
router.get("/projects-list", studentController.getStudentProjects);
router.get("/certificates-list", studentController.getStudentCertificates);

// Notifications & Profile
router.get("/notifications", notificationController.getNotifications);
router.put("/notifications/mark-all-read", notificationController.markAllAsRead);
router.put("/notifications/:id/read", notificationController.markAsRead);
router.delete("/notifications/:id", notificationController.deleteNotification);
router.get("/profile", profileController.getProfile);
router.put("/profile", profileController.updateProfile);
router.post("/profile/avatar", upload.single("avatar"), profileController.updateAvatar);

// Settings
router.get("/settings", settingsController.getSettings);
router.put("/settings", settingsController.updateSettings);
router.put("/settings/password", settingsController.updatePassword);
router.put("/settings/email", settingsController.updateEmail);
router.put("/settings/phone", settingsController.updatePhone);
router.post("/settings/logout-all", settingsController.logoutAllDevices);
router.post("/settings/export-data", settingsController.exportDataRequest);
router.post("/settings/delete-request", settingsController.deleteAccountRequest);

// Offers & Announcements
router.get("/offers/automatic", studentOffersController.getAutomaticOffers);
router.post("/offers/validate", studentOffersController.validateCoupon);
router.get("/announcements", userAnnouncementsController.getStudentAnnouncements);

export default router;
