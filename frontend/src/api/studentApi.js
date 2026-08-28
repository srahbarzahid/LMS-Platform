import apiClient from "./client";

export const studentApi = {
  getOverview: async () => {
    const response = await apiClient.get("/student/overview");
    return response.data;
  },
  getMyCourses: async () => {
    const response = await apiClient.get("/student/my-courses");
    return response.data;
  },
  getAssignments: async () => {
    const response = await apiClient.get("/student/assignments-list");
    return response.data;
  },
  getQuizzes: async () => {
    const response = await apiClient.get("/student/quizzes-list");
    return response.data;
  },
  getProjects: async () => {
    const response = await apiClient.get("/student/projects-list");
    return response.data;
  },
  getCertificates: async () => {
    const response = await apiClient.get("/student/certificates-list");
    return response.data;
  }
};
