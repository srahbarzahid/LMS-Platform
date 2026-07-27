# 🎓 LMS Platform - Modern Learning Management System

> [!IMPORTANT]
> 🚧 **Work in Progress / Under Active Development** 🚧  
> This project is currently under construction and active development. Features, user interface components, backend services, and database schemas are continuously evolving.

A full-stack, feature-rich **Learning Management System (LMS)** built with **React 19**, **Vite**, **TypeScript**, **Node.js**, **Express**, **Prisma ORM**, and **PostgreSQL**.

---

## 🚧 Project Status & Development Roadmap

- 🛠️ **Status**: In Active Development (Pre-Release)
- 🔄 **Ongoing Tasks**:
  - [x] Core Authentication & Role-Based Access Control (Student, Instructor, Admin)
  - [x] Course & Module Content Architecture
  - [x] Interactive Quiz Player & Assignment Submissions
  - [x] Automated PDF Certificate Generation & QR Verification
  - [ ] Advanced Analytics & Performance Dashboard Refinements
  - [ ] Real-time Socket / Push Notifications Integration
  - [ ] Payment Gateway Integration Polish (Razorpay Sandbox/Production)
  - [ ] Mobile Responsiveness & UI/UX Enhancements

---

## 🌟 Features Overview

### 👨‍🎓 Student Experience
- **Course Discovery & Enrollment**: Browse categorized courses, search, filter by skill level/language, add to wishlist/cart, and complete checkout.
- **Interactive Course Player**: Video lesson playback with playback speed control, auto-play next lesson, and progress persistence.
- **Assessments & Quizzes**: Interactive quiz player with real-time scoring, answer keys, and instant performance feedback.
- **Assignments & Projects**: Submit assignments and capstone projects with file upload support, external links, and instructor feedback loops.
- **Automated Certificates**: Generate downloadable PDF certificates upon course completion with built-in QR Code verification system.
- **Personalized Dashboard**: Track course completion metrics, active assignments, notifications, notification preferences, and security sessions.

### 👨‍🏫 Instructor Portal
- **Course & Module Builder**: Design structured courses with modules, video lessons, and previewable content.
- **Project & Assignment Management**: Create custom projects, set maximum marks, allow resubmissions, and grade student submissions with tailored feedback.
- **Student Performance Insights**: Review completed quizzes, assignment submissions, and track enrollment trends.

### 🛡️ Admin Management
- **Platform Customization**: Manage website content, homepage sections, and announcements.
- **Certificate Templates**: Configure dynamic certificate templates and issuer signatures.
- **User & Course Governance**: Oversee course publications, review course requests, and manage platform roles (STUDENT, INSTRUCTOR, ADMIN).

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4, Lucide Icons
- **State Management**: Zustand
- **Data Fetching & Caching**: TanStack Query (React Query v5)
- **Rich Text & Charts**: React Quill, Recharts
- **PDF & Certificates**: `jspdf`, `html2pdf.js`

### Backend
- **Runtime**: Node.js & Express 5 (TypeScript)
- **Database & ORM**: PostgreSQL via Prisma ORM v7
- **Authentication**: JWT & Cookie Parser, Password hashing with `bcryptjs`
- **File Storage**: Multer (Local Uploads)
- **Document & QR Generation**: `pdfkit`, `qrcode`

---

## 📁 Repository Structure

```
LMS Platform/
├── backend/                  # Node.js + Express + Prisma REST API server
│   ├── prisma/               # Database schemas, migrations, and seed scripts
│   ├── src/
│   │   ├── controllers/      # Request handlers for users, courses, quizzes, etc.
│   │   ├── middlewares/      # Auth, role-based access control, file upload middlewares
│   │   ├── routes/           # API route definitions
│   │   └── services/         # Business logic (Certificates, Payments, Notifications)
│   └── uploads/              # Storage for course media, submissions, and certificates
│
├── frontend/                 # React 19 + Vite Single Page Application
│   ├── src/
│   │   ├── api/              # Axios instance & API client functions
│   │   ├── components/       # Reusable UI components (Navbar, Footer, Modals, Cards)
│   │   ├── context/          # Global theme & authentication context providers
│   │   └── pages/            # Student, Instructor, and Admin page views
│   └── index.css             # Global styles & Tailwind configuration
│
├── package.json              # Workspace script runner (concurrent backend + frontend)
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher
- **PostgreSQL**: Local instance or remote database URL (e.g., Supabase, Neon, Render)

### 1. Installation

Clone the repository and install all dependencies for root, backend, and frontend with a single command:

```bash
# Install dependencies across all packages
npm run install:all
```

Alternatively, manually install dependencies in each directory:
```bash
npm install
cd backend && npm install
cd ../frontend && npm install
```

---

### 2. Backend Environment Setup

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"
JWT_SECRET="your_super_secret_jwt_key"
FRONTEND_URL="http://localhost:5173"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

Run database migrations to initialize PostgreSQL schema:

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

---

### 3. Frontend Environment Setup

Create a `.env` file in the `frontend/` directory (optional if using default `http://localhost:5000/api`):

```env
VITE_API_BASE_URL="http://localhost:5000/api"
```

---

### 4. Running the Application

From the **workspace root directory**, launch both backend and frontend concurrently:

```bash
npm run dev
```

- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5000`

---

## 📜 Key Scripts

| Command | Action |
| :--- | :--- |
| `npm run dev` | Runs backend (`:5000`) and frontend (`:5173`) concurrently |
| `npm run dev:backend` | Starts the Express server with `nodemon` & `ts-node` |
| `npm run dev:frontend` | Starts the Vite React frontend dev server |
| `npm run install:all` | Installs NPM packages for root, backend, and frontend |

---

## 🔒 Security & Roles

- **Role-Based Access Control (RBAC)**: Enforced via Express middleware (`STUDENT`, `INSTRUCTOR`, `ADMIN`).
- **Security Sessions**: Real-time session monitoring tracking device, IP address, and location.
- **Certificate Authenticity**: Dynamic verification tokens & QR code checks accessible publicly via `/verify-certificate`.

---

## 📄 License

This project is licensed under the MIT License.
