let mockProfile = {
  id: 'user123',
  name: 'John Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  avatarUrl: null,
  bio: 'A passionate learner interested in IoT and Robotics.',
  city: 'San Francisco',
  country: 'United States',
  college: 'University of Technology',
  occupation: 'Software Engineer',
  skills: ['Python', 'React', 'IoT', 'C++'],
  experienceLevel: 'Intermediate',
  githubUrl: 'https://github.com/johndoe',
  linkedinUrl: 'https://linkedin.com/in/johndoe',
  portfolioUrl: 'https://johndoe.dev',
  role: 'STUDENT',
  createdAt: new Date('2025-01-15T00:00:00Z'),
  updatedAt: new Date()
};

const mockStats = {
  coursesEnrolled: 4,
  coursesCompleted: 1,
  certificatesEarned: 1,
  projectsCompleted: 3,
  learningHours: 42
};

export const getStudentProfile = async (userId: string) => {
  // In the future: return await prisma.user.findUnique({ where: { id: userId } });
  return { profile: mockProfile, stats: mockStats };
};

export const updateStudentProfile = async (userId: string, data: any) => {
  // In the future: return await prisma.user.update({ where: { id: userId }, data });
  mockProfile = { ...mockProfile, ...data };
  return mockProfile;
};

export const uploadAvatar = async (userId: string, fileUrl: string) => {
  // In the future: return await prisma.user.update({ where: { id: userId }, data: { avatarUrl: fileUrl } });
  mockProfile.avatarUrl = fileUrl as any;
  return mockProfile;
};
