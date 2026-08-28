import { prisma } from "../prisma.js";
import { COURSE_STATUS_LABELS, levelLabel } from "./coursePipeline.service.js";

const getInitials = (name = "") => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "S";
  return parts.slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
};

const toDate = (value) => (value ? new Date(value) : null);

const toIsoDate = (value) => {
  const date = toDate(value);
  return date ? date.toISOString().slice(0, 10) : null;
};

const relativeTime = (value) => {
  const date = toDate(value);
  if (!date) return "Not active yet";

  const diff = Date.now() - date.getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return "Just now";
  if (diff < hour) return `${Math.max(Math.round(diff / minute), 1)} mins ago`;
  if (diff < day) return `${Math.max(Math.round(diff / hour), 1)} hours ago`;
  if (diff < day * 30) return `${Math.max(Math.round(diff / day), 1)} days ago`;
  return date.toLocaleDateString();
};

const cleanString = (value) => (value === null || value === undefined ? "" : String(value).trim());

const parseNumber = (value, fallback = 0) => {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "number") return Number.isFinite(value) ? value : fallback;
  const match = String(value).match(/\d+/);
  if (match) {
    const parsed = Number(match[0]);
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
};

const normalizeSubmissionStatus = (status) => {
  const value = cleanString(status).toUpperCase().replace(/[\s-]+/g, "_");
  if (value === "GRADED") return "Graded";
  if (value === "RESUBMISSION_REQUIRED" || value === "RESUBMISSION_REQUESTED") return "Resubmission Requested";
  if (value === "UNDER_REVIEW") return "Under Review";
  if (value === "SUBMITTED" || value === "PENDING") return "Pending Review";
  return cleanString(status) || "Pending Review";
};

const statusFromCourse = (courseStatus) => (courseStatus === "PUBLISHED" ? "Published" : "Draft");

const getInstructorCourseIds = async (instructorId) => {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true }
  });
  return courses.map((course) => course.id);
};

const ensureCourseAccess = async (courseId, instructorId) => {
  const course = await prisma.course.findFirst({
    where: { id: courseId, instructorId },
    select: { id: true, title: true }
  });

  if (!course) {
    const error = new Error("Course not found for this instructor.");
    error.statusCode = 404;
    throw error;
  }

  return course;
};

const ensureModuleAccess = async (moduleId, instructorId, courseId = null) => {
  if (!moduleId) return null;
  const module = await prisma.module.findFirst({
    where: { id: moduleId, course: { instructorId } },
    include: { course: { select: { id: true, title: true } } }
  });

  if (!module) {
    if (courseId) {
      await ensureCourseAccess(courseId, instructorId);
      return null;
    }
    const error = new Error("Module not found for this instructor.");
    error.statusCode = 404;
    throw error;
  }

  return module;
};

const getModuleLookup = async (instructorId) => {
  const modules = await prisma.module.findMany({
    where: { course: { instructorId } },
    select: { id: true, title: true }
  });
  return new Map(modules.map((module) => [module.id, module.title]));
};

const withModuleInfo = (record, moduleLookup) => ({
  ...record,
  module: record.moduleId ? { id: record.moduleId, title: moduleLookup.get(record.moduleId) || "Module" } : null
});

const formatQuestion = (question) => {
  const options = Array.isArray(question.options) ? question.options : [];
  const correctIndex = options.findIndex((option) => option === question.correctAnswer);

  return {
    id: question.id,
    question: question.question,
    options,
    correctAnswer: question.correctAnswer,
    correctOption: correctIndex >= 0 ? correctIndex : 0
  };
};

const formatQuiz = (quiz) => {
  const qList = (quiz.questions || []).map(formatQuestion);
  const marksPerQuestion = parseNumber(quiz.marksPerQuestion, 10);
  const totalMarks = marksPerQuestion * qList.length;
  const passingMarks = parseNumber(quiz.passingMarks, Math.round(totalMarks * 0.6));

  return {
    id: quiz.id,
    courseId: quiz.courseId,
    courseName: quiz.course?.title || "",
    moduleId: quiz.moduleId || "",
    moduleName: quiz.module?.title || "Unassigned",
    title: quiz.title,
    status: statusFromCourse(quiz.course?.status),
    questions: qList,
    questionCount: qList.length,
    marksPerQuestion,
    totalMarks,
    passingMarks
  };
};

const formatAssignment = (assignment) => ({
  id: assignment.id,
  courseId: assignment.courseId,
  courseName: assignment.course?.title || "",
  moduleId: assignment.moduleId || "",
  moduleName: assignment.module?.title || "Unassigned",
  title: assignment.title,
  description: assignment.description || "",
  points: assignment.points ?? 100,
  dueDate: assignment.dueDate,
  attachmentUrl: assignment.attachmentUrl || "",
  fileUrl: assignment.attachmentUrl || "",
  status: statusFromCourse(assignment.course?.status),
  submissions: assignment._count?.submissions || assignment.submissions?.length || 0
});

const formatProject = (project) => ({
  id: project.id,
  courseId: project.courseId,
  courseName: project.course?.title || "",
  moduleId: project.moduleId || "",
  moduleName: project.module?.title || "Unassigned",
  title: project.title,
  description: project.description || "",
  dueDate: project.dueDate,
  maxMarks: project.maxMarks ?? 100,
  projectFileUrl: project.projectFileUrl || "",
  attachmentUrl: project.projectFileUrl || "",
  fileUrl: project.projectFileUrl || "",
  allowResubmission: Boolean(project.allowResubmission),
  status: project.status || statusFromCourse(project.course?.status),
  submissions: project._count?.submissions || project.submissions?.length || 0
});

const formatLesson = (lesson) => ({
  id: lesson.id,
  courseId: lesson.module?.courseId,
  courseName: lesson.module?.course?.title || "",
  moduleId: lesson.moduleId,
  moduleName: lesson.module?.title || "Module",
  title: lesson.title,
  description: lesson.description || "",
  duration: lesson.duration,
  durationLabel: lesson.duration ? `${lesson.duration} min` : "Not set",
  isPreview: Boolean(lesson.isPreview),
  videoUrl: lesson.videoUrl || "",
  status: statusFromCourse(lesson.module?.course?.status),
  type: "lesson"
});

const buildModuleItems = (course, module) => {
  const lessons = (module.lessons || []).map((lesson) => ({
    id: lesson.id,
    type: "lesson",
    title: lesson.title,
    description: lesson.description || "",
    duration: lesson.duration ? `${lesson.duration} min` : "Not set",
    durationMinutes: lesson.duration,
    isPreview: Boolean(lesson.isPreview),
    videoUrl: lesson.videoUrl || "",
    status: statusFromCourse(course.status)
  }));

  const quizzes = (course.quizzes || [])
    .filter((quiz) => quiz.moduleId === module.id)
    .map((quiz) => {
      const qList = (quiz.questions || []).map(formatQuestion);
      const marksPerQuestion = parseNumber(quiz.marksPerQuestion, 10);
      const totalMarks = marksPerQuestion * qList.length;
      const passingMarks = parseNumber(quiz.passingMarks, Math.round(totalMarks * 0.6));

      return {
        id: quiz.id,
        type: "quiz",
        title: quiz.title,
        status: statusFromCourse(course.status),
        questions: qList,
        questionCount: qList.length,
        questionList: qList,
        marksPerQuestion,
        totalMarks,
        passingMarks
      };
    });

  const assignments = (course.assignments || [])
    .filter((assignment) => assignment.moduleId === module.id)
    .map((assignment) => ({
      id: assignment.id,
      type: "assignment",
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.dueDate,
      points: 100,
      status: statusFromCourse(course.status)
    }));

  const projects = (course.projects || [])
    .filter((project) => project.moduleId === module.id)
    .map((project) => ({
      id: project.id,
      type: "project",
      title: project.title,
      description: project.description || "",
      dueDate: project.dueDate,
      maxMarks: project.maxMarks,
      points: project.maxMarks || 100,
      status: project.status || statusFromCourse(course.status)
    }));

  return [...lessons, ...quizzes, ...assignments, ...projects];
};

