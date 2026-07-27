"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLowestPerformers = exports.getTopPerformers = exports.getInsights = exports.getRecentActivity = exports.getActivity = exports.getCategories = exports.getDevices = exports.getLessons = exports.getLearningTime = exports.getRatings = exports.getCertificates = exports.getProjects = exports.getAssignments = exports.getQuizzes = exports.getStudentProgress = exports.getCompletion = exports.getRevenue = exports.getEnrollments = exports.getDashboardData = void 0;
const analytics_service_1 = require("../services/analytics.service");
const handleRequest = async (req, res, serviceMethod) => {
    try {
        const data = await serviceMethod();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const getDashboardData = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getDashboardKPIs);
exports.getDashboardData = getDashboardData;
const getEnrollments = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getEnrollmentAnalytics);
exports.getEnrollments = getEnrollments;
const getRevenue = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getRevenueAnalytics);
exports.getRevenue = getRevenue;
const getCompletion = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getCourseCompletion);
exports.getCompletion = getCompletion;
const getStudentProgress = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getStudentProgress);
exports.getStudentProgress = getStudentProgress;
const getQuizzes = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getQuizAnalytics);
exports.getQuizzes = getQuizzes;
const getAssignments = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getAssignmentAnalytics);
exports.getAssignments = getAssignments;
const getProjects = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getProjectAnalytics);
exports.getProjects = getProjects;
const getCertificates = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getCertificateAnalytics);
exports.getCertificates = getCertificates;
const getRatings = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getRatingsAnalytics);
exports.getRatings = getRatings;
const getLearningTime = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getLearningTime);
exports.getLearningTime = getLearningTime;
const getLessons = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getLessonAnalytics);
exports.getLessons = getLessons;
const getDevices = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getDeviceAnalytics);
exports.getDevices = getDevices;
const getCategories = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getCategoryAnalytics);
exports.getCategories = getCategories;
const getActivity = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getActivityHeatmap);
exports.getActivity = getActivity;
const getRecentActivity = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getRecentActivity);
exports.getRecentActivity = getRecentActivity;
const getInsights = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getCourseInsights);
exports.getInsights = getInsights;
const getTopPerformers = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getTopPerformers);
exports.getTopPerformers = getTopPerformers;
const getLowestPerformers = (req, res) => handleRequest(req, res, analytics_service_1.AnalyticsService.getLowestPerformers);
exports.getLowestPerformers = getLowestPerformers;
