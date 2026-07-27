import { Request, Response } from 'express';
import { adminUsersService } from '../../services/admin/users.service';

export const adminUsersController = {
  // Students
  getStudents: (req: Request, res: Response) => {
    try {
      const { page, limit, search, status, course } = req.query;
      const data = adminUsersService.getStudents({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search as string,
        status: status as string,
        course: course as string
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching students', error });
    }
  },

  getStudentById: (req: Request, res: Response) => {
    try {
      const student = adminUsersService.getStudentById(req.params.id);
      if (student) res.json(student);
      else res.status(404).json({ message: 'Student not found' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching student', error });
    }
  },

  // Instructors
  getInstructors: (req: Request, res: Response) => {
    try {
      const { page, limit, search, status } = req.query;
      const data = adminUsersService.getInstructors({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search as string,
        status: status as string
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructors', error });
    }
  },

  getInstructorById: (req: Request, res: Response) => {
    try {
      const instructor = adminUsersService.getInstructorById(req.params.id);
      if (instructor) res.json(instructor);
      else res.status(404).json({ message: 'Instructor not found' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching instructor', error });
    }
  },

  createInstructor: (req: Request, res: Response) => {
    try {
      const instructor = adminUsersService.createInstructor(req.body);
      res.status(201).json(instructor);
    } catch (error) {
      res.status(500).json({ message: 'Error creating instructor', error });
    }
  },

  // Admins
  getAdmins: (req: Request, res: Response) => {
    try {
      const { page, limit, search, role, status } = req.query;
      const data = adminUsersService.getAdmins({
        page: Number(page) || 1,
        limit: Number(limit) || 10,
        search: search as string,
        role: role as string,
        status: status as string
      });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admins', error });
    }
  },

  getAdminById: (req: Request, res: Response) => {
    try {
      const admin = adminUsersService.getAdminById(req.params.id);
      if (admin) res.json(admin);
      else res.status(404).json({ message: 'Admin not found' });
    } catch (error) {
      res.status(500).json({ message: 'Error fetching admin', error });
    }
  },
  
  // Generic Actions
  deleteUser: (req: Request, res: Response) => {
    adminUsersService.deleteUser(req.params.id);
    res.json({ message: 'User deleted successfully' });
  },
  updateUserStatus: (req: Request, res: Response) => {
    adminUsersService.updateUserStatus(req.params.id);
    res.json({ message: 'User status updated successfully' });
  },
  resetUserPassword: (req: Request, res: Response) => {
    // Mock reset
    res.json({ message: 'Password reset link sent' });
  }
};
