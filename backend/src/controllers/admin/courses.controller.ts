import { Request, Response } from 'express';

const indianNames = [
  'Vikram Singh', 'Anjali Verma', 'Karan Malhotra', 'Sneha Kapoor', 'Rohan Das',
  'Pooja Reddy', 'Amit Kumar', 'Kavita Joshi', 'Sanjay Mishra', 'Riya Jain'
];

const courseTitles = [
  'Complete 2024 Web Development Bootcamp', 'Machine Learning A-Z: Python & R', 
  'Advanced UI/UX Design with Figma', 'Digital Marketing Masterclass', 
  'MBA in a Box: Business Lessons', 'React Native: The Practical Guide',
  'Data Science and Deep Learning', 'Illustrator CC 2024 Masterclass',
  'The Complete Financial Analyst Course', 'Social Media Marketing Agency'
];

// Generate complex mock data for courses
let mockCourses = Array.from({ length: 45 }).map((_, i) => {
  const statusOptions = ['Published', 'Pending Approval', 'Draft', 'Rejected', 'Unpublished'];
  const categoryOptions = ['Web Development', 'Data Science', 'Design', 'Marketing', 'Business'];
  
  const status = statusOptions[Math.floor(Math.random() * statusOptions.length)];
  const category = categoryOptions[Math.floor(Math.random() * categoryOptions.length)];
  const price = Math.floor(Math.random() * 5000) + 1000;
  
  const title = courseTitles[i % courseTitles.length] + (i >= courseTitles.length ? ` (Vol ${Math.floor(i/10) + 1})` : '');
  const instructorName = indianNames[i % indianNames.length];
  
  return {
    id: `C${1000 + i}`,
    title,
    subtitle: `Master the skills needed for ${category} with hands-on projects and expert guidance.`,
    description: `This comprehensive course will take you from beginner to advanced in ${category}. You will build real-world projects and learn the best practices from industry professionals.`,
    instructor: {
      name: instructorName,
      email: `prof.${instructorName.split(' ')[0].toLowerCase()}@example.com`,
      phone: `+91 99887${Math.floor(10000 + Math.random() * 90000)}`,
      qualification: 'M.Tech / PhD',
      experience: `${(i % 15) + 3} Years`,
      coursesPublished: (i % 5) + 1
    },
    category,
    level: ['Beginner', 'Intermediate', 'Advanced'][Math.floor(Math.random() * 3)],
    language: 'English',
    price,
    discountPrice: price - 500,
    status,
    featured: status === 'Published' && Math.random() > 0.8,
    students: Math.floor(Math.random() * 5000),
    rating: (Math.random() * 2 + 3).toFixed(1),
    createdDate: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
    updatedDate: new Date().toISOString(),
    
    // Additional Detail Tabs Data
    analytics: {
      completionRate: Math.floor(Math.random() * 40) + 40, // 40-80%
      revenue: Math.floor(Math.random() * 500000),
      certificatesIssued: Math.floor(Math.random() * 2000)
    },
    curriculum: [
      { id: 1, title: 'Introduction', type: 'module', items: 3, lessons: [{ title: 'Welcome to the Course', duration: '5:30', type: 'video' }, { title: 'Setting up your environment', duration: '12:45', type: 'video' }, { title: 'Initial Quiz', duration: '10:00', type: 'quiz' }] },
      { id: 2, title: 'Core Concepts', type: 'module', items: 5, lessons: [{ title: 'What is UI/UX?', duration: '8:20', type: 'video' }, { title: 'Design Thinking', duration: '15:10', type: 'video' }, { title: 'Wireframing Basics', duration: '20:00', type: 'video' }, { title: 'Typography', duration: '11:15', type: 'video' }, { title: 'Color Theory', duration: '14:30', type: 'video' }] },
      { id: 3, title: 'Advanced Topics', type: 'module', items: 4, lessons: [{ title: 'Prototyping in Figma', duration: '25:00', type: 'video' }, { title: 'Design Systems', duration: '18:45', type: 'video' }, { title: 'Auto Layout', duration: '22:10', type: 'video' }, { title: 'Advanced Assignment', duration: '45:00', type: 'assignment' }] },
      { id: 4, title: 'Final Project', type: 'project', items: 1, lessons: [{ title: 'Capstone Project Submission', duration: '1:00:00', type: 'project' }] }
    ],
    reviews: Array.from({ length: 3 }).map((_, j) => ({
      id: `R${i}-${j}`,
      studentName: `Student ${indianNames[(j+i) % indianNames.length].split(' ')[0]}`,
      rating: Math.floor(Math.random() * 2) + 4,
      review: "Excellent course, highly recommended!",
      date: new Date().toISOString()
    })),
    activityLog: [
      { id: 1, action: 'Course Created', date: new Date(Date.now() - 5000000000).toISOString() },
      { id: 2, action: 'Submitted for Review', date: new Date(Date.now() - 2000000000).toISOString() },
      { id: 3, action: `Status changed to ${status}`, date: new Date().toISOString() }
    ]
  };
});

