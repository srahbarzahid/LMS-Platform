const getSummaryStats = async (filters) => {
  return {
    totalStudents: { value: 12450, growth: 12.5 },
    totalInstructors: { value: 342, growth: 5.2 },
    totalCourses: { value: 856, growth: 8.4 },
    totalRevenue: { value: 145e4, growth: 22.1 },
    totalEnrollments: { value: 45e3, growth: 15.3 },
    certificatesIssued: { value: 12400, growth: 18.2 },
    completionRate: { value: 68, growth: 2.1 },
    averageRating: { value: 4.7, growth: 0.1 }
  };
};
const getUserAnalytics = async (filters) => {
  return {
    growthChart: [
      { name: "Jan", students: 800, instructors: 20 },
      { name: "Feb", students: 1200, instructors: 25 },
      { name: "Mar", students: 1600, instructors: 30 },
      { name: "Apr", students: 2100, instructors: 45 },
      { name: "May", students: 2800, instructors: 60 },
      { name: "Jun", students: 3500, instructors: 75 }
    ],
    distribution: [
      { name: "Students", value: 12450 },
      { name: "Instructors", value: 342 }
    ],
    stats: {
      newUsersThisMonth: 1250,
      activeUsers: 8400,
      inactiveUsers: 4050
    }
  };
};
const getRevenueAnalytics = async (filters) => {
  return {
    revenueChart: [
      { name: "Jan", revenue: 45e3 },
      { name: "Feb", revenue: 52e3 },
      { name: "Mar", revenue: 61e3 },
      { name: "Apr", revenue: 75e3 },
      { name: "May", revenue: 89e3 },
      { name: "Jun", revenue: 112e3 }
    ],
    stats: {
      totalRevenue: 145e4,
      monthlyRevenue: 112e3,
      averageOrderValue: 85,
      refundAmount: 2500,
      discountAmount: 12e3,
      netRevenue: 1435500
    }
  };
};
const getCourseAnalytics = async (filters) => {
  return {
    statusDistribution: [
      { name: "Published", value: 650 },
      { name: "Pending", value: 120 },
      { name: "Draft", value: 70 },
      { name: "Rejected", value: 16 }
    ],
    topCourses: [
      { name: "Complete Web Dev", enrollments: 4500 },
      { name: "Machine Learning A-Z", enrollments: 3800 },
      { name: "React Native Masterclass", enrollments: 3100 },
      { name: "UI/UX Design Bootcamp", enrollments: 2900 },
      { name: "Python for Beginners", enrollments: 2500 }
    ],
    stats: {
      totalCourses: 856,
      highestRated: "Complete Web Dev",
      lowCompletion: "Advanced C++ Programming"
    }
  };
};
const getEnrollmentAnalytics = async (filters) => {
  return {
    trendChart: [
      { name: "Week 1", enrollments: 450 },
      { name: "Week 2", enrollments: 520 },
      { name: "Week 3", enrollments: 610 },
      { name: "Week 4", enrollments: 750 }
    ],
    stats: {
      totalEnrollments: 45e3,
      newEnrollments: 2330,
      completedEnrollments: 12400,
      activeEnrollments: 32600,
      certificateEligible: 850
    }
  };
};
const getCategoryAnalytics = async (filters) => {
  return {
    performanceChart: [
      { name: "Web Development", value: 45e4 },
      { name: "Data Science", value: 38e4 },
      { name: "Design", value: 25e4 },
      { name: "Marketing", value: 15e4 },
      { name: "Business", value: 12e4 }
    ],
    stats: {
      topCategory: "Web Development",
      coursesPerCategory: { "Web Dev": 150, "Data Science": 120, "Design": 80 }
    }
  };
};
const getInstructorPerformance = async (filters) => {
  return [
    { id: 1, name: "John Doe", courses: 12, students: 4500, revenue: 125e3, rating: 4.8, completion: 72, status: "Active" },
    { id: 2, name: "Jane Smith", courses: 8, students: 3800, revenue: 95e3, rating: 4.9, completion: 78, status: "Active" },
    { id: 3, name: "Mike Johnson", courses: 5, students: 2100, revenue: 45e3, rating: 4.6, completion: 65, status: "Active" },
    { id: 4, name: "Sarah Wilson", courses: 15, students: 8200, revenue: 21e4, rating: 4.7, completion: 70, status: "Active" },
    { id: 5, name: "David Brown", courses: 3, students: 800, revenue: 15e3, rating: 4.2, completion: 55, status: "Warning" }
  ];
};
const getPaymentAnalytics = async (filters) => {
  return {
    statusDistribution: [
      { name: "Successful", value: 85 },
      { name: "Pending", value: 10 },
      { name: "Failed", value: 3 },
      { name: "Refunded", value: 2 }
    ],
    stats: {
      successfulPayments: 12540,
      failedPayments: 342,
      pendingPayments: 1250,
      refundedPayments: 245,
      couponUsage: 4500,
      totalDiscountGiven: 45e3
    }
  };
};
const getCertificateAnalytics = async (filters) => {
  return {
    statusDistribution: [
      { name: "Issued", value: 85 },
      { name: "Pending", value: 12 },
      { name: "Revoked", value: 3 }
    ],
    stats: {
      certificatesIssued: 12400,
      eligibleStudents: 1500,
      pendingCertificates: 450,
      revokedCertificates: 42
    }
  };
};
const getReviewAnalytics = async (filters) => {
  return {
    distribution: [
      { name: "5 Stars", value: 8500 },
      { name: "4 Stars", value: 2400 },
      { name: "3 Stars", value: 800 },
      { name: "2 Stars", value: 200 },
      { name: "1 Star", value: 100 }
    ],
    stats: {
      averageRating: 4.7,
      totalReviews: 12e3,
      lowRatedCourses: 5
    }
  };
};
const getOfferAnalytics = async (filters) => {
  return {
    stats: {
      activeOffers: 12,
      couponUsage: 4500,
      revenueFromOffers: 125e3,
      totalDiscountAmount: 45e3,
      mostUsedCoupon: "SUMMER50"
    },
    topCoupons: [
      { code: "SUMMER50", uses: 1250, revenue: 45e3 },
      { code: "WELCOME20", uses: 850, revenue: 25e3 },
      { code: "FLASH30", uses: 450, revenue: 15e3 }
    ]
  };
};
const getRecentActivity = async (filters) => {
  return [
    { id: 1, type: "user", title: "New Student Registered", description: "Alice Smith joined the platform", time: "5 mins ago", icon: "UserPlus" },
    { id: 2, type: "course", title: "Course Submitted", description: "Advanced Node.js submitted for review", time: "15 mins ago", icon: "BookOpen" },
    { id: 3, type: "payment", title: "Large Payment Received", description: "$850 payment from Enterprise Corp", time: "1 hour ago", icon: "DollarSign" },
    { id: 4, type: "review", title: "5-Star Review", description: "Bob rated React Masterclass", time: "2 hours ago", icon: "Star" },
    { id: 5, type: "certificate", title: "Certificate Issued", description: "Issued to Charlie for Python 101", time: "3 hours ago", icon: "Award" },
    { id: 6, type: "instructor", title: "New Instructor", description: "Dr. John joined as an instructor", time: "5 hours ago", icon: "UserCog" }
  ];
};
const getInsights = async (filters) => {
  return [
    { id: 1, type: "success", message: "Web Development is the highest-selling category this month, up 15%." },
    { id: 2, type: "warning", message: "6 courses have been waiting for approval for over 3 days." },
    { id: 3, type: "danger", message: 'Refund requests for "Advanced Math" increased by 8%.' },
    { id: 4, type: "info", message: "Coupon SUMMER50 generated $45k in revenue." },
    { id: 5, type: "success", message: "React Masterclass has the highest completion rate (82%)." },
    { id: 6, type: "warning", message: "Student engagement dropped by 4% on weekends." }
  ];
};
export {
  getCategoryAnalytics,
  getCertificateAnalytics,
  getCourseAnalytics,
  getEnrollmentAnalytics,
  getInsights,
  getInstructorPerformance,
  getOfferAnalytics,
  getPaymentAnalytics,
  getRecentActivity,
  getRevenueAnalytics,
  getReviewAnalytics,
  getSummaryStats,
  getUserAnalytics
};
