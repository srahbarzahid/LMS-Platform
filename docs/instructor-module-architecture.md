# Instructor Module Architecture

## Goal

The instructor module is now organized as one database-backed pipeline across the sidebar:

Frontend page -> `frontend/src/api/instructorApi.js` -> Express route -> controller -> service -> Prisma -> MySQL.

Course video files are not stored. Course promo videos and lesson videos are saved only as hosted URLs.

## Course Creation Flow

1. Instructor opens `/instructor/courses/create`.
2. `InstructorCreateCourse.jsx` collects metadata, image URL/upload, pricing, certificate setting, requirements, outcomes, audience, and tags.
3. Save draft sends `action: "draft"` to `POST /api/instructor/courses`.
4. Submit for review sends `action: "review"` to the same endpoint.
5. `backend/src/controllers/instructor.controller.js` delegates to `coursePipeline.service.js`.
6. `coursePipeline.service.js` validates ownership, normalizes status/level/category, creates the slug, and writes `Course`.
7. Draft courses go to curriculum editing. Review courses become `PENDING_REVIEW`.
8. Admin review uses admin course endpoints to approve as `PUBLISHED` or reject as `REJECTED`.
9. Student/home course pages read only published courses from the shared catalog endpoints.

## Curriculum Flow

1. `InstructorCurriculum.jsx` loads instructor courses and selected curriculum.
2. `PUT /api/instructor/courses/:courseId/curriculum` saves modules and placeholders.
3. Existing records are updated by ID instead of being rebuilt from scratch.
4. New local placeholder IDs become real database IDs.
5. Removed module-attached items are deleted. Unassigned quizzes, assignments, and projects created from their dedicated pages are preserved.
6. Lessons store title, description, duration, preview flag, order, and optional hosted `videoUrl`.

## Sidebar API Map

- Dashboard: `GET /api/instructor/dashboard-stats`, `GET /api/instructor/recent-activity`
- My Courses/Create Course/Curriculum: `GET/POST/PUT/DELETE /api/instructor/courses`, curriculum and publish routes
- Lessons: `GET/POST/PUT/DELETE /api/instructor/lessons`
- Quizzes: `GET/POST/PUT/DELETE /api/instructor/quizzes`, quiz result detail route
- Assignments: `GET/POST/PUT/DELETE /api/instructor/assignments`, submission detail, grade, resubmission routes
- Projects: `GET/POST/PUT/DELETE /api/instructor/projects`, submission detail, grade, resubmission routes
- Students: `GET /api/instructor/students`, student profile/progress/submissions/activity/reviews routes
- Reviews: `GET /api/instructor/reviews`, `POST /api/instructor/reviews/:id/reply`
- Certificates: `GET /api/instructor/certificates`, certificate detail/progress/timeline routes
- Analytics: `GET /api/instructor/analytics`
- Announcements: `GET/POST/PUT/DELETE /api/instructor/announcements`
- Settings: `GET/PATCH/POST/DELETE /api/instructor/settings/*`

## Cross-Module Connections

- Admin module sees submitted courses through pending-course approval APIs.
- Student/home catalog sees only published courses.
- Student module receives instructor announcements through `Notification` records.
- Instructor review replies are stored as `Notification` records linked to the original review.
- Instructor assignment/project grading updates the same submission tables students use.
- Certificate views are computed from `Certificate`, `Enrollment`, `CourseCompletion`, and course content counts.

## Backend Structure

- `backend/src/routes/instructor.routes.js`: all protected instructor module routes.
- `backend/src/controllers/instructor.controller.js`: HTTP request/response layer and ownership checks.
- `backend/src/services/instructorModule.service.js`: instructor workspace, analytics, student, review, certificate, assignment, project, quiz, lesson, and announcement logic.
- `backend/src/services/coursePipeline.service.js`: course creation/update/status/category/formatting pipeline.
- `backend/src/controllers/announcements.user.controller.js`: bridges instructor announcement notifications into user-facing announcement feeds.
- `backend/src/middlewares/uploadMiddleware.js`: allows safe non-video resources and blocks video/audio uploads.

## Current Limit

There is no quiz-attempt model in the Prisma schema yet, so quiz result detail pages can show live quiz/question configuration and a truthful not-attempted state, but they cannot show real student attempt answers until a `QuizAttempt` or equivalent table is added.
