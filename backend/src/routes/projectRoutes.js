import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import { upload } from "../middlewares/uploadMiddleware.js";
import {
  createProject,
  getInstructorProjects,
  getStudentProjects,
  submitProject,
  gradeSubmission
} from "../controllers/projectController.js";
const router = express.Router();
router.post("/instructor", authMiddleware, upload.single("projectFile"), createProject);
router.get("/instructor", authMiddleware, getInstructorProjects);
router.put("/instructor/submissions/:submissionId/grade", authMiddleware, gradeSubmission);
router.get("/student", authMiddleware, getStudentProjects);
router.post("/student/:projectId/submit", authMiddleware, upload.single("submittedFile"), submitProject);
var stdin_default = router;
export {
  stdin_default as default
};
