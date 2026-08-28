import { prisma } from "../prisma.js";

export const COURSE_STATUS_LABELS = {
  DRAFT: "Draft",
  PENDING_REVIEW: "Pending Review",
  PUBLISHED: "Published",
  REJECTED: "Rejected",
  UNPUBLISHED: "Unpublished"
};

export const COURSE_LEVEL_LABELS = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels"
};

const STATUS_INPUTS = {
  draft: "DRAFT",
  pending: "PENDING_REVIEW",
  pending_review: "PENDING_REVIEW",
  pending_approval: "PENDING_REVIEW",
  review: "PENDING_REVIEW",
  submitted: "PENDING_REVIEW",
  published: "PUBLISHED",
  publish: "PUBLISHED",
  approved: "PUBLISHED",
  approve: "PUBLISHED",
  rejected: "REJECTED",
  reject: "REJECTED",
  unpublished: "UNPUBLISHED",
  unpublish: "UNPUBLISHED"
};

const LEVEL_INPUTS = {
  beginner: "BEGINNER",
  intermediate: "INTERMEDIATE",
  advanced: "ADVANCED",
  all: "ALL_LEVELS",
  all_level: "ALL_LEVELS",
  all_levels: "ALL_LEVELS"
};

export const courseInclude = {
  category: true,
  instructor: {
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      designation: true,
      bio: true,
      profileImage: true,
      _count: { select: { courses: true } }
    }
  },
  modules: {
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" }
      }
    }
  },
  quizzes: {
    include: {
      questions: true
    }
  },
  assignments: true,
  projects: true,
  payments: {
    include: {
      user: { select: { name: true, email: true } }
    },
    orderBy: { createdAt: "desc" }
  },
  reviews: {
    include: {
      user: { select: { name: true, profileImage: true } }
    },
    orderBy: { createdAt: "desc" },
    take: 5
  },
  _count: {
    select: {
      enrollments: true,
      reviews: true,
      certificates: true,
      modules: true
    }
  }
};

export const cleanString = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

export const slugify = (value) => {
  const slug = cleanString(value)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "course";
};

export const normalizeCourseStatus = (status) => {
  if (!status) return null;
  const key = cleanString(status).toLowerCase().replace(/[\s-]+/g, "_");
  return STATUS_INPUTS[key] || null;
};

export const normalizeCourseLevel = (level) => {
  if (!level) return "BEGINNER";
  const key = cleanString(level).toLowerCase().replace(/[\s-]+/g, "_");
  return LEVEL_INPUTS[key] || "BEGINNER";
};

export const statusLabel = (status) => COURSE_STATUS_LABELS[status] || status || "Draft";

export const levelLabel = (level) => COURSE_LEVEL_LABELS[level] || level || "Beginner";

export const getCoursePipelineErrorMessage = (error, fallbackMessage = "Course operation failed") => {
  const message = error?.message || "";
  if (error?.code === "P2022" || message.includes("does not exist in the current database")) {
    return "Course database schema is not up to date. Apply the Prisma course migration, restart the backend, and try again.";
  }

  if (error?.statusCode) return message;

  return fallbackMessage;
};

export const statusFromAction = (action, fallback = "DRAFT") => {
  if (!action) return fallback;
  return normalizeCourseStatus(action) || fallback;
};

export const toStringList = (value) => {
  if (Array.isArray(value)) {
    return value.map(cleanString).filter(Boolean);
  }

  return cleanString(value)
    .split(/[\n,]+/)
    .map(cleanString)
    .filter(Boolean);
};

const optionalText = (value) => {
  const text = cleanString(value);
  return text || null;
};

const optionalNumber = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const requiredMoney = (value) => {
  const number = optionalNumber(value);
  return number === null ? 0 : Math.max(number, 0);
};

