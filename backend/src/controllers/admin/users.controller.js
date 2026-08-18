import { adminUsersService } from "../../services/admin/users.service.js";
const adminUsersController = {
  // Students
  getStudents: (req, res) => {
    try {
      const { page, limit, search, status, course } = req.query;
      const data = adminUsersService.getStudents({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        status,
        course
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching students", error });
    }
  },
  getStudentById: (req, res) => {
    try {
      const student = adminUsersService.getStudentById(req.params.id);
      if (student) res.json(student);
      else res.status(404).json({ message: "Student not found" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching student", error });
    }
  },
  // Instructors
  getInstructors: (req, res) => {
    try {
      const { page, limit, search, status } = req.query;
      const data = adminUsersService.getInstructors({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        status
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructors", error });
    }
  },
  getInstructorById: (req, res) => {
    try {
      const instructor = adminUsersService.getInstructorById(req.params.id);
      if (instructor) res.json(instructor);
      else res.status(404).json({ message: "Instructor not found" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching instructor", error });
    }
  },
  createInstructor: (req, res) => {
    try {
      const instructor = adminUsersService.createInstructor(req.body);
      res.status(201).json(instructor);
    } catch (error) {
      res.status(500).json({ message: "Error creating instructor", error });
    }
  },
  // Admins
  getAdmins: (req, res) => {
    try {
      const { page, limit, search, role, status } = req.query;
      const data = adminUsersService.getAdmins({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        role,
        status
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: "Error fetching admins", error });
    }
  },
  getAdminById: (req, res) => {
    try {
      const admin = adminUsersService.getAdminById(req.params.id);
      if (admin) res.json(admin);
      else res.status(404).json({ message: "Admin not found" });
    } catch (error) {
      res.status(500).json({ message: "Error fetching admin", error });
    }
  },
  // Generic Actions
  deleteUser: (req, res) => {
    adminUsersService.deleteUser(req.params.id);
    res.json({ message: "User deleted successfully" });
  },
  updateUserStatus: (req, res) => {
    adminUsersService.updateUserStatus(req.params.id);
    res.json({ message: "User status updated successfully" });
  },
  resetUserPassword: (req, res) => {
    res.json({ message: "Password reset link sent" });
  }
};
export {
  adminUsersController
};
