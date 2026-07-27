"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("../controllers/admin/users.controller");
const courses_controller_1 = require("../controllers/admin/courses.controller");
const categories_controller_1 = require("../controllers/admin/categories.controller");
const enrollments_controller_1 = require("../controllers/admin/enrollments.controller");
const payments_controller_1 = require("../controllers/admin/payments.controller");
const offers_controller_1 = require("../controllers/admin/offers.controller");
const certificates_controller_1 = require("../controllers/admin/certificates.controller");
const website_controller_1 = require("../controllers/admin/website.controller");
const reviews_controller_1 = require("../controllers/admin/reviews.controller");
const announcements_controller_1 = require("../controllers/admin/announcements.controller");
const analytics_controller_1 = require("../controllers/admin/analytics.controller");
const router = (0, express_1.Router)();
// Protect all admin routes (temporarily disabled for demo)
// router.use(authenticate, authorize(['admin']));
// Dashboard Analytics
router.get('/dashboard', analytics_controller_1.getAdminDashboardAnalytics);
// Advanced Analytics API
router.get('/analytics/summary', analytics_controller_1.getAnalyticsSummary);
router.get('/analytics/users', analytics_controller_1.getAnalyticsUsers);
router.get('/analytics/revenue', analytics_controller_1.getAnalyticsRevenue);
router.get('/analytics/courses', analytics_controller_1.getAnalyticsCourses);
router.get('/analytics/enrollments', analytics_controller_1.getAnalyticsEnrollments);
router.get('/analytics/categories', analytics_controller_1.getAnalyticsCategories);
router.get('/analytics/instructors', analytics_controller_1.getAnalyticsInstructors);
router.get('/analytics/payments', analytics_controller_1.getAnalyticsPayments);
router.get('/analytics/certificates', analytics_controller_1.getAnalyticsCertificates);
router.get('/analytics/reviews', analytics_controller_1.getAnalyticsReviews);
router.get('/analytics/offers', analytics_controller_1.getAnalyticsOffers);
router.get('/analytics/activity', analytics_controller_1.getAnalyticsActivity);
router.get('/analytics/insights', analytics_controller_1.getAnalyticsInsights);
router.get('/analytics/export', analytics_controller_1.exportAnalytics);
// User Management Routes
router.get('/users/students', users_controller_1.adminUsersController.getStudents);
router.get('/users/students/:id', users_controller_1.adminUsersController.getStudentById);
router.get('/users/instructors', users_controller_1.adminUsersController.getInstructors);
router.post('/users/instructors', users_controller_1.adminUsersController.createInstructor);
router.get('/users/instructors/:id', users_controller_1.adminUsersController.getInstructorById);
router.get('/users/admins', users_controller_1.adminUsersController.getAdmins);
router.get('/users/admins/:id', users_controller_1.adminUsersController.getAdminById);
router.delete('/users/:id', users_controller_1.adminUsersController.deleteUser);
router.patch('/users/:id/status', users_controller_1.adminUsersController.updateUserStatus);
router.post('/users/:id/reset-password', users_controller_1.adminUsersController.resetUserPassword);
// Course Management Routes
router.get('/courses/pending', courses_controller_1.adminCoursesController.getPendingCourses);
router.get('/courses', courses_controller_1.adminCoursesController.getCourses);
router.get('/courses/:id', courses_controller_1.adminCoursesController.getCourseById);
router.patch('/courses/:id/status', courses_controller_1.adminCoursesController.updateCourseStatus);
router.patch('/courses/:id/featured', courses_controller_1.adminCoursesController.toggleCourseFeatured);
router.patch('/courses/:id/template', courses_controller_1.adminCoursesController.updateCourseTemplate);
router.delete('/courses/:id', courses_controller_1.adminCoursesController.deleteCourse);
// Category Management Routes
router.get('/categories', categories_controller_1.adminCategoriesController.getCategories);
router.get('/categories/:id', categories_controller_1.adminCategoriesController.getCategoryById);
router.post('/categories', categories_controller_1.adminCategoriesController.createCategory);
router.put('/categories/:id', categories_controller_1.adminCategoriesController.updateCategory);
router.patch('/categories/:id/featured', categories_controller_1.adminCategoriesController.toggleFeatured);
router.delete('/categories/:id', categories_controller_1.adminCategoriesController.deleteCategory);
// Enrollment Management Routes
router.get('/enrollments', enrollments_controller_1.adminEnrollmentsController.getEnrollments);
router.get('/enrollments/:id', enrollments_controller_1.adminEnrollmentsController.getEnrollmentDetails);
router.get('/enrollments/:id/activity', enrollments_controller_1.adminEnrollmentsController.getEnrollmentActivity);
router.get('/enrollments/:id/progress', enrollments_controller_1.adminEnrollmentsController.getEnrollmentProgressBreakdown);
// Payment Management Routes
router.get('/payments/summary', payments_controller_1.adminPaymentsController.getPaymentsSummary);
router.get('/payments/revenue', payments_controller_1.adminPaymentsController.getPaymentsRevenue);
router.get('/payments', payments_controller_1.adminPaymentsController.getPayments);
router.get('/payments/:id', payments_controller_1.adminPaymentsController.getPaymentDetails);
router.get('/payments/:id/invoice', payments_controller_1.adminPaymentsController.getPaymentInvoice);
// Offers & Coupons Routes
router.get('/offers', offers_controller_1.adminOffersController.getOffers);
router.get('/offers/:id', offers_controller_1.adminOffersController.getOfferById);
router.post('/offers', offers_controller_1.adminOffersController.createOffer);
router.put('/offers/:id', offers_controller_1.adminOffersController.updateOffer);
router.delete('/offers/:id', offers_controller_1.adminOffersController.deleteOffer);
router.put('/offers/:id/activate', offers_controller_1.adminOffersController.toggleStatus);
// Certificate Templates Routes
router.get('/certificate/templates', certificates_controller_1.adminCertificatesController.getTemplates);
router.get('/certificate/templates/:id', certificates_controller_1.adminCertificatesController.getTemplateById);
router.post('/certificate/templates', certificates_controller_1.adminCertificatesController.createTemplate);
router.put('/certificate/templates/:id', certificates_controller_1.adminCertificatesController.updateTemplate);
router.delete('/certificate/templates/:id', certificates_controller_1.adminCertificatesController.deleteTemplate);
router.put('/certificate/templates/:id/default', certificates_controller_1.adminCertificatesController.setDefaultTemplate);
// Issued Certificates Routes
router.get('/certificates', certificates_controller_1.adminCertificatesController.getIssuedCertificates);
router.get('/certificates/:id', certificates_controller_1.adminCertificatesController.getIssuedCertificateById);
router.put('/certificates/:id/revoke', certificates_controller_1.adminCertificatesController.revokeCertificate);
router.get('/certificates/:id/download', certificates_controller_1.adminCertificatesController.downloadCertificate);
// Verification Route (Admin Dashboard)
router.get('/certificate/verify/:certificateId', certificates_controller_1.adminCertificatesController.verifyCertificate);
// Website Content Route
router.get('/content', website_controller_1.adminWebsiteController.getWebsiteContent);
router.put('/content', website_controller_1.adminWebsiteController.updateWebsiteContent);
// Reviews Management Routes
router.get('/reviews/summary', reviews_controller_1.adminReviewsController.getSummary);
router.get('/reviews', reviews_controller_1.adminReviewsController.getAllReviews);
router.get('/reviews/:reviewId', reviews_controller_1.adminReviewsController.getReviewById);
router.put('/reviews/:reviewId/hide', reviews_controller_1.adminReviewsController.hideReview);
router.put('/reviews/:reviewId/unhide', reviews_controller_1.adminReviewsController.unhideReview);
router.delete('/reviews/:reviewId', reviews_controller_1.adminReviewsController.deleteReview);
// Announcements Management Routes
router.get('/announcements/summary', announcements_controller_1.adminAnnouncementsController.getSummary);
router.get('/announcements', announcements_controller_1.adminAnnouncementsController.getAllAnnouncements);
router.post('/announcements', announcements_controller_1.adminAnnouncementsController.createAnnouncement);
router.get('/announcements/:announcementId', announcements_controller_1.adminAnnouncementsController.getAnnouncementById);
router.put('/announcements/:announcementId', announcements_controller_1.adminAnnouncementsController.updateAnnouncement);
router.delete('/announcements/:announcementId', announcements_controller_1.adminAnnouncementsController.deleteAnnouncement);
router.put('/announcements/:announcementId/publish', announcements_controller_1.adminAnnouncementsController.togglePublishStatus);
exports.default = router;
