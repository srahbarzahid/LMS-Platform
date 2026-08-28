import * as StudentService from "../services/student.service.js";

const getStudentOverview = async (req, res) => {
  try {
    const data = await StudentService.getStudentOverview(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student overview:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student overview" });
  }
};

const getStudentMyCourses = async (req, res) => {
  try {
    const data = await StudentService.getStudentMyCourses(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student courses:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student courses" });
  }
};

const getStudentAssignments = async (req, res) => {
  try {
    const data = await StudentService.getStudentAssignments(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student assignments:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student assignments" });
  }
};

const getStudentQuizzes = async (req, res) => {
  try {
    const data = await StudentService.getStudentQuizzes(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student quizzes:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student quizzes" });
  }
};

const getStudentProjects = async (req, res) => {
  try {
    const data = await StudentService.getStudentProjects(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student projects:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student projects" });
  }
};

const getStudentCertificates = async (req, res) => {
  try {
    const data = await StudentService.getStudentCertificates(req.user.id);
    res.json({ success: true, data });
  } catch (error) {
    console.error("Failed to fetch student certificates:", error);
    res.status(500).json({ success: false, message: "Failed to fetch student certificates" });
  }
};

export {
  getStudentOverview,
  getStudentMyCourses,
  getStudentAssignments,
  getStudentQuizzes,
  getStudentProjects,
  getStudentCertificates
};