const formatWorkspaceCourse = (course) => {
  const modules = (course.modules || []).map((module) => ({
    id: module.id,
    title: module.title,
    courseId: course.id,
    order: module.order,
    lessons: buildModuleItems(course, module)
  }));

  const unassignedItems = [
    ...(course.quizzes || []).filter((quiz) => !quiz.moduleId).map((quiz) => ({
      id: quiz.id,
      type: "quiz",
      title: quiz.title,
      status: statusFromCourse(course.status),
      questions: (quiz.questions || []).map(formatQuestion)
    })),
    ...(course.assignments || []).filter((assignment) => !assignment.moduleId).map((assignment) => ({
      id: assignment.id,
      type: "assignment",
      title: assignment.title,
      description: assignment.description || "",
      dueDate: assignment.dueDate,
      status: statusFromCourse(course.status)
    })),
    ...(course.projects || []).filter((project) => !project.moduleId).map((project) => ({
      id: project.id,
      type: "project",
      title: project.title,
      description: project.description || "",
      dueDate: project.dueDate,
      maxMarks: project.maxMarks,
      status: project.status || statusFromCourse(course.status)
    }))
  ];

  if (unassignedItems.length) {
    modules.push({
      id: `${course.id}-unassigned`,
      title: "Unassigned Items",
      courseId: course.id,
      order: modules.length,
      lessons: unassignedItems
    });
  }

  return {
    id: course.id,
    title: course.title,
    status: COURSE_STATUS_LABELS[course.status] || course.status,
    modules
  };
};

export const getInstructorWorkspace = async (instructorId) => {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } }
      },
      quizzes: { include: { questions: true } },
      assignments: true,
      projects: true
    },
    orderBy: { updatedAt: "desc" }
  });

  return courses.map(formatWorkspaceCourse);
};

export const getInstructorDashboardData = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  const emptyStats = {
    totalCourses: 0,
    activeCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    revenueTrend: "+0.0%",
    studentsTrend: "+0.0%",
    ratingTrend: "+0.0",
    coursesTrend: "+0.0%",
    pendingAssignments: 0,
    pendingProjects: 0,
    completionRate: 0,
    recentEnrollments: [],
    recentReviews: [],
    revenueChart: []
  };

  if (!courseIds.length) return emptyStats;

  const [
    courses,
    enrollments,
    payments,
    assignmentPending,
    projectPending,
    completions,
    recentEnrollments,
    recentReviews
  ] = await Promise.all([
    prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { id: true, status: true, rating: true, title: true, createdAt: true }
    }),
    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      select: { id: true, userId: true, createdAt: true }
    }),
    prisma.payment.findMany({
      where: { courseId: { in: courseIds }, status: "SUCCESS" },
      select: { amount: true, createdAt: true }
    }),
    prisma.submission.count({
      where: {
        status: { in: ["SUBMITTED", "PENDING", "UNDER_REVIEW"] },
        assignment: { courseId: { in: courseIds } }
      }
    }),
    prisma.projectSubmission.count({
      where: {
        status: { in: ["SUBMITTED", "PENDING", "UNDER_REVIEW"] },
        project: { courseId: { in: courseIds } }
      }
    }),
    prisma.courseCompletion.findMany({
      where: { courseId: { in: courseIds } },
      select: { overallProgress: true, isCompleted: true }
    }),
    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.review.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, name: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 10
    })
  ]);

  const uniqueStudents = new Set(enrollments.map((enrollment) => enrollment.userId));
  const ratedCourses = courses.filter((course) => Number(course.rating) > 0);
  const averageRating = ratedCourses.length
    ? ratedCourses.reduce((sum, course) => sum + Number(course.rating || 0), 0) / ratedCourses.length
    : 0;
  const completionRate = completions.length
    ? completions.reduce((sum, item) => sum + Number(item.overallProgress || (item.isCompleted ? 100 : 0)), 0) / completions.length
    : 0;

  // Trend Calculations
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  // Revenue trend
  const currentMonthRevenue = payments
    .filter((p) => p.createdAt && new Date(p.createdAt) >= startOfCurrentMonth)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);
  const lastMonthRevenue = payments
    .filter((p) => p.createdAt && new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) < startOfCurrentMonth)
    .reduce((sum, p) => sum + Number(p.amount || 0), 0);

  let revenueTrend = "+0.0%";
  if (lastMonthRevenue > 0) {
    const change = ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100;
    revenueTrend = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  } else if (currentMonthRevenue > 0) {
    revenueTrend = "+100.0%";
  }

  // Student trend
  const currentMonthStudents = new Set(
    enrollments.filter((e) => e.createdAt && new Date(e.createdAt) >= startOfCurrentMonth).map((e) => e.userId)
  ).size;
  const lastMonthStudents = new Set(
    enrollments.filter((e) => e.createdAt && new Date(e.createdAt) >= startOfLastMonth && new Date(e.createdAt) < startOfCurrentMonth).map((e) => e.userId)
  ).size;

  let studentsTrend = "+0.0%";
  if (lastMonthStudents > 0) {
    const change = ((currentMonthStudents - lastMonthStudents) / lastMonthStudents) * 100;
    studentsTrend = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  } else if (currentMonthStudents > 0) {
    studentsTrend = "+100.0%";
  }

  // Rating trend
  const currentMonthReviews = recentReviews.filter((r) => r.createdAt && new Date(r.createdAt) >= startOfCurrentMonth);
  const lastMonthReviews = recentReviews.filter((r) => r.createdAt && new Date(r.createdAt) >= startOfLastMonth && new Date(r.createdAt) < startOfCurrentMonth);
  const currentAvg = currentMonthReviews.length
    ? currentMonthReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / currentMonthReviews.length
    : averageRating;
  const lastAvg = lastMonthReviews.length
    ? lastMonthReviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) / lastMonthReviews.length
    : averageRating;

  const ratingDiff = currentAvg - lastAvg;
  const ratingTrend = `${ratingDiff >= 0 ? "+" : ""}${ratingDiff.toFixed(1)}`;

  // Course trend
  const currentMonthCoursesCount = courses.filter((c) => c.createdAt && new Date(c.createdAt) >= startOfCurrentMonth).length;
  const lastMonthCoursesCount = courses.filter((c) => c.createdAt && new Date(c.createdAt) >= startOfLastMonth && new Date(c.createdAt) < startOfCurrentMonth).length;

  let coursesTrend = "+0.0%";
  if (lastMonthCoursesCount > 0) {
    const change = ((currentMonthCoursesCount - lastMonthCoursesCount) / lastMonthCoursesCount) * 100;
    coursesTrend = `${change >= 0 ? "+" : ""}${change.toFixed(1)}%`;
  } else if (currentMonthCoursesCount > 0) {
    coursesTrend = "+100.0%";
  }

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const revenueChart = Array.from({ length: 7 }).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - index));
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);
    const revenue = payments
      .filter((payment) => payment.createdAt >= dayStart && payment.createdAt <= dayEnd)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return { name: weekDays[date.getDay()], Revenue: revenue };
  });

  return {
    totalCourses: courses.length,
    activeCourses: courses.filter((course) => course.status === "PUBLISHED").length,
    totalStudents: uniqueStudents.size,
    totalRevenue: payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0),
    averageRating: Number(averageRating.toFixed(1)),
    revenueTrend,
    studentsTrend,
    ratingTrend,
    coursesTrend,
    pendingAssignments: assignmentPending,
    pendingProjects: projectPending,
    completionRate: Math.round(completionRate),
    recentEnrollments: recentEnrollments.slice(0, 5).map((enrollment) => ({
      id: enrollment.id,
      name: enrollment.user?.name || "Student",
      course: enrollment.course?.title || "Course",
      date: relativeTime(enrollment.createdAt)
    })),
    recentReviews: recentReviews.slice(0, 5).map((review) => ({
      id: review.id,
      name: review.user?.name || "Student",
      course: review.course?.title || "Course",
      rating: review.rating,
      text: review.comment || "",
      date: relativeTime(review.createdAt)
    })),
    revenueChart
  };
};

