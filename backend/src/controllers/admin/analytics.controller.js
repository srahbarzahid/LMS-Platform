import { getDashboardAnalyticsData } from "../../services/admin/analytics.service.js";
import * as AnalyticsService from "../../services/admin/adminAnalytics.service.js";
const getAdminDashboardAnalytics = async (req, res) => {
  try {
    const data = await getDashboardAnalyticsData();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching admin analytics:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
const handleAnalyticsRequest = async (req, res, serviceFunction) => {
  try {
    const filters = req.query;
    const data = await serviceFunction(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
const getAnalyticsSummary = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getSummaryStats);
const getAnalyticsUsers = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getUserAnalytics);
const getAnalyticsRevenue = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getRevenueAnalytics);
const getAnalyticsCourses = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCourseAnalytics);
const getAnalyticsEnrollments = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getEnrollmentAnalytics);
const getAnalyticsCategories = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCategoryAnalytics);
const getAnalyticsInstructors = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getInstructorPerformance);
const getAnalyticsPayments = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getPaymentAnalytics);
const getAnalyticsCertificates = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getCertificateAnalytics);
const getAnalyticsReviews = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getReviewAnalytics);
const getAnalyticsOffers = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getOfferAnalytics);
const getAnalyticsActivity = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getRecentActivity);
const getAnalyticsInsights = (req, res) => handleAnalyticsRequest(req, res, AnalyticsService.getInsights);
const exportAnalytics = async (req, res) => {
  try {
    const summary = await AnalyticsService.getSummaryStats({});
    const instructors = await AnalyticsService.getInstructorPerformance({});
    const courses = await AnalyticsService.getCourseAnalytics({});
    const activity = await AnalyticsService.getRecentActivity({});
    let csv = "=== LMS ANALYTICS REPORT ===\n\n";
    csv += "--- SUMMARY STATS ---\n";
    csv += "Metric,Value,Growth\n";
    csv += `Total Students,${summary.totalStudents.value},${summary.totalStudents.growth}%
`;
    csv += `Total Instructors,${summary.totalInstructors.value},${summary.totalInstructors.growth}%
`;
    csv += `Total Courses,${summary.totalCourses.value},${summary.totalCourses.growth}%
`;
    csv += `Total Revenue,$${summary.totalRevenue.value},${summary.totalRevenue.growth}%
`;
    csv += `Total Enrollments,${summary.totalEnrollments.value},${summary.totalEnrollments.growth}%
`;
    csv += `Certificates Issued,${summary.certificatesIssued.value},${summary.certificatesIssued.growth}%
`;
    csv += "\n--- TOP INSTRUCTORS ---\n";
    csv += "Name,Courses,Students,Revenue,Rating,Status\n";
    instructors.forEach((inst) => {
      csv += `"${inst.name}",${inst.courses},${inst.students},$${inst.revenue},${inst.rating},${inst.status}
`;
    });
    csv += "\n--- TOP SELLING COURSES ---\n";
    csv += "Course Name,Enrollments\n";
    courses.topCourses.forEach((course) => {
      csv += `"${course.name}",${course.enrollments}
`;
    });
    csv += "\n--- RECENT ACTIVITY ---\n";
    csv += "Type,Title,Description,Time\n";
    activity.forEach((act) => {
      csv += `"${act.type}","${act.title}","${act.description}","${act.time}"
`;
    });
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="analytics_full_report.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error("Error exporting analytics:", error);
    res.status(500).send("Error generating export");
  }
};

const getSystemLogs = async (req, res) => {
  try {
    const activity = await AnalyticsService.getRecentActivity({});
    return res.json({ success: true, data: activity });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to fetch system logs" });
  }
};

export {
  exportAnalytics,
  getAdminDashboardAnalytics,
  getAnalyticsActivity,
  getAnalyticsCategories,
  getAnalyticsCertificates,
  getAnalyticsCourses,
  getAnalyticsEnrollments,
  getAnalyticsInsights,
  getAnalyticsInstructors,
  getAnalyticsOffers,
  getAnalyticsPayments,
  getAnalyticsRevenue,
  getAnalyticsReviews,
  getAnalyticsSummary,
  getAnalyticsUsers,
  getSystemLogs
};
