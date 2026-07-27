# ⚙️ LMS Platform Backend

> [!IMPORTANT]
> 🚧 **Under Construction / Active Development** 🚧  
> The backend services and database models are currently under active development. Endpoints and schemas may evolve as new features are added.

The RESTful API service powering the **LMS Platform**, built with **Node.js**, **Express 5**, **TypeScript**, **Prisma ORM**, and **PostgreSQL**.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express v5 (TypeScript)
- **Database**: PostgreSQL
- **ORM**: Prisma ORM v7
- **Auth**: JWT (JSON Web Tokens), `cookie-parser`, `bcryptjs`
- **File Uploads**: Multer
- **Documents & Verification**: PDFKit & QRCode

---

## 📂 Project Architecture

```
backend/
├── prisma/
│   ├── schema.prisma      # Prisma database schema models
│   └── migrations/        # SQL migration history
├── src/
│   ├── controllers/       # Route handler logic (Auth, Courses, Quizzes, Projects, Certificates)
│   ├── middlewares/       # Authentication, authorization, file upload handling
│   ├── routes/            # Express route schemas & endpoints
│   ├── services/          # Business logic services (Certificate generator, Payments)
│   └── index.ts           # Server initialization & middleware wiring
└── uploads/               # Local file storage for uploads & generated files
```

---

## 🚀 Environment & Setup

Create a `.env` file in the `backend` folder:

```env
PORT=5000
DATABASE_URL="postgresql://username:password@localhost:5432/lms_db?schema=public"
JWT_SECRET="your_jwt_secret_key"
FRONTEND_URL="http://localhost:5173"
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
```

### Database Commands

```bash
# Run Prisma migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Open Prisma Studio to inspect data
npx prisma studio
```

---

## 📜 Available Scripts

In the `backend` directory:

```bash
# Start development server with nodemon & ts-node
npm run dev

# Compile TypeScript to dist/
npm run build

# Start compiled production server
npm run start
```
