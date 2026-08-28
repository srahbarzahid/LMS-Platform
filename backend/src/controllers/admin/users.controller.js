import bcrypt from "bcryptjs";
import { prisma } from "../../prisma.js";
import { adminUsersService } from "../../services/admin/users.service.js";

const adminUsersController = {
  getUserById: async (req, res) => {
    try {
      const userDetails = await adminUsersService.getUserById(req.params.id);
      if (userDetails) res.json(userDetails);
      else res.status(404).json({ message: "User not found" });
    } catch (error) {
      console.error("Error fetching user details:", error);
      res.status(500).json({ message: "Error fetching user details", error });
    }
  },

  // Students
  getStudents: async (req, res) => {
    try {
      const { page, limit, search, status, course } = req.query;
      const data = await adminUsersService.getStudents({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        status,
        course
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).json({ message: "Error fetching students", error });
    }
  },
  getStudentById: async (req, res) => {
    try {
      const student = await adminUsersService.getStudentById(req.params.id);
      if (student) res.json(student);
      else res.status(404).json({ message: "Student not found" });
    } catch (error) {
      console.error("Error fetching student:", error);
      res.status(500).json({ message: "Error fetching student", error });
    }
  },

  // Instructors
  getInstructors: async (req, res) => {
    try {
      const { page, limit, search, status } = req.query;
      const data = await adminUsersService.getInstructors({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        status
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching instructors:", error);
      res.status(500).json({ message: "Error fetching instructors", error });
    }
  },
  getInstructorById: async (req, res) => {
    try {
      const instructor = await adminUsersService.getInstructorById(req.params.id);
      if (instructor) res.json(instructor);
      else res.status(404).json({ message: "Instructor not found" });
    } catch (error) {
      console.error("Error fetching instructor:", error);
      res.status(500).json({ message: "Error fetching instructor", error });
    }
  },
  createInstructor: async (req, res) => {
    try {
      const instructor = await adminUsersService.createInstructor(req.body);
      res.status(201).json(instructor);
    } catch (error) {
      console.error("Error creating instructor:", error);
      res.status(500).json({ message: "Error creating instructor", error });
    }
  },

  // Admins
  getAdmins: async (req, res) => {
    try {
      const { page, limit, search, role, status } = req.query;
      const data = await adminUsersService.getAdmins({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search,
        role,
        status
      });
      res.json(data);
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Error fetching admins", error });
    }
  },
  getAdminById: async (req, res) => {
    try {
      const admin = await adminUsersService.getAdminById(req.params.id);
      if (admin) res.json(admin);
      else res.status(404).json({ message: "Admin not found" });
    } catch (error) {
      console.error("Error fetching admin:", error);
      res.status(500).json({ message: "Error fetching admin", error });
    }
  },

  // Generic Actions
  deleteUser: async (req, res) => {
    try {
      await adminUsersService.deleteUser(req.params.id);
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Error deleting user", error });
    }
  },
  updateUserStatus: async (req, res) => {
    try {
      await adminUsersService.updateUserStatus(req.params.id);
      res.json({ message: "User status updated successfully" });
    } catch (error) {
      console.error("Error updating user status:", error);
      res.status(500).json({ message: "Error updating user status", error });
    }
  },
  resetUserPassword: async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      if (!password) {
        return res.status(400).json({ message: "New password is required" });
      }
      const hashedPassword = await bcrypt.hash(password, 12);
      await prisma.user.update({
        where: { id },
        data: { password: hashedPassword }
      });
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error resetting user password:", error);
      res.status(500).json({ message: "Error resetting user password", error: error.message || error });
    }
  }
};

export { adminUsersController };
