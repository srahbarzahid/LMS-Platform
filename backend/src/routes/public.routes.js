import { Router } from "express";
import { userAnnouncementsController } from "../controllers/announcements.user.controller.js";
import { adminWebsiteController } from "../controllers/admin/website.controller.js";

const router = Router();

router.get("/announcements", userAnnouncementsController.getPublicAnnouncements);
router.get("/content", adminWebsiteController.getWebsiteContent);

export default router;
