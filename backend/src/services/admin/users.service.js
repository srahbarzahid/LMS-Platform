import { prisma } from "../../prisma.js";

const adminUsersService = {
  async getStudents(filters) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { role: "STUDENT" };
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } }
      ];
    }
    if (filters.status && filters.status !== "All") {
      if (filters.status === "Blocked" || filters.status === "Inactive") {
        where.isDeactivated = true;
      } else if (filters.status === "Active") {
        where.isDeactivated = false;
      }
    }

    const [dbStudents, total, totalAll, activeCount, blockedCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { enrollments: true } }
        }
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { role: "STUDENT" } }),
      prisma.user.count({ where: { role: "STUDENT", isDeactivated: false } }),
      prisma.user.count({ where: { role: "STUDENT", isDeactivated: true } })
    ]);

    const data = dbStudents.map((s) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone || "-",
      enrolledCourses: s._count.enrollments || 0,
      progress: s._count.enrollments > 0 ? 100 : 0,
      status: s.isDeactivated ? "Blocked" : "Active",
      joinedDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "Recent",
      profileImage: s.profileImage || null
    }));

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      stats: {
        total: totalAll,
        active: activeCount,
        blocked: blockedCount,
        newThisMonth: totalAll
      }
    };
  },

  async getUserById(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return null;

    if (user.role === "INSTRUCTOR") {
      return this.getInstructorById(id);
    }
    return this.getStudentById(id);
  },

  async getStudentById(id) {
    const s = await prisma.user.findUnique({
      where: { id },
      include: {
        enrollments: {
          include: {
            course: {
              include: {
                modules: {
                  include: {
                    lessons: true
                  }
                },
                reviews: true
              }
            }
          }
        },
        payments: {
          include: { course: true },
          orderBy: { createdAt: "desc" }
        },
        certificates: {
          include: { course: true },
          orderBy: { createdAt: "desc" }
        }
      }
    });

    if (!s) return null;

    const enrolledCoursesList = s.enrollments.map((e, idx) => {
      const allLessons = e.course?.modules?.flatMap((m) => m.lessons) || [];
      return {
        id: e.course?.id || idx + 1,
        title: e.course?.title || "Enrolled Course",
        progress: e.status === "COMPLETED" ? 100 : Math.round(e.progress || 50),
        lastAccessed: e.updatedAt ? new Date(e.updatedAt).toLocaleDateString() : "Recently",
        status: e.status === "COMPLETED" ? "Completed" : "In Progress",
        image: e.course?.thumbnail || "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300&q=80",
        modules: allLessons.length > 0
          ? allLessons.map((l) => ({
              title: l.title,
              status: "Completed",
              date: "Completed"
            }))
          : [
              { title: "Course Introduction", status: "Completed", date: "Joined" },
              { title: "Main Core Modules", status: "In Progress", date: "Active" }
            ]
      };
    });

    const payments = s.payments.map((p) => ({
      id: `INV-${p.id.substring(0, 8).toUpperCase()}`,
      date: p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "Today",
      amount: `₹${p.amount}`,
      status: p.status === "SUCCESS" ? "Completed" : p.status,
      method: "Online Payment (UPI/Card)",
      course: p.course?.title || "Course Enrollment"
    }));

    const activities = [];
    s.certificates.forEach((c) => {
      activities.push({
        id: `cert-${c.id}`,
        type: "course_completed",
        title: "Certificate Earned",
        description: `Successfully completed "${c.course?.title || "Course"}"`,
        date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recently",
        icon: "Award",
        color: "bg-emerald-100 text-emerald-600",
        dot: "bg-emerald-500"
      });
    });

    s.payments.forEach((p) => {
      activities.push({
        id: `pay-${p.id}`,
        type: "enrolled",
        title: "Course Purchased",
        description: `Purchased "${p.course?.title || "Course"}" for ₹${p.amount}`,
        date: p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Recently",
        icon: "CheckCircle",
        color: "bg-purple-100 text-purple-600",
        dot: "bg-purple-500"
      });
    });

    activities.push({
      id: `reg-${s.id}`,
      type: "login",
      title: "Account Registered",
      description: `Registered student account (${s.email})`,
      date: s.createdAt ? new Date(s.createdAt).toLocaleDateString() : "Account Created",
      icon: "Clock",
      color: "bg-gray-100 text-gray-600",
      dot: "bg-gray-400"
    });

    return {
      student: {
        id: s.id,
        name: s.name,
        email: s.email,
        phone: s.phone || "-",
        address: "Verified Student Profile",
        joinedDate: s.createdAt ? new Date(s.createdAt).toISOString().split("T")[0] : "2026-01-01",
        status: s.isDeactivated ? "Blocked" : "Active",
        enrolledCourses: s.enrollments.length,
        completedCourses: s.enrollments.filter((e) => e.status === "COMPLETED").length,
        certificates: s.certificates.length
      },
      payments,
      activities,
      enrolledCoursesList
    };
  },

  async getInstructors(filters) {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 10;
    const skip = (page - 1) * limit;

    const where = { role: "INSTRUCTOR" };
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { email: { contains: filters.search } }
      ];
    }
    if (filters.status && filters.status !== "All") {
      if (filters.status === "Suspended" || filters.status === "Inactive") {
        where.isDeactivated = true;
      } else if (filters.status === "Active") {
        where.isDeactivated = false;
      }
    }

    const [dbInstructors, total, totalAll, activeCount, suspendedCount, totalRevenueResult] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          courses: { select: { id: true, price: true, rating: true } },
          _count: { select: { courses: true } }
        }
      }),
      prisma.user.count({ where }),
      prisma.user.count({ where: { role: "INSTRUCTOR" } }),
      prisma.user.count({ where: { role: "INSTRUCTOR", isDeactivated: false } }),
      prisma.user.count({ where: { role: "INSTRUCTOR", isDeactivated: true } }),
      prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "SUCCESS" } })
    ]);

    const totalRevenue = totalRevenueResult._sum.amount || 0;

    const data = await Promise.all(
      dbInstructors.map(async (i) => {
        const courseCount = i._count.courses || 0;

        const [studentCount, revenueResult, ratingResult] = await Promise.all([
          prisma.enrollment.count({ where: { course: { instructorId: i.id } } }),
          prisma.payment.aggregate({
            _sum: { amount: true },
            where: { status: "SUCCESS", course: { instructorId: i.id } }
          }),
          prisma.review.aggregate({
            _avg: { rating: true },
            where: { course: { instructorId: i.id } }
          })
        ]);

        const revenue = revenueResult._sum.amount || 0;
        const rating = ratingResult._avg.rating
          ? parseFloat(ratingResult._avg.rating.toFixed(1))
          : 5.0;

        return {
          id: i.id,
          name: i.name,
          email: i.email,
          phone: i.phone || "-",
          courses: courseCount,
          students: studentCount,
          revenue,
          rating,
          status: i.isDeactivated ? "Suspended" : "Active",
          joinedDate: i.createdAt ? new Date(i.createdAt).toISOString().split("T")[0] : "Recent"
        };
      })
    );

    return {
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
      stats: {
        total: totalAll,
        active: activeCount,
        suspended: suspendedCount,
        totalRevenue
      }
    };
  },

  async getInstructorById(id) {
    const inst = await prisma.user.findUnique({
      where: { id },
      include: {
        courses: {
          include: {
            enrollments: true,
            reviews: { include: { user: true } },
            payments: { where: { status: "SUCCESS" }, include: { user: true } }
          }
        }
      }
    });

    if (!inst) return null;

    let totalStudents = 0;
    let totalRevenue = 0;

    const publishedCoursesList = inst.courses.map((c) => {
      const studentCount = c.enrollments.length;
      const courseRev = c.payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      totalStudents += studentCount;
      totalRevenue += courseRev;

      const avgRating = c.reviews.length > 0
        ? (c.reviews.reduce((sum, r) => sum + r.rating, 0) / c.reviews.length).toFixed(1)
        : 5.0;

      return {
        id: c.id,
        title: c.title,
        students: studentCount,
        rating: parseFloat(avgRating),
        revenue: `₹${courseRev.toLocaleString()}`,
        status: c.status === "PUBLISHED" ? "Published" : c.status,
        image: c.thumbnail || "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=300&q=80",
        metrics: {
          completionRate: c.enrollments.length > 0 ? Math.round((c.enrollments.filter((e) => e.status === "COMPLETED").length / c.enrollments.length) * 100) : 100,
          activeStudents: studentCount,
          fiveStarReviews: c.reviews.filter((r) => r.rating === 5).length,
          refundRate: 0.0
        },
        topReviews: c.reviews.map((r) => ({
          user: r.user?.name || "Student",
          rating: r.rating,
          comment: r.comment,
          date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : "Recently"
        }))
      };
    });

    const payouts = inst.courses.flatMap((c) =>
      c.payments.map((p) => ({
        id: `PAY-${p.id.substring(0, 8).toUpperCase()}`,
        date: p.createdAt ? new Date(p.createdAt).toISOString().split("T")[0] : "Today",
        amount: `₹${p.amount}`,
        status: p.status === "SUCCESS" ? "Processed" : p.status,
        period: p.createdAt ? new Date(p.createdAt).toLocaleDateString("default", { month: "short", year: "numeric" }) : "Recent"
      }))
    );

    const activities = inst.courses.map((c) => ({
      id: `course-${c.id}`,
      type: "course_published",
      title: "Published Course",
      description: `Course "${c.title}" published on platform`,
      date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : "Recently",
      icon: "BookOpen",
      color: "bg-emerald-100 text-emerald-600",
      dot: "bg-emerald-500"
    }));

    activities.push({
      id: `reg-${inst.id}`,
      type: "login",
      title: "Instructor Account Created",
      description: `Instructor profile registered (${inst.email})`,
      date: inst.createdAt ? new Date(inst.createdAt).toLocaleDateString() : "Recently",
      icon: "Clock",
      color: "bg-gray-100 text-gray-600",
      dot: "bg-gray-400"
    });

    return {
      instructor: {
        id: inst.id,
        name: inst.name,
        email: inst.email,
        phone: inst.phone || "-",
        qualification: "Senior Technical Instructor",
        experience: "5+ Years",
        skills: "Robotics, IoT, Embedded Systems, ROS2",
        joinedDate: inst.createdAt ? new Date(inst.createdAt).toISOString().split("T")[0] : "2026-01-01",
        status: inst.isDeactivated ? "Suspended" : "Active",
        courses: inst.courses.length,
        students: totalStudents,
        revenue: totalRevenue,
        totalStudents,
        rating: publishedCoursesList.length > 0
          ? (publishedCoursesList.reduce((acc, c) => acc + Number(c.rating), 0) / publishedCoursesList.length).toFixed(1)
          : 5.0
      },
      payouts,
      activities,
      publishedCoursesList
    };
  },

  async createInstructor(data) {
    const newInstructor = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: "$2b$10$defaultPasswordHashKeyForInstructor",
        role: "INSTRUCTOR",
        isEmailVerified: true
      }
    });

    return {
      id: newInstructor.id,
      name: newInstructor.name,
      email: newInstructor.email,
      phone: newInstructor.phone || "-",
      courses: 0,
      students: 0,
      revenue: 0,
      rating: "5.0",
      status: "Active",
      joinedDate: new Date(newInstructor.createdAt).toISOString().split("T")[0]
    };
  },

  async getAdmins(filters) {
    const where = { role: "ADMIN" };
    const dbAdmins = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" }
    });

    const data = dbAdmins.map((a) => ({
      id: a.id,
      name: a.name,
      email: a.email,
      role: "Super Admin",
      status: a.isDeactivated ? "Inactive" : "Active",
      lastLogin: a.updatedAt ? new Date(a.updatedAt).toLocaleDateString() : "Today"
    }));

    return {
      data,
      total: data.length,
      page: 1,
      totalPages: 1,
      stats: {
        total: data.length,
        superAdmins: data.length,
        active: data.filter((a) => a.status === "Active").length
      }
    };
  },

  async getAdminById(id) {
    const a = await prisma.user.findUnique({ where: { id } });
    if (!a) return null;
    return {
      id: a.id,
      name: a.name,
      email: a.email,
      role: "Super Admin",
      status: a.isDeactivated ? "Inactive" : "Active",
      lastLogin: "Today"
    };
  },

  async deleteUser(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return;

    // Clean up dependent records first to ensure permanent deletion without foreign key constraint errors
    await prisma.$transaction([
      prisma.cart.deleteMany({ where: { userId: id } }),
      prisma.wishlist.deleteMany({ where: { userId: id } }),
      prisma.notification.deleteMany({ where: { userId: id } }),
      prisma.securitySession.deleteMany({ where: { userId: id } }),
      prisma.userSettings.deleteMany({ where: { userId: id } }),
      prisma.notificationPreference.deleteMany({ where: { userId: id } }),
      prisma.submission.deleteMany({ where: { userId: id } }),
      prisma.projectSubmission.deleteMany({ where: { studentId: id } }),
      prisma.courseCompletion.deleteMany({ where: { OR: [{ userId: id }, { course: { instructorId: id } }] } }),
      prisma.certificate.deleteMany({ where: { OR: [{ userId: id }, { course: { instructorId: id } }] } }),
      prisma.review.deleteMany({ where: { OR: [{ userId: id }, { course: { instructorId: id } }] } }),
      prisma.payment.deleteMany({ where: { OR: [{ userId: id }, { course: { instructorId: id } }] } }),
      prisma.enrollment.deleteMany({ where: { OR: [{ userId: id }, { course: { instructorId: id } }] } }),
      prisma.project.deleteMany({ where: { instructorId: id } }),
      prisma.course.deleteMany({ where: { instructorId: id } }),
      prisma.user.delete({ where: { id } })
    ]);
  },

  async updateUserStatus(id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (user) {
      await prisma.user.update({
        where: { id },
        data: { isDeactivated: !user.isDeactivated }
      });
    }
  }
};

export { adminUsersService };