const ensureCourseSlug = async (source, excludeCourseId) => {
  const baseSlug = slugify(source);
  let candidate = baseSlug;
  let suffix = 2;

  while (true) {
    const existing = await prisma.course.findFirst({
      where: {
        slug: candidate,
        ...(excludeCourseId ? { NOT: { id: excludeCourseId } } : {})
      },
      select: { id: true }
    });

    if (!existing) return candidate;
    candidate = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
};

const resolveCategory = async (input, existingCourse) => {
  const categoryId = cleanString(input.categoryId);
  if (categoryId) {
    const category = await prisma.category.findUnique({ where: { id: categoryId } });
    if (category) return category;
  }

  const categoryName = cleanString(input.category);
  if (categoryName) {
    const slug = slugify(categoryName);
    const existingCategory = await prisma.category.findFirst({
      where: {
        OR: [{ slug }, { name: categoryName }]
      }
    });

    if (existingCategory) return existingCategory;

    return prisma.category.create({
      data: {
        name: categoryName,
        slug,
        description: `${categoryName} courses`
      }
    });
  }

  if (existingCourse?.categoryId) {
    const existingCat = await prisma.category.findUnique({ where: { id: existingCourse.categoryId } });
    if (existingCat) return existingCat;
  }

  let defaultCategory = await prisma.category.findFirst();
  if (!defaultCategory) {
    defaultCategory = await prisma.category.create({
      data: {
        name: "General",
        slug: "general",
        description: "General courses category"
      }
    });
  }
  return defaultCategory;
};

const buildCourseMutationData = async ({ input, existingCourse, instructorId, requestedStatus }) => {
  const title = cleanString(input.title) || existingCourse?.title || "";
  if (!title) {
    const error = new Error("Course title is required.");
    error.statusCode = 400;
    throw error;
  }

  const category = await resolveCategory(input, existingCourse);
  if (!category) {
    const error = new Error("Course category is required.");
    error.statusCode = 400;
    throw error;
  }

  let resolvedInstructorId = instructorId || existingCourse?.instructorId;
  if (resolvedInstructorId) {
    const userExists = await prisma.user.findUnique({ where: { id: resolvedInstructorId }, select: { id: true } });
    if (!userExists) resolvedInstructorId = null;
  }

  if (!resolvedInstructorId) {
    const instructorUser = await prisma.user.findFirst({
      where: { role: { in: ["INSTRUCTOR", "ADMIN"] } },
      select: { id: true }
    });
    if (instructorUser) {
      resolvedInstructorId = instructorUser.id;
    } else {
      const anyUser = await prisma.user.findFirst({ select: { id: true } });
      resolvedInstructorId = anyUser?.id;
    }
  }

  if (!resolvedInstructorId) {
    const error = new Error("Instructor account not found in database. Please log in again.");
    error.statusCode = 401;
    throw error;
  }

  const shortDescription =
    cleanString(input.shortDescription) ||
    cleanString(input.subtitle) ||
    existingCourse?.shortDescription ||
    title;

  const description =
    cleanString(input.fullDescription) ||
    cleanString(input.description) ||
    existingCourse?.description ||
    shortDescription;

  const resolvedStatus = requestedStatus || normalizeCourseStatus(input.status) || existingCourse?.status || "DRAFT";
  const now = new Date();
  const slugSource = cleanString(input.slug) || title;

  return {
    title,
    slug: await ensureCourseSlug(slugSource, existingCourse?.id),
    subtitle: optionalText(input.subtitle) ?? existingCourse?.subtitle ?? null,
    description,
    shortDescription,
    thumbnail: optionalText(input.thumbnail) ?? existingCourse?.thumbnail ?? null,
    categoryId: category.id,
    instructorId: resolvedInstructorId,
    level: normalizeCourseLevel(input.level || existingCourse?.level),
    language: cleanString(input.language) || existingCourse?.language || "English",
    price: requiredMoney(input.price ?? existingCourse?.price),
    discountPrice: optionalNumber(input.discountPrice) ?? existingCourse?.discountPrice ?? null,
    status: resolvedStatus,
    certificateAvail:
      input.certificateEnabled === undefined
        ? existingCourse?.certificateAvail ?? true
        : Boolean(input.certificateEnabled),
    learningOutcomes: toStringList(input.learningOutcomes).length
      ? toStringList(input.learningOutcomes)
      : existingCourse?.learningOutcomes ?? [],
    requirements: toStringList(input.requirements).length
      ? toStringList(input.requirements)
      : existingCourse?.requirements ?? [],
    targetAudience: optionalText(input.targetAudience) ?? existingCourse?.targetAudience ?? null,
    tags: toStringList(input.tags).length ? toStringList(input.tags) : existingCourse?.tags ?? [],
    promoVideoUrl: optionalText(input.promoVideoUrl) ?? existingCourse?.promoVideoUrl ?? null,
    rejectionReason: resolvedStatus === "REJECTED" ? input.rejectionReason || existingCourse?.rejectionReason || null : null,
    submittedAt:
      resolvedStatus === "PENDING_REVIEW" && existingCourse?.status !== "PENDING_REVIEW"
        ? now
        : existingCourse?.submittedAt ?? null,
    publishedAt:
      resolvedStatus === "PUBLISHED" && existingCourse?.status !== "PUBLISHED"
        ? now
        : existingCourse?.publishedAt ?? null
  };
};

export const createCourseFromInstructor = async ({ input, instructorId, action }) => {
  const requestedStatus = statusFromAction(action || input.action, "DRAFT");
  const data = await buildCourseMutationData({ input, instructorId, requestedStatus });

  return prisma.course.create({
    data,
    include: courseInclude
  });
};

export const updateCourseFromInstructor = async ({ courseId, input, instructorId, action }) => {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId, instructorId }
  });

  if (!existingCourse) return null;

  const requestedStatus = action ? statusFromAction(action, existingCourse.status) : normalizeCourseStatus(input.status);
  const data = await buildCourseMutationData({
    input,
    existingCourse,
    instructorId,
    requestedStatus
  });

  return prisma.course.update({
    where: { id: courseId },
    data,
    include: courseInclude
  });
};

