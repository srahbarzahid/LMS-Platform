import { Router } from "express";
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
} from "../controllers/instructorAnalytics.controller.js";
const router = Router();
router.get("/overview", getOverview);
router.get("/students", getStudents);
router.get("/revenue", getRevenue);
router.get("/courses", getCourses);
router.get("/learning", getLearning);
router.get("/assessments", getAssessments);
router.get("/ratings", getRatings);
router.get("/certificates", getCertificates);
router.get("/activities", getActivities);
router.get("/tasks", getTasks);
router.get("/reports", getReports);
var stdin_default = router;
export {
  stdin_default as default
};
