import { Router } from "express";
import { userAnnouncementsController } from "../controllers/announcements.user.controller.js";
import { adminWebsiteController } from "../controllers/admin/website.controller.js";
import { createReview, getCourseReviews } from "../controllers/reviewController.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = Router();

router.get("/announcements", userAnnouncementsController.getPublicAnnouncements);
router.get("/content", adminWebsiteController.getWebsiteContent);
router.get("/reviews", getCourseReviews);
router.post("/reviews", authMiddleware, createReview);

export default router;
