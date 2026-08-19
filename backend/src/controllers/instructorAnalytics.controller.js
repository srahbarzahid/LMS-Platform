import { InstructorAnalyticsService } from "../services/instructorAnalytics.service.js";

const getInstructorId = (req) => req.user?.userId || req.user?.id;

const handleRequest = async (req, res, serviceMethod) => {
  try {
    const data = await serviceMethod(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    console.error("Instructor analytics error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getOverview = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getOverview);
const getStudents = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getStudents);
const getRevenue = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getRevenue);
const getCourses = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getCourses);
const getLearning = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getLearning);
const getAssessments = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getAssessments);
const getRatings = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getRatings);
const getCertificates = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getCertificates);
const getActivities = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getActivities);
const getTasks = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getTasks);
const getReports = (req, res) => handleRequest(req, res, InstructorAnalyticsService.getReports);
export {
  getActivities,
  getAssessments,
  getCertificates,
  getCourses,
  getLearning,
  getOverview,
  getRatings,
  getReports,
  getRevenue,
  getStudents,
  getTasks
};
