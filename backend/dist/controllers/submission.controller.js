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
exports.getQuizResult = exports.requestProjectResubmission = exports.gradeProject = exports.getProject = exports.requestAssignmentResubmission = exports.gradeAssignment = exports.getAssignment = void 0;
const SubmissionService = __importStar(require("../services/submission.service"));
const getAssignment = async (req, res) => {
    const data = await SubmissionService.getAssignmentMock(req.params.submissionId);
    res.json(data);
};
exports.getAssignment = getAssignment;
const gradeAssignment = async (req, res) => {
    const { marks, feedback } = req.body;
    const result = await SubmissionService.gradeAssignmentMock(req.params.submissionId, marks, feedback);
    res.json(result);
};
exports.gradeAssignment = gradeAssignment;
const requestAssignmentResubmission = async (req, res) => {
    const result = await SubmissionService.requestResubmissionAssignmentMock(req.params.submissionId);
    res.json(result);
};
exports.requestAssignmentResubmission = requestAssignmentResubmission;
const getProject = async (req, res) => {
    const data = await SubmissionService.getProjectMock(req.params.submissionId);
    res.json(data);
};
exports.getProject = getProject;
const gradeProject = async (req, res) => {
    const { marks, feedback } = req.body;
    const result = await SubmissionService.gradeProjectMock(req.params.submissionId, marks, feedback);
    res.json(result);
};
exports.gradeProject = gradeProject;
const requestProjectResubmission = async (req, res) => {
    const result = await SubmissionService.requestResubmissionProjectMock(req.params.submissionId);
    res.json(result);
};
exports.requestProjectResubmission = requestProjectResubmission;
const getQuizResult = async (req, res) => {
    const data = await SubmissionService.getQuizResultMock(req.params.resultId);
    res.json(data);
};
exports.getQuizResult = getQuizResult;
