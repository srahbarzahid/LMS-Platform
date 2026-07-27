import { Router } from 'express';
import { getCourses, getCourseById, createCourse } from '../controllers/courseController';
import { authenticate, authorize } from '../middlewares/auth';

const router = Router();

router.get('/', getCourses);
router.get('/:id', getCourseById);

// Instructor only routes
router.post('/', authenticate, authorize(['INSTRUCTOR', 'ADMIN']), createCourse);
// PUT, DELETE etc can be added similarly

export default router;
