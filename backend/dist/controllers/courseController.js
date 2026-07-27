"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourse = exports.getCourseById = exports.getCourses = void 0;
const index_1 = require("../index");
const getCourses = async (req, res) => {
    try {
        const category = req.query.category;
        const level = req.query.level;
        const search = req.query.search;
        const limit = req.query.limit || '10';
        const page = req.query.page || '1';
        const where = { status: 'PUBLISHED' };
        if (category)
            where.categoryId = category;
        if (level)
            where.level = level;
        if (search) {
            where.OR = [
                { title: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } }
            ];
        }
        const skip = (Number(page) - 1) * Number(limit);
        const [courses, total] = await Promise.all([
            index_1.prisma.course.findMany({
                where,
                include: {
                    instructor: { select: { name: true, profileImage: true } },
                    category: { select: { name: true } }
                },
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' }
            }),
            index_1.prisma.course.count({ where })
        ]);
        res.json({
            courses,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / Number(limit))
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCourses = getCourses;
const getCourseById = async (req, res) => {
    try {
        const id = req.params.id;
        const course = await index_1.prisma.course.findUnique({
            where: { id },
            include: {
                instructor: { select: { id: true, name: true, bio: true, profileImage: true } },
                category: true,
                modules: {
                    orderBy: { order: 'asc' },
                    include: {
                        lessons: {
                            orderBy: { order: 'asc' },
                            select: {
                                id: true,
                                title: true,
                                duration: true,
                                isPreview: true,
                                order: true,
                                // Do not send videoUrl unless enrolled, this will be handled in a separate endpoint or conditionally
                            }
                        }
                    }
                },
                reviews: {
                    include: { user: { select: { name: true, profileImage: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                }
            }
        });
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.json(course);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getCourseById = getCourseById;
const createCourse = async (req, res) => {
    try {
        const { title, slug, description, shortDescription, categoryId, level, language, price } = req.body;
        const course = await index_1.prisma.course.create({
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
                status: 'DRAFT'
            }
        });
        res.status(201).json(course);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.createCourse = createCourse;
