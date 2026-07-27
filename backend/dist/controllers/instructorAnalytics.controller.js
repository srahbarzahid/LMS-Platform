"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.getTasks = exports.getActivities = exports.getCertificates = exports.getRatings = exports.getAssessments = exports.getLearning = exports.getCourses = exports.getRevenue = exports.getStudents = exports.getOverview = void 0;
const instructorAnalytics_service_1 = require("../services/instructorAnalytics.service");
const handleRequest = async (req, res, serviceMethod) => {
    try {
        const data = await serviceMethod();
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
const getOverview = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getOverview);
exports.getOverview = getOverview;
const getStudents = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getStudents);
exports.getStudents = getStudents;
const getRevenue = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getRevenue);
exports.getRevenue = getRevenue;
const getCourses = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getCourses);
exports.getCourses = getCourses;
const getLearning = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getLearning);
exports.getLearning = getLearning;
const getAssessments = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getAssessments);
exports.getAssessments = getAssessments;
const getRatings = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getRatings);
exports.getRatings = getRatings;
const getCertificates = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getCertificates);
exports.getCertificates = getCertificates;
const getActivities = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getActivities);
exports.getActivities = getActivities;
const getTasks = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getTasks);
exports.getTasks = getTasks;
const getReports = (req, res) => handleRequest(req, res, instructorAnalytics_service_1.InstructorAnalyticsService.getReports);
exports.getReports = getReports;
