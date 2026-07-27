"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gradeSubmission = exports.submitProject = exports.getStudentProjects = exports.getInstructorProjects = exports.createProject = void 0;
const index_1 = require("../index");
const createProject = async (req, res) => {
    try {
        const instructorId = req.user?.userId;
        if (!instructorId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const { courseId, moduleId, title, description, dueDate, maxMarks, allowResubmission } = req.body;
        let projectFileUrl = null;
        let projectFileType = null;
        if (req.file) {
            // In production this would be an S3 URL. Using local path for now.
            projectFileUrl = `/uploads/${req.file.filename}`;
            projectFileType = req.file.mimetype;
        }
        const project = await index_1.prisma.project.create({
            data: {
                courseId,
                moduleId: moduleId || null,
                instructorId,
                title,
                description,
                projectFileUrl,
                projectFileType,
                dueDate: dueDate ? new Date(dueDate) : null,
                maxMarks: maxMarks ? parseFloat(maxMarks) : 100,
                allowResubmission: allowResubmission === 'true',
            }
        });
        res.status(201).json(project);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to create project' });
    }
};
exports.createProject = createProject;
const getInstructorProjects = async (req, res) => {
    try {
        const instructorId = req.user?.userId;
        const projects = await index_1.prisma.project.findMany({
            where: { instructorId },
            include: { course: true, _count: { select: { submissions: true } } }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getInstructorProjects = getInstructorProjects;
const getStudentProjects = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        // Get all projects for courses the student is enrolled in
        const enrollments = await index_1.prisma.enrollment.findMany({
            where: { userId: studentId, status: 'ACTIVE' },
            select: { courseId: true }
        });
        const courseIds = enrollments.map(e => e.courseId);
        const projects = await index_1.prisma.project.findMany({
            where: { courseId: { in: courseIds } },
            include: {
                course: true,
                submissions: {
                    where: { studentId }
                }
            }
        });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getStudentProjects = getStudentProjects;
const submitProject = async (req, res) => {
    try {
        const studentId = req.user?.userId;
        if (!studentId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }
        const projectId = req.params.projectId;
        const { submittedLink, studentNote } = req.body;
        let submittedFileUrl = null;
        let submittedFileType = null;
        if (req.file) {
            submittedFileUrl = `/uploads/${req.file.filename}`;
            submittedFileType = req.file.mimetype;
        }
        // Check if already submitted unless allowResubmission is true
        const project = await index_1.prisma.project.findUnique({ where: { id: projectId } });
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const existingSubmission = await index_1.prisma.projectSubmission.findFirst({
            where: { projectId, studentId }
        });
        if (existingSubmission && !project.allowResubmission && existingSubmission.status !== 'RESUBMISSION_REQUIRED') {
            res.status(400).json({ message: 'Resubmission not allowed' });
            return;
        }
        if (existingSubmission) {
            // Update existing
            const updated = await index_1.prisma.projectSubmission.update({
                where: { id: existingSubmission.id },
                data: {
                    submittedFileUrl: submittedFileUrl || existingSubmission.submittedFileUrl,
                    submittedFileType: submittedFileType || existingSubmission.submittedFileType,
                    submittedLink: submittedLink || existingSubmission.submittedLink,
                    studentNote: studentNote || existingSubmission.studentNote,
                    status: 'SUBMITTED',
                    submittedAt: new Date()
                }
            });
            res.json(updated);
        }
        else {
            // Create new
            const submission = await index_1.prisma.projectSubmission.create({
                data: {
                    projectId,
                    studentId,
                    submittedFileUrl,
                    submittedFileType,
                    submittedLink,
                    studentNote,
                    status: 'SUBMITTED',
                    submittedAt: new Date()
                }
            });
            res.status(201).json(submission);
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to submit project' });
    }
};
exports.submitProject = submitProject;
const gradeSubmission = async (req, res) => {
    try {
        const submissionId = req.params.submissionId;
        const { marks, feedback, status } = req.body;
        const submission = await index_1.prisma.projectSubmission.update({
            where: { id: submissionId },
            data: {
                marks: parseFloat(marks),
                feedback,
                status: status || 'GRADED',
                reviewedAt: new Date()
            }
        });
        res.json(submission);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.gradeSubmission = gradeSubmission;
