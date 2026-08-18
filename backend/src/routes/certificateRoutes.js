import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  generateCertificate,
  getStudentCertificates,
  verifyCertificate
} from "../controllers/certificateController.js";
const router = express.Router();
router.post("/student/generate/:courseId", authMiddleware, generateCertificate);
router.get("/student", authMiddleware, getStudentCertificates);
router.get("/verify/:certificateId", verifyCertificate);
var stdin_default = router;
export {
  stdin_default as default
};
