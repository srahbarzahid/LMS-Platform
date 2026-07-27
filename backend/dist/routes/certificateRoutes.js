"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const certificateController_1 = require("../controllers/certificateController");
const router = express_1.default.Router();
// Student Routes
router.post('/student/generate/:courseId', auth_1.authMiddleware, certificateController_1.generateCertificate);
router.get('/student', auth_1.authMiddleware, certificateController_1.getStudentCertificates);
// Public Routes
router.get('/verify/:certificateId', certificateController_1.verifyCertificate);
exports.default = router;
