import { prisma } from "../prisma.js";

export const getStudentProfile = async (userId) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      bio: true,
      city: true,
      country: true,
      college: true,
      occupation: true,
      skills: true,
      experienceLevel: true,
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      dateOfBirth: true,
      gender: true,
      designation: true,
      role: true,
      createdAt: true,
      updatedAt: true
    }
  });

  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  const enrollmentsCount = await prisma.enrollment.count({ where: { userId } });
  const completedCount = await prisma.enrollment.count({ where: { userId, status: "COMPLETED" } });
  const certsCount = await prisma.certificate.count({ where: { userId } });
  const projectsCount = await prisma.projectSubmission.count({ where: { studentId: userId } });

  return {
    success: true,
    data: {
      ...user,
      avatarUrl: user.profileImage,
      stats: {
        coursesEnrolled: enrollmentsCount,
        coursesCompleted: completedCount,
        certificatesEarned: certsCount,
        projectsCompleted: projectsCount,
        learningHours: enrollmentsCount * 12
      }
    }
  };
};

export const updateStudentProfile = async (userId, data) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.name ? { name: String(data.name).trim() } : {}),
      ...(data.phone !== undefined ? { phone: data.phone } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.country !== undefined ? { country: data.country } : {}),
      ...(data.college !== undefined ? { college: data.college } : {}),
      ...(data.occupation !== undefined ? { occupation: data.occupation } : {}),
      ...(data.skills !== undefined ? { skills: data.skills } : {}),
      ...(data.experienceLevel !== undefined ? { experienceLevel: data.experienceLevel } : {}),
      ...(data.githubUrl !== undefined ? { githubUrl: data.githubUrl } : {}),
      ...(data.linkedinUrl !== undefined ? { linkedinUrl: data.linkedinUrl } : {}),
      ...(data.portfolioUrl !== undefined ? { portfolioUrl: data.portfolioUrl } : {}),
      ...(data.dateOfBirth !== undefined ? { dateOfBirth: data.dateOfBirth } : {}),
      ...(data.gender !== undefined ? { gender: data.gender } : {}),
      ...(data.designation !== undefined ? { designation: data.designation } : {}),
      ...(data.profileImage !== undefined ? { profileImage: data.profileImage } : {}),
      ...(data.avatarUrl !== undefined ? { profileImage: data.avatarUrl } : {})
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      profileImage: true,
      bio: true,
      city: true,
      country: true,
      college: true,
      occupation: true,
      skills: true,
      experienceLevel: true,
      githubUrl: true,
      linkedinUrl: true,
      portfolioUrl: true,
      dateOfBirth: true,
      gender: true,
      designation: true,
      role: true
    }
  });

  return {
    success: true,
    data: {
      ...updatedUser,
      avatarUrl: updatedUser.profileImage
    }
  };
};

export const uploadAvatar = async (userId, fileUrl) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { profileImage: fileUrl },
    select: { id: true, name: true, email: true, profileImage: true }
  });

  return {
    success: true,
    data: {
      ...updatedUser,
      avatarUrl: updatedUser.profileImage
    }
  };
};
