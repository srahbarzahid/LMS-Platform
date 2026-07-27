"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminCategoriesController = void 0;
const categories_service_1 = require("../../services/admin/categories.service");
exports.adminCategoriesController = {
    getCategories: (req, res) => {
        const { page = 1, limit = 10, search = '', featured } = req.query;
        let categories = categories_service_1.adminCategoriesService.getAllCategories();
        // Search
        if (search) {
            const s = String(search).toLowerCase();
            categories = categories.filter(c => c.name.toLowerCase().includes(s) ||
                c.description.toLowerCase().includes(s));
        }
        // Filter by Featured
        if (featured && featured !== 'All') {
            const isFeatured = featured === 'Featured';
            categories = categories.filter(c => c.featured === isFeatured);
        }
        // Sort by name (can be parameterized if needed)
        categories.sort((a, b) => a.name.localeCompare(b.name));
        // Stats
        const totalCategories = categories_service_1.adminCategoriesService.getAllCategories().length;
        const featuredCategories = categories_service_1.adminCategoriesService.getAllCategories().filter(c => c.featured).length;
        const totalCourses = categories_service_1.adminCategoriesService.getAllCategories().reduce((sum, c) => sum + c.totalCourses, 0);
        const mostPopular = [...categories_service_1.adminCategoriesService.getAllCategories()].sort((a, b) => b.totalCourses - a.totalCourses)[0];
        // Pagination
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
                mostPopularCategory: mostPopular ? mostPopular.name : 'N/A'
            }
        });
    },
    getCategoryById: (req, res) => {
        const category = categories_service_1.adminCategoriesService.getCategoryById(req.params.id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(category);
    },
    createCategory: (req, res) => {
        try {
            const newCategory = categories_service_1.adminCategoriesService.createCategory(req.body);
            res.status(201).json(newCategory);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    updateCategory: (req, res) => {
        try {
            const category = categories_service_1.adminCategoriesService.updateCategory(req.params.id, req.body);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    deleteCategory: (req, res) => {
        try {
            categories_service_1.adminCategoriesService.deleteCategory(req.params.id);
            res.json({ message: 'Category deleted successfully' });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    toggleFeatured: (req, res) => {
        try {
            const category = categories_service_1.adminCategoriesService.toggleFeatured(req.params.id, req.body.featured);
            if (!category) {
                return res.status(404).json({ error: 'Category not found' });
            }
            res.json(category);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
};
