import { Request, Response } from 'express';
import { AnalyticsService } from '../services/analytics.service';

const handleRequest = async (req: Request, res: Response, serviceMethod: () => any) => {
  try {
    const data = await serviceMethod();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getDashboardData = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getDashboardKPIs);
export const getEnrollments = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getEnrollmentAnalytics);
export const getRevenue = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getRevenueAnalytics);
export const getCompletion = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getCourseCompletion);
export const getStudentProgress = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getStudentProgress);
export const getQuizzes = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getQuizAnalytics);
export const getAssignments = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getAssignmentAnalytics);
export const getProjects = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getProjectAnalytics);
export const getCertificates = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getCertificateAnalytics);
export const getRatings = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getRatingsAnalytics);
export const getLearningTime = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getLearningTime);
export const getLessons = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getLessonAnalytics);
export const getDevices = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getDeviceAnalytics);
export const getCategories = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getCategoryAnalytics);
export const getActivity = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getActivityHeatmap);
export const getRecentActivity = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getRecentActivity);
export const getInsights = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getCourseInsights);
export const getTopPerformers = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getTopPerformers);
export const getLowestPerformers = (req: Request, res: Response) => handleRequest(req, res, AnalyticsService.getLowestPerformers);
