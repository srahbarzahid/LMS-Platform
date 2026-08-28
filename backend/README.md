# ⚙️ LMS Platform Backend Service

> [!NOTE]
> 🚀 **Production-Ready REST API Service**  
> Powered by **Node.js**, **Express 5**, **Prisma ORM**, and **MySQL Database (`lms_platform`)**.

---

## 🛠️ Architecture & Tech Stack

- **Runtime & Framework**: Node.js & Express v5
- **Database**: MySQL (`lms_platform`)
- **ORM**: Prisma ORM v7
- **Auth**: JWT (JSON Web Tokens), `cookie-parser`, `bcryptjs`
- **File Uploads**: Multer
- **Testing**: Jest Unit Tests (**34/34 Tests Passed**)

---

## 📋 Comprehensive API Endpoints & Feature Status

| Endpoint Path | Method | Feature | Implementation Status |
| :--- | :--- | :--- | :--- |
| `/api/admin/users` | `GET`, `DELETE` | List users & permanent deletion with cascade cleanup | ✅ **Complete (MySQL)** |
| `/api/admin/courses` | `GET`, `PUT` | Admin course approval & publishing workflow | ✅ **Complete (MySQL)** |
| `/api/admin/categories` | `GET`, `POST`, `DELETE` | Category management & parent-child mapping | ✅ **Complete (MySQL)** |
| `/api/admin/enrollments` | `GET`, `POST` | Live enrollments & manual student enrollment | ✅ **Complete (MySQL)** |
| `/api/admin/certificates` | `GET`, `POST` | Certificate list & manual issuance modal | ✅ **Complete (MySQL)** |
| `/api/admin/reviews` | `GET`, `PUT`, `DELETE` | Moderation of student reviews (Publish/Hide/Delete) | ✅ **Complete (MySQL)** |
| `/api/admin/payments` | `GET` | Real database transactions & revenue analytics | ✅ **Complete (MySQL)** |
| `/api/reviews` | `GET`, `POST` | Public/Student review submission & dynamic star stats | ✅ **Complete (MySQL)** |
| `/api/admin/offers` | `GET`, `POST` | Offers & Coupon management | 🟡 **UI Integrated (Local State)** |
| `/api/admin/content` | `GET`, `PUT` | Landing page content management | 🟡 **UI Integrated (Local State)** |
| `/api/admin/announcements` | `GET`, `POST` | Announcement broadcasting | 🟡 **UI Integrated (Local State)** |
| `/api/webhooks/razorpay` | `POST` | Live Razorpay payment webhook listener | 🔴 **Roadmap Feature** |
| `/api/notifications/socket` | `WS` | Real-time Socket.io push notifications | 🔴 **Roadmap Feature** |

---

## 🚀 Database Setup & Commands

```bash
# Push schema changes to MySQL database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio to inspect database data
npx prisma studio

# Run backend unit tests
npm test
```
