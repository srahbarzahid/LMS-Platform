"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const courseController_1 = require("../controllers/courseController");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get('/', courseController_1.getCourses);
router.get('/:id', courseController_1.getCourseById);
// Instructor only routes
router.post('/', auth_1.authenticate, (0, auth_1.authorize)(['INSTRUCTOR', 'ADMIN']), courseController_1.createCourse);
// PUT, DELETE etc can be added similarly
exports.default = router;
