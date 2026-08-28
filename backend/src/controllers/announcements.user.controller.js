import { prisma } from "../prisma.js";
import { mockAnnouncements } from "./admin/announcements.controller.js";

const parseAnnouncementRelatedType = (relatedType = "") => {
  if (!relatedType) return "ALL";
  const parts = relatedType.split(":");
  return parts.length > 1 ? parts[1] : "ALL";
};

const formatNotificationAnnouncement = (notification, coursesById = new Map()) => {
  const courseId = parseAnnouncementRelatedType(notification.relatedType);
  const course = courseId === "ALL" ? null : coursesById.get(courseId);

  return {
    id: notification.relatedId || notification.id,
    announcementId: notification.relatedId || notification.id,
    title: notification.title,
    type: notification.type || "Course Announcement",
    message: notification.message,
    audience: course ? "Course Students" : "All Students",
    course: course?.title || (courseId !== "ALL" ? courseId : "All Courses"),
    courseId: course?.id || (courseId !== "ALL" ? courseId : ""),
    priority: "Medium",
    status: "Published",
    publishDate: notification.createdAt,
    createdAt: notification.createdAt
  };
};

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

      const courseIds = [
        ...new Set(
          courseAnnouncements
            .map((n) => parseAnnouncementRelatedType(n.relatedType))
            .filter((id) => id && id !== "ALL")
        )
      ];

      const courses = courseIds.length
        ? await prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, title: true }
          })
        : [];

      const coursesById = new Map(courses.map((c) => [c.id, c]));

      const sortedAnnouncements = courseAnnouncements.map((item) =>
        formatNotificationAnnouncement(item, coursesById)
      );
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

      const courseIds = [
        ...new Set(
          courseAnnouncements
            .map((n) => parseAnnouncementRelatedType(n.relatedType))
            .filter((id) => id && id !== "ALL")
        )
      ];

      const courses = courseIds.length
        ? await prisma.course.findMany({
            where: { id: { in: courseIds } },
            select: { id: true, title: true }
          })
        : [];

      const coursesById = new Map(courses.map((c) => [c.id, c]));

      const sortedAnnouncements = courseAnnouncements.map((item) =>
        formatNotificationAnnouncement(item, coursesById)
      );
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
