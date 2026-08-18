class InstructorAnalyticsService {
  static getOverview() {
    return {
      totalStudents: { value: 1248, growth: "+15%", description: "vs last month" },
      totalCourses: { value: 12, growth: "+2", description: "new this month" },
      totalRevenue: { value: "$24,500", growth: "+8%", description: "vs last month" },
      averageRating: { value: 4.8, growth: "+0.2", description: "vs last month" },
      courseCompletionRate: { value: "68%", growth: "+5%", description: "vs last month" },
      certificatesIssued: { value: 845, growth: "+12%", description: "vs last month" },
      pendingAssignments: { value: 24, description: "requires action" },
      pendingProjects: { value: 12, description: "requires action" }
    };
  }
  static getStudents() {
    return [
      { date: "Mon", enrollments: 12, visitors: 45 },
      { date: "Tue", enrollments: 19, visitors: 60 },
      { date: "Wed", enrollments: 15, visitors: 50 },
      { date: "Thu", enrollments: 22, visitors: 70 },
      { date: "Fri", enrollments: 28, visitors: 85 },
      { date: "Sat", enrollments: 35, visitors: 110 },
      { date: "Sun", enrollments: 42, visitors: 130 }
    ];
  }
  static getRevenue() {
    return {
      growth: "+12%",
      topCourse: "UI/UX Masterclass",
      monthly: [
        { name: "Jan", revenue: 4e3 },
        { name: "Feb", revenue: 3e3 },
        { name: "Mar", revenue: 5e3 },
        { name: "Apr", revenue: 4500 },
        { name: "May", revenue: 6e3 },
        { name: "Jun", revenue: 8e3 }
      ]
    };
  }
  static getCourses() {
    return [
      { name: "UI/UX Masterclass", students: 842, revenue: 12500, completion: 75, rating: 4.9, status: "Active", trend: "+12%" },
      { name: "React Architecture", students: 650, revenue: 8500, completion: 68, rating: 4.8, status: "Active", trend: "+8%" },
      { name: "Digital Marketing", students: 420, revenue: 2100, completion: 82, rating: 4.7, status: "Active", trend: "+15%" },
      { name: "Advanced CSS", students: 120, revenue: 1400, completion: 45, rating: 4.5, status: "Draft", trend: "-5%" }
    ];
  }
  static getLearning() {
    return {
      averageLearningTime: { value: "45m", progress: 75, comparison: "+5m vs last week" },
      averageSessionDuration: { value: "22m", progress: 60, comparison: "+2m vs last week" },
      lessonsCompleted: { value: "1,240", progress: 85, comparison: "+120 vs last week" },
      weeklyActiveStudents: { value: "850", progress: 92, comparison: "+45 vs last week" }
    };
  }
  static getAssessments() {
    return {
      quizzes: {
        pass: 85,
        fail: 15,
        averageScore: 78,
        averageAttempts: 1.5
      },
      assignments: [
        { name: "Submitted", value: 45 },
        { name: "Pending", value: 12 },
        { name: "Graded", value: 28 },
        { name: "Resubmission Requested", value: 5 }
      ]
    };
  }
  static getRatings() {
    return {
      average: 4.8,
      distribution: [
        { stars: 5, count: 850 },
        { stars: 4, count: 250 },
        { stars: 3, count: 50 },
        { stars: 2, count: 15 },
        { stars: 1, count: 5 }
      ]
    };
  }
  static getCertificates() {
    return [
      { name: "Completed", value: 450, color: "#10B981" },
      { name: "In Progress", value: 650, color: "#F59E0B" },
      { name: "Dropped", value: 148, color: "#EF4444" }
    ];
  }
  static getActivities() {
    return [
      { id: 1, type: "enrollment", message: "New student enrolled in UI/UX Masterclass.", time: "10 mins ago", icon: "Users" },
      { id: 2, type: "completion", message: 'Student completed lesson "React Hooks".', time: "1 hour ago", icon: "CheckCircle" },
      { id: 3, type: "submission", message: 'Assignment submitted for "Advanced CSS".', time: "2 hours ago", icon: "ClipboardCheck" },
      { id: 4, type: "certificate", message: "Certificate generated for Diana Prince.", time: "3 hours ago", icon: "Award" }
    ];
  }
  static getTasks() {
    return [
      { id: 1, title: "Assignments Waiting Review", count: 15, priority: "High", due: "Today" },
      { id: 2, title: "Projects Waiting Review", count: 12, priority: "Medium", due: "Tomorrow" },
      { id: 3, title: "Courses Pending Approval", count: 2, priority: "Low", due: "Next Week" }
    ];
  }
  static getReports() {
    return {
      mostPopularCourse: "UI/UX Masterclass",
      highestRatedCourse: "React Architecture (4.9)",
      highestRevenueCourse: "UI/UX Masterclass ($12,500)",
      mostActiveStudent: "John Doe (45 hours)",
      highestCompletionCourse: "Advanced CSS (82%)"
    };
  }
}
export {
  InstructorAnalyticsService
};
