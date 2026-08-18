-- =============================================================================
-- LMS PLATFORM - PRODUCTION MYSQL DATABASE SCHEMA (3NF NORMALIZED)
-- =============================================================================
-- Database: lms_platform
-- Engine: InnoDB
-- Character Set: utf8mb4 / utf8mb4_unicode_ci
-- =============================================================================

CREATE DATABASE IF NOT EXISTS `lms_platform` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `lms_platform`;

-- Disable foreign key checks during schema creation
SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 1. USERS TABLE
-- Stores accounts for Students, Instructors, and Admin users
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `User`;
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50) NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('STUDENT', 'INSTRUCTOR', 'ADMIN') NOT NULL DEFAULT 'STUDENT',
  `profileImage` TEXT NULL,
  `bio` TEXT NULL,
  `city` VARCHAR(100) NULL,
  `country` VARCHAR(100) NULL,
  `college` VARCHAR(255) NULL,
  `occupation` VARCHAR(150) NULL,
  `skills` JSON NULL,
  `experienceLevel` VARCHAR(100) NULL,
  `githubUrl` TEXT NULL,
  `linkedinUrl` TEXT NULL,
  `portfolioUrl` TEXT NULL,
  `pendingEmail` VARCHAR(255) NULL,
  `pendingPhone` VARCHAR(50) NULL,
  `isEmailVerified` TINYINT(1) NOT NULL DEFAULT 1,
  `isPhoneVerified` TINYINT(1) NOT NULL DEFAULT 0,
  `notificationPreferences` JSON NULL,
  `dateOfBirth` VARCHAR(50) NULL,
  `gender` VARCHAR(50) NULL,
  `designation` VARCHAR(150) NULL,
  `isDeactivated` TINYINT(1) NOT NULL DEFAULT 0,
  `deactivatedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 2. CATEGORIES TABLE
-- Stores course categories (Development, Design, Marketing, etc.)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Category`;
CREATE TABLE `Category` (
  `id` VARCHAR(191) NOT NULL,
  `name` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` TEXT NULL,
  `icon` VARCHAR(100) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_category_name` (`name`),
  UNIQUE KEY `idx_category_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 3. COURSES TABLE
-- Stores all courses created by instructors and approved by admin
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Course`;
CREATE TABLE `Course` (
  `id` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `shortDescription` TEXT NOT NULL,
  `thumbnail` TEXT NULL,
  `categoryId` VARCHAR(191) NOT NULL,
  `instructorId` VARCHAR(191) NOT NULL,
  `level` ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'BEGINNER',
  `language` VARCHAR(100) NOT NULL DEFAULT 'English',
  `price` DOUBLE NOT NULL DEFAULT 0,
  `discountPrice` DOUBLE NULL,
  `duration` INT NULL,
  `status` ENUM('DRAFT', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'DRAFT',
  `rating` DOUBLE NOT NULL DEFAULT 0,
  `totalStudents` INT NOT NULL DEFAULT 0,
  `certificateAvail` TINYINT(1) NOT NULL DEFAULT 1,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_course_slug` (`slug`),
  KEY `fk_course_category` (`categoryId`),
  KEY `fk_course_instructor` (`instructorId`),
  CONSTRAINT `fk_course_category` FOREIGN KEY (`categoryId`) REFERENCES `Category` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_course_instructor` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. MODULES TABLE (CURRICULUM CHAPTERS)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Module`;
CREATE TABLE `Module` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_module_course` (`courseId`),
  CONSTRAINT `fk_module_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. LESSONS TABLE (MODULE TOPICS & VIDEOS)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Lesson`;
CREATE TABLE `Lesson` (
  `id` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NULL,
  `videoUrl` TEXT NULL,
  `duration` INT NULL,
  `isPreview` TINYINT(1) NOT NULL DEFAULT 0,
  `order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `fk_lesson_module` (`moduleId`),
  CONSTRAINT `fk_lesson_module` FOREIGN KEY (`moduleId`) REFERENCES `Module` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. ENROLLMENTS TABLE (PREVENTS DUPLICATE ENROLLMENTS)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Enrollment`;
CREATE TABLE `Enrollment` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `paymentId` VARCHAR(191) NULL,
  `progress` DOUBLE NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_user_course_enrollment` (`userId`, `courseId`),
  KEY `fk_enrollment_user` (`userId`),
  KEY `fk_enrollment_course` (`courseId`),
  CONSTRAINT `fk_enrollment_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_enrollment_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. CART TABLE (PREVENTS DUPLICATE CART ITEMS)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Cart`;
CREATE TABLE `Cart` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_cart_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_cart_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_cart_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. WISHLIST TABLE (PREVENTS DUPLICATE WISHLIST ITEMS)
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Wishlist`;
CREATE TABLE `Wishlist` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_wishlist_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_wishlist_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_wishlist_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. PAYMENTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Payment`;
CREATE TABLE `Payment` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `status` ENUM('PENDING', 'SUCCESS', 'FAILED') NOT NULL DEFAULT 'PENDING',
  `razorpayPaymentId` VARCHAR(255) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `fk_payment_user` (`userId`),
  KEY `fk_payment_course` (`courseId`),
  CONSTRAINT `fk_payment_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_payment_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 10. REVIEWS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Review`;
CREATE TABLE `Review` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `rating` INT NOT NULL,
  `comment` TEXT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_review_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_review_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 11. QUIZZES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Quiz`;
CREATE TABLE `Quiz` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NULL,
  `title` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_quiz_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 12. QUESTIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Question`;
CREATE TABLE `Question` (
  `id` VARCHAR(191) NOT NULL,
  `quizId` VARCHAR(191) NOT NULL,
  `question` TEXT NOT NULL,
  `options` JSON NOT NULL,
  `correctAnswer` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_question_quiz` FOREIGN KEY (`quizId`) REFERENCES `Quiz` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 13. ASSIGNMENTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Assignment`;
CREATE TABLE `Assignment` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT NOT NULL,
  `dueDate` DATETIME(3) NULL,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_assignment_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 14. SUBMISSIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Submission`;
CREATE TABLE `Submission` (
  `id` VARCHAR(191) NOT NULL,
  `assignmentId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `fileUrl` TEXT NULL,
  `comment` TEXT NULL,
  `marks` DOUBLE NULL,
  `feedback` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'SUBMITTED',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_submission_assignment` FOREIGN KEY (`assignmentId`) REFERENCES `Assignment` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_submission_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 15. CERTIFICATES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Certificate`;
CREATE TABLE `Certificate` (
  `id` VARCHAR(191) NOT NULL,
  `certificateId` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `instructorId` VARCHAR(191) NULL,
  `completionDate` DATETIME(3) NULL,
  `issuedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `certificateUrl` TEXT NULL,
  `qrCodeUrl` TEXT NULL,
  `verificationUrl` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'ACTIVE',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_certificate_code` (`certificateId`),
  CONSTRAINT `fk_certificate_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_certificate_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 16. COURSE COMPLETIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `CourseCompletion`;
CREATE TABLE `CourseCompletion` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `lessonProgress` INT NOT NULL DEFAULT 0,
  `quizCompleted` TINYINT(1) NOT NULL DEFAULT 0,
  `assignmentCompleted` TINYINT(1) NOT NULL DEFAULT 0,
  `projectCompleted` TINYINT(1) NOT NULL DEFAULT 0,
  `overallProgress` INT NOT NULL DEFAULT 0,
  `isCompleted` TINYINT(1) NOT NULL DEFAULT 0,
  `completedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_unique_completion_user_course` (`userId`, `courseId`),
  CONSTRAINT `fk_completion_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_completion_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 17. PROJECTS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Project`;
CREATE TABLE `Project` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `moduleId` VARCHAR(191) NULL,
  `instructorId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT NOT NULL,
  `projectFileUrl` TEXT NULL,
  `projectFileType` VARCHAR(50) NULL,
  `dueDate` DATETIME(3) NULL,
  `maxMarks` DOUBLE NOT NULL DEFAULT 100,
  `allowResubmission` TINYINT(1) NOT NULL DEFAULT 0,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PUBLISHED',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_project_course` FOREIGN KEY (`courseId`) REFERENCES `Course` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_project_instructor` FOREIGN KEY (`instructorId`) REFERENCES `User` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 18. PROJECT SUBMISSIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `ProjectSubmission`;
CREATE TABLE `ProjectSubmission` (
  `id` VARCHAR(191) NOT NULL,
  `projectId` VARCHAR(191) NOT NULL,
  `studentId` VARCHAR(191) NOT NULL,
  `submittedFileUrl` TEXT NULL,
  `submittedFileType` VARCHAR(50) NULL,
  `submittedLink` TEXT NULL,
  `studentNote` TEXT NULL,
  `status` VARCHAR(50) NOT NULL DEFAULT 'PENDING',
  `marks` DOUBLE NULL,
  `feedback` TEXT NULL,
  `submittedAt` DATETIME(3) NULL,
  `reviewedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_projsub_project` FOREIGN KEY (`projectId`) REFERENCES `Project` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_projsub_student` FOREIGN KEY (`studentId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 19. NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `Notification`;
CREATE TABLE `Notification` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `message` TEXT NOT NULL,
  `category` VARCHAR(100) NOT NULL DEFAULT 'General',
  `type` VARCHAR(100) NULL,
  `relatedId` VARCHAR(191) NULL,
  `relatedType` VARCHAR(100) NULL,
  `isRead` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_notification_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 20. USER SETTINGS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `UserSettings`;
CREATE TABLE `UserSettings` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `preferredLanguage` VARCHAR(50) NOT NULL DEFAULT 'English',
  `defaultPlaybackSpeed` DOUBLE NOT NULL DEFAULT 1.0,
  `autoPlayNextLesson` TINYINT(1) NOT NULL DEFAULT 1,
  `resumePlayback` TINYINT(1) NOT NULL DEFAULT 1,
  `theme` VARCHAR(50) NOT NULL DEFAULT 'System',
  `accountVisibility` VARCHAR(50) NOT NULL DEFAULT 'Public',
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_usersettings_userId` (`userId`),
  CONSTRAINT `fk_usersettings_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 21. NOTIFICATION PREFERENCES TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `NotificationPreference`;
CREATE TABLE `NotificationPreference` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `courseUpdates` TINYINT(1) NOT NULL DEFAULT 1,
  `assignmentNotifications` TINYINT(1) NOT NULL DEFAULT 1,
  `quizNotifications` TINYINT(1) NOT NULL DEFAULT 1,
  `projectNotifications` TINYINT(1) NOT NULL DEFAULT 1,
  `certificateNotifications` TINYINT(1) NOT NULL DEFAULT 1,
  `paymentNotifications` TINYINT(1) NOT NULL DEFAULT 1,
  `marketingEmails` TINYINT(1) NOT NULL DEFAULT 0,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  UNIQUE KEY `idx_notifpref_userId` (`userId`),
  CONSTRAINT `fk_notifpref_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 22. SECURITY SESSIONS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `SecuritySession`;
CREATE TABLE `SecuritySession` (
  `id` VARCHAR(191) NOT NULL,
  `userId` VARCHAR(191) NOT NULL,
  `device` VARCHAR(255) NOT NULL,
  `browser` VARCHAR(100) NULL DEFAULT 'Chrome',
  `location` VARCHAR(255) NOT NULL,
  `ipAddress` VARCHAR(100) NOT NULL,
  `isCurrent` TINYINT(1) NOT NULL DEFAULT 0,
  `lastActiveAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_secsession_user` FOREIGN KEY (`userId`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 23. PLATFORM SETTINGS TABLE
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `PlatformSettings`;
CREATE TABLE `PlatformSettings` (
  `id` VARCHAR(191) NOT NULL DEFAULT 'default',
  `lmsName` VARCHAR(255) NOT NULL DEFAULT 'LMS Platform',
  `logoUrl` TEXT NULL,
  `defaultLanguage` VARCHAR(50) NOT NULL DEFAULT 'English',
  `defaultTheme` VARCHAR(50) NOT NULL DEFAULT 'System',
  `supportEmail` VARCHAR(255) NOT NULL DEFAULT 'support@lms.com',
  `supportPhone` VARCHAR(100) NOT NULL DEFAULT '+1-800-555-0199',
  `sessionTimeout` INT NOT NULL DEFAULT 60,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
