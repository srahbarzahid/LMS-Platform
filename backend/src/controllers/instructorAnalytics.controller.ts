import { Request, Response } from 'express';
import { InstructorAnalyticsService } from '../services/instructorAnalytics.service';

const handleRequest = async (req: Request, res: Response, serviceMethod: () => any) => {
  try {
    const data = await serviceMethod();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getOverview = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getOverview);
export const getStudents = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getStudents);
export const getRevenue = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getRevenue);
export const getCourses = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getCourses);
export const getLearning = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getLearning);
export const getAssessments = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getAssessments);
export const getRatings = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getRatings);
export const getCertificates = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getCertificates);
export const getActivities = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getActivities);
export const getTasks = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getTasks);
export const getReports = (req: Request, res: Response) => handleRequest(req, res, InstructorAnalyticsService.getReports);
