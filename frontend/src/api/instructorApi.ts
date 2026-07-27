import axios from 'axios';

// Currently using localhost:5000 for backend API
const API_URL = 'http://localhost:5000/api/instructor';

// In a real application, you would pass the auth token (JWT) in the headers
// For now, this is a mock setup that calls the real backend we'll be building.
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token in the future
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const instructorApi = {
  // Dashboard
  getDashboardStats: async () => {
    const response = await api.get('/dashboard');
    return response.data;
  },

  // Courses
  getCourses: async () => {
    const response = await api.get('/courses');
    return response.data;
  },
  getCourseDetails: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },
  createCourse: async (courseData: any) => {
    const response = await api.post('/courses', courseData);
    return response.data;
  },
  updateCourse: async (id: string, courseData: any) => {
    const response = await api.put(`/courses/${id}`, courseData);
    return response.data;
  },
  deleteCourse: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
  publishCourse: async (id: string) => {
    const response = await api.put(`/courses/${id}/publish`);
    return response.data;
  },
  unpublishCourse: async (id: string) => {
    const response = await api.put(`/courses/${id}/unpublish`);
    return response.data;
  },

  // Curriculum
  getCurriculum: async (courseId: string) => {
    const response = await api.get(`/courses/${courseId}/curriculum`);
    return response.data;
  },
  addModule: async (courseId: string, moduleData: any) => {
    const response = await api.post(`/courses/${courseId}/modules`, moduleData);
    return response.data;
  },
  updateModule: async (moduleId: string, moduleData: any) => {
    const response = await api.put(`/modules/${moduleId}`, moduleData);
    return response.data;
  },
  deleteModule: async (moduleId: string) => {
    const response = await api.delete(`/modules/${moduleId}`);
    return response.data;
  },
  reorderCurriculum: async (courseId: string, orderData: any) => {
    const response = await api.put(`/courses/${courseId}/reorder`, orderData);
    return response.data;
  },

  // Lessons
  getLessons: async () => {
    const response = await api.get('/lessons');
    return response.data;
  },
  addLesson: async (lessonData: any) => {
    const response = await api.post('/lessons', lessonData);
    return response.data;
  },
  updateLesson: async (id: string, lessonData: any) => {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data;
  },
  deleteLesson: async (id: string) => {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  },

  // Quizzes
  getQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  createQuiz: async (quizData: any) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  updateQuiz: async (id: string, quizData: any) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },
  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
  getQuizResults: async (id: string) => {
    const response = await api.get(`/quizzes/${id}/results`);
    return response.data;
  },

  // Assignments
  getAssignments: async () => {
    const response = await api.get('/assignments');
    return response.data;
  },
  createAssignment: async (assignmentData: any) => {
    const response = await api.post('/assignments', assignmentData);
    return response.data;
  },
  updateAssignment: async (id: string, assignmentData: any) => {
    const response = await api.put(`/assignments/${id}`, assignmentData);
    return response.data;
  },
  deleteAssignment: async (id: string) => {
    const response = await api.delete(`/assignments/${id}`);
    return response.data;
  },
  getAssignmentSubmissions: async (id: string) => {
    const response = await api.get(`/assignments/${id}/submissions`);
    return response.data;
  },
  gradeAssignmentSubmission: async (submissionId: string, gradeData: any) => {
    const response = await api.put(`/assignments/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },

  // Projects
  getProjects: async () => {
    const response = await api.get('/projects');
    return response.data;
  },
  createProject: async (projectData: any) => {
    const response = await api.post('/projects', projectData);
    return response.data;
  },
  updateProject: async (id: string, projectData: any) => {
    const response = await api.put(`/projects/${id}`, projectData);
    return response.data;
  },
  deleteProject: async (id: string) => {
    const response = await api.delete(`/projects/${id}`);
    return response.data;
  },
  getProjectSubmissions: async (id: string) => {
    const response = await api.get(`/projects/${id}/submissions`);
    return response.data;
  },
  gradeProjectSubmission: async (submissionId: string, gradeData: any) => {
    const response = await api.put(`/projects/submissions/${submissionId}/grade`, gradeData);
    return response.data;
  },
  requestProjectResubmission: async (submissionId: string, data: any) => {
    const response = await api.put(`/projects/submissions/${submissionId}/request-resubmission`, data);
    return response.data;
  },

  // Students
  getStudents: async () => {
    const response = await api.get('/students');
    return response.data;
  },
  getStudentDetails: async (id: string) => {
    const response = await api.get(`/students/${id}`);
    return response.data;
  },

  // Reviews
  getReviews: async () => {
    const response = await api.get('/reviews');
    return response.data;
  },

  // Certificates
  getCertificates: async () => {
    const response = await api.get('/certificates');
    return response.data;
  },

  // Analytics
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },

  // Announcements
  getAnnouncements: async () => {
    const response = await api.get('/announcements');
    return response.data;
  },
  createAnnouncement: async (announcementData: any) => {
    const response = await api.post('/announcements', announcementData);
    return response.data;
  },
  updateAnnouncement: async (id: string, announcementData: any) => {
    const response = await api.put(`/announcements/${id}`, announcementData);
    return response.data;
  },
  deleteAnnouncement: async (id: string) => {
    const response = await api.delete(`/announcements/${id}`);
    return response.data;
  },

  // Profile & Settings
  getProfile: async () => {
    const response = await api.get('/profile');
    return response.data;
  },
  updateProfile: async (profileData: any) => {
    const response = await api.put('/profile', profileData);
    return response.data;
  },
  updateAvatar: async (formData: FormData) => {
    const response = await api.post('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
  getSettings: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  updateSettings: async (settingsData: any) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
  updatePassword: async (passwordData: any) => {
    const response = await api.put('/settings/password', passwordData);
    return response.data;
  }
};
