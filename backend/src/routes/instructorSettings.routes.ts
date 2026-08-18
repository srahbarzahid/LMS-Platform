import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';
import {
  validateInstructorProfile,
  validatePasswordChange,
  validateInstructorNotifications,
  validateInstructorPreferences,
  validateDeactivateAccount,
} from '../validators/instructorSettings.validators';
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
  deactivateAccount,
} from '../controllers/instructor/instructorSettings.controller';

const router = Router();

// Protect all instructor settings routes with authentication and role check (INSTRUCTOR or ADMIN)
router.use(authenticate, authorize(['INSTRUCTOR', 'instructor', 'ADMIN', 'admin']));

// Profile Routes
router.get('/profile', getProfile);
router.patch('/profile', upload.single('profilePhoto'), validateInstructorProfile, updateProfile);

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
router.patch('/notifications', validateInstructorNotifications, updateNotifications);

// User UI Preferences Routes
router.get('/preferences', getPreferences);
router.patch('/preferences', validateInstructorPreferences, updatePreferences);

// Account Deactivation (Soft-delete)
router.post('/deactivate', validateDeactivateAccount, deactivateAccount);

export default router;
