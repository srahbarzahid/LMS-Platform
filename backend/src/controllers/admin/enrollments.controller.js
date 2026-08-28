import { prisma } from "../../prisma.js";

const helperFormatEnrollment = (e, cert) => {
  const progressPercentage = e.progress || 0;
  const isCompleted = progressPercentage >= 100;
  let status = "Active";
  if (isCompleted) status = "Completed";

  let certificateStatus = "Not Eligible";
  if (cert) certificateStatus = "Issued";
  else if (isCompleted) certificateStatus = "Eligible";

  const totalLessons = e.course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 10;
  const completedLessons = Math.round((progressPercentage / 100) * totalLessons);

  return {
    id: e.id,
    studentId: e.user?.id,
    studentName: e.user?.name || "Student",
    studentEmail: e.user?.email || "",
    studentPhone: e.user?.phone || "-",
    joinedDate: e.user?.createdAt,
    courseId: e.course?.id,
    courseName: e.course?.title || "Course",
    instructorId: e.course?.instructor?.id,
    instructorName: e.course?.instructor?.name || "Instructor",
    category: e.course?.category?.name || "General",
    enrollmentDate: e.createdAt,
    progressPercentage,
    completedLessons,
    totalLessons,
    completedQuizzes: isCompleted ? 2 : 0,
    totalQuizzes: 2,
    submittedAssignments: isCompleted ? 1 : 0,
    totalAssignments: 1,
    submittedProjects: isCompleted ? 1 : 0,
    totalProjects: 1,
    status,
    certificateStatus,
    certificateId: cert?.id || null,
    issuedDate: cert?.issuedDate || null,
    paymentStatus: "Paid",
    amountPaid: e.course?.price || 4999,
    transactionId: `TXN-${e.id.substring(0, 8).toUpperCase()}`
  };
};

const adminEnrollmentsController = {
  // GET /api/admin/enrollments
  getEnrollments: async (req, res) => {
    try {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const search = (req.query.search || "").trim();
      const statusFilter = req.query.status;
      const certStatusFilter = req.query.certStatus;

      const where = {};
      if (search) {
        where.OR = [
          { user: { name: { contains: search } } },
          { user: { email: { contains: search } } },
          { course: { title: { contains: search } } },
          { course: { instructor: { name: { contains: search } } } }
        ];
      }

      const allEnrollments = await prisma.enrollment.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true, createdAt: true }
          },
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              category: { select: { name: true } },
              instructor: { select: { id: true, name: true } },
              modules: { include: { lessons: true } }
            }
          }
        },
        orderBy: { createdAt: "desc" }
      });

      const certificates = await prisma.certificate.findMany({
        select: { userId: true, courseId: true, id: true, issuedDate: true }
      });
      const certMap = new Map();
      certificates.forEach((c) => certMap.set(`${c.userId}-${c.courseId}`, c));

      const formatted = allEnrollments
        .map((e) => helperFormatEnrollment(e, certMap.get(`${e.userId}-${e.courseId}`)))
        .filter((e) => {
          if (statusFilter && e.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
          if (certStatusFilter && e.certificateStatus.toLowerCase() !== certStatusFilter.toLowerCase()) return false;
          return true;
        });

      const total = formatted.length;
      const startIndex = (page - 1) * limit;
      const paginated = formatted.slice(startIndex, startIndex + limit);

      const totalDb = await prisma.enrollment.count();
      const activeCount = formatted.filter((e) => e.status === "Active").length;
      const completedCount = formatted.filter((e) => e.status === "Completed").length;
      const eligibleCount = formatted.filter((e) => e.certificateStatus === "Eligible").length;

      res.status(200).json({
        success: true,
        data: paginated,
        total,
        totalPages: Math.ceil(total / limit) || 1,
        page,
        stats: {
          total: totalDb,
          active: activeCount,
          completed: completedCount,
          eligible: eligibleCount,
          newThisMonth: totalDb
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Failed to fetch enrollments" });
    }
  },

  // GET /api/admin/enrollments/:id
  getEnrollmentDetails: async (req, res) => {
    try {
      const e = await prisma.enrollment.findUnique({
        where: { id: req.params.id },
        include: {
          user: { select: { id: true, name: true, email: true, phone: true, createdAt: true } },
          course: {
            select: {
              id: true,
              title: true,
              price: true,
              category: { select: { name: true } },
              instructor: { select: { id: true, name: true } },
              modules: { include: { lessons: true } }
            }
          }
        }
      });

      if (!e) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
      }

      const cert = await prisma.certificate.findFirst({
        where: { userId: e.userId, courseId: e.courseId }
      });

      res.status(200).json({ success: true, data: helperFormatEnrollment(e, cert) });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
  },

  // GET /api/admin/enrollments/:id/activity
  getEnrollmentActivity: async (req, res) => {
    try {
      const e = await prisma.enrollment.findUnique({
        where: { id: req.params.id },
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } }
        }
      });

      if (!e) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
      }

      const activity = [
        { id: 1, type: "enrolled", action: `Enrolled in ${e.course?.title || "Course"}`, date: e.createdAt },
        { id: 2, type: "lesson", action: "Started Course Curriculum", date: e.createdAt }
      ];

      res.status(200).json({ success: true, data: activity });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
  },

  // GET /api/admin/enrollments/:id/progress
  getEnrollmentProgressBreakdown: async (req, res) => {
    try {
      const e = await prisma.enrollment.findUnique({
        where: { id: req.params.id },
        include: {
          course: { include: { modules: { include: { lessons: true } } } }
        }
      });

      if (!e) {
        return res.status(404).json({ success: false, message: "Enrollment not found" });
      }

      const totalLessons = e.course?.modules?.reduce((sum, m) => sum + (m.lessons?.length || 0), 0) || 1;
      const completedLessons = Math.round(((e.progress || 0) / 100) * totalLessons);

      res.status(200).json({
        success: true,
        data: {
          overall: e.progress || 0,
          lessons: { completed: completedLessons, total: totalLessons },
          quizzes: { completed: 0, total: 0 },
          assignments: { completed: 0, total: 0 },
          projects: { completed: 0, total: 0 }
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message || "Server Error" });
    }
  }
};

export { adminEnrollmentsController };
