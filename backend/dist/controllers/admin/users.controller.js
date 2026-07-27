"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUsersController = void 0;
const users_service_1 = require("../../services/admin/users.service");
exports.adminUsersController = {
    // Students
    getStudents: (req, res) => {
        try {
            const { page, limit, search, status, course } = req.query;
            const data = users_service_1.adminUsersService.getStudents({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                search: search,
                status: status,
                course: course
            });
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching students', error });
        }
    },
    getStudentById: (req, res) => {
        try {
            const student = users_service_1.adminUsersService.getStudentById(req.params.id);
            if (student)
                res.json(student);
            else
                res.status(404).json({ message: 'Student not found' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching student', error });
        }
    },
    // Instructors
    getInstructors: (req, res) => {
        try {
            const { page, limit, search, status } = req.query;
            const data = users_service_1.adminUsersService.getInstructors({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                search: search,
                status: status
            });
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching instructors', error });
        }
    },
    getInstructorById: (req, res) => {
        try {
            const instructor = users_service_1.adminUsersService.getInstructorById(req.params.id);
            if (instructor)
                res.json(instructor);
            else
                res.status(404).json({ message: 'Instructor not found' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching instructor', error });
        }
    },
    createInstructor: (req, res) => {
        try {
            const instructor = users_service_1.adminUsersService.createInstructor(req.body);
            res.status(201).json(instructor);
        }
        catch (error) {
            res.status(500).json({ message: 'Error creating instructor', error });
        }
    },
    // Admins
    getAdmins: (req, res) => {
        try {
            const { page, limit, search, role, status } = req.query;
            const data = users_service_1.adminUsersService.getAdmins({
                page: Number(page) || 1,
                limit: Number(limit) || 10,
                search: search,
                role: role,
                status: status
            });
            res.json(data);
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching admins', error });
        }
    },
    getAdminById: (req, res) => {
        try {
            const admin = users_service_1.adminUsersService.getAdminById(req.params.id);
            if (admin)
                res.json(admin);
            else
                res.status(404).json({ message: 'Admin not found' });
        }
        catch (error) {
            res.status(500).json({ message: 'Error fetching admin', error });
        }
    },
    // Generic Actions
    deleteUser: (req, res) => {
        users_service_1.adminUsersService.deleteUser(req.params.id);
        res.json({ message: 'User deleted successfully' });
    },
    updateUserStatus: (req, res) => {
        users_service_1.adminUsersService.updateUserStatus(req.params.id);
        res.json({ message: 'User status updated successfully' });
    },
    resetUserPassword: (req, res) => {
        // Mock reset
        res.json({ message: 'Password reset link sent' });
    }
};
