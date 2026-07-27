"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const uploadMiddleware_1 = require("../middlewares/uploadMiddleware");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
// Instructor Routes
router.post('/instructor', auth_1.authMiddleware, uploadMiddleware_1.upload.single('projectFile'), projectController_1.createProject);
router.get('/instructor', auth_1.authMiddleware, projectController_1.getInstructorProjects);
router.put('/instructor/submissions/:submissionId/grade', auth_1.authMiddleware, projectController_1.gradeSubmission);
// Student Routes
router.get('/student', auth_1.authMiddleware, projectController_1.getStudentProjects);
router.post('/student/:projectId/submit', auth_1.authMiddleware, uploadMiddleware_1.upload.single('submittedFile'), projectController_1.submitProject);
exports.default = router;
