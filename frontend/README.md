# 🎨 LMS Platform Frontend

> [!IMPORTANT]
> 🚧 **Under Construction / Active Development** 🚧  
> The frontend application is actively being built and refined. UI components, page layouts, and state management logic are subject to ongoing improvements.

The frontend user interface for the **LMS Platform**, engineered with **React 19**, **Vite**, **TypeScript**, **Tailwind CSS**, and **Zustand**.

---

## ⚡ Tech Stack & Libraries

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Data Fetching**: [@tanstack/react-query](https://tanstack.com/query/latest)
- **HTTP Client**: Axios
- **Routing**: [React Router DOM v7](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts & Data Visualization**: Recharts
- **Rich Text Editor**: React Quill (`react-quill-new`)
- **PDF Generation**: `jspdf` & `html2pdf.js`
- **Toasts**: `react-hot-toast`

---

## 📂 Project Architecture

```
frontend/src/
├── api/                   # Axios API configuration & endpoint services
├── assets/                # Static assets, branding, and imagery
├── components/            # Reusable UI components
│   ├── admin/             # Admin-specific tables & management modals
│   ├── instructor/        # Course & project creation forms
│   └── student/           # Certificate cards, progress bars, video player
├── context/               # React Contexts (ThemeContext, AuthContext)
├── pages/                 # Page components
│   ├── admin/             # Admin website content & certificate templates
│   ├── instructor/        # Instructor project and submission reviews
│   └── student/           # Dashboard, Course Player, Quizzes, Certificates
├── App.tsx                # Main router & page route declarations
├── main.tsx               # Application entry point
└── index.css              # Global design tokens & Tailwind imports
```

---

## 🛠️ Scripts & Commands

In the `frontend` directory:

```bash
# Start Vite development server
npm run dev

# Type-check & build for production
npm run build

# Preview production build locally
npm run preview

# Run Oxlint linter
npm run lint
```

---

## 🌐 Key Pages & Flow

1. **Public Views**: Landing page (`Home.tsx`), Course Catalog (`Courses.tsx`), Course Details (`CourseDetails.tsx`), About & Contact pages, Certificate Verification (`VerifyCertificate.tsx`).
2. **Student Dashboard**: Overview (`StudentDashboardOverview.tsx`), Enrolled Courses (`StudentMyCourses.tsx`), Course Player (`CoursePlayer.tsx`), Quiz Player (`QuizPlayer.tsx`), Assignments (`StudentAssignments.tsx`), Projects (`StudentProjects.tsx`), Certificate Repository (`StudentCertificates.tsx`), Profile & Settings (`StudentSettings.tsx`).
3. **Instructor Dashboard**: Project Management (`InstructorProjectsManagement.tsx`), Create Projects (`InstructorProjectCreate.tsx`), Grade Submissions (`InstructorReviewSubmission.tsx`).
4. **Admin Panel**: Manage Website Content (`AdminWebsiteContent.tsx`), Manage Certificate Templates (`AdminCertificateTemplates.tsx`).
