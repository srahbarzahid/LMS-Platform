import { prisma } from "../prisma.js";
import {
  courseInclude,
  createCourseFromInstructor,
  formatCourse,
  getCoursePipelineErrorMessage,
  normalizeCourseStatus,
  submitCourseForReview as submitCourseForReviewRecord,
  updateCourseFromInstructor
} from "../services/coursePipeline.service.js";
import * as InstructorModuleService from "../services/instructorModule.service.js";

const getInstructorId = (req) => req.user?.userId || req.user?.id;

const sendInstructorError = (res, error, fallbackMessage = "Server Error") => {
  console.error("Instructor Controller Error:", error);
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.statusCode ? error.message : getCoursePipelineErrorMessage(error, fallbackMessage)
  });
};

const sendNotFound = (res, message = "Record not found") => {
  res.status(404).json({ success: false, message });
};

const getDashboardStats = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorDashboardData(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch instructor dashboard");
  }
};

const getRecentActivity = async (req, res) => {
  try {
    const data = await InstructorModuleService.getRecentInstructorActivity(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch recent activity");
  }
};

const getCourses = async (req, res) => {
  try {
    const instructorId = getInstructorId(req);
    const search = req.query.search?.trim();
    const status = normalizeCourseStatus(req.query.status);
    const where = {
      instructorId,
      ...(status ? { status } : {}),
      ...(search
        ? {
            OR: [
              { title: { contains: search } },
              { shortDescription: { contains: search } },
              { description: { contains: search } }
            ]
          }
        : {})
    };
    const courses = await prisma.course.findMany({
      where,
      include: courseInclude,
      orderBy: { updatedAt: "desc" }
    });
    res.json({ success: true, data: courses.map(formatCourse) });
  } catch (error) {
    sendInstructorError(res, error);
  }
};

const getCourseDetails = async (req, res) => {
  try {
    const instructorId = getInstructorId(req);
    const course = await prisma.course.findFirst({
      where: { id: req.params.id, instructorId },
      include: courseInclude
    });
    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }
    res.json({ success: true, data: formatCourse(course) });
  } catch (error) {
    sendInstructorError(res, error);
  }
};

const createCourse = async (req, res) => {
  try {
    const course = await createCourseFromInstructor({
      input: req.body,
      instructorId: getInstructorId(req),
      action: req.body.action
    });
    res.status(201).json({ success: true, data: formatCourse(course) });
  } catch (error) {
    sendInstructorError(res, error, "Failed to create course");
  }
};

const updateCourse = async (req, res) => {
  try {
    const course = await updateCourseFromInstructor({
      courseId: req.params.id,
      input: req.body,
      instructorId: getInstructorId(req),
      action: req.body.action
    });
    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }
    res.json({ success: true, data: formatCourse(course) });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update course");
  }
};

const deleteCourse = async (req, res) => {
  try {
    const instructorId = getInstructorId(req);
    const course = await prisma.course.findFirst({ where: { id: req.params.id, instructorId }, select: { id: true } });
    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Course deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete course");
  }
};