export const getRecentInstructorActivity = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return [];

  const [enrollments, assignmentSubmissions, projectSubmissions, reviews, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.submission.findMany({
      where: { assignment: { courseId: { in: courseIds } } },
      include: {
        user: { select: { name: true } },
        assignment: { include: { course: { select: { title: true } } } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.projectSubmission.findMany({
      where: { project: { courseId: { in: courseIds } } },
      include: {
        student: { select: { name: true } },
        project: { include: { course: { select: { title: true } } } }
      },
      orderBy: { updatedAt: "desc" },
      take: 5
    }),
    prisma.review.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      },
      orderBy: { createdAt: "desc" },
      take: 5
    }),
    prisma.certificate.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { name: true } },
        course: { select: { title: true } }
      },
      orderBy: { issuedDate: "desc" },
      take: 5
    })
  ]);

  return [
    ...enrollments.map((item) => ({
      id: item.id,
      type: "enrollment",
      message: `${item.user?.name || "Student"} enrolled in ${item.course?.title || "a course"}`,
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    })),
    ...assignmentSubmissions.map((item) => ({
      id: item.id,
      type: "submission",
      message: `${item.user?.name || "Student"} submitted ${item.assignment?.title || "an assignment"}`,
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    })),
    ...projectSubmissions.map((item) => ({
      id: item.id,
      type: "project",
      message: `${item.student?.name || "Student"} submitted ${item.project?.title || "a project"}`,
      time: relativeTime(item.submittedAt || item.updatedAt),
      createdAt: item.submittedAt || item.updatedAt
    })),
    ...reviews.map((item) => ({
      id: item.id,
      type: "review",
      message: `${item.user?.name || "Student"} reviewed ${item.course?.title || "a course"}`,
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    })),
    ...certificates.map((item) => ({
      id: item.id,
      type: "certificate",
      message: `Certificate issued to ${item.user?.name || "Student"} for ${item.course?.title || "a course"}`,
      time: relativeTime(item.issuedDate),
      createdAt: item.issuedDate
    }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 10)
    .map(({ createdAt, ...item }) => item);
};

export const getInstructorLessons = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  const lessons = await prisma.lesson.findMany({
    where: {
      OR: [
        { module: { course: { instructorId } } },
        { module: { courseId: { in: courseIds } } }
      ]
    },
    include: {
      module: {
        include: { course: { select: { id: true, title: true, status: true } } }
      }
    },
    orderBy: [{ module: { order: "asc" } }, { order: "asc" }]
  });

  return lessons.map(formatLesson);
};

export const saveInstructorLesson = async ({ instructorId, lessonId, input }) => {
  const title = cleanString(input.title);
  if (!title) {
    const error = new Error("Lesson title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (lessonId) {
    const existing = await prisma.lesson.findFirst({
      where: { id: lessonId, module: { course: { instructorId } } },
      select: { id: true }
    });
    if (!existing) {
      const error = new Error("Lesson not found.");
      error.statusCode = 404;
      throw error;
    }

    const lesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        title,
        description: cleanString(input.description) || null,
        duration: input.duration === "" ? null : parseNumber(input.duration, null),
        isPreview: Boolean(input.isPreview),
        videoUrl: cleanString(input.videoUrl) || null
      },
      include: {
        module: { include: { course: { select: { id: true, title: true, status: true } } } }
      }
    });
    return formatLesson(lesson);
  }

  const module = await ensureModuleAccess(input.moduleId, instructorId);
  const order = await prisma.lesson.count({ where: { moduleId: module.id } });
  const lesson = await prisma.lesson.create({
    data: {
      moduleId: module.id,
      title,
      description: cleanString(input.description) || null,
      duration: input.duration === "" ? null : parseNumber(input.duration, null),
      isPreview: Boolean(input.isPreview),
      videoUrl: cleanString(input.videoUrl) || null,
      order
    },
    include: {
      module: { include: { course: { select: { id: true, title: true, status: true } } } }
    }
  });
  return formatLesson(lesson);
};

export const deleteInstructorLesson = async ({ instructorId, lessonId }) => {
  const existing = await prisma.lesson.findFirst({
    where: { id: lessonId, module: { course: { instructorId } } },
    select: { id: true }
  });
  if (!existing) return false;
  await prisma.lesson.delete({ where: { id: lessonId } });
  return true;
};

export const getInstructorQuizzes = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  const [quizzes, moduleLookup] = await Promise.all([
    prisma.quiz.findMany({
      where: {
        OR: [
          { course: { instructorId } },
          { courseId: { in: courseIds } }
        ]
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        questions: true
      },
      orderBy: { title: "asc" }
    }),
    getModuleLookup(instructorId)
  ]);

  return quizzes.map((quiz) => formatQuiz(withModuleInfo(quiz, moduleLookup)));
};

