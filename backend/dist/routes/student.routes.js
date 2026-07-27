"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const notificationController = __importStar(require("../controllers/notification.controller"));
const profileController = __importStar(require("../controllers/profile.controller"));
const settingsController = __importStar(require("../controllers/settings.controller"));
const offers_controller_1 = require("../controllers/student/offers.controller");
const announcements_user_controller_1 = require("../controllers/announcements.user.controller");
const router = express_1.default.Router();
// Apply auth middleware to all student routes
router.use(auth_1.authMiddleware);
// --- NOTIFICATIONS ---
router.get('/notifications', notificationController.getNotifications);
router.put('/notifications/mark-all-read', notificationController.markAllAsRead);
router.put('/notifications/:id/read', notificationController.markAsRead);
router.delete('/notifications/:id', notificationController.deleteNotification);
// --- PROFILE ---
router.get('/profile', profileController.getProfile);
router.put('/profile', profileController.updateProfile);
router.post('/profile/avatar', uploadMiddleware_1.upload.single('avatar'), profileController.updateAvatar);
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
router.get('/offers/automatic', offers_controller_1.studentOffersController.getAutomaticOffers);
router.post('/offers/validate', offers_controller_1.studentOffersController.validateCoupon);
// --- ANNOUNCEMENTS ---
router.get('/announcements', announcements_user_controller_1.userAnnouncementsController.getStudentAnnouncements);
exports.default = router;
