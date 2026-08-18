import { Router } from "express";
import { getCourses, getCourseById, createCourse } from "../controllers/courseController.js";
import { authenticate, authorize } from "../middlewares/auth.js";
const router = Router();
router.get("/", getCourses);
router.get("/:id", getCourseById);
router.post("/", authenticate, authorize(["INSTRUCTOR", "ADMIN"]), createCourse);
var stdin_default = router;
export {
  stdin_default as default
};