export const saveInstructorQuiz = async ({ instructorId, quizId, input }) => {
  const title = cleanString(input.title);
  if (!title) {
    const error = new Error("Quiz title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!quizId && !input.courseId) {
    const error = new Error("Course is required to create a quiz.");
    error.statusCode = 400;
    throw error;
  }

  if (input.courseId) await ensureCourseAccess(input.courseId, instructorId);
  if (input.moduleId) await ensureModuleAccess(input.moduleId, instructorId);

  const questionsInput = Array.isArray(input.questions) ? input.questions : [];
  const normalizedQuestions = questionsInput
    .map((q) => {
      const qText = cleanString(q.question) || "New Question";
      
      let rawOpts = Array.isArray(q.options)
        ? q.options.map((opt) => (typeof opt === "string" ? opt.trim() : String(opt || "")))
        : [];
      
      let opts = rawOpts.filter(Boolean);
      if (opts.length === 0) {
        opts = ["Option 1", "Option 2"];
      } else if (opts.length === 1) {
        opts = [opts[0], opts[0] === "Option 1" ? "Option 2" : "Option 1"];
      }

      const correctIndex = typeof q.correctOption === "number" && q.correctOption >= 0 && q.correctOption < opts.length ? q.correctOption : 0;
      const cAns = cleanString(q.correctAnswer) || opts[correctIndex] || opts[0] || "Option 1";

      return {
        question: qText,
        options: opts,
        correctAnswer: cAns
      };
    })
    .filter((q) => Boolean(q.question));

  const marksPerQuestion = parseNumber(input.marksPerQuestion, 10);
  const totalMarks = marksPerQuestion * normalizedQuestions.length;
  const passingMarks = parseNumber(input.passingMarks, Math.round(totalMarks * 0.6));

  const saved = await prisma.$transaction(async (tx) => {
    let quiz;

    if (quizId) {
      const existing = await tx.quiz.findFirst({
        where: { id: quizId, course: { instructorId } },
        select: { id: true, courseId: true, moduleId: true }
      });
      if (!existing) {
        const error = new Error("Quiz not found.");
        error.statusCode = 404;
        throw error;
      }

      quiz = await tx.quiz.update({
        where: { id: quizId },
        data: {
          title,
          marksPerQuestion,
          passingMarks,
          courseId: input.courseId || existing.courseId,
          moduleId: input.moduleId !== undefined ? input.moduleId || null : existing.moduleId
        }
      });
      await tx.question.deleteMany({ where: { quizId } });
    } else {
      quiz = await tx.quiz.create({
        data: {
          title,
          marksPerQuestion,
          passingMarks,
          courseId: input.courseId,
          moduleId: input.moduleId || null
        }
      });
    }

    if (normalizedQuestions.length) {
      await tx.question.createMany({
        data: normalizedQuestions.map((question) => ({
          quizId: quiz.id,
          question: question.question,
          options: question.options,
          correctAnswer: question.correctAnswer
        }))
      });
    }

    return tx.quiz.findUnique({
      where: { id: quiz.id },
      include: {
        course: { select: { id: true, title: true, status: true } },
        questions: true
      }
    });
  });

  const moduleLookup = await getModuleLookup(instructorId);
  return formatQuiz(withModuleInfo(saved, moduleLookup));
};

export const deleteInstructorQuiz = async ({ instructorId, quizId }) => {
  const existing = await prisma.quiz.findFirst({
    where: { id: quizId, course: { instructorId } },
    select: { id: true }
  });
  if (!existing) return false;
  await prisma.quiz.delete({ where: { id: quizId } });
  return true;
};

export const getInstructorAssignments = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  const [assignments, moduleLookup] = await Promise.all([
    prisma.assignment.findMany({
      where: {
        OR: [
          { course: { instructorId } },
          { courseId: { in: courseIds } }
        ]
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { title: "asc" }
    }),
    getModuleLookup(instructorId)
  ]);

  return assignments.map((assignment) => formatAssignment(withModuleInfo(assignment, moduleLookup)));
};

export const saveInstructorAssignment = async ({ instructorId, assignmentId, input }) => {
  const title = cleanString(input.title);
  if (!title) {
    const error = new Error("Assignment title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!assignmentId && !input.courseId) {
    const error = new Error("Course is required to create an assignment.");
    error.statusCode = 400;
    throw error;
  }

  if (input.courseId) await ensureCourseAccess(input.courseId, instructorId);
  if (input.moduleId) await ensureModuleAccess(input.moduleId, instructorId, input.courseId);

  const data = {
    title,
    description: cleanString(input.description) || title,
    points: parseNumber(input.points ?? input.maxMarks, 100),
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    attachmentUrl: cleanString(input.attachmentUrl || input.fileUrl) || null,
    ...(input.courseId ? { courseId: input.courseId } : {}),
    moduleId: input.moduleId || null
  };

  let assignment;
  if (assignmentId) {
    const existing = await prisma.assignment.findFirst({
      where: { id: assignmentId, course: { instructorId } },
      select: { id: true, moduleId: true }
    });
    if (!existing) {
      const error = new Error("Assignment not found.");
      error.statusCode = 404;
      throw error;
    }

    assignment = await prisma.assignment.update({
      where: { id: assignmentId },
      data: {
        ...data,
        moduleId: input.moduleId !== undefined ? input.moduleId || null : existing.moduleId
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      }
    });
  } else {
    assignment = await prisma.assignment.create({
      data: {
        ...data,
        courseId: input.courseId
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      }
    });
  }

  const moduleLookup = await getModuleLookup(instructorId);
  return formatAssignment(withModuleInfo(assignment, moduleLookup));
};

export const deleteInstructorAssignment = async ({ instructorId, assignmentId }) => {
  const existing = await prisma.assignment.findFirst({
    where: { id: assignmentId, course: { instructorId } },
    select: { id: true }
  });
  if (!existing) return false;
  await prisma.assignment.delete({ where: { id: assignmentId } });
  return true;
};

export const getInstructorAssignmentSubmissions = async ({ instructorId, assignmentId }) => {
  const assignment = await prisma.assignment.findFirst({
    where: { id: assignmentId, course: { instructorId } },
    select: { id: true }
  });
  if (!assignment) return null;

  const submissions = await prisma.submission.findMany({
    where: { assignmentId },
    include: {
      user: { select: { id: true, name: true, email: true, profileImage: true } },
      assignment: { include: { course: { select: { id: true, title: true } } } }
    },
    orderBy: { createdAt: "desc" }
  });

  return submissions.map((submission) => ({
    id: submission.id,
    title: submission.assignment?.title || "Assignment",
    assignmentTitle: submission.assignment?.title || "Assignment",
    course: submission.assignment?.course?.title || "Course",
    studentId: submission.userId,
    studentName: submission.user?.name || "Student",
    studentEmail: submission.user?.email || "",
    submittedDate: relativeTime(submission.createdAt),
    submissionDate: submission.createdAt,
    status: normalizeSubmissionStatus(submission.status),
    marks: submission.marks === null || submission.marks === undefined ? "-" : `${submission.marks}/100`,
    feedback: submission.feedback || "",
    studentNote: submission.comment || "",
    fileUrl: submission.fileUrl || "",
    file: submission.fileUrl ? { name: submission.fileUrl.split("/").pop(), url: submission.fileUrl } : null
  }));
};

export const getInstructorProjects = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  const [projects, moduleLookup] = await Promise.all([
    prisma.project.findMany({
      where: {
        OR: [
          { instructorId },
          { course: { instructorId } },
          { courseId: { in: courseIds } }
        ]
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      },
      orderBy: { updatedAt: "desc" }
    }),
    getModuleLookup(instructorId)
  ]);

  return projects.map((project) => formatProject(withModuleInfo(project, moduleLookup)));
};

export const saveInstructorProject = async ({ instructorId, projectId, input }) => {
  const title = cleanString(input.title);
  if (!title) {
    const error = new Error("Project title is required.");
    error.statusCode = 400;
    throw error;
  }

  if (!projectId && !input.courseId) {
    const error = new Error("Course is required to create a project.");
    error.statusCode = 400;
    throw error;
  }

  if (input.courseId) await ensureCourseAccess(input.courseId, instructorId);
  if (input.moduleId) await ensureModuleAccess(input.moduleId, instructorId);

  const data = {
    title,
    description: cleanString(input.description) || title,
    dueDate: input.dueDate ? new Date(input.dueDate) : null,
    maxMarks: parseNumber(input.maxMarks, 100),
    projectFileUrl: cleanString(input.projectFileUrl || input.attachmentUrl || input.fileUrl) || null,
    allowResubmission: Boolean(input.allowResubmission),
    status: cleanString(input.status) || "PUBLISHED",
    ...(input.courseId ? { courseId: input.courseId } : {}),
    moduleId: input.moduleId || null
  };

  let project;
  if (projectId) {
    const existing = await prisma.project.findFirst({
      where: { id: projectId, instructorId },
      select: { id: true, moduleId: true }
    });
    if (!existing) {
      const error = new Error("Project not found.");
      error.statusCode = 404;
      throw error;
    }

    project = await prisma.project.update({
      where: { id: projectId },
      data: {
        ...data,
        moduleId: input.moduleId !== undefined ? input.moduleId || null : existing.moduleId
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      }
    });
  } else {
    project = await prisma.project.create({
      data: {
        ...data,
        courseId: input.courseId,
        instructorId
      },
      include: {
        course: { select: { id: true, title: true, status: true } },
        _count: { select: { submissions: true } }
      }
    });
  }

  const moduleLookup = await getModuleLookup(instructorId);
  return formatProject(withModuleInfo(project, moduleLookup));
};

export const deleteInstructorProject = async ({ instructorId, projectId }) => {
  const existing = await prisma.project.findFirst({
    where: { id: projectId, instructorId },
    select: { id: true }
  });
  if (!existing) return false;
  await prisma.project.delete({ where: { id: projectId } });
  return true;
};

export const getInstructorProjectSubmissions = async ({ instructorId, projectId }) => {
  const project = await prisma.project.findFirst({
    where: { id: projectId, instructorId },
    select: { id: true }
  });
  if (!project) return null;

  const submissions = await prisma.projectSubmission.findMany({
    where: { projectId },
    include: {
      student: { select: { id: true, name: true, email: true, profileImage: true } },
      project: { include: { course: { select: { id: true, title: true } } } }
    },
    orderBy: { updatedAt: "desc" }
  });

  return submissions.map((submission) => ({
    id: submission.id,
    title: submission.project?.title || "Project",
    projectTitle: submission.project?.title || "Project",
    course: submission.project?.course?.title || "Course",
    studentId: submission.studentId,
    studentName: submission.student?.name || "Student",
    studentEmail: submission.student?.email || "",
    submittedDate: relativeTime(submission.submittedAt || submission.updatedAt),
    submissionDate: submission.submittedAt || submission.updatedAt,
    status: normalizeSubmissionStatus(submission.status),
    marks: submission.marks === null || submission.marks === undefined ? "-" : `${submission.marks}/${submission.project?.maxMarks || 100}`,
    feedback: submission.feedback || "",
    studentNote: submission.studentNote || "",
    submittedLink: submission.submittedLink || "",
    fileUrl: submission.submittedFileUrl || ""
  }));
};

export const gradeAssignmentSubmission = async ({ instructorId, submissionId, input }) => {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, assignment: { course: { instructorId } } },
    include: { assignment: true }
  });
  if (!submission) return null;

  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      marks: parseNumber(input.marks, 0),
      feedback: cleanString(input.feedback) || null,
      status: cleanString(input.status).toUpperCase() || "GRADED"
    }
  });
};

