import { AnalyticsService } from "../services/analytics.service.js";
const handleRequest = async (req, res, serviceMethod) => {
  try {
    const data = await serviceMethod();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getDashboardData = (req, res) => handleRequest(req, res, AnalyticsService.getDashboardKPIs);
const getEnrollments = (req, res) => handleRequest(req, res, AnalyticsService.getEnrollmentAnalytics);
const getRevenue = (req, res) => handleRequest(req, res, AnalyticsService.getRevenueAnalytics);
const getCompletion = (req, res) => handleRequest(req, res, AnalyticsService.getCourseCompletion);
const getStudentProgress = (req, res) => handleRequest(req, res, AnalyticsService.getStudentProgress);
const getQuizzes = (req, res) => handleRequest(req, res, AnalyticsService.getQuizAnalytics);
const getAssignments = (req, res) => handleRequest(req, res, AnalyticsService.getAssignmentAnalytics);
const getProjects = (req, res) => handleRequest(req, res, AnalyticsService.getProjectAnalytics);
const getCertificates = (req, res) => handleRequest(req, res, AnalyticsService.getCertificateAnalytics);
const getRatings = (req, res) => handleRequest(req, res, AnalyticsService.getRatingsAnalytics);
const getLearningTime = (req, res) => handleRequest(req, res, AnalyticsService.getLearningTime);
const getLessons = (req, res) => handleRequest(req, res, AnalyticsService.getLessonAnalytics);
const getDevices = (req, res) => handleRequest(req, res, AnalyticsService.getDeviceAnalytics);
const getCategories = (req, res) => handleRequest(req, res, AnalyticsService.getCategoryAnalytics);
const getActivity = (req, res) => handleRequest(req, res, AnalyticsService.getActivityHeatmap);
const getRecentActivity = (req, res) => handleRequest(req, res, AnalyticsService.getRecentActivity);
const getInsights = (req, res) => handleRequest(req, res, AnalyticsService.getCourseInsights);
const getTopPerformers = (req, res) => handleRequest(req, res, AnalyticsService.getTopPerformers);
const getLowestPerformers = (req, res) => handleRequest(req, res, AnalyticsService.getLowestPerformers);
export {
  getActivity,
  getAssignments,
  getCategories,
  getCertificates,
  getCompletion,
  getDashboardData,
  getDevices,
  getEnrollments,
  getInsights,
  getLearningTime,
  getLessons,
  getLowestPerformers,
  getProjects,
  getQuizzes,
  getRatings,
  getRecentActivity,
  getRevenue,
  getStudentProgress,
  getTopPerformers
};
