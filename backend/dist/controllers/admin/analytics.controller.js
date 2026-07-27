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
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportAnalytics = exports.getAnalyticsInsights = exports.getAnalyticsActivity = exports.getAnalyticsOffers = exports.getAnalyticsReviews = exports.getAnalyticsCertificates = exports.getAnalyticsPayments = exports.getAnalyticsInstructors = exports.getAnalyticsCategories = exports.getAnalyticsEnrollments = exports.getAnalyticsCourses = exports.getAnalyticsRevenue = exports.getAnalyticsUsers = exports.getAnalyticsSummary = exports.getAdminDashboardAnalytics = void 0;
const analytics_service_1 = require("../../services/admin/analytics.service");
const AnalyticsService = __importStar(require("../../services/admin/adminAnalytics.service"));
const getAdminDashboardAnalytics = async (req, res) => {
    try {
        const data = await (0, analytics_service_1.getDashboardAnalyticsData)();
        res.status(200).json(data);
    }
    catch (error) {
        console.error('Error fetching admin analytics:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
exports.getAdminDashboardAnalytics = getAdminDashboardAnalytics;
const handleAnalyticsRequest = async (req, res, serviceFunction) => {
    try {
        const filters = req.query;
        const data = await serviceFunction(filters);
        res.status(200).json({ success: true, data });
    }
    catch (error) {
        console.error('Error fetching analytics:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};
const getAnalyticsSummary = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getSummaryStats);
exports.getAnalyticsSummary = getAnalyticsSummary;
const getAnalyticsUsers = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getUserAnalytics);
exports.getAnalyticsUsers = getAnalyticsUsers;
const getAnalyticsRevenue = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getRevenueAnalytics);
exports.getAnalyticsRevenue = getAnalyticsRevenue;
const getAnalyticsCourses = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCourseAnalytics);
exports.getAnalyticsCourses = getAnalyticsCourses;
const getAnalyticsEnrollments = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getEnrollmentAnalytics);
exports.getAnalyticsEnrollments = getAnalyticsEnrollments;
const getAnalyticsCategories = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCategoryAnalytics);
exports.getAnalyticsCategories = getAnalyticsCategories;
const getAnalyticsInstructors = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getInstructorPerformance);
exports.getAnalyticsInstructors = getAnalyticsInstructors;
const getAnalyticsPayments = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getPaymentAnalytics);
exports.getAnalyticsPayments = getAnalyticsPayments;
const getAnalyticsCertificates = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCertificateAnalytics);
exports.getAnalyticsCertificates = getAnalyticsCertificates;
const getAnalyticsReviews = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getReviewAnalytics);
exports.getAnalyticsReviews = getAnalyticsReviews;
const getAnalyticsOffers = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getOfferAnalytics);
exports.getAnalyticsOffers = getAnalyticsOffers;
const getAnalyticsActivity = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getRecentActivity);
exports.getAnalyticsActivity = getAnalyticsActivity;
const getAnalyticsInsights = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getInsights);
exports.getAnalyticsInsights = getAnalyticsInsights;
const exportAnalytics = async (req, res) => {
    try {
        const summary = await AnalyticsService.getSummaryStats({});
        const instructors = await AnalyticsService.getInstructorPerformance({});
        const courses = await AnalyticsService.getCourseAnalytics({});
        const activity = await AnalyticsService.getRecentActivity({});
        let csv = '=== LMS ANALYTICS REPORT ===\n\n';
        // Summary Table
        csv += '--- SUMMARY STATS ---\n';
        csv += 'Metric,Value,Growth\n';
        csv += `Total Students,${summary.totalStudents.value},${summary.totalStudents.growth}%\n`;
        csv += `Total Instructors,${summary.totalInstructors.value},${summary.totalInstructors.growth}%\n`;
        csv += `Total Courses,${summary.totalCourses.value},${summary.totalCourses.growth}%\n`;
        csv += `Total Revenue,$${summary.totalRevenue.value},${summary.totalRevenue.growth}%\n`;
        csv += `Total Enrollments,${summary.totalEnrollments.value},${summary.totalEnrollments.growth}%\n`;
        csv += `Certificates Issued,${summary.certificatesIssued.value},${summary.certificatesIssued.growth}%\n`;
        // Instructors Table
        csv += '\n--- TOP INSTRUCTORS ---\n';
        csv += 'Name,Courses,Students,Revenue,Rating,Status\n';
        instructors.forEach((inst) => {
            csv += `"${inst.name}",${inst.courses},${inst.students},$${inst.revenue},${inst.rating},${inst.status}\n`;
        });
        // Courses Table
        csv += '\n--- TOP SELLING COURSES ---\n';
        csv += 'Course Name,Enrollments\n';
        courses.topCourses.forEach((course) => {
            csv += `"${course.name}",${course.enrollments}\n`;
        });
        // Activity Table
        csv += '\n--- RECENT ACTIVITY ---\n';
        csv += 'Type,Title,Description,Time\n';
        activity.forEach((act) => {
            csv += `"${act.type}","${act.title}","${act.description}","${act.time}"\n`;
        });
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="analytics_full_report.csv"');
        res.status(200).send(csv);
    }
    catch (error) {
        console.error('Error exporting analytics:', error);
        res.status(500).send('Error generating export');
    }
};
exports.exportAnalytics = exportAnalytics;
