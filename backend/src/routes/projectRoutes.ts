import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { upload } from '../middlewares/uploadMiddleware';
import { 
  createProject, 
  getInstructorProjects, 
  getStudentProjects, 
  submitProject, 
  gradeSubmission 
} from '../controllers/projectController';

const router = express.Router();

// Instructor Routes
router.post('/instructor', authMiddleware, upload.single('projectFile'), createProject);
router.get('/instructor', authMiddleware, getInstructorProjects);
router.put('/instructor/submissions/:submissionId/grade', authMiddleware, gradeSubmission);

// Student Routes
router.get('/student', authMiddleware, getStudentProjects);
router.post('/student/:projectId/submit', authMiddleware, upload.single('submittedFile'), submitProject);

export default router;
