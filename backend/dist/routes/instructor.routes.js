"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const instructor_controller_1 = require("../controllers/instructor.controller");
const StudentController = __importStar(require("../controllers/student.controller"));
const SubmissionController = __importStar(require("../controllers/submission.controller"));
const announcements_user_controller_1 = require("../controllers/announcements.user.controller");
const instructorAnalytics_routes_1 = __importDefault(require("./instructorAnalytics.routes"));
const router = (0, express_1.Router)();
// In a real app, you would add auth and role middleware:
// router.use(protect);
// router.use(authorize('INSTRUCTOR', 'ADMIN'));
router.get('/dashboard-stats', instructor_controller_1.getDashboardStats);
router.get('/recent-activity', instructor_controller_1.getRecentActivity);
router.get('/courses', instructor_controller_1.getCourses);
router.post('/courses', instructor_controller_1.createCourse);
router.put('/courses/:id', instructor_controller_1.updateCourse);
router.delete('/courses/:id', instructor_controller_1.deleteCourse);
router.get('/courses/:courseId/curriculum', instructor_controller_1.getCurriculum);
router.put('/courses/:courseId/curriculum', instructor_controller_1.updateCurriculum);
// --- Students ---
router.get('/students', StudentController.getStudents);
router.get('/students/:studentId', StudentController.getStudentDetails);
router.get('/students/:studentId/progress', StudentController.getStudentProgress);
router.get('/students/:studentId/submissions', StudentController.getStudentSubmissions);
router.get('/students/:studentId/activity', StudentController.getStudentActivity);
router.get('/students/:studentId/reviews', StudentController.getStudentReviews);
// --- Submissions ---
router.get('/submissions/assignments/:submissionId', SubmissionController.getAssignment);
router.put('/submissions/assignments/:submissionId/grade', SubmissionController.gradeAssignment);
router.post('/submissions/assignments/:submissionId/request-resubmission', SubmissionController.requestAssignmentResubmission);
router.get('/submissions/projects/:submissionId', SubmissionController.getProject);
router.put('/submissions/projects/:submissionId/grade', SubmissionController.gradeProject);
router.post('/submissions/projects/:submissionId/request-resubmission', SubmissionController.requestProjectResubmission);
router.get('/quiz-results/:resultId', SubmissionController.getQuizResult);
// --- Certificates ---
router.get('/certificates', instructor_controller_1.getInstructorCertificates);
router.get('/certificates/:certificateId', instructor_controller_1.getCertificateDetails);
router.get('/certificates/:certificateId/progress', instructor_controller_1.getCertificateProgress);
router.get('/certificates/:certificateId/student', instructor_controller_1.getCertificateTimeline);
router.use('/analytics', instructorAnalytics_routes_1.default);
// --- Announcements ---
router.get('/announcements', announcements_user_controller_1.userAnnouncementsController.getInstructorAnnouncements);
exports.default = router;
