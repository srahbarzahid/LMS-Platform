import { Request, Response } from 'express';
import * as StudentService from '../services/student.service';

export const getStudents = async (req: Request, res: Response) => {
  const students = await StudentService.getStudentsMock('instructor_1');
  res.json(students);
};

export const getStudentDetails = async (req: Request, res: Response) => {
  const details = await StudentService.getStudentDetailsMock(req.params.studentId as string);
  res.json(details);
};

export const getStudentProgress = async (req: Request, res: Response) => {
  const progress = await StudentService.getStudentProgressMock(req.params.studentId as string);
  res.json(progress);
};

export const getStudentSubmissions = async (req: Request, res: Response) => {
  // Mock logic - return empty or generic array for now as frontend has static mocks
  res.json({ assignments: [], projects: [], quizzes: [] });
};

export const getStudentActivity = async (req: Request, res: Response) => {
  const activity = await StudentService.getStudentActivityMock(req.params.studentId as string);
  res.json(activity);
};

export const getStudentReviews = async (req: Request, res: Response) => {
  const reviews = await StudentService.getStudentReviewsMock(req.params.studentId as string);
  res.json(reviews);
};