export const submitCourseForReview = async ({ courseId, instructorId }) => {
  const existingCourse = await prisma.course.findFirst({
    where: { id: courseId, instructorId },
    select: { id: true, status: true }
  });

  if (!existingCourse) return null;

  return prisma.course.update({
    where: { id: courseId },
    data: {
      status: "PENDING_REVIEW",
      submittedAt: new Date(),
      rejectionReason: null
    },
    include: courseInclude
  });
};

export const formatCurriculum = (course) => {
  const quizzes = course.quizzes || [];
  const assignments = course.assignments || [];
  const projects = course.projects || [];

  return (course.modules || []).map((module) => {
    const moduleQuizzes = quizzes.filter((quiz) => quiz.moduleId === module.id);
    const moduleAssignments = assignments.filter((assignment) => assignment.moduleId === module.id);
    const moduleProjects = projects.filter((project) => project.moduleId === module.id);
    const lessons = [
      ...(module.lessons || []).map((lesson) => {
        const dur = lesson.duration && Number(lesson.duration) > 0 ? `${lesson.duration} min` : "Not set";
        return {
          id: lesson.id,
          title: lesson.title,
          description: lesson.description || "",
          duration: dur,
          durationMinutes: lesson.duration,
          videoUrl: lesson.videoUrl || "",
          type: "lesson",
          isPreview: lesson.isPreview,
          order: lesson.order,
          status: COURSE_STATUS_LABELS[course.status] || course.status
        };
      }),
      ...moduleQuizzes.map((quiz) => {
        const qCount = Array.isArray(quiz.questions) ? quiz.questions.length : 0;
        const marksPerQuestion = quiz.marksPerQuestion || 10;
        const totalMarks = marksPerQuestion * qCount;
        return {
          id: quiz.id,
          title: quiz.title,
          duration: "Quiz",
          type: "quiz",
          questions: qCount,
          marksPerQuestion,
          totalMarks,
          passingMarks: quiz.passingMarks || Math.round(totalMarks * 0.6),
          status: COURSE_STATUS_LABELS[course.status] || course.status
        };
      }),
      ...moduleAssignments.map((assignment) => ({
        id: assignment.id,
        title: assignment.title,
        description: assignment.description || "",
        duration: "Assignment",
        type: "assignment",
        points: 100,
        dueDate: assignment.dueDate,
        status: COURSE_STATUS_LABELS[course.status] || course.status
      })),
      ...moduleProjects.map((project) => ({
        id: project.id,
        title: project.title,
        description: project.description || "",
        duration: "Project",
        type: "project",
        points: project.maxMarks || 100,
        maxMarks: project.maxMarks || 100,
        dueDate: project.dueDate,
        status: project.status || COURSE_STATUS_LABELS[course.status] || course.status
      }))
    ];

    return {
      id: module.id,
      title: module.title,
      type: "module",
      order: module.order,
      items: lessons,
      itemsCount: lessons.length,
      lessons
    };
  });
};