const publishCourse = async (req, res) => {
  try {
    const course = await submitCourseForReviewRecord({
      courseId: req.params.id,
      instructorId: getInstructorId(req)
    });
    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }
    res.json({ success: true, data: formatCourse(course), message: "Course submitted for review" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to submit course for review");
  }
};

const unpublishCourse = async (req, res) => {
  try {
    const instructorId = getInstructorId(req);
    const existingCourse = await prisma.course.findFirst({
      where: { id: req.params.id, instructorId },
      select: { id: true }
    });
    if (!existingCourse) {
      sendNotFound(res, "Course not found");
      return;
    }
    const course = await prisma.course.update({
      where: { id: req.params.id },
      data: { status: "UNPUBLISHED" },
      include: courseInclude
    });
    res.json({ success: true, data: formatCourse(course), message: "Course unpublished" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to unpublish course");
  }
};

const getCurriculum = async (req, res) => {
  try {
    const course = await prisma.course.findFirst({
      where: { id: req.params.courseId, instructorId: getInstructorId(req) },
      include: courseInclude
    });
    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }
    res.json({ success: true, data: formatCourse(course).curriculum });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch curriculum");
  }
};

const parseDurationToMinutes = (duration) => {
  if (duration === null || duration === undefined || duration === "") return null;
  if (typeof duration === "number") return Math.max(Math.round(duration), 0);

  const text = String(duration).trim();
  const timeMatch = text.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const minutes = Number(timeMatch[1]);
    const seconds = Number(timeMatch[2]);
    return Math.max(Math.round(minutes + seconds / 60), 0);
  }

  const numericMatch = text.match(/\d+/);
  return numericMatch ? Math.max(Number(numericMatch[0]), 0) : null;
};

const updateCurriculum = async (req, res) => {
  try {
    const { courseId } = req.params;
    const instructorId = getInstructorId(req);
    const modules = Array.isArray(req.body.modules) ? req.body.modules : [];
    const course = await prisma.course.findFirst({
      where: { id: courseId, instructorId },
      select: { id: true, instructorId: true }
    });

    if (!course) {
      sendNotFound(res, "Course not found");
      return;
    }

    await prisma.$transaction(async (tx) => {
      const existingModules = await tx.module.findMany({ where: { courseId }, select: { id: true } });
      const existingModuleIdList = existingModules.map((module) => module.id);
      const [existingLessons, existingQuizzes, existingAssignments, existingProjects] = await Promise.all([
        tx.lesson.findMany({ where: { moduleId: { in: existingModuleIdList } }, select: { id: true } }),
        tx.quiz.findMany({ where: { courseId }, select: { id: true } }),
        tx.assignment.findMany({ where: { courseId }, select: { id: true } }),
        tx.project.findMany({ where: { courseId }, select: { id: true } })
      ]);

      const existingModuleIds = new Set(existingModules.map((module) => module.id));
      const existingLessonIds = new Set(existingLessons.map((lesson) => lesson.id));
      const existingQuizIds = new Set(existingQuizzes.map((quiz) => quiz.id));
      const existingAssignmentIds = new Set(existingAssignments.map((assignment) => assignment.id));
      const existingProjectIds = new Set(existingProjects.map((project) => project.id));
      const keptModuleIds = [];
      const keptLessonIds = [];
      const keptQuizIds = [];
      const keptAssignmentIds = [];
      const keptProjectIds = [];

      for (const [moduleIndex, module] of modules.entries()) {
        const moduleData = {
          courseId,
          title: module.title?.trim() || `Module ${moduleIndex + 1}`,
          order: moduleIndex
        };
        const savedModule = existingModuleIds.has(module.id)
          ? await tx.module.update({ where: { id: module.id }, data: moduleData })
          : await tx.module.create({ data: moduleData });

        keptModuleIds.push(savedModule.id);
        const items = Array.isArray(module.items) ? module.items : module.lessons || [];

        for (const [itemIndex, item] of items.entries()) {
          const type = item.type === "video" ? "lesson" : item.type;
          const title = item.title?.trim() || `Untitled ${type || "item"}`;

          if (type === "lesson") {
            const lessonData = {
              moduleId: savedModule.id,
              title,
              description: item.description || null,
              duration: parseDurationToMinutes(item.durationMinutes ?? item.duration),
              isPreview: Boolean(item.isPreview),
              order: itemIndex
            };
            if (item.videoUrl !== undefined) lessonData.videoUrl = item.videoUrl || null;

            const targetId = existingLessonIds.has(item.id)
              ? item.id
              : (await tx.lesson.findFirst({ where: { moduleId: savedModule.id, title }, select: { id: true } }))?.id;

            const savedLesson = targetId
              ? await tx.lesson.update({ where: { id: targetId }, data: lessonData })
              : await tx.lesson.create({ data: { ...lessonData, videoUrl: item.videoUrl || null } });
            keptLessonIds.push(savedLesson.id);
          } else if (type === "quiz") {
            const quizData = {
              courseId,
              moduleId: savedModule.id,
              title
            };

            const targetId = existingQuizIds.has(item.id)
              ? item.id
              : (await tx.quiz.findFirst({ where: { courseId, title }, select: { id: true } }))?.id;

            const savedQuiz = targetId
              ? await tx.quiz.update({ where: { id: targetId }, data: quizData })
              : await tx.quiz.create({ data: quizData });
            keptQuizIds.push(savedQuiz.id);
          } else if (type === "assignment") {
            const assignmentData = {
              courseId,
              moduleId: savedModule.id,
              title,
              description: item.description || title
            };
            if (item.dueDate !== undefined) assignmentData.dueDate = item.dueDate ? new Date(item.dueDate) : null;

            const targetId = existingAssignmentIds.has(item.id)
              ? item.id
              : (await tx.assignment.findFirst({ where: { courseId, title }, select: { id: true } }))?.id;

            const savedAssignment = targetId
              ? await tx.assignment.update({ where: { id: targetId }, data: assignmentData })
              : await tx.assignment.create({ data: assignmentData });
            keptAssignmentIds.push(savedAssignment.id);
          } else if (type === "project") {
            const projectData = {
              courseId,
              moduleId: savedModule.id,
              instructorId,
              title,
              description: item.description || title,
              status: item.status || "DRAFT"
            };
            if (item.points !== undefined) projectData.maxMarks = Number(item.points) || 100;
            if (item.dueDate !== undefined) projectData.dueDate = item.dueDate ? new Date(item.dueDate) : null;

            const targetId = existingProjectIds.has(item.id)
              ? item.id
              : (await tx.project.findFirst({ where: { courseId, title }, select: { id: true } }))?.id;

            const savedProject = targetId
              ? await tx.project.update({ where: { id: targetId }, data: projectData })
              : await tx.project.create({ data: { ...projectData, maxMarks: projectData.maxMarks || 100 } });
            keptProjectIds.push(savedProject.id);
          }
        }
      }

      if (existingModuleIdList.length) {
        await tx.lesson.deleteMany({
          where: {
            moduleId: { in: existingModuleIdList },
            ...(keptLessonIds.length ? { id: { notIn: keptLessonIds } } : {})
          }
        });
      }
      await tx.quiz.deleteMany({ where: { courseId, moduleId: { not: null }, ...(keptQuizIds.length ? { id: { notIn: keptQuizIds } } : {}) } });
      await tx.assignment.deleteMany({ where: { courseId, moduleId: { not: null }, ...(keptAssignmentIds.length ? { id: { notIn: keptAssignmentIds } } : {}) } });
      await tx.project.deleteMany({ where: { courseId, moduleId: { not: null }, ...(keptProjectIds.length ? { id: { notIn: keptProjectIds } } : {}) } });
      await tx.module.deleteMany({ where: { courseId, ...(keptModuleIds.length ? { id: { notIn: keptModuleIds } } : {}) } });
    });

    const updatedCourse = await prisma.course.findUnique({
      where: { id: courseId },
      include: courseInclude
    });
    res.json({ success: true, data: formatCourse(updatedCourse).curriculum });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update curriculum");
  }
};

const getWorkspace = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorWorkspace(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch instructor workspace");
  }
};

