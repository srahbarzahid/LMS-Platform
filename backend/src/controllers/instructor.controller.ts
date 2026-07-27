import { Request, Response } from 'express';
import { CertificateService } from '../services/certificate.service';

// Mock Data structure for now, easy to replace with Prisma later
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const stats = {
      totalStudents: 1248,
      activeCourses: 12,
      totalRevenue: 24500.50,
      averageRating: 4.8
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getRecentActivity = async (req: Request, res: Response) => {
  try {
    const activity = [
      { id: '1', type: 'enrollment', message: 'Alice Smith enrolled in UI/UX Masterclass', time: '2 hours ago' },
      { id: '2', type: 'submission', message: 'Bob submitted Final Project', time: '5 hours ago' }
    ];
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCourses = async (req: Request, res: Response) => {
  try {
    const courses = [
      { id: '1', title: 'UI/UX Masterclass', status: 'Published', students: 842, revenue: 12450, rating: 4.8, date: 'Oct 15, 2023' }
    ];
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const courseData = req.body;
    res.json({ success: true, data: { id: Date.now().toString(), ...courseData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    res.json({ success: true, data: { id, ...courseData } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    res.json({ success: true, message: `Course ${id} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCurriculum = async (req: Request, res: Response) => {
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
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const updateCurriculum = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const curriculumData = req.body;
    res.json({ success: true, data: curriculumData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getInstructorCertificates = async (req: Request, res: Response) => {
  try {
    const instructorId = (req as any).user?.id || 'mock_instructor_id';
    const data = await CertificateService.getInstructorCertificates(instructorId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCertificateDetails = async (req: Request, res: Response) => {
  try {
    const certificateId = req.params.certificateId as string;
    const instructorId = (req as any).user?.id || 'mock_instructor_id';
    const data = await CertificateService.getCertificateDetails(certificateId, instructorId);
    if (!data) {
       res.status(404).json({ success: false, message: 'Not found' });
       return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCertificateProgress = async (req: Request, res: Response) => {
  try {
    const certificateId = req.params.certificateId as string;
    const instructorId = (req as any).user?.id || 'mock_instructor_id';
    const data = await CertificateService.getCertificateProgress(certificateId, instructorId);
    if (!data) {
       res.status(404).json({ success: false, message: 'Not found' });
       return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

export const getCertificateTimeline = async (req: Request, res: Response) => {
  try {
    const certificateId = req.params.certificateId as string;
    const instructorId = (req as any).user?.id || 'mock_instructor_id';
    const data = await CertificateService.getCertificateTimeline(certificateId, instructorId);
    if (!data) {
       res.status(404).json({ success: false, message: 'Not found' });
       return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
