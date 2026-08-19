import { Router } from "express";
import {
  createAnnouncement,
  createAssignment,
  createCourse,
  createLesson,
  createProject,
  createQuiz,
  deleteAnnouncement,
  deleteAssignment,
  deleteCourse,
  deleteLesson,
  deleteProject,
  deleteQuiz,
  getAnalytics,
  getAnnouncements,
  getAssignmentSubmissionDetails,
  getAssignmentSubmissions,
  getAssignments,
  getCertificateDetails,
  getCertificateProgress,
  getCertificateTimeline,
  getCourseDetails,
  getCourses,
  getCurriculum,
  getDashboardStats,
  getInstructorCertificates,
  getLessons,
  getProjectSubmissionDetails,
  getProjectSubmissions,
  getProjects,
  getQuizResultDetails,
  getQuizResults,
  getQuizzes,
  getRecentActivity,
  getReviews,
  getStudentActivity,
  getStudentDetails,
  getStudentProgress,
  getStudentReviews,
  getStudentSubmissions,
  getStudents,
  getWorkspace,
  gradeAssignmentSubmission,
  gradeProjectSubmission,
  publishCourse,
  replyToReview,
  requestAssignmentResubmission,
  requestProjectResubmission,
  unpublishCourse,
  updateAnnouncement,
  updateAssignment,
  updateCourse,
  updateCurriculum,
  updateLesson,
  updateProject,
  updateQuiz
} from "../controllers/instructor.controller.js";
import instructorAnalyticsRoutes from "./instructorAnalytics.routes.js";
import { authenticate, authorize } from "../middlewares/auth.js";

const router = Router();
const instructorOnly = [authenticate, authorize(["INSTRUCTOR", "ADMIN"])];

router.use(instructorOnly);

router.get("/dashboard-stats", getDashboardStats);
router.get("/recent-activity", getRecentActivity);
router.get("/workspace", getWorkspace);

router.get("/courses", getCourses);
router.post("/courses", createCourse);
router.get("/courses/:courseId/curriculum", getCurriculum);
router.put("/courses/:courseId/curriculum", updateCurriculum);
router.get("/courses/:id", getCourseDetails);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.put("/courses/:id/publish", publishCourse);
router.put("/courses/:id/unpublish", unpublishCourse);

router.get("/lessons", getLessons);
router.post("/lessons", createLesson);
router.put("/lessons/:id", updateLesson);
router.delete("/lessons/:id", deleteLesson);

router.get("/quizzes", getQuizzes);
router.post("/quizzes", createQuiz);
router.put("/quizzes/:id", updateQuiz);
router.delete("/quizzes/:id", deleteQuiz);
router.get("/quizzes/:id/results", getQuizResults);

router.get("/assignments", getAssignments);
router.post("/assignments", createAssignment);
router.put("/assignments/submissions/:submissionId/grade", gradeAssignmentSubmission);
router.put("/assignments/submissions/:submissionId/request-resubmission", requestAssignmentResubmission);
router.get("/assignments/:id/submissions", getAssignmentSubmissions);
router.put("/assignments/:id", updateAssignment);
router.delete("/assignments/:id", deleteAssignment);

router.get("/projects", getProjects);
router.post("/projects", createProject);
router.put("/projects/submissions/:submissionId/grade", gradeProjectSubmission);
router.put("/projects/submissions/:submissionId/request-resubmission", requestProjectResubmission);
router.get("/projects/:id/submissions", getProjectSubmissions);
router.put("/projects/:id", updateProject);
router.delete("/projects/:id", deleteProject);

router.get("/students", getStudents);
router.get("/students/:studentId", getStudentDetails);
router.get("/students/:studentId/progress", getStudentProgress);
router.get("/students/:studentId/submissions", getStudentSubmissions);
router.get("/students/:studentId/activity", getStudentActivity);
router.get("/students/:studentId/reviews", getStudentReviews);

router.get("/submissions/assignments/:submissionId", getAssignmentSubmissionDetails);
router.put("/submissions/assignments/:submissionId/grade", gradeAssignmentSubmission);
router.post("/submissions/assignments/:submissionId/request-resubmission", requestAssignmentResubmission);
router.get("/submissions/projects/:submissionId", getProjectSubmissionDetails);
router.put("/submissions/projects/:submissionId/grade", gradeProjectSubmission);
router.post("/submissions/projects/:submissionId/request-resubmission", requestProjectResubmission);
router.get("/quiz-results/:resultId", getQuizResultDetails);

router.get("/reviews", getReviews);
router.post("/reviews/:id/reply", replyToReview);

router.get("/certificates", getInstructorCertificates);
router.get("/certificates/:certificateId/progress", getCertificateProgress);
router.get("/certificates/:certificateId/student", getCertificateTimeline);
router.get("/certificates/:certificateId", getCertificateDetails);

router.get("/analytics", getAnalytics);
router.use("/analytics", instructorAnalyticsRoutes);

router.get("/announcements", getAnnouncements);
router.post("/announcements", createAnnouncement);
router.put("/announcements/:id", updateAnnouncement);
router.delete("/announcements/:id", deleteAnnouncement);

export default router;
