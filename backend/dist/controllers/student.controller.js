"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStudentReviews = exports.getStudentActivity = exports.getStudentSubmissions = exports.getStudentProgress = exports.getStudentDetails = exports.getStudents = void 0;
const StudentService = __importStar(require("../services/student.service"));
const getStudents = async (req, res) => {
    const students = await StudentService.getStudentsMock('instructor_1');
    res.json(students);
};
exports.getStudents = getStudents;
const getStudentDetails = async (req, res) => {
    const details = await StudentService.getStudentDetailsMock(req.params.studentId);
    res.json(details);
};
exports.getStudentDetails = getStudentDetails;
const getStudentProgress = async (req, res) => {
    const progress = await StudentService.getStudentProgressMock(req.params.studentId);
    res.json(progress);
};
exports.getStudentProgress = getStudentProgress;
const getStudentSubmissions = async (req, res) => {
    // Mock logic - return empty or generic array for now as frontend has static mocks
    res.json({ assignments: [], projects: [], quizzes: [] });
};
exports.getStudentSubmissions = getStudentSubmissions;
const getStudentActivity = async (req, res) => {
    const activity = await StudentService.getStudentActivityMock(req.params.studentId);
    res.json(activity);
};
exports.getStudentActivity = getStudentActivity;
const getStudentReviews = async (req, res) => {
    const reviews = await StudentService.getStudentReviewsMock(req.params.studentId);
    res.json(reviews);
};
exports.getStudentReviews = getStudentReviews;
