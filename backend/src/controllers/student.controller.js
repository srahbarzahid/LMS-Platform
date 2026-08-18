import * as StudentService from "../services/student.service.js";
const getStudents = async (req, res) => {
  const students = await StudentService.getStudentsMock("instructor_1");
  res.json(students);
};
const getStudentDetails = async (req, res) => {
  const details = await StudentService.getStudentDetailsMock(req.params.studentId);
  res.json(details);
};
const getStudentProgress = async (req, res) => {
  const progress = await StudentService.getStudentProgressMock(req.params.studentId);
  res.json(progress);
};
const getStudentSubmissions = async (req, res) => {
  res.json({ assignments: [], projects: [], quizzes: [] });
};
const getStudentActivity = async (req, res) => {
  const activity = await StudentService.getStudentActivityMock(req.params.studentId);
  res.json(activity);
};
const getStudentReviews = async (req, res) => {
  const reviews = await StudentService.getStudentReviewsMock(req.params.studentId);
  res.json(reviews);
};
export {
  getStudentActivity,
  getStudentDetails,
  getStudentProgress,
  getStudentReviews,
  getStudentSubmissions,
  getStudents
};
