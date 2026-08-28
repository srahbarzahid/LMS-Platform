import { prisma } from "../../prisma.js";

const adminCategoriesService = {
  async getAllCategories() {
    let categories = await prisma.category.findMany({
      include: {
        _count: { select: { courses: true } }
      },
      orderBy: { name: "asc" }
    });

    if (categories.length === 0) {
      const initial = [
        { name: "Robotics", slug: "robotics", description: "Learn about designing, building, and operating robots.", icon: "Cpu", featured: true },
        { name: "Artificial Intelligence", slug: "artificial-intelligence", description: "Machine learning, neural networks, and AI fundamentals.", icon: "BrainCircuit", featured: true },
        { name: "Internet of Things", slug: "internet-of-things", description: "Connecting physical devices to the digital world.", icon: "Wifi", featured: false },
        { name: "Embedded Systems", slug: "embedded-systems", description: "Programming microcontrollers and hardware integration.", icon: "Microchip", featured: true },
        { name: "Frontend Development", slug: "frontend-development", description: "Building beautiful and interactive user interfaces.", icon: "Layout", featured: true },
        { name: "Backend Development", slug: "backend-development", description: "Server-side programming, databases, and APIs.", icon: "Server", featured: false },
        { name: "Python Programming", slug: "python-programming", description: "Learn Python for data science, automation, and web.", icon: "Code", featured: true },
        { name: "PCB Designing", slug: "pcb-designing", description: "Design printed circuit boards for electronics projects.", icon: "Layers", featured: false },
        { name: "3D Printing", slug: "3d-printing", description: "Mastering 3D modeling and additive manufacturing.", icon: "Box", featured: false },
        { name: "CAD Designing", slug: "cad-designing", description: "Computer-aided design for engineering and architecture.", icon: "PenTool", featured: false }
      ];

      for (const cat of initial) {
        await prisma.category.upsert({
          where: { name: cat.name },
          update: {},
          create: cat
        });
      }

      categories = await prisma.category.findMany({
        include: {
          _count: { select: { courses: true } }
        },
        orderBy: { name: "asc" }
      });
    }

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Folder",
      totalCourses: c._count?.courses || 0,
      featured: c.featured,
      createdAt: c.createdAt
    }));
  },

  async getCategoryById(id) {
    const c = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } }
    });
    if (!c) return null;
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Folder",
      totalCourses: c._count?.courses || 0,
      featured: c.featured,
      createdAt: c.createdAt
    };
  },

  async createCategory(data) {
    const slug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : `cat-${Date.now()}`;
    const c = await prisma.category.create({
      data: {
        name: data.name,
        slug: slug || `cat-${Date.now()}`,
        description: data.description || "",
        icon: data.icon || "Folder",
        featured: Boolean(data.featured)
      }
    });
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Folder",
      totalCourses: 0,
      featured: c.featured,
      createdAt: c.createdAt
    };
  },

  async updateCategory(id, data) {
    const slug = data.name ? data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : undefined;
    const c = await prisma.category.update({
      where: { id },
      data: {
        ...(data.name ? { name: data.name, slug } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.icon !== undefined ? { icon: data.icon } : {}),
        ...(data.featured !== undefined ? { featured: Boolean(data.featured) } : {})
      },
      include: { _count: { select: { courses: true } } }
    });
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Folder",
      totalCourses: c._count?.courses || 0,
      featured: c.featured,
      createdAt: c.createdAt
    };
  },

  async deleteCategory(id) {
    const c = await prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { courses: true } } }
    });
    if (!c) throw new Error("Category not found");
    if (c._count?.courses > 0) {
      throw new Error("This category contains active courses. Please reassign the courses before deleting.");
    }
    await prisma.category.delete({ where: { id } });
    return true;
  },

  async toggleFeatured(id, featured) {
    const c = await prisma.category.update({
      where: { id },
      data: { featured: Boolean(featured) },
      include: { _count: { select: { courses: true } } }
    });
    return {
      id: c.id,
      name: c.name,
      slug: c.slug,
      description: c.description || "",
      icon: c.icon || "Folder",
      totalCourses: c._count?.courses || 0,
      featured: c.featured,
      createdAt: c.createdAt
    };
  }
};

export { adminCategoriesService };
