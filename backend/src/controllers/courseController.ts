import { Request, Response } from 'express';
import { prisma } from '../index';

export const getCourses = async (req: Request, res: Response): Promise<void> => {
  try {
    const category = req.query.category as string | undefined;
    const level = req.query.level as string | undefined;
    const search = req.query.search as string | undefined;
    const limit = (req.query.limit as string) || '10';
    const page = (req.query.page as string) || '1';
    
    const where: any = { status: 'PUBLISHED' };
    
    if (category) where.categoryId = category;
    if (level) where.level = level;
    if (search) {
      where.OR = [
        { title: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          instructor: { select: { name: true, profileImage: true } },
          category: { select: { name: true } }
        },
        skip,
        take: Number(limit),
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    res.json({
      courses,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCourseById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = req.params.id as string;
    
    const course = await prisma.course.findUnique({
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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      title, slug, description, shortDescription, categoryId, level, language, price
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
        instructorId: req.user!.userId,
        status: 'DRAFT'
      }
    });

    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
