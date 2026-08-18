import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';
import {
  validateProfile,
  validatePasswordChange,
  validateNotifications,
  validatePreferences,
  validatePlatformSettings,
} from '../validators/settings.validators';
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
  updatePlatformSettings,
} from '../controllers/admin/settings.controller';

const router = Router();

// Apply authenticate middleware to all settings routes
router.use(authenticate);

// Profile Routes
router.get('/profile', getProfile);
router.patch('/profile', upload.single('profilePhoto'), validateProfile, updateProfile);

// Password & Verification Routes
router.post('/change-password', validatePasswordChange, changePassword);
router.post('/resend-verification', resendVerification);
router.post('/confirm-verification', confirmVerification);

// Security & Active Sessions Routes
router.get('/sessions', getSessions);
router.delete('/sessions/:id', deleteSession);
router.delete('/sessions', deleteAllOtherSessions);

// Notification Preferences Routes
router.get('/notifications', getNotifications);
router.patch('/notifications', validateNotifications, updateNotifications);

// User UI Preferences Routes
router.get('/preferences', getPreferences);
router.patch('/preferences', validatePreferences, updatePreferences);

// General Platform Settings Routes (Admin Role Guarded)
router.get('/platform', authorize(['ADMIN', 'admin']), getPlatformSettings);
router.patch('/platform', authorize(['ADMIN', 'admin']), upload.single('logo'), validatePlatformSettings, updatePlatformSettings);

export default router;
