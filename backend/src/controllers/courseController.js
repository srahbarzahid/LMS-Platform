import { prisma } from "../prisma.js";
import { getFallbackCourses, normalizeCourse, paginateCourses } from "../services/courseCatalog.service.js";
import {
  courseInclude,
  createCourseFromInstructor,
  formatCourse,
  getCoursePipelineErrorMessage,
  normalizeCourseLevel
} from "../services/coursePipeline.service.js";

const buildCourseFilters = (query) => ({
  category: query.category,
  level: query.level,
  search: query.search
});

const logCourseFallback = (message, error) => {
  const code = error?.code || error?.name || "UNKNOWN";
  const detail = error?.message?.split("\n").find(Boolean) || "Database query failed";
  console.warn(`${message} (${code}): ${detail}`);
};

const getCourses = async (req, res) => {
  const limit = req.query.limit || "10";
  const page = req.query.page || "1";
  const filters = buildCourseFilters(req.query);

  try {
    const where = { status: "PUBLISHED" };
    if (filters.category) where.category = { is: { name: filters.category } };
    if (filters.level) where.level = normalizeCourseLevel(filters.level);
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search } },
        { description: { contains: filters.search } },
        { shortDescription: { contains: filters.search } }
      ];
    }
    const safeLimit = Math.max(Number(limit) || 10, 1);
    const safePage = Math.max(Number(page) || 1, 1);
    const skip = (safePage - 1) * safeLimit;
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: { select: { name: true, profileImage: true } },
          category: { select: { name: true } }
        },
        skip,
        take: safeLimit,
        orderBy: { createdAt: "desc" }
      }),
      prisma.course.count({ where })
    ]);
    const data = courses.map(normalizeCourse);
    res.json({
      success: true,
      data,
      courses: data,
      source: "database",
      total,
      page: safePage,
      totalPages: Math.max(Math.ceil(total / safeLimit), 1)
    });
  } catch (error) {
    logCourseFallback("Failed to fetch public courses from database. Serving fallback catalog.", error);
    res.json({
      ...paginateCourses(getFallbackCourses(filters), page, limit),
      source: "fallback"
    });
  }
};
const getCourseById = async (req, res) => {
  try {
    const id = req.params.id;
    const course = await prisma.course.findFirst({
      where: { id, status: "PUBLISHED" },
      include: courseInclude
    });
    if (!course) {
      const fallbackCourse = getFallbackCourses().find((item) => item.id === req.params.id || item.slug === req.params.id);
      if (fallbackCourse) {
        res.json({ success: true, data: fallbackCourse, course: fallbackCourse, source: "fallback" });
        return;
      }
      res.status(404).json({ success: false, message: "Course not found" });
      return;
    }
    const data = formatCourse(course);
    res.json({ success: true, data, course: data, source: "database" });
  } catch (error) {
    const fallbackCourse = getFallbackCourses().find((item) => item.id === req.params.id || item.slug === req.params.id);
    if (fallbackCourse) {
      logCourseFallback("Failed to fetch course from database. Serving fallback course.", error);
      res.json({ success: true, data: fallbackCourse, course: fallbackCourse, source: "fallback" });
      return;
    }
    console.error("Failed to fetch course.", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const createCourse = async (req, res) => {
  try {
    const course = await createCourseFromInstructor({
      input: req.body,
      instructorId: req.user.userId,
      action: req.body.action || "draft"
    });
    res.status(201).json({ success: true, data: formatCourse(course) });
  } catch (error) {
    console.error(error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: getCoursePipelineErrorMessage(error, "Failed to create course")
    });
  }
};
export {
  createCourse,
  getCourseById,
  getCourses
};