const getLessons = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorLessons(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch lessons");
  }
};

const createLesson = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorLesson({ instructorId: getInstructorId(req), input: req.body });
    res.status(201).json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to save lesson");
  }
};

const updateLesson = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorLesson({
      instructorId: getInstructorId(req),
      lessonId: req.params.id,
      input: req.body
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update lesson");
  }
};

const deleteLesson = async (req, res) => {
  try {
    const deleted = await InstructorModuleService.deleteInstructorLesson({ instructorId: getInstructorId(req), lessonId: req.params.id });
    if (!deleted) {
      sendNotFound(res, "Lesson not found");
      return;
    }
    res.json({ success: true, message: "Lesson deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete lesson");
  }
};

const getQuizzes = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorQuizzes(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch quizzes");
  }
};

const createQuiz = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorQuiz({ instructorId: getInstructorId(req), input: req.body });
    res.status(201).json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to save quiz");
  }
};

const updateQuiz = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorQuiz({
      instructorId: getInstructorId(req),
      quizId: req.params.id,
      input: req.body
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update quiz");
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const deleted = await InstructorModuleService.deleteInstructorQuiz({ instructorId: getInstructorId(req), quizId: req.params.id });
    if (!deleted) {
      sendNotFound(res, "Quiz not found");
      return;
    }
    res.json({ success: true, message: "Quiz deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete quiz");
  }
};

const getQuizResults = async (req, res) => {
  try {
    res.json({ success: true, data: [] });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch quiz results");
  }
};

const getAssignments = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorAssignments(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch assignments");
  }
};

const createAssignment = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorAssignment({ instructorId: getInstructorId(req), input: req.body });
    res.status(201).json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to save assignment");
  }
};

const updateAssignment = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorAssignment({
      instructorId: getInstructorId(req),
      assignmentId: req.params.id,
      input: req.body
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update assignment");
  }
};