export const requestAssignmentResubmission = async ({ instructorId, submissionId, input }) => {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, assignment: { course: { instructorId } } },
    select: { id: true }
  });
  if (!submission) return null;

  return prisma.submission.update({
    where: { id: submissionId },
    data: {
      feedback: cleanString(input.feedback) || "Please revise and resubmit this assignment.",
      status: "RESUBMISSION_REQUESTED"
    }
  });
};

export const gradeProjectSubmission = async ({ instructorId, submissionId, input }) => {
  const submission = await prisma.projectSubmission.findFirst({
    where: { id: submissionId, project: { instructorId } },
    select: { id: true }
  });
  if (!submission) return null;

  return prisma.projectSubmission.update({
    where: { id: submissionId },
    data: {
      marks: parseNumber(input.marks, 0),
      feedback: cleanString(input.feedback) || null,
      status: cleanString(input.status).toUpperCase() || "GRADED",
      reviewedAt: new Date()
    }
  });
};

export const requestProjectResubmission = async ({ instructorId, submissionId, input }) => {
  const submission = await prisma.projectSubmission.findFirst({
    where: { id: submissionId, project: { instructorId } },
    select: { id: true }
  });
  if (!submission) return null;

  return prisma.projectSubmission.update({
    where: { id: submissionId },
    data: {
      feedback: cleanString(input.feedback) || "Please revise and resubmit this project.",
      status: "RESUBMISSION_REQUIRED",
      reviewedAt: new Date()
    }
  });
};

export const getAssignmentSubmissionDetails = async ({ instructorId, submissionId }) => {
  const submission = await prisma.submission.findFirst({
    where: { id: submissionId, assignment: { course: { instructorId } } },
    include: {
      user: { select: { id: true, name: true, email: true } },
      assignment: { include: { course: { select: { id: true, title: true } } } }
    }
  });

  if (!submission) return null;

  return {
    id: submission.id,
    assignmentTitle: submission.assignment?.title || "Assignment",
    studentName: submission.user?.name || "Student",
    studentEmail: submission.user?.email || "",
    course: submission.assignment?.course?.title || "Course",
    submissionDate: submission.createdAt,
    status: normalizeSubmissionStatus(submission.status),
    studentNote: submission.comment || "",
    file: submission.fileUrl ? { name: submission.fileUrl.split("/").pop(), url: submission.fileUrl } : null,
    marks: submission.marks,
    feedback: submission.feedback || ""
  };
};

export const getProjectSubmissionDetails = async ({ instructorId, submissionId }) => {
  const submission = await prisma.projectSubmission.findFirst({
    where: { id: submissionId, project: { instructorId } },
    include: {
      student: { select: { id: true, name: true, email: true } },
      project: { include: { course: { select: { id: true, title: true } } } }
    }
  });

  if (!submission) return null;

  return {
    id: submission.id,
    projectTitle: submission.project?.title || "Project",
    studentName: submission.student?.name || "Student",
    studentEmail: submission.student?.email || "",
    course: submission.project?.course?.title || "Course",
    submissionDate: submission.submittedAt || submission.updatedAt,
    status: normalizeSubmissionStatus(submission.status),
    studentNote: submission.studentNote || "",
    githubLink: submission.submittedLink || "",
    fileUrl: submission.submittedFileUrl || "",
    marks: submission.marks,
    feedback: submission.feedback || ""
  };
};

export const getQuizResultDetails = async ({ instructorId, resultId }) => {
  const quiz = await prisma.quiz.findFirst({
    where: { id: resultId, course: { instructorId } },
    include: {
      course: { select: { title: true } },
      questions: true
    }
  });

  if (!quiz) return null;

  return {
    id: quiz.id,
    quizName: quiz.title,
    studentName: "No quiz attempts recorded yet",
    course: quiz.course?.title || "Course",
    score: 0,
    totalQuestions: quiz.questions.length,
    percentage: 0,
    status: "Not Attempted",
    attemptNumber: 0,
    timeTaken: "0 mins",
    date: null,
    questions: quiz.questions.map((question) => ({
      id: question.id,
      text: question.question,
      correct: null,
      studentAnswer: "",
      correctAnswer: question.correctAnswer
    }))
  };
};

export const getInstructorStudentsData = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) {
    return {
      data: [],
      stats: {
        totalStudents: 0,
        activeStudents: 0,
        completed: 0,
        avgProgress: 0,
        certificates: 0,
        pendingReviews: 0
      },
      courses: []
    };
  }

  const [enrollments, completions, certificates, pendingAssignments, pendingProjects, instructorCourses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, profileImage: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.courseCompletion.findMany({
      where: { courseId: { in: courseIds } }
    }),
    prisma.certificate.findMany({
      where: { courseId: { in: courseIds } }
    }),
    prisma.submission.count({
      where: { status: { in: ["SUBMITTED", "PENDING"] }, assignment: { courseId: { in: courseIds } } }
    }),
    prisma.projectSubmission.count({
      where: { status: { in: ["SUBMITTED", "PENDING"] }, project: { courseId: { in: courseIds } } }
    }),
    prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { title: true }
    })
  ]);

  const completionMap = new Map(completions.map((item) => [`${item.userId}:${item.courseId}`, item]));
  const certificateMap = new Map(certificates.map((item) => [`${item.userId}:${item.courseId}`, item]));
  const courseNames = [...new Set(instructorCourses.map((c) => c.title).filter(Boolean))];
  const uniqueStudentIds = new Set(enrollments.map((item) => item.userId));

  const rows = enrollments.map((enrollment) => {
    const completion = completionMap.get(`${enrollment.userId}:${enrollment.courseId}`);
    const certificate = certificateMap.get(`${enrollment.userId}:${enrollment.courseId}`);
    const progress = Math.round(completion?.overallProgress ?? enrollment.progress ?? 0);
    const isCompleted = completion?.isCompleted || enrollment.status === "COMPLETED" || progress >= 100;

    return {
      id: enrollment.id,
      studentId: enrollment.userId,
      name: enrollment.user?.name || "Student",
      email: enrollment.user?.email || "",
      avatar: getInitials(enrollment.user?.name),
      course: enrollment.course?.title || "Course",
      courseId: enrollment.courseId,
      progress,
      lastActive: relativeTime(completion?.updatedAt || enrollment.createdAt),
      courseStatus: isCompleted ? "Completed" : progress > 0 ? "Active" : "Inactive",
      certificateStatus: certificate ? "Generated" : isCompleted ? "Eligible" : "Pending"
    };
  });

  const avgProgress = rows.length
    ? Math.round(rows.reduce((sum, item) => sum + Number(item.progress || 0), 0) / rows.length)
    : 0;

  return {
    data: rows,
    stats: {
      totalStudents: uniqueStudentIds.size,
      activeStudents: rows.filter((item) => item.courseStatus === "Active").length,
      completed: rows.filter((item) => item.courseStatus === "Completed").length,
      avgProgress,
      certificates: certificates.length,
      pendingReviews: pendingAssignments + pendingProjects
    },
    courses: courseNames
  };
};

