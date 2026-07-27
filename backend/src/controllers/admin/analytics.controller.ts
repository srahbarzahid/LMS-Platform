import { Request, Response } from 'express';
import { getDashboardAnalyticsData } from '../../services/admin/analytics.service';
import * as AnalyticsService from '../../services/admin/adminAnalytics.service';

export const getAdminDashboardAnalytics = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getDashboardAnalyticsData();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching admin analytics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const handleAnalyticsRequest = async (req: Request, res: Response, serviceFunction: Function) => {
  try {
    const filters = req.query;
    const data = await serviceFunction(filters);
    res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getAnalyticsSummary = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getSummaryStats);
export const getAnalyticsUsers = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getUserAnalytics);
export const getAnalyticsRevenue = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getRevenueAnalytics);
export const getAnalyticsCourses = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getCourseAnalytics);
export const getAnalyticsEnrollments = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getEnrollmentAnalytics);
export const getAnalyticsCategories = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getCategoryAnalytics);
export const getAnalyticsInstructors = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getInstructorPerformance);
export const getAnalyticsPayments = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getPaymentAnalytics);
export const getAnalyticsCertificates = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getCertificateAnalytics);
export const getAnalyticsReviews = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getReviewAnalytics);
export const getAnalyticsOffers = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getOfferAnalytics);
export const getAnalyticsActivity = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getRecentActivity);
export const getAnalyticsInsights = (req: Request, res: Response) => handleAnalyticsRequest(req, res, AnalyticsService.getInsights);

export const exportAnalytics = async (req: Request, res: Response) => {
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
    instructors.forEach((inst: any) => {
      csv += `"${inst.name}",${inst.courses},${inst.students},$${inst.revenue},${inst.rating},${inst.status}\n`;
    });

    // Courses Table
    csv += '\n--- TOP SELLING COURSES ---\n';
    csv += 'Course Name,Enrollments\n';
    courses.topCourses.forEach((course: any) => {
      csv += `"${course.name}",${course.enrollments}\n`;
    });

    // Activity Table
    csv += '\n--- RECENT ACTIVITY ---\n';
    csv += 'Type,Title,Description,Time\n';
    activity.forEach((act: any) => {
      csv += `"${act.type}","${act.title}","${act.description}","${act.time}"\n`;
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="analytics_full_report.csv"');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting analytics:', error);
    res.status(500).send('Error generating export');
  }
};