const deleteAssignment = async (req, res) => {
  try {
    const deleted = await InstructorModuleService.deleteInstructorAssignment({
      instructorId: getInstructorId(req),
      assignmentId: req.params.id
    });
    if (!deleted) {
      sendNotFound(res, "Assignment not found");
      return;
    }
    res.json({ success: true, message: "Assignment deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete assignment");
  }
};

const getAssignmentSubmissions = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorAssignmentSubmissions({
      instructorId: getInstructorId(req),
      assignmentId: req.params.id
    });
    if (!data) {
      sendNotFound(res, "Assignment not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch assignment submissions");
  }
};

const gradeAssignmentSubmission = async (req, res) => {
  try {
    const data = await InstructorModuleService.gradeAssignmentSubmission({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId,
      input: req.body
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data, message: "Assignment graded successfully" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to grade assignment");
  }
};

const requestAssignmentResubmission = async (req, res) => {
  try {
    const data = await InstructorModuleService.requestAssignmentResubmission({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId,
      input: req.body
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data, message: "Assignment resubmission requested" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to request resubmission");
  }
};

const getProjects = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorProjects(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch projects");
  }
};

const createProject = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorProject({ instructorId: getInstructorId(req), input: req.body });
    res.status(201).json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to save project");
  }
};

const updateProject = async (req, res) => {
  try {
    const data = await InstructorModuleService.saveInstructorProject({
      instructorId: getInstructorId(req),
      projectId: req.params.id,
      input: req.body
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update project");
  }
};

const deleteProject = async (req, res) => {
  try {
    const deleted = await InstructorModuleService.deleteInstructorProject({ instructorId: getInstructorId(req), projectId: req.params.id });
    if (!deleted) {
      sendNotFound(res, "Project not found");
      return;
    }
    res.json({ success: true, message: "Project deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete project");
  }
};

const getProjectSubmissions = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorProjectSubmissions({
      instructorId: getInstructorId(req),
      projectId: req.params.id
    });
    if (!data) {
      sendNotFound(res, "Project not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch project submissions");
  }
};

const gradeProjectSubmission = async (req, res) => {
  try {
    const data = await InstructorModuleService.gradeProjectSubmission({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId,
      input: req.body
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data, message: "Project graded successfully" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to grade project");
  }
};

const requestProjectResubmission = async (req, res) => {
  try {
    const data = await InstructorModuleService.requestProjectResubmission({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId,
      input: req.body
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data, message: "Project resubmission requested" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to request resubmission");
  }
};

const getAssignmentSubmissionDetails = async (req, res) => {
  try {
    const data = await InstructorModuleService.getAssignmentSubmissionDetails({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch submission");
  }
};

const getProjectSubmissionDetails = async (req, res) => {
  try {
    const data = await InstructorModuleService.getProjectSubmissionDetails({
      instructorId: getInstructorId(req),
      submissionId: req.params.submissionId
    });
    if (!data) {
      sendNotFound(res, "Submission not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch submission");
  }
};

const getQuizResultDetails = async (req, res) => {
  try {
    const data = await InstructorModuleService.getQuizResultDetails({
      instructorId: getInstructorId(req),
      resultId: req.params.resultId
    });
    if (!data) {
      sendNotFound(res, "Quiz result not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch quiz result");
  }
};

const getStudents = async (req, res) => {
  try {
    const result = await InstructorModuleService.getInstructorStudentsData(getInstructorId(req));
    res.json({ success: true, ...result });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch students");
  }
};

const getStudentDetails = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorStudentDetails({
      instructorId: getInstructorId(req),
      studentId: req.params.studentId
    });
    if (!data) {
      sendNotFound(res, "Student not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch student details");
  }
};

const getStudentProgress = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorStudentProgress({
      instructorId: getInstructorId(req),
      studentId: req.params.studentId
    });
    if (!data) {
      sendNotFound(res, "Student not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch student progress");
  }
};

const getStudentSubmissions = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorStudentSubmissions({
      instructorId: getInstructorId(req),
      studentId: req.params.studentId
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch student submissions");
  }
};

const getStudentActivity = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorStudentActivity({
      instructorId: getInstructorId(req),
      studentId: req.params.studentId
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch student activity");
  }
};

const getStudentReviews = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorStudentReviews({
      instructorId: getInstructorId(req),
      studentId: req.params.studentId
    });
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch student reviews");
  }
};

const getReviews = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorReviewsData(getInstructorId(req));
    res.json({ success: true, ...data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch reviews");
  }
};

const replyToReview = async (req, res) => {
  try {
    const data = await InstructorModuleService.replyToInstructorReview({
      instructorId: getInstructorId(req),
      reviewId: req.params.id,
      reply: req.body.reply
    });
    if (!data) {
      sendNotFound(res, "Review not found");
      return;
    }
    res.json({ success: true, data, message: "Review reply saved" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to reply to review");
  }
};

const getInstructorCertificates = async (req, res) => {
  try {
    const result = await InstructorModuleService.getInstructorCertificatesData(getInstructorId(req));
    res.json({ success: true, ...result });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch certificates");
  }
};

const getCertificateDetails = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorCertificateDetails({
      instructorId: getInstructorId(req),
      certificateId: req.params.certificateId
    });
    if (!data) {
      sendNotFound(res, "Certificate not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch certificate");
  }
};

const getCertificateProgress = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorCertificateProgress({
      instructorId: getInstructorId(req),
      certificateId: req.params.certificateId
    });
    if (!data) {
      sendNotFound(res, "Certificate not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch certificate progress");
  }
};

const getCertificateTimeline = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorCertificateTimeline({
      instructorId: getInstructorId(req),
      certificateId: req.params.certificateId
    });
    if (!data) {
      sendNotFound(res, "Certificate not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch certificate timeline");
  }
};

const getAnalytics = async (req, res) => {
  try {
    const data = await InstructorModuleService.getInstructorAnalyticsData(getInstructorId(req));
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch analytics");
  }
};

const getAnnouncements = async (req, res) => {
  try {
    const result = await InstructorModuleService.getInstructorAnnouncements(getInstructorId(req));
    res.json({ success: true, ...result });
  } catch (error) {
    sendInstructorError(res, error, "Failed to fetch announcements");
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const data = await InstructorModuleService.createInstructorAnnouncement({
      instructorId: getInstructorId(req),
      input: req.body
    });
    res.status(201).json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to create announcement");
  }
};

const updateAnnouncement = async (req, res) => {
  try {
    const data = await InstructorModuleService.updateInstructorAnnouncement({
      instructorId: getInstructorId(req),
      announcementId: req.params.id,
      input: req.body
    });
    if (!data) {
      sendNotFound(res, "Announcement not found");
      return;
    }
    res.json({ success: true, data });
  } catch (error) {
    sendInstructorError(res, error, "Failed to update announcement");
  }
};

const deleteAnnouncement = async (req, res) => {
  try {
    const deleted = await InstructorModuleService.deleteInstructorAnnouncement({
      instructorId: getInstructorId(req),
      announcementId: req.params.id
    });
    if (!deleted) {
      sendNotFound(res, "Announcement not found");
      return;
    }
    res.json({ success: true, message: "Announcement deleted" });
  } catch (error) {
    sendInstructorError(res, error, "Failed to delete announcement");
  }
};

export {
  createAnnouncement,
  createAssignment,
  createCourse,
  createLesson,
  createProject,
  createQuiz,
  deleteAnnouncement,
  deleteAssignment,
  deleteCourse,
  deleteLesson,
  deleteProject,
  deleteQuiz,
  getAnalytics,
  getAnnouncements,
  getAssignmentSubmissionDetails,
  getAssignmentSubmissions,
  getAssignments,
  getCertificateDetails,
  getCertificateProgress,
  getCertificateTimeline,
  getCourseDetails,
  getCourses,
  getCurriculum,
  getDashboardStats,
  getInstructorCertificates,
  getLessons,
  getProjectSubmissionDetails,
  getProjectSubmissions,
  getProjects,
  getQuizResultDetails,
  getQuizResults,
  getQuizzes,
  getRecentActivity,
  getReviews,
  getStudentActivity,
  getStudentDetails,
  getStudentProgress,
  getStudentReviews,
  getStudentSubmissions,
  getStudents,
  getWorkspace,
  gradeAssignmentSubmission,
  gradeProjectSubmission,
  publishCourse,
  replyToReview,
  requestAssignmentResubmission,
  requestProjectResubmission,
  unpublishCourse,
  updateAnnouncement,
  updateAssignment,
  updateCourse,
  updateCurriculum,
  updateLesson,
  updateProject,
  updateQuiz
};
