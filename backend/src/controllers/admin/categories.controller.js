import { adminCategoriesService } from "../../services/admin/categories.service.js";
const adminCategoriesController = {
  getCategories: async (req, res) => {
    try {
      const { page = 1, limit = 10, search = "", featured } = req.query;
      let categories = await adminCategoriesService.getAllCategories();

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

      const allCat = await adminCategoriesService.getAllCategories();
      const totalCategories = allCat.length;
      const featuredCategories = allCat.filter((c) => c.featured).length;
      const totalCourses = allCat.reduce((sum, c) => sum + c.totalCourses, 0);
      const mostPopular = [...allCat].sort((a, b) => b.totalCourses - a.totalCourses)[0];

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
    } catch (error) {
      res.status(500).json({ error: error.message || "Failed to fetch categories" });
    }
  },

  getCategoryById: async (req, res) => {
    try {
      const category = await adminCategoriesService.getCategoryById(req.params.id);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createCategory: async (req, res) => {
    try {
      const newCategory = await adminCategoriesService.createCategory(req.body);
      res.status(201).json(newCategory);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateCategory: async (req, res) => {
    try {
      const category = await adminCategoriesService.updateCategory(req.params.id, req.body);
      if (!category) {
        return res.status(404).json({ error: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      await adminCategoriesService.deleteCategory(req.params.id);
      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  toggleFeatured: async (req, res) => {
    try {
      const category = await adminCategoriesService.toggleFeatured(req.params.id, req.body.featured);
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
