import { Request, Response } from 'express';
import * as SubmissionService from '../services/submission.service';

export const getAssignment = async (req: Request, res: Response) => {
  const data = await SubmissionService.getAssignmentMock(req.params.submissionId as string);
  res.json(data);
};

export const gradeAssignment = async (req: Request, res: Response) => {
  const { marks, feedback } = req.body;
  const result = await SubmissionService.gradeAssignmentMock(req.params.submissionId as string, marks, feedback);
  res.json(result);
};

export const requestAssignmentResubmission = async (req: Request, res: Response) => {
  const result = await SubmissionService.requestResubmissionAssignmentMock(req.params.submissionId as string);
  res.json(result);
};

export const getProject = async (req: Request, res: Response) => {
  const data = await SubmissionService.getProjectMock(req.params.submissionId as string);
  res.json(data);
};

export const gradeProject = async (req: Request, res: Response) => {
  const { marks, feedback } = req.body;
  const result = await SubmissionService.gradeProjectMock(req.params.submissionId as string, marks, feedback);
  res.json(result);
};

export const requestProjectResubmission = async (req: Request, res: Response) => {
  const result = await SubmissionService.requestResubmissionProjectMock(req.params.submissionId as string);
  res.json(result);
};

export const getQuizResult = async (req: Request, res: Response) => {
  const data = await SubmissionService.getQuizResultMock(req.params.resultId as string);
  res.json(data);
};