const getInstructorStudentScope = async ({ instructorId, studentId }) => {
  let enrollments = await prisma.enrollment.findMany({
    where: { userId: studentId, course: { instructorId } },
    include: {
      user: { select: { id: true, name: true, email: true, phone: true, profileImage: true, createdAt: true } },
      course: {
        include: {
          modules: { include: { lessons: true } },
          quizzes: true,
          assignments: true,
          projects: true
        }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  if (!enrollments.length) {
    enrollments = await prisma.enrollment.findMany({
      where: { userId: studentId },
      include: {
        user: { select: { id: true, name: true, email: true, phone: true, profileImage: true, createdAt: true } },
        course: {
          include: {
            modules: { include: { lessons: true } },
            quizzes: true,
            assignments: true,
            projects: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }

  if (!enrollments.length) return null;

  const completions = await prisma.courseCompletion.findMany({
    where: {
      userId: studentId,
      courseId: { in: enrollments.map((item) => item.courseId) }
    }
  });

  return {
    student: enrollments[0].user,
    enrollments,
    completions,
    completionMap: new Map(completions.map((item) => [item.courseId, item]))
  };
};

export const getInstructorStudentDetails = async ({ instructorId, studentId }) => {
  const scope = await getInstructorStudentScope({ instructorId, studentId });
  if (!scope) return null;

  const { student, enrollments, completionMap } = scope;
  const currentEnrollment = enrollments[0];
  const currentCompletion = completionMap.get(currentEnrollment.courseId);
  const summary = await getInstructorStudentProgress({ instructorId, studentId });

  return {
    id: student.id,
    name: student.name,
    email: student.email,
    phone: student.phone || "Not provided",
    avatar: getInitials(student.name),
    enrollmentDate: currentEnrollment.createdAt,
    courseName: currentEnrollment.course?.title || "Course",
    batch: "Default Cohort",
    status: currentCompletion?.isCompleted || currentEnrollment.status === "COMPLETED" ? "Completed" : "Active",
    summary,
    enrollments: enrollments.map((enrollment) => ({
      id: enrollment.id,
      courseId: enrollment.courseId,
      courseName: enrollment.course?.title || "Course",
      progress: Math.round(completionMap.get(enrollment.courseId)?.overallProgress ?? enrollment.progress ?? 0),
      enrollmentDate: enrollment.createdAt
    }))
  };
};

export const getInstructorStudentProgress = async ({ instructorId, studentId }) => {
  const scope = await getInstructorStudentScope({ instructorId, studentId });
  if (!scope) return null;

  const totals = scope.enrollments.reduce(
    (acc, enrollment) => {
      const course = enrollment.course;
      const completion = scope.completionMap.get(enrollment.courseId);
      const lessonTotal = (course.modules || []).reduce((sum, module) => sum + (module.lessons?.length || 0), 0);
      const quizTotal = course.quizzes?.length || 0;
      const assignmentTotal = course.assignments?.length || 0;
      const projectTotal = course.projects?.length || 0;
      const progress = Math.round(completion?.overallProgress ?? enrollment.progress ?? 0);

      acc.overallSum += progress;
      acc.courseCount += 1;
      acc.lessons.total += lessonTotal;
      acc.lessons.completed += completion?.lessonProgress ?? Math.round(lessonTotal * progress / 100);
      acc.quizzes.total += quizTotal;
      acc.quizzes.completed += completion?.quizCompleted ? quizTotal : 0;
      acc.assignments.total += assignmentTotal;
      acc.assignments.completed += completion?.assignmentCompleted ? assignmentTotal : 0;
      acc.projects.total += projectTotal;
      acc.projects.completed += completion?.projectCompleted ? projectTotal : 0;
      return acc;
    },
    {
      overallSum: 0,
      courseCount: 0,
      lessons: { completed: 0, total: 0 },
      quizzes: { completed: 0, total: 0 },
      assignments: { completed: 0, total: 0 },
      projects: { completed: 0, total: 0 }
    }
  );

  const percentage = (completed, total) => (total ? Math.min(Math.round(completed / total * 100), 100) : 0);
  const overall = totals.courseCount ? Math.round(totals.overallSum / totals.courseCount) : 0;

  return {
    overall,
    lessons: { ...totals.lessons, percentage: percentage(totals.lessons.completed, totals.lessons.total) },
    quizzes: { ...totals.quizzes, percentage: percentage(totals.quizzes.completed, totals.quizzes.total) },
    assignments: { ...totals.assignments, percentage: percentage(totals.assignments.completed, totals.assignments.total) },
    projects: { ...totals.projects, percentage: percentage(totals.projects.completed, totals.projects.total) }
  };
};

export const getInstructorStudentSubmissions = async ({ instructorId, studentId }) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return { assignments: [], projects: [], quizzes: [] };

  const [assignments, projects, completions] = await Promise.all([
    prisma.submission.findMany({
      where: { userId: studentId, assignment: { courseId: { in: courseIds } } },
      include: { assignment: { include: { course: { select: { title: true } } } } },
      orderBy: { createdAt: "desc" }
    }),
    prisma.projectSubmission.findMany({
      where: { studentId, project: { courseId: { in: courseIds } } },
      include: { project: { include: { course: { select: { title: true } } } } },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.courseCompletion.findMany({
      where: { userId: studentId, courseId: { in: courseIds }, quizCompleted: true },
      include: { course: { include: { quizzes: true } } }
    })
  ]);

  return {
    assignments: assignments.map((submission) => ({
      id: submission.id,
      title: submission.assignment?.title || "Assignment",
      submittedDate: relativeTime(submission.createdAt),
      status: normalizeSubmissionStatus(submission.status),
      marks: submission.marks === null || submission.marks === undefined ? "-" : `${submission.marks}/100`,
      feedback: submission.feedback || "-"
    })),
    projects: projects.map((submission) => ({
      id: submission.id,
      title: submission.project?.title || "Project",
      submittedDate: relativeTime(submission.submittedAt || submission.updatedAt),
      status: normalizeSubmissionStatus(submission.status),
      marks: submission.marks === null || submission.marks === undefined ? "-" : `${submission.marks}/${submission.project?.maxMarks || 100}`,
      feedback: submission.feedback || "-"
    })),
    quizzes: completions.flatMap((completion) => (completion.course?.quizzes || []).map((quiz) => ({
      id: quiz.id,
      title: quiz.title,
      score: "Completed",
      attempts: 1,
      result: "Pass",
      date: relativeTime(completion.updatedAt)
    })))
  };
};

export const getInstructorStudentActivity = async ({ instructorId, studentId }) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return [];

  const [enrollments, assignmentSubmissions, projectSubmissions, certificates, reviews] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId: studentId, courseId: { in: courseIds } },
      include: { course: { select: { title: true } } }
    }),
    prisma.submission.findMany({
      where: { userId: studentId, assignment: { courseId: { in: courseIds } } },
      include: { assignment: { include: { course: { select: { title: true } } } } }
    }),
    prisma.projectSubmission.findMany({
      where: { studentId, project: { courseId: { in: courseIds } } },
      include: { project: { include: { course: { select: { title: true } } } } }
    }),
    prisma.certificate.findMany({
      where: { userId: studentId, courseId: { in: courseIds } },
      include: { course: { select: { title: true } } }
    }),
    prisma.review.findMany({
      where: { userId: studentId, courseId: { in: courseIds } },
      include: { course: { select: { title: true } } }
    })
  ]);

  return [
    ...certificates.map((item) => ({
      id: item.id,
      type: "certificate",
      title: "Certificate Generated",
      course: item.course?.title || "Course",
      time: relativeTime(item.issuedDate),
      createdAt: item.issuedDate
    })),
    ...assignmentSubmissions.map((item) => ({
      id: item.id,
      type: "assignment",
      title: "Assignment Submitted",
      course: item.assignment?.course?.title || "Course",
      details: item.assignment?.title,
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    })),
    ...projectSubmissions.map((item) => ({
      id: item.id,
      type: "project",
      title: "Project Submitted",
      course: item.project?.course?.title || "Course",
      details: item.project?.title,
      time: relativeTime(item.submittedAt || item.updatedAt),
      createdAt: item.submittedAt || item.updatedAt
    })),
    ...reviews.map((item) => ({
      id: item.id,
      type: "review",
      title: "Course Reviewed",
      course: item.course?.title || "Course",
      details: `${item.rating} stars`,
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    })),
    ...enrollments.map((item) => ({
      id: item.id,
      type: "enrollment",
      title: "Course Enrolled",
      course: item.course?.title || "Course",
      time: relativeTime(item.createdAt),
      createdAt: item.createdAt
    }))
  ]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(({ createdAt, ...item }) => item);
};

export const getInstructorStudentReviews = async ({ instructorId, studentId }) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return [];

  const reviews = await prisma.review.findMany({
    where: { userId: studentId, courseId: { in: courseIds } },
    include: { course: { select: { title: true } } },
    orderBy: { createdAt: "desc" }
  });

  return reviews.map((review) => ({
    id: review.id,
    course: review.course?.title || "Course",
    rating: review.rating,
    date: relativeTime(review.createdAt),
    review: review.comment || ""
  }));
};

export const getInstructorReviewsData = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return { data: [], averageRating: 0, courses: [] };

  const [reviews, replies, instructorCourses] = await Promise.all([
    prisma.review.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.notification.findMany({
      where: { category: "Review", type: "Instructor Reply" }
    }),
    prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { title: true }
    })
  ]);

  const replyMap = new Map(replies.map((reply) => [reply.relatedId, reply.message]));
  const averageRating = reviews.length
    ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
    : 0;

  return {
    data: reviews.map((review) => ({
      id: review.id,
      student: review.user?.name || "Student",
      studentId: review.userId,
      course: review.course?.title || "Course",
      courseId: review.courseId,
      rating: review.rating,
      text: review.comment || "",
      date: toIsoDate(review.createdAt),
      reply: replyMap.get(review.id) || null
    })),
    averageRating: Number(averageRating.toFixed(1)),
    courses: [...new Set(instructorCourses.map((c) => c.title).filter(Boolean))]
  };
};

