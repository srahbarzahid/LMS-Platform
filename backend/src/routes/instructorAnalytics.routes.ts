import { Router } from 'express';
import {
  getOverview,
  getStudents,
  getRevenue,
  getCourses,
  getLearning,
  getAssessments,
  getRatings,
  getCertificates,
  getActivities,
  getTasks,
  getReports
} from '../controllers/instructorAnalytics.controller';

const router = Router();

// Example auth middleware usage if needed:
// import { authenticate, authorize } from '../middlewares/auth';
// router.use(authenticate);
// router.use(authorize(['INSTRUCTOR', 'ADMIN']));

router.get('/overview', getOverview);
router.get('/students', getStudents);
router.get('/revenue', getRevenue);
router.get('/courses', getCourses);
router.get('/learning', getLearning);
router.get('/assessments', getAssessments);
router.get('/ratings', getRatings);
router.get('/certificates', getCertificates);
router.get('/activities', getActivities);
router.get('/tasks', getTasks);
router.get('/reports', getReports);

export default router;
