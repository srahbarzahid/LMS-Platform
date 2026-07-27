import express from 'express';
import { authMiddleware } from '../middlewares/auth';
import { 
  generateCertificate,
  getStudentCertificates,
  verifyCertificate
} from '../controllers/certificateController';

const router = express.Router();

// Student Routes
router.post('/student/generate/:courseId', authMiddleware, generateCertificate);
router.get('/student', authMiddleware, getStudentCertificates);

// Public Routes
router.get('/verify/:certificateId', verifyCertificate);

export default router;
