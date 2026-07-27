export const getSummaryStats = async (filters: any) => {
  return {
    totalStudents: { value: 12450, growth: 12.5 },
    totalInstructors: { value: 342, growth: 5.2 },
    totalCourses: { value: 856, growth: 8.4 },
    totalRevenue: { value: 1450000, growth: 22.1 },
    totalEnrollments: { value: 45000, growth: 15.3 },
    certificatesIssued: { value: 12400, growth: 18.2 },
    completionRate: { value: 68, growth: 2.1 },
    averageRating: { value: 4.7, growth: 0.1 }
  };
};

export const getUserAnalytics = async (filters: any) => {
  return {
    growthChart: [
      { name: 'Jan', students: 800, instructors: 20 },
      { name: 'Feb', students: 1200, instructors: 25 },
      { name: 'Mar', students: 1600, instructors: 30 },
      { name: 'Apr', students: 2100, instructors: 45 },
      { name: 'May', students: 2800, instructors: 60 },
      { name: 'Jun', students: 3500, instructors: 75 },
    ],
    distribution: [
      { name: 'Students', value: 12450 },
      { name: 'Instructors', value: 342 }
    ],
    stats: {
      newUsersThisMonth: 1250,
      activeUsers: 8400,
      inactiveUsers: 4050
    }
  };
};

export const getRevenueAnalytics = async (filters: any) => {
  return {
    revenueChart: [
      { name: 'Jan', revenue: 45000 },
      { name: 'Feb', revenue: 52000 },
      { name: 'Mar', revenue: 61000 },
      { name: 'Apr', revenue: 75000 },
      { name: 'May', revenue: 89000 },
      { name: 'Jun', revenue: 112000 },
    ],
    stats: {
      totalRevenue: 1450000,
      monthlyRevenue: 112000,
      averageOrderValue: 85,
      refundAmount: 2500,
      discountAmount: 12000,
      netRevenue: 1435500
    }
  };
};

export const getCourseAnalytics = async (filters: any) => {
  return {
    statusDistribution: [
      { name: 'Published', value: 650 },
      { name: 'Pending', value: 120 },
      { name: 'Draft', value: 70 },
      { name: 'Rejected', value: 16 }
    ],
    topCourses: [
      { name: 'Complete Web Dev', enrollments: 4500 },
      { name: 'Machine Learning A-Z', enrollments: 3800 },
      { name: 'React Native Masterclass', enrollments: 3100 },
      { name: 'UI/UX Design Bootcamp', enrollments: 2900 },
      { name: 'Python for Beginners', enrollments: 2500 },
    ],
    stats: {
      totalCourses: 856,
      highestRated: 'Complete Web Dev',
      lowCompletion: 'Advanced C++ Programming'
    }
  };
};

export const getEnrollmentAnalytics = async (filters: any) => {
  return {
    trendChart: [
      { name: 'Week 1', enrollments: 450 },
      { name: 'Week 2', enrollments: 520 },
      { name: 'Week 3', enrollments: 610 },
      { name: 'Week 4', enrollments: 750 },
    ],
    stats: {
      totalEnrollments: 45000,
      newEnrollments: 2330,
      completedEnrollments: 12400,
      activeEnrollments: 32600,
      certificateEligible: 850
    }
  };
};

export const getCategoryAnalytics = async (filters: any) => {
  return {
    performanceChart: [
      { name: 'Web Development', value: 450000 },
      { name: 'Data Science', value: 380000 },
      { name: 'Design', value: 250000 },
      { name: 'Marketing', value: 150000 },
      { name: 'Business', value: 120000 },
    ],
    stats: {
      topCategory: 'Web Development',
      coursesPerCategory: { 'Web Dev': 150, 'Data Science': 120, 'Design': 80 }
    }
  };
};

