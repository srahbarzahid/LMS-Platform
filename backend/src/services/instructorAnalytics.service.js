import { getInstructorAnalyticsData } from "./instructorModule.service.js";

class InstructorAnalyticsService {
  static async getOverview(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).overview;
  }

  static async getStudents(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).students;
  }

  static async getRevenue(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).revenue;
  }

  static async getCourses(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).courses;
  }

  static async getLearning(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).learning;
  }

  static async getAssessments(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).assessments;
  }

  static async getRatings(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).ratings;
  }

  static async getCertificates(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).certificates;
  }

  static async getActivities(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).activities;
  }

  static async getTasks(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).tasks;
  }

  static async getReports(instructorId) {
    return (await getInstructorAnalyticsData(instructorId)).reports;
  }
}

export {
  InstructorAnalyticsService
};
