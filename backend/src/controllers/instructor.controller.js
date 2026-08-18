import { CertificateService } from "../services/certificate.service.js";
const getDashboardStats = async (req, res) => {
  try {
    const stats = {
      totalStudents: 1248,
      activeCourses: 12,
      totalRevenue: 24500.5,
      averageRating: 4.8
    };
    res.json({ success: true, data: stats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getRecentActivity = async (req, res) => {
  try {
    const activity = [
      { id: "1", type: "enrollment", message: "Alice Smith enrolled in UI/UX Masterclass", time: "2 hours ago" },
      { id: "2", type: "submission", message: "Bob submitted Final Project", time: "5 hours ago" }
    ];
    res.json({ success: true, data: activity });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getCourses = async (req, res) => {
  try {
    const courses = [
      { id: "1", title: "UI/UX Masterclass", status: "Published", students: 842, revenue: 12450, rating: 4.8, date: "Oct 15, 2023" }
    ];
    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const createCourse = async (req, res) => {
  try {
    const courseData = req.body;
    res.json({ success: true, data: { id: Date.now().toString(), ...courseData } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const courseData = req.body;
    res.json({ success: true, data: { id, ...courseData } });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    res.json({ success: true, message: `Course ${id} deleted` });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    const curriculum = [
      {
        id: "mod1",
        title: "Module 1: Getting Started",
        order: 0,
        items: [
          { id: "item1", title: "Welcome Video", type: "video", duration: "5:30", isPreview: true }
        ]
      }
    ];
    res.json({ success: true, data: curriculum });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const updateCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    const curriculumData = req.body;
    res.json({ success: true, data: curriculumData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getInstructorCertificates = async (req, res) => {
  try {
    const instructorId = req.user?.id || "mock_instructor_id";
    const data = await CertificateService.getInstructorCertificates(instructorId);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getCertificateDetails = async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    const instructorId = req.user?.id || "mock_instructor_id";
    const data = await CertificateService.getCertificateDetails(certificateId, instructorId);
    if (!data) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getCertificateProgress = async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    const instructorId = req.user?.id || "mock_instructor_id";
    const data = await CertificateService.getCertificateProgress(certificateId, instructorId);
    if (!data) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
const getCertificateTimeline = async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    const instructorId = req.user?.id || "mock_instructor_id";
    const data = await CertificateService.getCertificateTimeline(certificateId, instructorId);
    if (!data) {
      res.status(404).json({ success: false, message: "Not found" });
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
export {
  createCourse,
  deleteCourse,
  getCertificateDetails,
  getCertificateProgress,
  getCertificateTimeline,
  getCourses,
  getCurriculum,
  getDashboardStats,
  getInstructorCertificates,
  getRecentActivity,
  updateCourse,
  updateCurriculum
};