export const replyToInstructorReview = async ({ instructorId, reviewId, reply }) => {
  const review = await prisma.review.findFirst({
    where: { id: reviewId, course: { instructorId } },
    include: { course: { select: { title: true } } }
  });
  if (!review) return null;

  await prisma.notification.deleteMany({
    where: { category: "Review", type: "Instructor Reply", relatedId: review.id }
  });

  await prisma.notification.create({
    data: {
      userId: review.userId,
      title: `Instructor replied to your review`,
      message: cleanString(reply),
      category: "Review",
      type: "Instructor Reply",
      relatedId: review.id,
      relatedType: "REVIEW"
    }
  });

  return { id: review.id, reply: cleanString(reply) };
};

export const getInstructorCertificatesData = async (instructorId) => {
  const courseIds = await getInstructorCourseIds(instructorId);
  if (!courseIds.length) return { data: [], stats: { issued: 0, eligible: 0, pending: 0, avgCompletion: 0 }, courses: [] };

  const [enrollments, completions, certificates, instructorCourses] = await Promise.all([
    prisma.enrollment.findMany({
      where: { courseId: { in: courseIds } },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.courseCompletion.findMany({ where: { courseId: { in: courseIds } } }),
    prisma.certificate.findMany({ where: { courseId: { in: courseIds } } }),
    prisma.course.findMany({
      where: { id: { in: courseIds } },
      select: { title: true }
    })
  ]);

  const completionMap = new Map(completions.map((item) => [`${item.userId}:${item.courseId}`, item]));
  const certificateMap = new Map(certificates.map((item) => [`${item.userId}:${item.courseId}`, item]));

  const rows = enrollments.map((enrollment) => {
    const completion = completionMap.get(`${enrollment.userId}:${enrollment.courseId}`);
    const certificate = certificateMap.get(`${enrollment.userId}:${enrollment.courseId}`);
    const progress = Math.round(completion?.overallProgress ?? enrollment.progress ?? 0);
    const certificateStatus = certificate ? "Issued" : progress >= 100 || completion?.isCompleted ? "Eligible" : "Pending";

    return {
      id: certificate?.id || enrollment.id,
      studentId: enrollment.userId,
      studentName: enrollment.user?.name || "Student",
      studentEmail: enrollment.user?.email || "",
      studentAvatar: getInitials(enrollment.user?.name),
      courseName: enrollment.course?.title || "Course",
      courseId: enrollment.courseId,
      enrollmentDate: toIsoDate(enrollment.createdAt),
      completionDate: toIsoDate(completion?.completedAt),
      issueDate: toIsoDate(certificate?.issuedDate),
      certificateStatus,
      certificateId: certificate?.certificateId || "N/A",
      progress
    };
  });

  const avgCompletion = rows.length
    ? Math.round(rows.reduce((sum, row) => sum + row.progress, 0) / rows.length)
    : 0;

  return {
    data: rows,
    stats: {
      issued: rows.filter((row) => row.certificateStatus === "Issued").length,
      eligible: rows.filter((row) => row.certificateStatus === "Eligible").length,
      pending: rows.filter((row) => row.certificateStatus === "Pending").length,
      avgCompletion
    },
    courses: [...new Set(instructorCourses.map((c) => c.title).filter(Boolean))]
  };
};

export const getInstructorCertificateDetails = async ({ instructorId, certificateId }) => {
  const certificates = await getInstructorCertificatesData(instructorId);
  return certificates.data.find((item) => item.id === certificateId || item.certificateId === certificateId) || null;
};

export const getInstructorCertificateProgress = async ({ instructorId, certificateId }) => {
  const details = await getInstructorCertificateDetails({ instructorId, certificateId });
  if (!details) return null;

  const progress = await getInstructorStudentProgress({ instructorId, studentId: details.studentId });
  return progress;
};

export const getInstructorCertificateTimeline = async ({ instructorId, certificateId }) => {
  const details = await getInstructorCertificateDetails({ instructorId, certificateId });
  if (!details) return null;

  const timeline = [
    { id: 1, title: "Course Enrolled", date: details.enrollmentDate, status: "completed" },
    { id: 2, title: "Course Completed", date: details.completionDate, status: details.completionDate ? "completed" : "pending" },
    { id: 3, title: "Certificate Generated", date: details.issueDate, status: details.issueDate ? "completed" : "pending" }
  ];

  return timeline;
};

const parseAnnouncementRelatedType = (relatedType = "") => {
  const [, courseId = "ALL"] = relatedType.split(":");
  return courseId;
};

const formatInstructorAnnouncement = (notification, coursesById = new Map()) => {
  const courseId = parseAnnouncementRelatedType(notification.relatedType);
  const course = courseId === "ALL" ? null : coursesById.get(courseId);

  return {
    id: notification.relatedId || notification.id,
    announcementId: notification.relatedId || notification.id,
    title: notification.title,
    type: "Course Announcement",
    message: notification.message,
    text: notification.message,
    audience: course ? "Enrolled Students" : "All Enrolled Students",
    course: course?.title || "All Courses",
    courseId: course?.id || "",
    views: 0,
    priority: "Medium",
    status: "Published",
    publishDate: notification.createdAt,
    date: toIsoDate(notification.createdAt),
    createdAt: notification.createdAt
  };
};

export const getInstructorAnnouncements = async (instructorId) => {
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true, title: true }
  });
  const coursesById = new Map(courses.map((course) => [course.id, course]));
  const announcements = await prisma.notification.findMany({
    where: {
      userId: instructorId,
      category: "Announcement",
      type: "Instructor Announcement"
    },
    orderBy: { createdAt: "desc" }
  });

  return {
    data: announcements.map((item) => formatInstructorAnnouncement(item, coursesById)),
    courses
  };
};

export const createInstructorAnnouncement = async ({ instructorId, input }) => {
  const title = cleanString(input.title);
  const message = cleanString(input.message || input.text);
  if (!title || !message) {
    const error = new Error("Announcement title and message are required.");
    error.statusCode = 400;
    throw error;
  }

  const courseId = cleanString(input.courseId);
  const allCourses = !courseId || courseId === "all" || courseId === "All Courses";
  const courseIds = allCourses ? await getInstructorCourseIds(instructorId) : [courseId];

  if (!courseIds.length) {
    const error = new Error("Create a course before posting announcements.");
    error.statusCode = 400;
    throw error;
  }

  for (const id of courseIds) await ensureCourseAccess(id, instructorId);

  const enrollments = await prisma.enrollment.findMany({
    where: { courseId: { in: courseIds } },
    select: { userId: true }
  });
  const recipientIds = [...new Set([instructorId, ...enrollments.map((item) => item.userId)])];
  const announcementId = `ann_${Date.now()}`;
  const relatedType = `INSTRUCTOR_ANNOUNCEMENT:${allCourses ? "ALL" : courseId}`;

  await prisma.notification.createMany({
    data: recipientIds.map((userId) => ({
      userId,
      title,
      message,
      category: "Announcement",
      type: "Instructor Announcement",
      relatedId: announcementId,
      relatedType
    }))
  });

  const saved = await prisma.notification.findFirst({
    where: { userId: instructorId, relatedId: announcementId }
  });
  const courses = await prisma.course.findMany({
    where: { id: { in: courseIds } },
    select: { id: true, title: true }
  });
  return formatInstructorAnnouncement(saved, new Map(courses.map((course) => [course.id, course])));
};

