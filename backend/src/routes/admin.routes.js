import { Router } from "express";
import { adminUsersController } from "../controllers/admin/users.controller.js";
import { adminCoursesController } from "../controllers/admin/courses.controller.js";
import { adminCategoriesController } from "../controllers/admin/categories.controller.js";
import { adminEnrollmentsController } from "../controllers/admin/enrollments.controller.js";
import { adminPaymentsController } from "../controllers/admin/payments.controller.js";
import { adminOffersController } from "../controllers/admin/offers.controller.js";
import { adminCertificatesController } from "../controllers/admin/certificates.controller.js";
import { adminWebsiteController } from "../controllers/admin/website.controller.js";
import { adminReviewsController } from "../controllers/admin/reviews.controller.js";
import { adminAnnouncementsController } from "../controllers/admin/announcements.controller.js";
import {
  getAdminDashboardAnalytics,
  getAnalyticsSummary,
  getAnalyticsUsers,
  getAnalyticsRevenue,
  getAnalyticsCourses,
  getAnalyticsEnrollments,
  getAnalyticsCategories,
  getAnalyticsInstructors,
  getAnalyticsPayments,
  getAnalyticsCertificates,
  getAnalyticsReviews,
  getAnalyticsOffers,
  getAnalyticsActivity,
  getAnalyticsInsights,
  exportAnalytics,
  getSystemLogs
} from "../controllers/admin/analytics.controller.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();
router.use(authenticate, authorize(["ADMIN"]));
router.get("/dashboard", getAdminDashboardAnalytics);
router.get("/analytics/summary", getAnalyticsSummary);
router.get("/analytics/users", getAnalyticsUsers);
router.get("/analytics/revenue", getAnalyticsRevenue);
router.get("/analytics/courses", getAnalyticsCourses);
router.get("/analytics/enrollments", getAnalyticsEnrollments);
router.get("/analytics/categories", getAnalyticsCategories);
router.get("/analytics/instructors", getAnalyticsInstructors);
router.get("/analytics/payments", getAnalyticsPayments);
router.get("/analytics/certificates", getAnalyticsCertificates);
router.get("/analytics/reviews", getAnalyticsReviews);
router.get("/analytics/offers", getAnalyticsOffers);
router.get("/analytics/activity", getAnalyticsActivity);
router.get("/analytics/insights", getAnalyticsInsights);
router.get("/analytics/export", exportAnalytics);
router.get("/users/students", adminUsersController.getStudents);
router.post("/users/students", adminUsersController.createStudent);
router.get("/users/students/:id", adminUsersController.getStudentById);
router.get("/users/instructors", adminUsersController.getInstructors);
router.post("/users/instructors", adminUsersController.createInstructor);
router.get("/users/instructors/:id", adminUsersController.getInstructorById);
router.get("/users/admins", adminUsersController.getAdmins);
router.get("/users/admins/:id", adminUsersController.getAdminById);
router.get("/users/:id", adminUsersController.getUserById);
router.delete("/users/:id", adminUsersController.deleteUser);
router.patch("/users/:id/status", adminUsersController.updateUserStatus);
router.post("/users/:id/reset-password", adminUsersController.resetUserPassword);
router.get("/courses/pending", adminCoursesController.getPendingCourses);
router.get("/courses", adminCoursesController.getCourses);
router.get("/courses/:id", adminCoursesController.getCourseById);
router.patch("/courses/:id/status", adminCoursesController.updateCourseStatus);
router.patch("/courses/:id/featured", adminCoursesController.toggleCourseFeatured);
router.patch("/courses/:id/template", adminCoursesController.updateCourseTemplate);
router.delete("/courses/:id", adminCoursesController.deleteCourse);
router.get("/categories", adminCategoriesController.getCategories);
router.get("/categories/:id", adminCategoriesController.getCategoryById);
router.post("/categories", adminCategoriesController.createCategory);
router.put("/categories/:id", adminCategoriesController.updateCategory);
router.patch("/categories/:id/featured", adminCategoriesController.toggleFeatured);
router.delete("/categories/:id", adminCategoriesController.deleteCategory);
router.get("/enrollments", adminEnrollmentsController.getEnrollments);
router.get("/enrollments/:id", adminEnrollmentsController.getEnrollmentDetails);
router.get("/enrollments/:id/activity", adminEnrollmentsController.getEnrollmentActivity);
router.get("/enrollments/:id/progress", adminEnrollmentsController.getEnrollmentProgressBreakdown);
router.get("/payments/summary", adminPaymentsController.getPaymentsSummary);
router.get("/payments/revenue", adminPaymentsController.getPaymentsRevenue);
router.get("/payments", adminPaymentsController.getPayments);
router.get("/payments/:id", adminPaymentsController.getPaymentDetails);
router.get("/payments/:id/invoice", adminPaymentsController.getPaymentInvoice);
router.get("/offers", adminOffersController.getOffers);
router.get("/offers/:id", adminOffersController.getOfferById);
router.post("/offers", adminOffersController.createOffer);
router.put("/offers/:id", adminOffersController.updateOffer);
router.delete("/offers/:id", adminOffersController.deleteOffer);
router.put("/offers/:id/activate", adminOffersController.toggleStatus);
router.get("/certificate/templates", adminCertificatesController.getTemplates);
router.get("/certificate/templates/:id", adminCertificatesController.getTemplateById);
router.post("/certificate/templates", adminCertificatesController.createTemplate);
router.put("/certificate/templates/:id", adminCertificatesController.updateTemplate);
router.delete("/certificate/templates/:id", adminCertificatesController.deleteTemplate);
router.put("/certificate/templates/:id/default", adminCertificatesController.setDefaultTemplate);
router.get("/certificates", adminCertificatesController.getIssuedCertificates);
router.post("/certificates/issue", adminCertificatesController.issueCertificate);
router.get("/certificates/:id", adminCertificatesController.getIssuedCertificateById);
router.put("/certificates/:id/revoke", adminCertificatesController.revokeCertificate);
router.get("/certificates/:id/download", adminCertificatesController.downloadCertificate);
router.get("/certificate/verify/:certificateId", adminCertificatesController.verifyCertificate);
router.get("/content", adminWebsiteController.getWebsiteContent);
router.put("/content", adminWebsiteController.updateWebsiteContent);
router.get("/reviews/summary", adminReviewsController.getSummary);
router.get("/reviews", adminReviewsController.getAllReviews);
router.get("/reviews/:reviewId", adminReviewsController.getReviewById);
router.put("/reviews/:reviewId/hide", adminReviewsController.hideReview);
router.put("/reviews/:reviewId/unhide", adminReviewsController.unhideReview);
router.delete("/reviews/:reviewId", adminReviewsController.deleteReview);
router.get("/announcements/summary", adminAnnouncementsController.getSummary);
router.get("/announcements", adminAnnouncementsController.getAllAnnouncements);
router.post("/announcements", adminAnnouncementsController.createAnnouncement);
router.get("/announcements/:announcementId", adminAnnouncementsController.getAnnouncementById);
router.put("/announcements/:announcementId", adminAnnouncementsController.updateAnnouncement);
router.delete("/announcements/:announcementId", adminAnnouncementsController.deleteAnnouncement);
router.put("/announcements/:announcementId/publish", adminAnnouncementsController.togglePublishStatus);
router.get("/system-logs", getSystemLogs);
var stdin_default = router;
export {
  stdin_default as default
};
