let mockProfile = {
  id: "user123",
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  avatarUrl: null,
  bio: "A passionate learner interested in IoT and Robotics.",
  city: "San Francisco",
  country: "United States",
  college: "University of Technology",
  occupation: "Software Engineer",
  skills: ["Python", "React", "IoT", "C++"],
  experienceLevel: "Intermediate",
  githubUrl: "https://github.com/johndoe",
  linkedinUrl: "https://linkedin.com/in/johndoe",
  portfolioUrl: "https://johndoe.dev",
  role: "STUDENT",
  createdAt: /* @__PURE__ */ new Date("2025-01-15T00:00:00Z"),
  updatedAt: /* @__PURE__ */ new Date()
};
const mockStats = {
  coursesEnrolled: 4,
  coursesCompleted: 1,
  certificatesEarned: 1,
  projectsCompleted: 3,
  learningHours: 42
};
const getStudentProfile = async (userId) => {
  return { profile: mockProfile, stats: mockStats };
};
const updateStudentProfile = async (userId, data) => {
  mockProfile = { ...mockProfile, ...data };
  return mockProfile;
};
const uploadAvatar = async (userId, fileUrl) => {
  mockProfile.avatarUrl = fileUrl;
  return mockProfile;
};
export {
  getStudentProfile,
  updateStudentProfile,
  uploadAvatar
};
