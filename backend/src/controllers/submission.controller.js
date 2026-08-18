import * as SubmissionService from "../services/submission.service.js";
const getAssignment = async (req, res) => {
  const data = await SubmissionService.getAssignmentMock(req.params.submissionId);
  res.json(data);
};
const gradeAssignment = async (req, res) => {
  const { marks, feedback } = req.body;
  const result = await SubmissionService.gradeAssignmentMock(req.params.submissionId, marks, feedback);
  res.json(result);
};
const requestAssignmentResubmission = async (req, res) => {
  const result = await SubmissionService.requestResubmissionAssignmentMock(req.params.submissionId);
  res.json(result);
};
const getProject = async (req, res) => {
  const data = await SubmissionService.getProjectMock(req.params.submissionId);
  res.json(data);
};
const gradeProject = async (req, res) => {
  const { marks, feedback } = req.body;
  const result = await SubmissionService.gradeProjectMock(req.params.submissionId, marks, feedback);
  res.json(result);
};
const requestProjectResubmission = async (req, res) => {
  const result = await SubmissionService.requestResubmissionProjectMock(req.params.submissionId);
  res.json(result);
};
const getQuizResult = async (req, res) => {
  const data = await SubmissionService.getQuizResultMock(req.params.resultId);
  res.json(data);
};
export {
  getAssignment,
  getProject,
  getQuizResult,
  gradeAssignment,
  gradeProject,
  requestAssignmentResubmission,
  requestProjectResubmission
};
