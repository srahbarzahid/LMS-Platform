import { prisma } from "../../prisma.js";
import {
  courseInclude,
  formatCourse,
  normalizeCourseStatus
} from "../../services/coursePipeline.service.js";

const parsePage = (value) => Math.max(parseInt(value, 10) || 1, 1);
const parseLimit = (value) => Math.max(parseInt(value, 10) || 10, 1);

const getTodayStart = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

const buildCourseWhere = ({ search, status, category, pendingOnly = false }) => {
  const normalizedStatus = pendingOnly ? "PENDING_REVIEW" : normalizeCourseStatus(status);
  const where = {
    ...(normalizedStatus ? { status: normalizedStatus } : {})
  };

  if (category && category !== "All") {
    where.category = { is: { name: category } };
  }

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { shortDescription: { contains: search } },
      { description: { contains: search } },
      { instructor: { is: { name: { contains: search } } } },
      { instructor: { is: { email: { contains: search } } } }
    ];
  }

  return where;
};

const getCourseStats = async () => {
  const todayStart = getTodayStart();
  const monthStart = new Date(todayStart.getFullYear(), todayStart.getMonth(), 1);
  const [
    total,
    published,
    pending,
    draft,
    rejected,
    unpublished,
    featured,
    newThisMonth
  ] = await Promise.all([
    prisma.course.count(),
    prisma.course.count({ where: { status: "PUBLISHED" } }),
    prisma.course.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.course.count({ where: { status: "DRAFT" } }),
    prisma.course.count({ where: { status: "REJECTED" } }),
    prisma.course.count({ where: { status: "UNPUBLISHED" } }),
    prisma.course.count({ where: { featured: true } }),
    prisma.course.count({ where: { createdAt: { gte: monthStart } } })
  ]);

  return {
    total,
    published,
    pending,
    draft,
    rejected,
    unpublished,
    featured,
    newThisMonth
  };
};

const sendAdminCourseError = (res, error, fallbackMessage) => {
  console.error(error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : fallbackMessage
  });
};