export const updateInstructorAnnouncement = async ({ instructorId, announcementId, input }) => {
  const ownerCopy = await prisma.notification.findFirst({
    where: {
      userId: instructorId,
      relatedId: announcementId,
      category: "Announcement",
      type: "Instructor Announcement"
    }
  });
  if (!ownerCopy) return null;

  await prisma.notification.updateMany({
    where: { relatedId: announcementId, category: "Announcement", type: "Instructor Announcement" },
    data: {
      title: cleanString(input.title) || ownerCopy.title,
      message: cleanString(input.message || input.text) || ownerCopy.message
    }
  });

  const updated = await prisma.notification.findFirst({ where: { id: ownerCopy.id } });
  const courses = await prisma.course.findMany({
    where: { instructorId },
    select: { id: true, title: true }
  });
  return formatInstructorAnnouncement(updated, new Map(courses.map((course) => [course.id, course])));
};

export const deleteInstructorAnnouncement = async ({ instructorId, announcementId }) => {
  const ownerCopy = await prisma.notification.findFirst({
    where: {
      userId: instructorId,
      relatedId: announcementId,
      category: "Announcement",
      type: "Instructor Announcement"
    },
    select: { id: true }
  });
  if (!ownerCopy) return false;

  await prisma.notification.deleteMany({
    where: { relatedId: announcementId, category: "Announcement", type: "Instructor Announcement" }
  });
  return true;
};

export const getInstructorAnalyticsData = async (instructorId) => {
  const [dashboard, students, reviews, certificates, courses, assignments, projects] = await Promise.all([
    getInstructorDashboardData(instructorId),
    getInstructorStudentsData(instructorId),
    getInstructorReviewsData(instructorId),
    getInstructorCertificatesData(instructorId),
    prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: true,
        payments: { where: { status: "SUCCESS" } },
        courseCompletions: true,
        reviews: true
      }
    }),
    getInstructorAssignments(instructorId),
    getInstructorProjects(instructorId)
  ]);

  const overview = {
    totalStudents: { value: dashboard.totalStudents, growth: dashboard.studentsTrend, description: "vs last month" },
    totalCourses: { value: dashboard.totalCourses, growth: dashboard.coursesTrend, description: "new this month" },
    totalRevenue: { value: `$${dashboard.totalRevenue.toLocaleString()}`, growth: dashboard.revenueTrend, description: "vs last month" },
    averageRating: { value: dashboard.averageRating, growth: dashboard.ratingTrend, description: "vs last month" },
    courseCompletionRate: { value: `${dashboard.completionRate}%`, growth: `${dashboard.completionRate}%`, description: "completion rate" },
    certificatesIssued: { value: certificates.stats.issued, growth: `${certificates.stats.issued}`, description: "issued records" },
    pendingAssignments: { value: dashboard.pendingAssignments, description: "requires action" },
    pendingProjects: { value: dashboard.pendingProjects, description: "requires action" }
  };

  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const coursesAnalytics = courses.map((course) => {
    const revenue = course.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
    const completion = course.courseCompletions.length
      ? Math.round(course.courseCompletions.reduce((sum, item) => sum + Number(item.overallProgress || 0), 0) / course.courseCompletions.length)
      : 0;
    const rating = course.reviews.length
      ? Number((course.reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / course.reviews.length).toFixed(1))
      : Number(course.rating || 0);

    const currentMonthRev = course.payments
      .filter((p) => p.createdAt && new Date(p.createdAt) >= startOfCurrentMonth)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const lastMonthRev = course.payments
      .filter((p) => p.createdAt && new Date(p.createdAt) >= startOfLastMonth && new Date(p.createdAt) < startOfCurrentMonth)
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    let trend = "+0%";
    if (lastMonthRev > 0) {
      const change = ((currentMonthRev - lastMonthRev) / lastMonthRev) * 100;
      trend = `${change >= 0 ? "+" : ""}${Math.round(change)}%`;
    } else if (currentMonthRev > 0 || course.enrollments.length > 0) {
      trend = "+100%";
    }

    return {
      name: course.title,
      students: course.enrollments.length,
      revenue,
      completion,
      rating,
      status: COURSE_STATUS_LABELS[course.status] || course.status,
      trend
    };
  });

  const assignmentStatus = assignments.reduce(
    (acc, assignment) => {
      if (assignment.submissions > 0) acc.Submitted += assignment.submissions;
      return acc;
    },
    { Submitted: 0, Pending: dashboard.pendingAssignments + dashboard.pendingProjects, Graded: 0, "Resubmission Requested": 0 }
  );

  return {
    overview,
    students: dashboard.revenueChart.map((item) => ({ date: item.name, enrollments: 0, visitors: 0 })),
    revenue: {
      growth: dashboard.revenueTrend,
      topCourse: coursesAnalytics[0]?.name || "No courses yet",
      monthly: dashboard.revenueChart.map((item) => ({ name: item.name, revenue: item.Revenue }))
    },
    courses: coursesAnalytics,
    learning: {
      averageLearningTime: { value: "0m", progress: dashboard.completionRate, comparison: "live database" },
      averageSessionDuration: { value: "0m", progress: dashboard.completionRate, comparison: "live database" },
      lessonsCompleted: { value: String(students.stats.avgProgress), progress: students.stats.avgProgress, comparison: "average progress" },
      weeklyActiveStudents: { value: String(students.stats.activeStudents), progress: Math.min(students.stats.activeStudents, 100), comparison: "active students" }
    },
    assessments: {
      quizzes: {
        pass: students.data.filter((student) => student.progress >= 60).length,
        fail: students.data.filter((student) => student.progress < 60).length,
        averageScore: students.stats.avgProgress,
        averageAttempts: 1
      },
      assignments: Object.entries(assignmentStatus).map(([name, value]) => ({ name, value }))
    },
    ratings: {
      average: reviews.averageRating || 0,
      distribution: [5, 4, 3, 2, 1].map((stars) => ({
        stars,
        count: reviews.data.filter((review) => review.rating === stars).length
      }))
    },
    certificates: [
      { name: "Completed", value: certificates.stats.issued, color: "#10B981" },
      { name: "In Progress", value: certificates.stats.pending, color: "#F59E0B" },
      { name: "Eligible", value: certificates.stats.eligible, color: "#06B6D4" }
    ],
    activities: await getRecentInstructorActivity(instructorId),
    tasks: [
      { id: 1, title: "Assignments Waiting Review", count: dashboard.pendingAssignments, priority: "High", due: "Today" },
      { id: 2, title: "Projects Waiting Review", count: dashboard.pendingProjects, priority: "Medium", due: "Today" },
      { id: 3, title: "Draft Courses", count: courses.filter((course) => course.status === "DRAFT").length, priority: "Low", due: "This Week" }
    ],
    reports: {
      mostPopularCourse: [...coursesAnalytics].sort((a, b) => b.students - a.students)[0]?.name || "No courses yet",
      highestRatedCourse: [...coursesAnalytics].sort((a, b) => b.rating - a.rating)[0]?.name || "No courses yet",
      highestRevenueCourse: [...coursesAnalytics].sort((a, b) => b.revenue - a.revenue)[0]?.name || "No courses yet",
      mostActiveStudent: [...students.data].sort((a, b) => b.progress - a.progress)[0]?.name || "No students yet",
      highestCompletionCourse: [...coursesAnalytics].sort((a, b) => b.completion - a.completion)[0]?.name || "No courses yet"
    }
  };
};
