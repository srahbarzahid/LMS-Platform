# Course Creation Pipeline

## Scope

The instructor course creation flow is now a database-backed pipeline. It stores course metadata, category ownership, pricing, certificate settings, course status, admin review state, and curriculum placeholders. It does not store uploaded video files. Lessons are saved with `videoUrl: null`; an optional promotional video URL can be stored on the course record.

## Lifecycle

1. Instructor opens `/instructor/courses/create`.
2. `InstructorCreateCourse.jsx` collects course metadata across Basic Info, Media, Pricing, and Details.
3. Save as Draft calls `POST /api/instructor/courses` with `action: "draft"`.
4. The backend validates the instructor token and role, resolves the submitted category, generates a unique slug, and creates `Course.status = DRAFT`.
5. The instructor is sent to `/instructor/curriculum?courseId=:id`.
6. `InstructorCurriculum.jsx` fetches the instructor courses and the selected course curriculum.
7. Save Curriculum calls `PUT /api/instructor/courses/:courseId/curriculum`.
8. The backend updates existing module/content records by ID, creates new placeholders, and deletes only records removed from the curriculum editor:
   - modules in `Module`
   - lessons in `Lesson` with an optional hosted `videoUrl`
   - quizzes in `Quiz`
   - assignments in `Assignment`
   - projects in `Project`
9. Submit for Review calls `PUT /api/instructor/courses/:id/publish`.
10. The instructor endpoint moves the course to `PENDING_REVIEW`.
11. Admin opens `/admin/course-approvals`.
12. `AdminCourseApprovals.jsx` reads `GET /api/admin/courses/pending`.
13. Admin approval sets status to `PUBLISHED`; rejection sets status to `REJECTED` with a reason.
14. Public/student course catalog reads only `PUBLISHED` courses from `GET /api/courses`.

## Status Model

The course lifecycle is normalized in Prisma:

- `DRAFT`: instructor is still editing.
- `PENDING_REVIEW`: submitted to admin.
- `PUBLISHED`: visible in the public/student catalog.
- `REJECTED`: returned to instructor with rejection reason.
- `UNPUBLISHED`: removed from catalog but preserved.

Frontend display labels are mapped in `backend/src/services/coursePipeline.service.js`, so labels like `Pending Review` are converted into enum values like `PENDING_REVIEW`.

## Database Setup

For a clean database with Prisma migration history, run:

```bash
cd backend
npm run db:migrate
npm run db:generate
```

For this existing local MySQL database, Prisma reported `P3005` because the database already had tables but no migration history. The course pipeline migration was applied manually with:

```bash
npx prisma db execute --schema prisma/schema.prisma --file prisma/migrations/20260819000000_course_creation_pipeline/migration.sql
npx prisma migrate resolve --applied 20260819000000_course_creation_pipeline
```

After that, `npm run db:status` should report that the database schema is up to date.

## Main Files

- `frontend/src/pages/instructor/InstructorCreateCourse.jsx`: course metadata form.
- `frontend/src/pages/instructor/InstructorCourses.jsx`: instructor-owned course list and status actions.
- `frontend/src/pages/instructor/InstructorCurriculum.jsx`: module/content-placeholder builder.
- `frontend/src/api/instructorApi.js`: instructor API wrapper using the shared client.
- `backend/src/routes/instructor.routes.js`: protected instructor course routes.
- `backend/src/controllers/instructor.controller.js`: instructor course and curriculum operations.
- `backend/src/controllers/admin/courses.controller.js`: admin review, status, feature, and delete operations.
- `backend/src/controllers/courseController.js`: public/student catalog reads published courses.
- `backend/src/services/coursePipeline.service.js`: shared normalization, slug, category, status, and formatting logic.
- `backend/prisma/schema.prisma`: course schema and lifecycle enums.
- `backend/prisma/migrations/20260819000000_course_creation_pipeline/migration.sql`: database migration for course creation metadata.

## Video Storage Rule

No uploaded video binary is stored in this implementation. The data model supports:

- `Course.promoVideoUrl`: optional external promo video URL.
- `Lesson.videoUrl`: optional hosted lesson video URL.

When video storage is later required, add a media upload service and store only the returned object URL/path in `Lesson.videoUrl`.
