"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const announcements_user_controller_1 = require("../controllers/announcements.user.controller");
const router = (0, express_1.Router)();
// --- Announcements ---
router.get('/announcements', announcements_user_controller_1.userAnnouncementsController.getPublicAnnouncements);
exports.default = router;