const buildActivityLog = (course) => {
  const logs = [
    {
      id: `${course.id}-created`,
      action: "Course Created",
      date: course.createdAt
    }
  ];

  if (course.submittedAt) {
    logs.unshift({
      id: `${course.id}-submitted`,
      action: "Submitted for Review",
      date: course.submittedAt
    });
  }

  if (course.publishedAt) {
    logs.unshift({
      id: `${course.id}-published`,
      action: "Published",
      date: course.publishedAt
    });
  }

  if (course.status === "REJECTED") {
    logs.unshift({
      id: `${course.id}-rejected`,
      action: `Rejected${course.rejectionReason ? `: ${course.rejectionReason}` : ""}`,
      date: course.updatedAt
    });
  }

  if (course.status === "UNPUBLISHED") {
    logs.unshift({
      id: `${course.id}-unpublished`,
      action: "Unpublished",
      date: course.updatedAt
    });
  }

  return logs;
};

export const formatCourse = (course) => {
  const students = course.totalStudents ?? course._count?.enrollments ?? 0;
  const effectivePrice = course.discountPrice ?? course.price ?? 0;
  const curriculum = formatCurriculum(course);

  const paymentsList = (course.payments || []).map((payment) => ({
    id: `TXN-${payment.id.substring(0, 8).toUpperCase()}`,
    user: payment.user?.name || "Student",
    email: payment.user?.email || "",
    date: payment.createdAt,
    amount: payment.amount ?? course.price ?? 0,
    status: payment.status === "SUCCESS" ? "Success" : payment.status
  }));

  const realRevenue = paymentsList
    .filter((p) => p.status === "Success")
    .reduce((sum, p) => sum + p.amount, 0);

  const realCompletionRate = course._count?.enrollments > 0
    ? Math.round(((course._count?.certificates || 0) / course._count.enrollments) * 100)
    : 0;

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    subtitle: course.subtitle || "",
    description: course.description || "",
    fullDescription: course.description || "",
    shortDescription: course.shortDescription || "",
    category: course.category?.name || "General",
    categoryId: course.categoryId,
    level: levelLabel(course.level),
    language: course.language || "English",
    price: course.price ?? 0,
    discountPrice: course.discountPrice ?? null,
    status: statusLabel(course.status),
    statusCode: course.status,
    featured: Boolean(course.featured),
    students,
    totalStudents: students,
    rating: Number(course.rating || 0),
    revenue: realRevenue || (effectivePrice * students),
    payments: paymentsList,
    thumbnail: course.thumbnail || null,
    certificateEnabled: course.certificateAvail,
    certificateAvail: course.certificateAvail,
    learningOutcomes: Array.isArray(course.learningOutcomes) ? course.learningOutcomes : [],
    requirements: Array.isArray(course.requirements) ? course.requirements : [],
    targetAudience: course.targetAudience || "",
    tags: Array.isArray(course.tags) ? course.tags : [],
    promoVideoUrl: course.promoVideoUrl || "",
    rejectionReason: course.rejectionReason || "",
    createdDate: course.createdAt,
    updatedDate: course.updatedAt,
    submittedAt: course.submittedAt,
    publishedAt: course.publishedAt,
    instructor: {
      id: course.instructor?.id,
      name: course.instructor?.name || "Instructor",
      email: course.instructor?.email || "",
      phone: course.instructor?.phone || "-",
      qualification: course.instructor?.designation || "Instructor",
      experience: course.instructor?.bio ? "Profile available" : "Senior Educator",
      coursesPublished: course.instructor?._count?.courses || 0,
      profileImage: course.instructor?.profileImage || null,
      bio: course.instructor?.bio || ""
    },
    curriculum,
    modules: curriculum,
    analytics: {
      completionRate: realCompletionRate,
      revenue: realRevenue || (effectivePrice * students),
      certificatesIssued: course._count?.certificates || 0
    },
    reviews: (course.reviews || []).map((review) => ({
      id: review.id,
      studentName: review.user?.name || "Student",
      rating: review.rating,
      review: review.comment || "",
      date: review.createdAt
    })),
    activityLog: buildActivityLog(course)
  };
};
