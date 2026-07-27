import { Router } from 'express';
import {
  getDashboardData,
  getEnrollments,
  getRevenue,
  getCompletion,
  getStudentProgress,
  getQuizzes,
  getAssignments,
  getProjects,
  getCertificates,
  getRatings,
  getLearningTime,
  getLessons,
  getDevices,
  getCategories,
  getActivity,
  getRecentActivity,
  getInsights,
  getTopPerformers,
  getLowestPerformers
} from '../controllers/analytics.controller';

const router = Router();

router.get('/dashboard', getDashboardData);
router.get('/enrollments', getEnrollments);
router.get('/revenue', getRevenue);
router.get('/completion', getCompletion);
router.get('/students', getStudentProgress);
router.get('/quizzes', getQuizzes);
router.get('/assignments', getAssignments);
router.get('/projects', getProjects);
router.get('/certificates', getCertificates);
router.get('/ratings', getRatings);
router.get('/learning-time', getLearningTime);
router.get('/lessons', getLessons);
router.get('/devices', getDevices);
router.get('/categories', getCategories);
router.get('/activity', getActivity);
router.get('/recent', getRecentActivity);
router.get('/insights', getInsights);
router.get('/top-performers', getTopPerformers);
router.get('/lowest-performers', getLowestPerformers);

export default router;
