let categories = [
  { id: "cat-1", name: "Robotics", description: "Learn about designing, building, and operating robots.", icon: "Cpu", totalCourses: 15, featured: true, createdAt: "2025-01-15T08:00:00Z" },
  { id: "cat-2", name: "Artificial Intelligence", description: "Machine learning, neural networks, and AI fundamentals.", icon: "BrainCircuit", totalCourses: 28, featured: true, createdAt: "2025-02-10T09:30:00Z" },
  { id: "cat-3", name: "Internet of Things", description: "Connecting physical devices to the digital world.", icon: "Wifi", totalCourses: 8, featured: false, createdAt: "2025-03-05T14:20:00Z" },
  { id: "cat-4", name: "Embedded Systems", description: "Programming microcontrollers and hardware integration.", icon: "Microchip", totalCourses: 12, featured: true, createdAt: "2025-04-12T11:45:00Z" },
  { id: "cat-5", name: "Frontend Development", description: "Building beautiful and interactive user interfaces.", icon: "Layout", totalCourses: 45, featured: true, createdAt: "2025-05-20T10:00:00Z" },
  { id: "cat-6", name: "Backend Development", description: "Server-side programming, databases, and APIs.", icon: "Server", totalCourses: 32, featured: false, createdAt: "2025-06-01T13:15:00Z" },
  { id: "cat-7", name: "Python Programming", description: "Learn Python for data science, automation, and web.", icon: "Code", totalCourses: 50, featured: true, createdAt: "2025-07-10T08:45:00Z" },
  { id: "cat-8", name: "PCB Designing", description: "Design printed circuit boards for electronics projects.", icon: "Layers", totalCourses: 5, featured: false, createdAt: "2025-08-22T16:30:00Z" },
  { id: "cat-9", name: "3D Printing", description: "Mastering 3D modeling and additive manufacturing.", icon: "Box", totalCourses: 0, featured: false, createdAt: "2025-09-05T09:10:00Z" },
  { id: "cat-10", name: "CAD Designing", description: "Computer-aided design for engineering and architecture.", icon: "PenTool", totalCourses: 0, featured: false, createdAt: "2025-10-18T15:20:00Z" }
];
const adminCategoriesService = {
  getAllCategories: () => categories,
  getCategoryById: (id) => categories.find((c) => c.id === id),
  createCategory: (data) => {
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: data.name || "New Category",
      description: data.description || "",
      icon: data.icon || "Folder",
      totalCourses: 0,
      featured: data.featured || false,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    };
    categories.push(newCategory);
    return newCategory;
  },
  updateCategory: (id, data) => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    categories[idx] = { ...categories[idx], ...data };
    return categories[idx];
  },
  deleteCategory: (id) => {
    const category = categories.find((c) => c.id === id);
    if (!category) {
      throw new Error("Category not found");
    }
    if (category.totalCourses > 0) {
      throw new Error("This category contains courses. Please move the courses to another category before deleting.");
    }
    categories = categories.filter((c) => c.id !== id);
    return true;
  },
  toggleFeatured: (id, featured) => {
    const idx = categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    categories[idx].featured = featured;
    return categories[idx];
  }
};
export {
  adminCategoriesService
};