export const getInstructorPerformance = async (filters: any) => {
  return [
    { id: 1, name: 'John Doe', courses: 12, students: 4500, revenue: 125000, rating: 4.8, completion: 72, status: 'Active' },
    { id: 2, name: 'Jane Smith', courses: 8, students: 3800, revenue: 95000, rating: 4.9, completion: 78, status: 'Active' },
    { id: 3, name: 'Mike Johnson', courses: 5, students: 2100, revenue: 45000, rating: 4.6, completion: 65, status: 'Active' },
    { id: 4, name: 'Sarah Wilson', courses: 15, students: 8200, revenue: 210000, rating: 4.7, completion: 70, status: 'Active' },
    { id: 5, name: 'David Brown', courses: 3, students: 800, revenue: 15000, rating: 4.2, completion: 55, status: 'Warning' },
  ];
};

export const getPaymentAnalytics = async (filters: any) => {
  return {
    statusDistribution: [
      { name: 'Successful', value: 85 },
      { name: 'Pending', value: 10 },
      { name: 'Failed', value: 3 },
      { name: 'Refunded', value: 2 }
    ],
    stats: {
      successfulPayments: 12540,
      failedPayments: 342,
      pendingPayments: 1250,
      refundedPayments: 245,
      couponUsage: 4500,
      totalDiscountGiven: 45000
    }
  };
};

export const getCertificateAnalytics = async (filters: any) => {
  return {
    statusDistribution: [
      { name: 'Issued', value: 85 },
      { name: 'Pending', value: 12 },
      { name: 'Revoked', value: 3 }
    ],
    stats: {
      certificatesIssued: 12400,
      eligibleStudents: 1500,
      pendingCertificates: 450,
      revokedCertificates: 42
    }
  };
};

export const getReviewAnalytics = async (filters: any) => {
  return {
    distribution: [
      { name: '5 Stars', value: 8500 },
      { name: '4 Stars', value: 2400 },
      { name: '3 Stars', value: 800 },
      { name: '2 Stars', value: 200 },
      { name: '1 Star', value: 100 }
    ],
    stats: {
      averageRating: 4.7,
      totalReviews: 12000,
      lowRatedCourses: 5
    }
  };
};

export const getOfferAnalytics = async (filters: any) => {
  return {
    stats: {
      activeOffers: 12,
      couponUsage: 4500,
      revenueFromOffers: 125000,
      totalDiscountAmount: 45000,
      mostUsedCoupon: 'SUMMER50'
    },
    topCoupons: [
      { code: 'SUMMER50', uses: 1250, revenue: 45000 },
      { code: 'WELCOME20', uses: 850, revenue: 25000 },
      { code: 'FLASH30', uses: 450, revenue: 15000 }
    ]
  };
};

export const getRecentActivity = async (filters: any) => {
  return [
    { id: 1, type: 'user', title: 'New Student Registered', description: 'Alice Smith joined the platform', time: '5 mins ago', icon: 'UserPlus' },
    { id: 2, type: 'course', title: 'Course Submitted', description: 'Advanced Node.js submitted for review', time: '15 mins ago', icon: 'BookOpen' },
    { id: 3, type: 'payment', title: 'Large Payment Received', description: '$850 payment from Enterprise Corp', time: '1 hour ago', icon: 'DollarSign' },
    { id: 4, type: 'review', title: '5-Star Review', description: 'Bob rated React Masterclass', time: '2 hours ago', icon: 'Star' },
    { id: 5, type: 'certificate', title: 'Certificate Issued', description: 'Issued to Charlie for Python 101', time: '3 hours ago', icon: 'Award' },
    { id: 6, type: 'instructor', title: 'New Instructor', description: 'Dr. John joined as an instructor', time: '5 hours ago', icon: 'UserCog' }
  ];
};

export const getInsights = async (filters: any) => {
  return [
    { id: 1, type: 'success', message: 'Web Development is the highest-selling category this month, up 15%.' },
    { id: 2, type: 'warning', message: '6 courses have been waiting for approval for over 3 days.' },
    { id: 3, type: 'danger', message: 'Refund requests for "Advanced Math" increased by 8%.' },
    { id: 4, type: 'info', message: 'Coupon SUMMER50 generated $45k in revenue.' },
    { id: 5, type: 'success', message: 'React Masterclass has the highest completion rate (82%).' },
    { id: 6, type: 'warning', message: 'Student engagement dropped by 4% on weekends.' }
  ];
};
