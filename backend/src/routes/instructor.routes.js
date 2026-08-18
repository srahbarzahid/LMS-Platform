import { Router } from "express";
import {
  getDashboardStats,
  getRecentActivity,
  getCourses,
  createCourse,
  updateCourse,
  deleteCourse,
  getCurriculum,
  updateCurriculum,
  getInstructorCertificates,
  getCertificateDetails,
  getCertificateProgress,
  getCertificateTimeline
} from "../controllers/instructor.controller.js";
import * as StudentController from "../controllers/student.controller.js";
import * as SubmissionController from "../controllers/submission.controller.js";
import { userAnnouncementsController } from "../controllers/announcements.user.controller.js";
import instructorAnalyticsRoutes from "./instructorAnalytics.routes.js";
const router = Router();
router.get("/dashboard-stats", getDashboardStats);
router.get("/recent-activity", getRecentActivity);
router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses/:courseId/curriculum", getCurriculum);
router.put("/courses/:courseId/curriculum", updateCurriculum);
router.get("/students", StudentController.getStudents);
router.get("/students/:studentId", StudentController.getStudentDetails);
router.get("/students/:studentId/progress", StudentController.getStudentProgress);
router.get("/students/:studentId/submissions", StudentController.getStudentSubmissions);
router.get("/students/:studentId/activity", StudentController.getStudentActivity);
router.get("/students/:studentId/reviews", StudentController.getStudentReviews);
router.get("/submissions/assignments/:submissionId", SubmissionController.getAssignment);
router.put("/submissions/assignments/:submissionId/grade", SubmissionController.gradeAssignment);
router.post("/submissions/assignments/:submissionId/request-resubmission", SubmissionController.requestAssignmentResubmission);
router.get("/submissions/projects/:submissionId", SubmissionController.getProject);
router.put("/submissions/projects/:submissionId/grade", SubmissionController.gradeProject);
router.post("/submissions/projects/:submissionId/request-resubmission", SubmissionController.requestProjectResubmission);
router.get("/quiz-results/:resultId", SubmissionController.getQuizResult);
router.get("/certificates", getInstructorCertificates);
router.get("/certificates/:certificateId", getCertificateDetails);
router.get("/certificates/:certificateId/progress", getCertificateProgress);
router.get("/certificates/:certificateId/student", getCertificateTimeline);
router.use("/analytics", instructorAnalyticsRoutes);
router.get("/announcements", userAnnouncementsController.getInstructorAnnouncements);
var stdin_default = router;
export {
  stdin_default as default
};