const adminCoursesController = {
  // GET /api/admin/courses
  getCourses: async (req, res) => {
    try {
      const page = parsePage(req.query.page);
      const limit = parseLimit(req.query.limit);
      const search = req.query.search?.trim() || "";
      const status = req.query.status === "All" ? "" : req.query.status;
      const category = req.query.category || "All";
      const where = buildCourseWhere({ search, status, category });

      const [courses, total, stats] = await Promise.all([
        prisma.course.findMany({
          where,
          include: courseInclude,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { updatedAt: "desc" }
        }),
        prisma.course.count({ where }),
        getCourseStats()
      ]);

      res.status(200).json({
        success: true,
        data: courses.map(formatCourse),
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        page,
        stats
      });
    } catch (error) {
      sendAdminCourseError(res, error, "Failed to fetch courses");
    }
  },

  // GET /api/admin/courses/pending
  getPendingCourses: async (req, res) => {
    try {
      const page = parsePage(req.query.page);
      const limit = parseLimit(req.query.limit);
      const search = req.query.search?.trim() || "";
      const where = buildCourseWhere({ search, pendingOnly: true });
      const todayStart = getTodayStart();

      const [courses, total, approvedToday, rejectedToday] = await Promise.all([
        prisma.course.findMany({
          where,
          include: courseInclude,
          skip: (page - 1) * limit,
          take: limit,
          orderBy: { submittedAt: "desc" }
        }),
        prisma.course.count({ where }),
        prisma.course.count({
          where: {
            status: "PUBLISHED",
            updatedAt: { gte: todayStart }
          }
        }),
        prisma.course.count({
          where: {
            status: "REJECTED",
            updatedAt: { gte: todayStart }
          }
        })
      ]);

      res.status(200).json({
        success: true,
        data: courses.map(formatCourse),
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
        page,
        stats: {
          pendingCourses: total,
          approvedToday,
          rejectedToday,
          totalPendingReviews: total
        }
      });
    } catch (error) {
      sendAdminCourseError(res, error, "Failed to fetch pending courses");
    }
  },

  // GET /api/admin/courses/:id
  getCourseById: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: courseInclude
      });

      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      res.status(200).json({ success: true, data: formatCourse(course) });
    } catch (error) {
      sendAdminCourseError(res, error, "Server error");
    }
  },

  // PATCH /api/admin/courses/:id/status
  updateCourseStatus: async (req, res) => {
    try {
      const { status, reason } = req.body;
      const normalizedStatus = normalizeCourseStatus(status);

      if (!normalizedStatus) {
        res.status(400).json({ success: false, message: "Invalid course status" });
        return;
      }

      const existingCourse = await prisma.course.findUnique({
        where: { id: req.params.id },
        select: { id: true }
      });

      if (!existingCourse) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      const course = await prisma.course.update({
        where: { id: req.params.id },
        data: {
          status: normalizedStatus,
          rejectionReason: normalizedStatus === "REJECTED" ? reason || "Rejected by administrator" : null,
          submittedAt: normalizedStatus === "PENDING_REVIEW" ? new Date() : undefined,
          publishedAt: normalizedStatus === "PUBLISHED" ? new Date() : undefined
        },
        include: courseInclude
      });

      res.status(200).json({ success: true, data: formatCourse(course) });
    } catch (error) {
      sendAdminCourseError(res, error, "Server error");
    }
  },

  // PATCH /api/admin/courses/:id/featured
  toggleCourseFeatured: async (req, res) => {
    try {
      const existingCourse = await prisma.course.findUnique({
        where: { id: req.params.id },
        select: { id: true }
      });

      if (!existingCourse) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      const course = await prisma.course.update({
        where: { id: req.params.id },
        data: { featured: Boolean(req.body.featured) },
        include: courseInclude
      });

      res.status(200).json({ success: true, data: formatCourse(course) });
    } catch (error) {
      sendAdminCourseError(res, error, "Server error");
    }
  },

  // PATCH /api/admin/courses/:id/template
  updateCourseTemplate: async (req, res) => {
    try {
      const course = await prisma.course.findUnique({
        where: { id: req.params.id },
        include: courseInclude
      });

      if (!course) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      res.status(200).json({
        success: true,
        data: formatCourse(course),
        message: "Certificate template assignment is not stored on the Course model yet."
      });
    } catch (error) {
      sendAdminCourseError(res, error, "Server error");
    }
  },

  // DELETE /api/admin/courses/:id
  deleteCourse: async (req, res) => {
    try {
      const existingCourse = await prisma.course.findUnique({
        where: { id: req.params.id },
        select: { id: true }
      });

      if (!existingCourse) {
        res.status(404).json({ success: false, message: "Course not found" });
        return;
      }

      await prisma.$transaction([
        prisma.cart.deleteMany({ where: { courseId: req.params.id } }),
        prisma.wishlist.deleteMany({ where: { courseId: req.params.id } }),
        prisma.submission.deleteMany({ where: { assignment: { courseId: req.params.id } } }),
        prisma.projectSubmission.deleteMany({ where: { project: { courseId: req.params.id } } }),
        prisma.courseCompletion.deleteMany({ where: { courseId: req.params.id } }),
        prisma.certificate.deleteMany({ where: { courseId: req.params.id } }),
        prisma.review.deleteMany({ where: { courseId: req.params.id } }),
        prisma.payment.deleteMany({ where: { courseId: req.params.id } }),
        prisma.enrollment.deleteMany({ where: { courseId: req.params.id } }),
        prisma.quiz.deleteMany({ where: { courseId: req.params.id } }),
        prisma.assignment.deleteMany({ where: { courseId: req.params.id } }),
        prisma.project.deleteMany({ where: { courseId: req.params.id } }),
        prisma.module.deleteMany({ where: { courseId: req.params.id } }),
        prisma.course.delete({ where: { id: req.params.id } })
      ]);

      res.status(200).json({ success: true, message: "Course deleted" });
    } catch (error) {
      sendAdminCourseError(res, error, "Server error");
    }
  }
};

export {
  adminCoursesController
};
