import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';

import * as notificationController from '../controllers/notification.controller';
import * as profileController from '../controllers/profile.controller';
import * as settingsController from '../controllers/settings.controller';
import { studentOffersController } from '../controllers/student/offers.controller';
import { userAnnouncementsController } from '../controllers/announcements.user.controller';

const router = express.Router();

// Apply auth middleware to all student routes
router.use(authMiddleware);

// --- NOTIFICATIONS ---
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/mark-all-read', notificationController.markAllAsRead);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);

// --- PROFILE ---
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.post('/profile/avatar', upload.single('avatar'), profileController.updateAvatar);

// --- SETTINGS ---
router.get('/settings', settingsController.getSettings);
router.put('/settings', settingsController.updateSettings);
router.put('/settings/password', settingsController.updatePassword);
router.put('/settings/email', settingsController.updateEmail);
router.put('/settings/phone', settingsController.updatePhone);
router.post('/settings/logout-all', settingsController.logoutAllDevices);
router.post('/settings/export-data', settingsController.exportDataRequest);
router.post('/settings/delete-request', settingsController.deleteAccountRequest);

// --- OFFERS & COUPONS ---
router.get('/offers/automatic', studentOffersController.getAutomaticOffers);
router.post('/offers/validate', studentOffersController.validateCoupon);

// --- ANNOUNCEMENTS ---
router.get('/announcements', userAnnouncementsController.getStudentAnnouncements);

export default router;
