const getDashboardAnalyticsData = async () => {
  return {
    overview: {
      totalStudents: 15420,
      studentGrowth: 12.5,
      totalInstructors: 450,
      instructorGrowth: 5.2,
      totalCourses: 125,
      courseGrowth: 8.4,
      publishedCourses: 98,
      pendingApprovals: 12,
      totalRevenue: 345e4,
      revenueGrowth: 24.5,
      totalOrders: 18500,
      orderGrowth: 15.2,
      certificatesIssued: 8400,
      certificateGrowth: 18,
      averageCourseRating: 4.8,
      courseCompletionRate: 68
    },
    userAnalytics: {
      totalActiveStudents: 12050,
      totalActiveInstructors: 410,
      newStudentRegistrations: 450,
      // this month
      newInstructorAccounts: 15,
      // this month
      monthlyGrowth: [
        { month: "Jan", students: 800, instructors: 20 },
        { month: "Feb", students: 1200, instructors: 25 },
        { month: "Mar", students: 900, instructors: 15 },
        { month: "Apr", students: 1500, instructors: 30 },
        { month: "May", students: 2100, instructors: 45 },
        { month: "Jun", students: 3400, instructors: 60 }
      ],
      userDistribution: [
        { name: "Students", value: 15420 },
        { name: "Instructors", value: 450 },
        { name: "Admins", value: 8 }
      ]
    },
    revenueAnalytics: {
      todayRevenue: 45e3,
      weeklyRevenue: 315e3,
      monthlyRevenue: 125e4,
      totalRevenue: 345e4,
      averageOrderValue: 2500,
      revenueGrowth: 18.5,
      monthlyData: [
        { month: "Jan", revenue: 45e4 },
        { month: "Feb", revenue: 52e4 },
        { month: "Mar", revenue: 48e4 },
        { month: "Apr", revenue: 61e4 },
        { month: "May", revenue: 75e4 },
        { month: "Jun", revenue: 98e4 }
      ]
    },
    courseAnalytics: {
      published: 98,
      draft: 15,
      pending: 12,
      rejected: 3,
      featured: 10,
      topSelling: 5,
      distribution: [
        { name: "Published", value: 98 },
        { name: "Draft", value: 15 },
        { name: "Pending", value: 12 }
      ],
      categories: [
        { name: "Development", count: 45 },
        { name: "Business", count: 30 },
        { name: "Design", count: 25 },
        { name: "Marketing", count: 15 }
      ]
    },
    enrollmentAnalytics: {
      total: 89e3,
      today: 450,
      monthly: 12500,
      completed: 45e3,
      activeLearners: 25e3,
      monthlyData: [
        { month: "Jan", enrollments: 5e3 },
        { month: "Feb", enrollments: 6200 },
        { month: "Mar", enrollments: 5800 },
        { month: "Apr", enrollments: 8100 },
        { month: "May", enrollments: 9500 },
        { month: "Jun", enrollments: 12500 }
      ]
    },
    paymentOverview: {
      successful: 18500,
      pending: 120,
      failed: 45,
      refundRequests: 24,
      revenueThisMonth: 125e4
    },
    pendingApprovals: {
      courses: 12,
      refunds: 24,
      reportedReviews: 15,
      certificates: 8
    },
    recentActivities: [
      { id: "1", type: "course_approved", title: "Course Approved", time: "10 mins ago", icon: "CheckCircle" },
      { id: "2", type: "student_registered", title: "Student Registered", time: "25 mins ago", icon: "User" },
      { id: "3", type: "payment_received", title: "Payment Received", time: "1 hour ago", icon: "IndianRupee" },
      { id: "4", type: "instructor_added", title: "Instructor Added", time: "2 hours ago", icon: "UserCog" },
      { id: "5", type: "course_submitted", title: "Course Submitted", time: "3 hours ago", icon: "BookOpen" },
      { id: "6", type: "offer_created", title: "Offer Created", time: "5 hours ago", icon: "Tag" }
    ],
    topCourses: [
      { id: "1", name: "Complete Web Dev Bootcamp", instructor: "Sarah Drasner", students: 12500, revenue: 15e5, completionRate: 85, rating: 4.9, status: "Active" },
      { id: "2", name: "Advanced React Patterns", instructor: "Kent C. Dodds", students: 8400, revenue: 95e4, completionRate: 78, rating: 4.8, status: "Active" },
      { id: "3", name: "UI/UX Design Masterclass", instructor: "Gary Simon", students: 6200, revenue: 62e4, completionRate: 82, rating: 4.7, status: "Active" },
      { id: "4", name: "Python for Data Science", instructor: "Jose Portilla", students: 5800, revenue: 58e4, completionRate: 72, rating: 4.8, status: "Active" }
    ],
    topInstructors: [
      { id: "1", name: "Sarah Drasner", courses: 5, students: 25e3, revenue: 35e5, rating: 4.9, status: "Active" },
      { id: "2", name: "Kent C. Dodds", courses: 3, students: 18e3, revenue: 21e5, rating: 4.8, status: "Active" },
      { id: "3", name: "Jose Portilla", courses: 8, students: 45e3, revenue: 42e5, rating: 4.7, status: "Active" }
    ],
    recentPayments: [
      { id: "TXN-9871", student: "Alex Johnson", course: "Complete Web Dev", amount: 4999, method: "Credit Card", status: "Success", date: "2026-07-07" },
      { id: "TXN-9872", student: "Maria Garcia", course: "Advanced React", amount: 5999, method: "UPI", status: "Success", date: "2026-07-07" },
      { id: "TXN-9873", student: "James Smith", course: "UI/UX Masterclass", amount: 3999, method: "PayPal", status: "Pending", date: "2026-07-07" },
      { id: "TXN-9874", student: "Linda Chen", course: "Python Data Science", amount: 4499, method: "Credit Card", status: "Failed", date: "2026-07-06" }
    ],
    latestStudents: [
      { id: "1", name: "David Wilson", email: "david.w@example.com", course: "Advanced React", joined: "2026-07-07", status: "Active" },
      { id: "2", name: "Emma Thompson", email: "emma.t@example.com", course: "Web Dev Bootcamp", joined: "2026-07-07", status: "Active" },
      { id: "3", name: "Oliver Brown", email: "oliver.b@example.com", course: "UI/UX Masterclass", joined: "2026-07-06", status: "Inactive" }
    ],
    certificateOverview: {
      issued: 8400,
      pending: 145,
      revoked: 12,
      eligible: 1250
    },
    offers: {
      active: 5,
      upcoming: 2,
      expired: 18,
      usage: 12500,
      revenueGenerated: 85e4
    },
    systemStatus: {
      homepage: "Running",
      paymentGateway: "Running",
      emailService: "Running",
      certificateService: "Running",
      storage: "Running",
      security: "Running"
    },
    platformInsights: [
      "Student registrations increased by 18% this week.",
      "Development is the highest-selling category.",
      "Web Dev Bootcamp has the highest completion rate.",
      "12 courses are waiting for approval.",
      "24 refund requests require attention.",
      "Certificates issued increased by 12% this month."
    ]
  };
};
export {
  getDashboardAnalyticsData
};
