import { prisma } from "../prisma.js";
import { getFallbackCourses, normalizeCourse, paginateCourses } from "../services/courseCatalog.service.js";

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
    if (filters.category) where.category = { name: { equals: filters.category, mode: "insensitive" } };
    if (filters.level) where.level = filters.level.toUpperCase();
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { description: { contains: filters.search, mode: "insensitive" } },
        { shortDescription: { contains: filters.search, mode: "insensitive" } }
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
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: { select: { id: true, name: true, bio: true, profileImage: true } },
        category: true,
        modules: {
          orderBy: { order: "asc" },
          include: {
            lessons: {
              orderBy: { order: "asc" },
              select: {
                id: true,
                title: true,
                duration: true,
                isPreview: true,
                order: true
                // Do not send videoUrl unless enrolled, this will be handled in a separate endpoint or conditionally
              }
            }
          }
        },
        reviews: {
          include: { user: { select: { name: true, profileImage: true } } },
          orderBy: { createdAt: "desc" },
          take: 5
        }
      }
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
    const data = normalizeCourse(course);
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
    const {
      title,
      slug,
      description,
      shortDescription,
      categoryId,
      level,
      language,
      price
    } = req.body;
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        shortDescription,
        categoryId,
        level,
        language,
        price: Number(price),
        instructorId: req.user.userId,
        status: "DRAFT"
      }
    });
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
export {
  createCourse,
  getCourseById,
  getCourses
};
