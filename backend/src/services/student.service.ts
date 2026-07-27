export const getStudentsMock = async (instructorId: string) => {
  return [
    { id: 'stu_1', name: 'Alice Smith', email: 'alice.smith@example.com', avatar: 'A', course: 'UI/UX Masterclass', progress: 85, lastActive: '2 hours ago', courseStatus: 'Active', certificateStatus: 'Pending' },
    { id: 'stu_2', name: 'Bob Johnson', email: 'bob.j@example.com', avatar: 'B', course: 'UI/UX Masterclass', progress: 100, lastActive: '1 day ago', courseStatus: 'Completed', certificateStatus: 'Generated' },
  ];
};

export const getStudentDetailsMock = async (studentId: string) => {
  return {
    id: studentId,
    name: studentId === 'stu_1' ? 'Alice Smith' : 'Bob Johnson',
    email: studentId === 'stu_1' ? 'alice.smith@example.com' : 'bob.j@example.com',
    phone: '+1 (555) 123-4567',
    enrollmentDate: 'March 15, 2026',
    courseName: 'UI/UX Masterclass',
    batch: 'Spring 2026 Cohort',
    status: 'Active',
    summary: {
      courseProgress: 85,
      lessonsCompleted: 24,
      totalLessons: 30,
      quizzesCompleted: 4,
      totalQuizzes: 5,
      assignmentsCompleted: 3,
      totalAssignments: 4,
      projectsCompleted: 1,
      totalProjects: 2
    }
  };
};

export const getStudentProgressMock = async (studentId: string) => {
  return {
    overall: 85,
    lessons: { completed: 27, total: 30, percentage: 90 },
    quizzes: { completed: 4, total: 5, percentage: 80 },
    assignments: { completed: 3, total: 4, percentage: 75 },
    projects: { completed: 1, total: 2, percentage: 50 },
  };
};

export const getStudentActivityMock = async (studentId: string) => {
  return [
    { id: 1, type: 'certificate', title: 'Certificate Generated', course: 'UI/UX Masterclass', time: '1 day ago' },
    { id: 2, type: 'course', title: 'Course Completed', course: 'UI/UX Masterclass', time: '1 day ago' },
  ];
};

export const getStudentReviewsMock = async (studentId: string) => {
  return [
    { id: 1, course: 'UI/UX Masterclass', rating: 5, date: '1 week ago', review: 'This course is absolutely fantastic!' },
  ];
};