export const adminCoursesController = {
  // GET /api/admin/courses
  getCourses: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';
      const statusFilter = (req.query.status as string) || 'All';
      const categoryFilter = (req.query.category as string) || 'All';
      
      let filtered = [...mockCourses];

      if (search) {
        const lowerSearch = search.toLowerCase();
        filtered = filtered.filter(c => 
          c.title.toLowerCase().includes(lowerSearch) || 
          c.instructor.name.toLowerCase().includes(lowerSearch)
        );
      }

      if (statusFilter !== 'All') {
        filtered = filtered.filter(c => c.status === statusFilter);
      }
      
      if (categoryFilter !== 'All') {
        filtered = filtered.filter(c => c.category === categoryFilter);
      }

      // Calculate stats before pagination
      const stats = {
        total: mockCourses.length,
        published: mockCourses.filter(c => c.status === 'Published').length,
        pending: mockCourses.filter(c => c.status === 'Pending Approval').length,
        draft: mockCourses.filter(c => c.status === 'Draft').length,
        rejected: mockCourses.filter(c => c.status === 'Rejected').length,
        unpublished: mockCourses.filter(c => c.status === 'Unpublished').length,
        featured: mockCourses.filter(c => c.featured).length,
        newThisMonth: 12 // Mock stat
      };

      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);

      res.status(200).json({
        success: true,
        data: paginated,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit),
        page,
        stats
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch courses' });
    }
  },

  // GET /api/admin/courses/pending
  getPendingCourses: async (req: Request, res: Response) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = (req.query.search as string) || '';

      let pending = mockCourses.filter(c => c.status === 'Pending Approval');

      if (search) {
        const lowerSearch = search.toLowerCase();
        pending = pending.filter(c => 
          c.title.toLowerCase().includes(lowerSearch) || 
          c.instructor.name.toLowerCase().includes(lowerSearch)
        );
      }

      // Calculate stats
      const stats = {
        pendingCourses: pending.length,
        approvedToday: mockCourses.filter(c => c.status === 'Published' && new Date(c.updatedDate).toDateString() === new Date().toDateString()).length,
        rejectedToday: mockCourses.filter(c => c.status === 'Rejected' && new Date(c.updatedDate).toDateString() === new Date().toDateString()).length,
        totalPendingReviews: pending.length // Can be different if we have different review queues, but same for now
      };

      const startIndex = (page - 1) * limit;
      const paginated = pending.slice(startIndex, startIndex + limit);

      res.status(200).json({
        success: true,
        data: paginated,
        total: pending.length,
        totalPages: Math.ceil(pending.length / limit),
        page,
        stats
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Failed to fetch pending courses' });
    }
  },

  // GET /api/admin/courses/:id
  getCourseById: async (req: Request, res: Response): Promise<void> => {
    try {
      const course = mockCourses.find(c => c.id === req.params.id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // PATCH /api/admin/courses/:id/status
  updateCourseStatus: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, reason, notes } = req.body;
      const course = mockCourses.find(c => c.id === req.params.id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      
      course.status = status;
      course.updatedDate = new Date().toISOString();
      
      course.activityLog.unshift({
        id: Date.now(),
        action: `Status changed to ${status}${reason ? ` (Reason: ${reason})` : ''}`,
        date: new Date().toISOString()
      });

      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // PATCH /api/admin/courses/:id/featured
  toggleCourseFeatured: async (req: Request, res: Response): Promise<void> => {
    try {
      const { featured } = req.body;
      const course = mockCourses.find(c => c.id === req.params.id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      
      course.featured = featured;
      course.activityLog.unshift({
        id: Date.now(),
        action: featured ? 'Course marked as Featured' : 'Course removed from Featured',
        date: new Date().toISOString()
      });

      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // PATCH /api/admin/courses/:id/template
  updateCourseTemplate: async (req: Request, res: Response): Promise<void> => {
    try {
      const { templateId } = req.body;
      const course = mockCourses.find(c => c.id === req.params.id);
      if (!course) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }

      course.certificateTemplateId = templateId;
      course.updatedDate = new Date().toISOString();

      course.activityLog.unshift({
        id: Date.now(),
        action: templateId ? 'Assigned Certificate Template' : 'Removed Certificate Template',
        date: new Date().toISOString()
      });

      res.status(200).json({ success: true, data: course });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  },

  // DELETE /api/admin/courses/:id
  deleteCourse: async (req: Request, res: Response): Promise<void> => {
    try {
      const index = mockCourses.findIndex(c => c.id === req.params.id);
      if (index === -1) {
        res.status(404).json({ success: false, message: 'Course not found' });
        return;
      }
      
      mockCourses.splice(index, 1);
      res.status(200).json({ success: true, message: 'Course deleted' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
