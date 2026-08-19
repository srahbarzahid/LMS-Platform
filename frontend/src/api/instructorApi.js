import apiClient from "./client";

const instructorApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await apiClient.get("/instructor/dashboard-stats");
    return response.data;
  },

  // Courses
  getCourses: async (params = {}) => {
    const response = await apiClient.get("/instructor/courses", { params });
    return response.data;
  },
  getCourseDetails: async (id) => {
    const response = await apiClient.get(`/instructor/courses/${id}`);
    return response.data;
  },
  createCourse: async (courseData) => {
    const response = await apiClient.post("/instructor/courses", courseData);
    return response.data;
  },
  updateCourse: async (id, courseData) => {
    const response = await apiClient.put(`/instructor/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id) => {
    const response = await apiClient.delete(`/instructor/courses/${id}`);
    return response.data;
  },
  publishCourse: async (id) => {
    const response = await apiClient.put(`/instructor/courses/${id}/publish`);
    return response.data;
  },
  unpublishCourse: async (id) => {
    const response = await apiClient.put(`/instructor/courses/${id}/unpublish`);
    return response.data;
  },
  uploadThumbnail: async (formData) => {
    const response = await apiClient.post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    return response.data;
  },
  getWorkspace: async () => {
    const response = await apiClient.get("/instructor/workspace");
    return response.data;
  },

  // Curriculum
  getCurriculum: async (courseId) => {
    const response = await apiClient.get(`/instructor/courses/${courseId}/curriculum`);
    return response.data;
  },
  updateCurriculum: async (courseId, curriculumData) => {
    const response = await apiClient.put(`/instructor/courses/${courseId}/curriculum`, curriculumData);
    return response.data;
  },
  addModule: async (courseId, moduleData) => {
    const response = await apiClient.post(`/instructor/courses/${courseId}/modules`, moduleData);
    return response.data;
  },
  updateModule: async (moduleId, moduleData) => {
    const response = await apiClient.put(`/instructor/modules/${moduleId}`, moduleData);
    return response.data;
  },
  deleteModule: async (moduleId) => {
    const response = await apiClient.delete(`/instructor/modules/${moduleId}`);
    return response.data;
  },
  reorderCurriculum: async (courseId, orderData) => {
    const response = await apiClient.put(`/instructor/courses/${courseId}/reorder`, orderData);
    return response.data;
  },

  // Lessons
  getLessons: async () => {
    const response = await apiClient.get("/instructor/lessons");
    return response.data;
  },
  addLesson: async (lessonData) => {
    const response = await apiClient.post("/instructor/lessons", lessonData);
    return response.data;
  },
  updateLesson: async (id, lessonData) => {
    const response = await apiClient.put(`/instructor/lessons/${id}`, lessonData);
    return response.data;
  },
  deleteLesson: async (id) => {
    const response = await apiClient.delete(`/instructor/lessons/${id}`);
    return response.data;
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await apiClient.get("/instructor/quizzes");
    return response.data;
  },
  createQuiz: async (quizData) => {
    const response = await apiClient.post("/instructor/quizzes", quizData);
    return response.data;
  },
  updateQuiz: async (id, quizData) => {
    const response = await apiClient.put(`/instructor/quizzes/${id}`, quizData);
    return response.data;
  },
  deleteQuiz: async (id) => {
    const response = await apiClient.delete(`/instructor/quizzes/${id}`);
    return response.data;
  },
  getQuizResults: async (id) => {
    const response = await apiClient.get(`/instructor/quizzes/${id}/results`);
    return response.data;
  },
  getQuizResultDetails: async (resultId) => {
    const response = await apiClient.get(`/instructor/quiz-results/${resultId}`);
    return response.data;
  },

  // Assignments
  getAssignments: async () => {
    const response = await apiClient.get("/instructor/assignments");
    return response.data;
  },
  createAssignment: async (assignmentData) => {
    const response = await apiClient.post("/instructor/assignments", assignmentData);
    return response.data;
  },
  updateAssignment: async (id, assignmentData) => {
    const response = await apiClient.put(`/instructor/assignments/${id}`, assignmentData);
    return response.data;
  },
  deleteAssignment: async (id) => {
    const response = await apiClient.delete(`/instructor/assignments/${id}`);
    return response.data;
  },
  getAssignmentSubmissions: async (id) => {
    const response = await apiClient.get(`/instructor/assignments/${id}/submissions`);
    return response.data;
  },
  getAssignmentSubmissionDetails: async (submissionId) => {
    const response = await apiClient.get(`/instructor/submissions/assignments/${submissionId}`);
    return response.data;
  },
  gradeAssignmentSubmission: async (submissionId, gradeData) => {
    const response = await apiClient.put(`/instructor/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
  requestAssignmentResubmission: async (submissionId, data) => {
    const response = await apiClient.put(`/instructor/assignments/submissions/${submissionId}/request-resubmission`, data);
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await apiClient.get("/instructor/projects");
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await apiClient.post("/instructor/projects", projectData);
    return response.data;
  },
  updateProject: async (id, projectData) => {
    const response = await apiClient.put(`/instructor/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id) => {
    const response = await apiClient.delete(`/instructor/projects/${id}`);
    return response.data;
  },
  getProjectSubmissions: async (id) => {
    const response = await apiClient.get(`/instructor/projects/${id}/submissions`);
    return response.data;
  },
  getProjectSubmissionDetails: async (submissionId) => {
    const response = await apiClient.get(`/instructor/submissions/projects/${submissionId}`);
    return response.data;
  },
  gradeProjectSubmission: async (submissionId, gradeData) => {
    const response = await apiClient.put(`/instructor/projects/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
  requestProjectResubmission: async (submissionId, data) => {
    const response = await apiClient.put(`/instructor/projects/submissions/${submissionId}/request-resubmission`, data);
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await apiClient.get("/instructor/students");
    return response.data;
  },
  getStudentDetails: async (id) => {
    const response = await apiClient.get(`/instructor/students/${id}`);
    return response.data;
  },
  getStudentProgress: async (id) => {
    const response = await apiClient.get(`/instructor/students/${id}/progress`);
    return response.data;
  },
  getStudentSubmissions: async (id) => {
    const response = await apiClient.get(`/instructor/students/${id}/submissions`);
    return response.data;
  },
  getStudentActivity: async (id) => {
    const response = await apiClient.get(`/instructor/students/${id}/activity`);
    return response.data;
  },
  getStudentReviews: async (id) => {
    const response = await apiClient.get(`/instructor/students/${id}/reviews`);
    return response.data;
  },

  // Reviews
  getReviews: async () => {
    const response = await apiClient.get("/instructor/reviews");
    return response.data;
  },
  replyToReview: async (id, reply) => {
    const response = await apiClient.post(`/instructor/reviews/${id}/reply`, { reply });
    return response.data;
  },

  // Certificates
  getCertificates: async () => {
    const response = await apiClient.get("/instructor/certificates");
    return response.data;
  },
  getCertificateDetails: async (id) => {
    const response = await apiClient.get(`/instructor/certificates/${id}`);
    return response.data;
  },
  getCertificateProgress: async (id) => {
    const response = await apiClient.get(`/instructor/certificates/${id}/progress`);
    return response.data;
  },
  getCertificateTimeline: async (id) => {
    const response = await apiClient.get(`/instructor/certificates/${id}/student`);
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await apiClient.get("/instructor/analytics");
    return response.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await apiClient.get("/instructor/announcements");
    return response.data;
  },
  createAnnouncement: async (announcementData) => {
    const response = await apiClient.post("/instructor/announcements", announcementData);
    return response.data;
  },
  updateAnnouncement: async (id, announcementData) => {
    const response = await apiClient.put(`/instructor/announcements/${id}`, announcementData);
    return response.data;
  },
  deleteAnnouncement: async (id) => {
    const response = await apiClient.delete(`/instructor/announcements/${id}`);
    return response.data;
  },

  // Profile & Settings
  getProfile: async () => {
    const response = await apiClient.get("/instructor/profile");
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await apiClient.put("/instructor/profile", profileData);
    return response.data;
  },
  updateAvatar: async (formData) => {
    const response = await apiClient.post("/instructor/profile/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  },
  getSettings: async () => {
    const response = await apiClient.get("/instructor/settings");
    return response.data;
  },
  updateSettings: async (settingsData) => {
    const response = await apiClient.put("/instructor/settings", settingsData);
    return response.data;
  },
  updatePassword: async (passwordData) => {
    const response = await apiClient.put("/instructor/settings/password", passwordData);
    return response.data;
  }
};

export {
  instructorApi
};
