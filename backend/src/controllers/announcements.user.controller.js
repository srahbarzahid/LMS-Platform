import { mockAnnouncements } from "./admin/announcements.controller.js";
const userAnnouncementsController = {
  // GET /api/student/announcements
  getStudentAnnouncements: async (req, res) => {
    try {
      const studentId = "student_1";
      const studentAnnouncements = mockAnnouncements.filter((ann) => {
        if (ann.status !== "Published") return false;
        return ann.audience === "All Users" || ann.audience === "All Students" || ann.audience === "Specific Student" && ann.targetId === studentId || // If we had a list of enrolled courses, we would check 'Specific Course Students' against enrolled courses
        ann.audience === "Specific Course Students";
      });
      const sortedAnnouncements = studentAnnouncements.sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
      res.status(200).json({ success: true, data: sortedAnnouncements });
    } catch (error) {
      console.error("Error fetching student announcements:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
  // GET /api/instructor/announcements
  getInstructorAnnouncements: async (req, res) => {
    try {
      const instructorId = "instructor_1";
      const instructorAnnouncements = mockAnnouncements.filter((ann) => {
        if (ann.status !== "Published") return false;
        return ann.audience === "All Users" || ann.audience === "All Instructors" || ann.audience === "Specific Instructor" && ann.targetId === instructorId;
      });
      const sortedAnnouncements = instructorAnnouncements.sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
      res.status(200).json({ success: true, data: sortedAnnouncements });
    } catch (error) {
      console.error("Error fetching instructor announcements:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },
  // GET /api/public/announcements (Landing Page)
  getPublicAnnouncements: async (req, res) => {
    try {
      const publicAnnouncements = mockAnnouncements.filter((ann) => {
        return ann.status === "Published" && ann.audience === "All Users";
      });
      const sortedAnnouncements = publicAnnouncements.sort((a, b) => {
        return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime();
      });
      res.status(200).json({ success: true, data: sortedAnnouncements });
    } catch (error) {
      console.error("Error fetching public announcements:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
};
export {
  userAnnouncementsController
};
