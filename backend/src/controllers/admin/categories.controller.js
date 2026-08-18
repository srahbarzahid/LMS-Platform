import { adminCategoriesService } from "../../services/admin/categories.service.js";
const adminCategoriesController = {
  getCategories: (req, res) => {
    const { page = 1, limit = 10, search = "", featured } = req.query;
    let categories = adminCategoriesService.getAllCategories();
    if (search) {
      const s = String(search).toLowerCase();
      categories = categories.filter(
        (c) => c.name.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
      );
    }
    if (featured && featured !== "All") {
      const isFeatured = featured === "Featured";
      categories = categories.filter((c) => c.featured === isFeatured);
    }
    categories.sort((a, b) => a.name.localeCompare(b.name));
    const totalCategories = adminCategoriesService.getAllCategories().length;
    const featuredCategories = adminCategoriesService.getAllCategories().filter((c) => c.featured).length;
    const totalCourses = adminCategoriesService.getAllCategories().reduce((sum, c) => sum + c.totalCourses, 0);
    const mostPopular = [...adminCategoriesService.getAllCategories()].sort((a, b) => b.totalCourses - a.totalCourses)[0];
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;
    const paginatedCategories = categories.slice(startIndex, endIndex);
    res.json({
      data: paginatedCategories,
      total: categories.length,
      page: pageNum,
      totalPages: Math.ceil(categories.length / limitNum),
      stats: {
        totalCategories,
        featuredCategories,
        totalCourses,
        mostPopularCategory: mostPopular ? mostPopular.name : "N/A"
      }
    });
  },
  getCategoryById: (req, res) => {
    const category = adminCategoriesService.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  },
  createCategory: (req, res) => {
    try {
      const newCategory = adminCategoriesService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  updateCategory: (req, res) => {
    try {
      const category = adminCategoriesService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteCategory: (req, res) => {
    try {
      adminCategoriesService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  toggleFeatured: (req, res) => {
    try {
      const category = adminCategoriesService.toggleFeatured(req.params.id, req.body.featured);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};
export {
  adminCategoriesController
};
