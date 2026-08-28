import { prisma } from "../prisma.js";

export const getStudentOverview = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: true,
          instructor: { select: { id: true, name: true, profileImage: true } },
          modules: {
            include: {
              lessons: true
            }
          }
        }
      }
    }
  });

  const enrolledCount = enrollments.length;
  const completedCount = enrollments.filter((e) => e.status === "COMPLETED" || e.progress >= 100).length;

  let totalLearningMinutes = 0;
  const continueLearning = [];
  const categoryMap = {};

  for (const e of enrollments) {
    const course = e.course;
    if (!course) continue;

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const courseDuration = allLessons.reduce((sum, l) => sum + (l.duration || 15), 0);
    totalLearningMinutes += ((e.progress || 0) / 100) * (courseDuration || 60);

    const catName = course.category?.name || "General";
    if (!categoryMap[catName]) {
      categoryMap[catName] = { name: catName, total: 0, count: 0 };
    }
    categoryMap[catName].total += (e.progress || 0);
    categoryMap[catName].count += 1;

    continueLearning.push({
      courseId: course.id,
      courseTitle: course.title,
      thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
      instructorName: course.instructor?.name || "Instructor",
      category: catName,
      progressPercentage: Math.round(e.progress || 0),
      totalLessons: totalLessons || 1,
      completedLessons: Math.round(((e.progress || 0) / 100) * (totalLessons || 1)),
      status: e.progress >= 100 ? "Completed" : e.progress > 0 ? "In Progress" : "Not Started"
    });
  }

  const courseIds = enrollments.map((e) => e.courseId);

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { id: true, title: true } },
      submissions: { where: { userId } }
    },
    take: 5
  });

  const pendingTasks = assignments.map((a) => {
    const sub = a.submissions[0];
    return {
      id: a.id,
      taskName: a.title,
      course: a.course?.title || "Course",
      dueDate: a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "No due date",
      status: sub ? sub.status : "Pending",
      type: "assignment"
    };
  });

  const categoryBreakdown = Object.values(categoryMap).map((cat) => ({
    name: cat.name,
    percentage: Math.round(cat.total / (cat.count || 1))
  }));

  const notifications = await prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return {
    stats: {
      enrolled: enrolledCount,
      completed: completedCount,
      learningHours: `${Math.round(totalLearningMinutes / 60)} hrs`,
      streak: `${enrolledCount > 0 ? 1 : 0} Day`,
      xpPoints: `${enrolledCount * 150} XP`
    },
    continueLearning,
    categoryBreakdown,
    pendingTasks,
    notifications: notifications.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.message,
      createdAt: n.createdAt
    }))
  };
};

export const getStudentMyCourses = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: true,
          instructor: { select: { id: true, name: true, profileImage: true } },
          modules: { include: { lessons: true } }
        }
      }
    }
  });

  return enrollments.map((e) => {
    const course = e.course;
    const allLessons = (course?.modules || []).flatMap((m) => m.lessons);
    const totalLessons = allLessons.length;
    const completedLessons = Math.round(((e.progress || 0) / 100) * (totalLessons || 1));

    return {
      courseId: course.id,
      courseTitle: course.title,
      thumbnail: course.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400",
      instructorName: course.instructor?.name || "Instructor",
      category: course.category?.name || "General",
      progressPercentage: Math.round(e.progress || 0),
      lastWatchedLesson: allLessons[0]?.title || "Introduction",
      duration: `${Math.round((course.duration || 120) / 60)} Hours`,
      totalLessons: totalLessons || 1,
      completedLessons,
      certificateStatus: e.progress >= 100 ? "Available" : "Not Eligible Yet",
      status: e.progress >= 100 ? "Completed" : e.progress > 0 ? "In Progress" : "Not Started",
      lastAccessedDate: e.createdAt
    };
  });
};

export const getStudentAssignments = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true }
  });

  const courseIds = enrollments.map((e) => e.courseId);

  const assignments = await prisma.assignment.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { include: { instructor: { select: { name: true } } } },
      module: { select: { title: true } },
      submissions: { where: { userId } }
    }
  });

  return assignments.map((a) => {
    const sub = a.submissions[0];
    return {
      id: a.id,
      title: a.title,
      course: a.course?.title || "Course",
      module: a.module?.title || "General",
      type: "Assignment",
      dueDate: a.dueDate ? new Date(a.dueDate).toISOString() : null,
      maxMarks: a.points || 100,
      status: sub ? (sub.status === "GRADED" ? "Graded" : sub.status === "RESUBMISSION_REQUESTED" ? "Resubmission Required" : "Submitted") : "Pending",
      instructor: a.course?.instructor?.name || "Instructor",
      submission: sub ? { id: sub.id, marks: sub.marks, feedback: sub.feedback, fileUrl: sub.attachmentUrl } : null
    };
  });
};

export const getStudentQuizzes = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true }
  });

  const courseIds = enrollments.map((e) => e.courseId);

  const quizzes = await prisma.quiz.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true } },
      module: { select: { title: true } },
      results: { where: { userId } }
    }
  });

  return quizzes.map((q) => {
    const result = q.results[0];
    return {
      id: q.id,
      title: q.title,
      course: q.course?.title || "Course",
      module: q.module?.title || "General",
      questions: q.questionCount || 10,
      totalMarks: q.totalMarks || 100,
      passingMarks: q.passingMarks || 40,
      timeLimit: `${q.timeLimit || 30} mins`,
      allowedAttempts: q.allowedAttempts || 3,
      attemptsUsed: q.results ? q.results.length : 0,
      dueDate: q.dueDate ? new Date(q.dueDate).toISOString() : null,
      status: result ? (result.passed ? "Completed" : "In Progress") : "Not Started",
      score: result ? result.score : null
    };
  });
};

export const getStudentProjects = async (userId) => {
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    select: { courseId: true }
  });

  const courseIds = enrollments.map((e) => e.courseId);

  const projects = await prisma.project.findMany({
    where: { courseId: { in: courseIds } },
    include: {
      course: { select: { title: true } },
      submissions: { where: { studentId: userId } }
    }
  });

  return projects.map((p) => {
    const sub = p.submissions[0];
    return {
      id: p.id,
      title: p.title,
      course: p.course?.title || "Course",
      module: "Capstone",
      dueDate: p.dueDate ? new Date(p.dueDate).toISOString() : null,
      maxMarks: p.maxMarks || 100,
      status: sub ? (sub.status === "GRADED" ? "Graded" : sub.status === "RESUBMISSION_REQUESTED" ? "Resubmission Required" : "Submitted") : "Pending",
      submission: sub ? { id: sub.id, marks: sub.marks, feedback: sub.feedback } : null
    };
  });
};

export const getStudentCertificates = async (userId) => {
  const certificates = await prisma.certificate.findMany({
    where: { userId },
    include: {
      course: { include: { instructor: { select: { name: true } } } }
    }
  });

  return certificates.map((c) => ({
    id: c.id,
    courseTitle: c.course?.title || "Course Certificate",
    instructorName: c.course?.instructor?.name || "Instructor",
    issueDate: c.issueDate ? new Date(c.issueDate).toLocaleDateString() : new Date().toLocaleDateString(),
    certificateUrl: c.certificateUrl || "#",
    serialNumber: c.serialNumber || `CERT-${c.id.substring(0, 8).toUpperCase()}`
  }));
};
