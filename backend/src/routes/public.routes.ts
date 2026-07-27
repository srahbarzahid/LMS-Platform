import { Router } from 'express';
import { userAnnouncementsController } from '../controllers/announcements.user.controller';

const router = Router();

// --- Announcements ---
router.get('/announcements', userAnnouncementsController.getPublicAnnouncements);

export default router;
