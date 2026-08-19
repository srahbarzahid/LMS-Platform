const fallbackCourses = [
  {
    id: "demo-web-development",
    title: "Complete Web Development Bootcamp",
    slug: "complete-web-development-bootcamp",
    subtitle: "Build responsive websites and full-stack apps with modern JavaScript.",
    description: "Learn HTML, CSS, React, Node.js, and deployment through hands-on projects.",
    instructor: { name: "Vikram Singh", profileImage: null },
    category: "Web Development",
    level: "Beginner",
    language: "English",
    price: 2499,
    discountPrice: 1999,
    status: "Published",
    featured: true,
    rating: 4.8,
    students: 3240,
    totalStudents: 3240,
    thumbnail: null,
    createdAt: "2026-07-01T00:00:00.000Z",
    updatedAt: "2026-08-01T00:00:00.000Z"
  },
  {
    id: "demo-robotics-iot",
    title: "Robotics and IoT with ESP32",
    slug: "robotics-iot-esp32",
    subtitle: "Create connected hardware projects with sensors, motors, and cloud data.",
    description: "A practical robotics course covering ESP32, MQTT, sensors, and automation.",
    instructor: { name: "Anjali Verma", profileImage: null },
    category: "Robotics",
    level: "Intermediate",
    language: "English",
    price: 1999,
    discountPrice: 1499,
    status: "Published",
    featured: true,
    rating: 4.7,
    students: 2180,
    totalStudents: 2180,
    thumbnail: null,
    createdAt: "2026-07-05T00:00:00.000Z",
    updatedAt: "2026-08-02T00:00:00.000Z"
  },
  {
    id: "demo-machine-learning",
    title: "Machine Learning A-Z with Python",
    slug: "machine-learning-python",
    subtitle: "Train models, evaluate results, and ship practical ML workflows.",
    description: "A complete machine learning path from data preparation to deployment.",
    instructor: { name: "Karan Malhotra", profileImage: null },
    category: "Data Science",
    level: "Intermediate",
    language: "English",
    price: 2999,
    discountPrice: 2499,
    status: "Published",
    featured: true,
    rating: 4.9,
    students: 4120,
    totalStudents: 4120,
    thumbnail: null,
    createdAt: "2026-07-08T00:00:00.000Z",
    updatedAt: "2026-08-03T00:00:00.000Z"
  },
  {
    id: "demo-ui-ux-design",
    title: "Advanced UI/UX Design with Figma",
    slug: "advanced-ui-ux-figma",
    subtitle: "Design polished product flows, prototypes, and reusable design systems.",
    description: "Master product design fundamentals, Figma workflows, and design critique.",
    instructor: { name: "Sneha Kapoor", profileImage: null },
    category: "Design",
    level: "Advanced",
    language: "English",
    price: 1799,
    discountPrice: 1299,
    status: "Published",
    featured: true,
    rating: 4.6,
    students: 1560,
    totalStudents: 1560,
    thumbnail: null,
    createdAt: "2026-07-10T00:00:00.000Z",
    updatedAt: "2026-08-04T00:00:00.000Z"
  },
  {
    id: "demo-digital-marketing",
    title: "Digital Marketing Masterclass",
    slug: "digital-marketing-masterclass",
    subtitle: "Plan campaigns, optimize funnels, and measure marketing performance.",
    description: "Learn SEO, content, paid ads, email, and analytics from one structured course.",
    instructor: { name: "Rohan Das", profileImage: null },
    category: "Marketing",
    level: "Beginner",
    language: "English",
    price: 1499,
    discountPrice: 999,
    status: "Published",
    featured: false,
    rating: 4.5,
    students: 2890,
    totalStudents: 2890,
    thumbnail: null,
    createdAt: "2026-07-12T00:00:00.000Z",
    updatedAt: "2026-08-05T00:00:00.000Z"
  },
  {
    id: "demo-data-science",
    title: "Data Science and Deep Learning",
    slug: "data-science-deep-learning",
    subtitle: "Analyze data and build neural networks with a project-first approach.",
    description: "Go from notebooks to meaningful models with Python, pandas, and deep learning.",
    instructor: { name: "Pooja Reddy", profileImage: null },
    category: "Data Science",
    level: "Advanced",
    language: "English",
    price: 3499,
    discountPrice: 2999,
    status: "Published",
    featured: false,
    rating: 4.8,
    students: 1980,
    totalStudents: 1980,
    thumbnail: null,
    createdAt: "2026-07-14T00:00:00.000Z",
    updatedAt: "2026-08-06T00:00:00.000Z"
  }
];

const statusLabels = {
  DRAFT: "Draft",
  PUBLISHED: "Published",
  REJECTED: "Rejected"
};

const levelLabels = {
  BEGINNER: "Beginner",
  INTERMEDIATE: "Intermediate",
  ADVANCED: "Advanced",
  ALL_LEVELS: "All Levels"
};

const normalizeStatus = (status) => statusLabels[status] || status || "Published";
const normalizeLevel = (level) => levelLabels[level] || level || "Beginner";

const normalizeInstructor = (instructor) => ({
  id: instructor?.id,
  name: instructor?.name || "Pibots Instructor",
  profileImage: instructor?.profileImage || null,
  bio: instructor?.bio
});

const normalizeCategory = (category) => {
  if (!category) return "Technology";
  if (typeof category === "string") return category;
  return category.name || "Technology";
};

const courseMatches = (course, { category, level, search }) => {
  const normalized = normalizeCourse(course);
  const searchText = `${normalized.title} ${normalized.subtitle} ${normalized.description} ${normalized.category}`.toLowerCase();
  const normalizedCategory = category?.toLowerCase();
  const normalizedLevel = level?.toLowerCase();

  if (normalizedCategory && normalized.category.toLowerCase() !== normalizedCategory) return false;
  if (normalizedLevel && normalized.level.toLowerCase() !== normalizedLevel) return false;
  if (search && !searchText.includes(search.toLowerCase())) return false;

  return true;
};

export const getFallbackCourses = (filters = {}) => fallbackCourses.filter((course) => courseMatches(course, filters));

export const normalizeCourse = (course) => {
  const category = normalizeCategory(course.category);
  const totalStudents = course.totalStudents ?? course.students ?? 0;
  const status = normalizeStatus(course.status);

  return {
    id: course.id,
    title: course.title,
    slug: course.slug,
    subtitle: course.shortDescription || course.subtitle || course.description || "",
    shortDescription: course.shortDescription || course.subtitle || "",
    description: course.description || "",
    instructor: normalizeInstructor(course.instructor),
    category,
    categoryId: course.categoryId,
    level: normalizeLevel(course.level),
    language: course.language || "English",
    price: course.price ?? 0,
    discountPrice: course.discountPrice ?? null,
    status,
    featured: Boolean(course.featured ?? status === "Published"),
    rating: course.rating ?? 0,
    students: totalStudents,
    totalStudents,
    thumbnail: course.thumbnail || null,
    createdAt: course.createdAt,
    updatedAt: course.updatedAt
  };
};

export const paginateCourses = (courses, page, limit) => {
  const safeLimit = Math.max(Number(limit) || 10, 1);
  const safePage = Math.max(Number(page) || 1, 1);
  const start = (safePage - 1) * safeLimit;
  const data = courses.slice(start, start + safeLimit).map(normalizeCourse);
  const total = courses.length;

  return {
    success: true,
    data,
    courses: data,
    total,
    page: safePage,
    totalPages: Math.max(Math.ceil(total / safeLimit), 1)
  };
};
