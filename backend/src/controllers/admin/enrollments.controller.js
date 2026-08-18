const statuses = ["Active", "Completed", "Inactive", "Cancelled"];
const certStatuses = ["Not Eligible", "Eligible", "Issued"];
const paymentStatuses = ["Paid", "Pending", "Failed", "Refunded"];
const indianNames = ["Rahul Sharma", "Priya Patel", "Amit Kumar", "Neha Gupta", "Rohan Singh", "Anjali Desai"];
const courses = [
  { id: "c1", name: "Advanced UI/UX Design with Figma", instructor: "Karan Malhotra", category: "Design" },
  { id: "c2", name: "Full-Stack Web Development", instructor: "Priya Sharma", category: "Development" },
  { id: "c3", name: "Data Science Bootcamp", instructor: "Amit Patel", category: "Data Science" },
  { id: "c4", name: "Digital Marketing Masterclass", instructor: "Rohan Gupta", category: "Marketing" }
];
const generateMockEnrollments = (count) => {
  return Array.from({ length: count }).map((_, i) => {
    const course = courses[Math.floor(Math.random() * courses.length)];
    const studentName = indianNames[Math.floor(Math.random() * indianNames.length)];
    const progress = Math.floor(Math.random() * 101);
    const isCompleted = progress === 100;
    let status = isCompleted ? "Completed" : statuses[Math.floor(Math.random() * 3)];
    let certStatus = isCompleted ? certStatuses[Math.floor(Math.random() * 2) + 1] : "Not Eligible";
    return {
      id: `ENR${1e4 + i}`,
      studentId: `S${100 + i}`,
      studentName,
      studentEmail: `${studentName.split(" ")[0].toLowerCase()}@example.com`,
      studentPhone: `+91 ${9e9 + Math.floor(Math.random() * 999999999)}`,
      joinedDate: new Date(Date.now() - Math.random() * 1e10 * 2).toISOString(),
      courseId: course.id,
      courseName: course.name,
      instructorId: `I${Math.floor(Math.random() * 10)}`,
      instructorName: course.instructor,
      category: course.category,
      courseDuration: `${Math.floor(Math.random() * 40) + 10}h ${Math.floor(Math.random() * 60)}m`,
      enrollmentDate: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      progressPercentage: progress,
      completedLessons: Math.floor(progress / 100 * 45),
      totalLessons: 45,
      completedQuizzes: Math.floor(progress / 100 * 10),
      totalQuizzes: 10,
      submittedAssignments: Math.floor(progress / 100 * 5),
      totalAssignments: 5,
      submittedProjects: Math.floor(progress / 100 * 2),
      totalProjects: 2,
      lastWatchedLesson: `Module ${Math.floor(Math.random() * 5) + 1}: Lesson ${Math.floor(Math.random() * 5) + 1}`,
      lastActiveDate: new Date(Date.now() - Math.random() * 1e9).toISOString(),
      status,
      certificateStatus: certStatus,
      certificateId: certStatus === "Issued" ? `CERT-${1e4 + i}` : null,
      completionDate: isCompleted ? new Date(Date.now() - Math.random() * 1e8).toISOString() : null,
      issuedDate: certStatus === "Issued" ? (/* @__PURE__ */ new Date()).toISOString() : null,
      paymentStatus: paymentStatuses[Math.floor(Math.random() * 4)],
      amountPaid: Math.floor(Math.random() * 4e3) + 999,
      paymentDate: new Date(Date.now() - Math.random() * 1e10).toISOString(),
      transactionId: `TXN${Math.floor(Math.random() * 1e9)}`
    };
  });
};
const mockEnrollments = generateMockEnrollments(85);
const adminEnrollmentsController = {
  // GET /api/admin/enrollments
  getEnrollments: async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = (req.query.search || "").toLowerCase();
      const filters = {
        status: req.query.status,
        course: req.query.course,
        certStatus: req.query.certStatus
      };
      let filtered = [...mockEnrollments];
      if (search) {
        filtered = filtered.filter(
          (e) => e.studentName.toLowerCase().includes(search) || e.studentEmail.toLowerCase().includes(search) || e.courseName.toLowerCase().includes(search) || e.instructorName.toLowerCase().includes(search) || e.id.toLowerCase().includes(search)
        );
      }
      if (filters.status) filtered = filtered.filter((e) => e.status.toLowerCase() === filters.status?.toLowerCase());
      if (filters.course) filtered = filtered.filter((e) => e.courseName.toLowerCase().includes(filters.course.toLowerCase()));
      if (filters.certStatus) filtered = filtered.filter((e) => e.certificateStatus.toLowerCase() === filters.certStatus?.toLowerCase());
      filtered.sort((a, b) => new Date(b.enrollmentDate).getTime() - new Date(a.enrollmentDate).getTime());
      const startIndex = (page - 1) * limit;
      const paginated = filtered.slice(startIndex, startIndex + limit);
      const stats = {
        total: mockEnrollments.length,
        active: mockEnrollments.filter((e) => e.status === "Active").length,
        completed: mockEnrollments.filter((e) => e.status === "Completed").length,
        eligible: mockEnrollments.filter((e) => e.certificateStatus === "Eligible").length,
        newThisMonth: mockEnrollments.filter((e) => {
          const date = new Date(e.enrollmentDate);
          const now = /* @__PURE__ */ new Date();
          return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
        }).length
      };
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
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
  // GET /api/admin/enrollments/:id
  getEnrollmentDetails: async (req, res) => {
    try {
      const enrollment = mockEnrollments.find((e) => e.id === req.params.id);
      if (!enrollment) {
        res.status(404).json({ success: false, message: "Enrollment not found" });
        return;
      }
      res.status(200).json({ success: true, data: enrollment });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
  // GET /api/admin/enrollments/:id/activity
  getEnrollmentActivity: async (req, res) => {
    try {
      const enrollment = mockEnrollments.find((e) => e.id === req.params.id);
      if (!enrollment) {
        res.status(404).json({ success: false, message: "Enrollment not found" });
        return;
      }
      const activity = [
        { id: 1, type: "enrolled", action: `Enrolled in ${enrollment.courseName}`, date: enrollment.enrollmentDate },
        { id: 2, type: "lesson", action: "Completed Module 1: Introduction", date: new Date(new Date(enrollment.enrollmentDate).getTime() + 864e5).toISOString() },
        { id: 3, type: "quiz", action: "Passed Initial Quiz (90%)", date: new Date(new Date(enrollment.enrollmentDate).getTime() + 1728e5).toISOString() }
      ];
      if (enrollment.progressPercentage > 50) {
        activity.push({ id: 4, type: "assignment", action: "Submitted Midterm Assignment", date: new Date(new Date(enrollment.enrollmentDate).getTime() + 5e8).toISOString() });
      }
      if (enrollment.status === "Completed") {
        activity.push({ id: 5, type: "completed", action: "Completed Course", date: enrollment.completionDate || (/* @__PURE__ */ new Date()).toISOString() });
      }
      if (enrollment.certificateStatus === "Issued") {
        activity.push({ id: 6, type: "certificate", action: `Certificate Issued (${enrollment.certificateId})`, date: enrollment.issuedDate || (/* @__PURE__ */ new Date()).toISOString() });
      }
      activity.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      res.status(200).json({ success: true, data: activity });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  },
  // GET /api/admin/enrollments/:id/progress
  getEnrollmentProgressBreakdown: async (req, res) => {
    try {
      const enrollment = mockEnrollments.find((e) => e.id === req.params.id);
      if (!enrollment) {
        res.status(404).json({ success: false, message: "Enrollment not found" });
        return;
      }
      const breakdown = {
        overall: enrollment.progressPercentage,
        lessons: { completed: enrollment.completedLessons, total: enrollment.totalLessons },
        quizzes: { completed: enrollment.completedQuizzes, total: enrollment.totalQuizzes },
        assignments: { completed: enrollment.submittedAssignments, total: enrollment.totalAssignments },
        projects: { completed: enrollment.submittedProjects, total: enrollment.totalProjects }
      };
      res.status(200).json({ success: true, data: breakdown });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
};
export {
  adminEnrollmentsController
};
