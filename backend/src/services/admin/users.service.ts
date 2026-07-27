const indianNames = [
  'Aarav Sharma', 'Priya Patel', 'Rahul Desai', 'Neha Gupta', 'Vikram Singh',
  'Anjali Verma', 'Karan Malhotra', 'Sneha Kapoor', 'Rohan Das', 'Pooja Reddy',
  'Amit Kumar', 'Kavita Joshi', 'Sanjay Mishra', 'Riya Jain', 'Vivek Tiwari',
  'Megha Agarwal', 'Ravi Iyer', 'Nisha Sharma', 'Arjun Nair', 'Kriti Bhatia',
  'Manish Rao', 'Swati Menon', 'Gaurav Yadav', 'Isha Chawla', 'Tarun Garg',
  'Aditi Sengupta', 'Rajeev Pillai', 'Sonal Mehta', 'Nitin Bhatt', 'Divya Chauhan'
];

export const adminUsersService = {
  // Generate large mock data
  _students: Array.from({ length: 45 }).map((_, i) => ({
    id: `STU-${1000 + i}`,
    name: indianNames[i % indianNames.length],
    email: `${indianNames[i % indianNames.length].split(' ')[0].toLowerCase()}.${i}@example.com`,
    phone: `+91 98765${Math.floor(10000 + Math.random() * 90000)}`,
    enrolledCourses: Math.floor(Math.random() * 5) + 1,
    progress: Math.floor(Math.random() * 100),
    status: Math.random() > 0.8 ? 'Blocked' : (Math.random() > 0.9 ? 'Inactive' : 'Active'),
    joinedDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0],
    profileImage: null
  })),

  _instructors: Array.from({ length: 25 }).map((_, i) => ({
    id: `INS-${1000 + i}`,
    name: indianNames[(i + 15) % indianNames.length],
    email: `prof.${indianNames[(i + 15) % indianNames.length].split(' ')[0].toLowerCase()}@example.com`,
    phone: `+91 99887${Math.floor(10000 + Math.random() * 90000)}`,
    courses: Math.floor(Math.random() * 10) + 1,
    students: Math.floor(Math.random() * 5000),
    revenue: Math.floor(Math.random() * 100000),
    rating: (Math.random() * 1 + 4).toFixed(1),
    status: Math.random() > 0.9 ? 'Suspended' : 'Active',
    joinedDate: new Date(Date.now() - Math.random() * 10000000000).toISOString().split('T')[0]
  })),

  _admins: [
    { id: 'ADM-1', name: 'Super Admin', email: 'admin@lms.com', role: 'Super Admin', status: 'Active', lastLogin: 'Today, 08:30 AM' },
    { id: 'ADM-2', name: 'Support Manager', email: 'support@lms.com', role: 'Admin', status: 'Active', lastLogin: 'Yesterday, 14:20 PM' },
    { id: 'ADM-3', name: 'Finance Controller', email: 'finance@lms.com', role: 'Admin', status: 'Inactive', lastLogin: '2 weeks ago' },
  ],

  getStudents(filters: any) {
    let result = [...this._students];
    if (filters.search) {
      result = result.filter(s => s.name.toLowerCase().includes(filters.search.toLowerCase()) || s.email.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter(s => s.status === filters.status);
    }
    
    const start = (filters.page - 1) * filters.limit;
    const paginated = result.slice(start, start + filters.limit);
    
    return {
      data: paginated,
      total: result.length,
      page: filters.page,
      totalPages: Math.ceil(result.length / filters.limit),
      stats: {
        total: this._students.length,
        active: this._students.filter(s => s.status === 'Active').length,
        blocked: this._students.filter(s => s.status === 'Blocked').length,
        newThisMonth: 15
      }
    };
  },

  getStudentById(id: string) {
    return this._students.find(s => s.id === id);
  },

  getInstructors(filters: any) {
    let result = [...this._instructors];
    if (filters.search) {
      result = result.filter(i => i.name.toLowerCase().includes(filters.search.toLowerCase()) || i.email.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.status && filters.status !== 'All') {
      result = result.filter(i => i.status === filters.status);
    }
    
    const start = (filters.page - 1) * filters.limit;
    const paginated = result.slice(start, start + filters.limit);
    
    return {
      data: paginated,
      total: result.length,
      page: filters.page,
      totalPages: Math.ceil(result.length / filters.limit),
      stats: {
        total: this._instructors.length,
        active: this._instructors.filter(i => i.status === 'Active').length,
        suspended: this._instructors.filter(i => i.status === 'Suspended').length,
        totalRevenue: this._instructors.reduce((sum, i) => sum + i.revenue, 0)
      }
    };
  },

  getInstructorById(id: string) {
    return this._instructors.find(i => i.id === id);
  },

  createInstructor(data: any) {
    const newInstructor = {
      id: `INS-${Math.floor(10000 + Math.random() * 90000)}`,
      name: data.name,
      email: data.email,
      phone: data.phone || '+91 9900000000',
      courses: 0,
      students: 0,
      revenue: 0,
      rating: '0.0',
      status: data.status || 'Active',
      joinedDate: new Date().toISOString().split('T')[0]
    };
    this._instructors.unshift(newInstructor);
    return newInstructor;
  },

  getAdmins(filters: any) {
    let result = [...this._admins];
    if (filters.search) {
      result = result.filter(a => a.name.toLowerCase().includes(filters.search.toLowerCase()));
    }
    if (filters.role && filters.role !== 'All') {
      result = result.filter(a => a.role === filters.role);
    }
    
    return {
      data: result,
      total: result.length,
      page: 1,
      totalPages: 1,
      stats: {
        total: this._admins.length,
        superAdmins: this._admins.filter(a => a.role === 'Super Admin').length,
        active: this._admins.filter(a => a.status === 'Active').length
      }
    };
  },

  getAdminById(id: string) {
    return this._admins.find(a => a.id === id);
  },

  deleteUser(id: string) {
    if (id.startsWith('STU')) {
      this._students = this._students.filter(s => s.id !== id);
    } else if (id.startsWith('INS')) {
      this._instructors = this._instructors.filter(i => i.id !== id);
    } else if (id.startsWith('ADM')) {
      this._admins = this._admins.filter(a => a.id !== id);
    }
  },

  updateUserStatus(id: string) {
    if (id.startsWith('STU')) {
      const u = this._students.find(s => s.id === id);
      if (u) u.status = u.status === 'Active' ? 'Blocked' : 'Active';
    } else if (id.startsWith('INS')) {
      const u = this._instructors.find(i => i.id === id);
      if (u) u.status = u.status === 'Active' ? 'Suspended' : 'Active';
    } else if (id.startsWith('ADM')) {
      const u = this._admins.find(a => a.id === id);
      if (u) u.status = u.status === 'Active' ? 'Inactive' : 'Active';
    }
  }
};
