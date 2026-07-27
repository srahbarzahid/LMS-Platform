"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCertificateTimeline = exports.getCertificateProgress = exports.getCertificateDetails = exports.getInstructorCertificates = exports.updateCurriculum = exports.getCurriculum = exports.deleteCourse = exports.updateCourse = exports.createCourse = exports.getCourses = exports.getRecentActivity = exports.getDashboardStats = void 0;
const certificate_service_1 = require("../services/certificate.service");
// Mock Data structure for now, easy to replace with Prisma later
const getDashboardStats = async (req, res) => {
    try {
        const stats = {
            totalStudents: 1248,
            activeCourses: 12,
            totalRevenue: 24500.50,
            averageRating: 4.8
        };
        res.json({ success: true, data: stats });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getDashboardStats = getDashboardStats;
const getRecentActivity = async (req, res) => {
    try {
        const activity = [
            { id: '1', type: 'enrollment', message: 'Alice Smith enrolled in UI/UX Masterclass', time: '2 hours ago' },
            { id: '2', type: 'submission', message: 'Bob submitted Final Project', time: '5 hours ago' }
        ];
        res.json({ success: true, data: activity });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getRecentActivity = getRecentActivity;
const getCourses = async (req, res) => {
    try {
        const courses = [
            { id: '1', title: 'UI/UX Masterclass', status: 'Published', students: 842, revenue: 12450, rating: 4.8, date: 'Oct 15, 2023' }
        ];
        res.json({ success: true, data: courses });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getCourses = getCourses;
const createCourse = async (req, res) => {
    try {
        const courseData = req.body;
        res.json({ success: true, data: { id: Date.now().toString(), ...courseData } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.createCourse = createCourse;
const updateCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const courseData = req.body;
        res.json({ success: true, data: { id, ...courseData } });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.updateCourse = updateCourse;
const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        res.json({ success: true, message: `Course ${id} deleted` });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.deleteCourse = deleteCourse;
const getCurriculum = async (req, res) => {
    try {
        const { courseId } = req.params;
        const curriculum = [
            {
                id: 'mod1',
                title: 'Module 1: Getting Started',
                order: 0,
                items: [
                    { id: 'item1', title: 'Welcome Video', type: 'video', duration: '5:30', isPreview: true }
                ]
            }
        ];
        res.json({ success: true, data: curriculum });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getCurriculum = getCurriculum;
const updateCurriculum = async (req, res) => {
    try {
        const { courseId } = req.params;
        const curriculumData = req.body;
        res.json({ success: true, data: curriculumData });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.updateCurriculum = updateCurriculum;
const getInstructorCertificates = async (req, res) => {
    try {
        const instructorId = req.user?.id || 'mock_instructor_id';
        const data = await certificate_service_1.CertificateService.getInstructorCertificates(instructorId);
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getInstructorCertificates = getInstructorCertificates;
const getCertificateDetails = async (req, res) => {
    try {
        const certificateId = req.params.certificateId;
        const instructorId = req.user?.id || 'mock_instructor_id';
        const data = await certificate_service_1.CertificateService.getCertificateDetails(certificateId, instructorId);
        if (!data) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getCertificateDetails = getCertificateDetails;
const getCertificateProgress = async (req, res) => {
    try {
        const certificateId = req.params.certificateId;
        const instructorId = req.user?.id || 'mock_instructor_id';
        const data = await certificate_service_1.CertificateService.getCertificateProgress(certificateId, instructorId);
        if (!data) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getCertificateProgress = getCertificateProgress;
const getCertificateTimeline = async (req, res) => {
    try {
        const certificateId = req.params.certificateId;
        const instructorId = req.user?.id || 'mock_instructor_id';
        const data = await certificate_service_1.CertificateService.getCertificateTimeline(certificateId, instructorId);
        if (!data) {
            res.status(404).json({ success: false, message: 'Not found' });
            return;
        }
        res.json({ success: true, data });
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};
exports.getCertificateTimeline = getCertificateTimeline;
