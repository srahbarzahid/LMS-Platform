import { prisma } from "../prisma.js";
import { mockAnnouncements } from "./admin/announcements.controller.js";

const formatNotificationAnnouncement = (notification) => ({
  announcementId: notification.relatedId || notification.id,
  title: notification.title,
  type: notification.type || "Announcement",
  message: notification.message,
  audience: "Course Students",
  priority: "Medium",
  status: "Published",
  publishDate: notification.createdAt,
  createdAt: notification.createdAt
});

const isPublishedAndCurrent = (announcement) => {
  const isPublished = announcement.status === "Published";
  const isNotExpired = !announcement.expiryDate || new Date(announcement.expiryDate) > new Date();
  return isPublished && isNotExpired;
};

const userAnnouncementsController = {
  // GET /api/student/announcements
  getStudentAnnouncements: async (req, res) => {
    try {
      const studentId = req.user?.userId || req.user?.id;
      const courseAnnouncements = studentId
        ? await prisma.notification.findMany({
            where: {
              userId: studentId,
              category: "Announcement"
            },
            orderBy: { createdAt: "desc" }
          })
        : [];
      const sortedAnnouncements = courseAnnouncements.map(formatNotificationAnnouncement);
      res.status(200).json({ success: true, data: sortedAnnouncements });
    } catch (error) {
      console.error("Error fetching student announcements:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  },

  // GET /api/instructor/announcements
  getInstructorAnnouncements: async (req, res) => {
    try {
      const instructorId = req.user?.userId || req.user?.id;
      const courseAnnouncements = instructorId
        ? await prisma.notification.findMany({
            where: {
              userId: instructorId,
              category: "Announcement"
            },
            orderBy: { createdAt: "desc" }
          })
        : [];
      const sortedAnnouncements = courseAnnouncements.map(formatNotificationAnnouncement);
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
        return isPublishedAndCurrent(ann) && ann.audience === "All Users";
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
