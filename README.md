<div align="center">

<img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=700&size=36&pause=1000&color=FFD60A&center=true&vCenter=true&width=600&lines=StudyNotion+%F0%9F%93%9A;Full-Stack+EdTech+Platform;Learn+%E2%80%A2+Teach+%E2%80%A2+Grow" alt="Typing SVG" />

<br/>

**A production-grade online learning platform — built from scratch with React, Node.js, MongoDB, and real payment integration.**

<br/>

[![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://redux-toolkit.js.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)](https://razorpay.com)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)

<br/>

[🌐 Live Demo](https://study-notion-project-swart.vercel.app) &nbsp;•&nbsp;
[📖 API Docs](https://studynotion-backend.onrender.com/api/docs) &nbsp;•&nbsp;
[⚡ Features](#-features) &nbsp;•&nbsp;
[🏗 Architecture](#-architecture) &nbsp;•&nbsp;
[🚀 Getting Started](#-getting-started)

</div>

---

## 🌍 Live Deployment

| Service | URL | Platform |
|---|---|---|
| 🖥 Frontend | https://study-notion-project-swart.vercel.app | Vercel |
| 🔌 Backend API | https://studynotion-backend.onrender.com | Render |
| 📖 Swagger Docs | https://studynotion-backend.onrender.com/api/docs | Render |

> **Test Credentials** &nbsp;|&nbsp; Student: `student@test.com / Test@1234` &nbsp;|&nbsp; Instructor: `instructor@test.com / Test@1234`
>
> **Razorpay Test Card**: `4111 1111 1111 1111` — Any future expiry — CVV: `123`

---

## 🎯 What is StudyNotion?

StudyNotion is a **full-stack EdTech platform** inspired by Udemy/Coursera — built with a real-world architecture to demonstrate end-to-end product engineering skills.

It supports **three distinct user roles** with a fully separate experience for each:

| Role | Can Do |
|---|---|
| 🎓 **Student** | Browse catalog, purchase courses, watch videos with resume, earn certificates |
| 👨‍🏫 **Instructor** | Build courses (sections → videos → PDFs), view earnings analytics, manage students |
| 🛡 **Admin** | Manage categories, moderate reviews, toggle platform maintenance mode |

---

## ✨ Features

### 🎓 Student Experience
- **Smart Course Discovery** — Full-text search across course names, tags, and descriptions; filter by category and price
- **Razorpay Checkout** — Secure payment flow with HMAC signature verification and duplicate-enroll protection
- **Video Resume** — Exact timestamp saved on every `pause` event; player resumes exactly where you left off across sessions
- **Progress Tracking** — Per-subsection completion tracking with a real-time progress bar
- **Completion Certificates** — Auto-generated PDF certificate (validated server-side at 100% completion), printable via browser
- **Wishlist** — Save courses for later; persisted in the database
- **OTP Verification** — Email-based OTP at signup with 60-second resend timer and 5-minute auto-expiry (MongoDB TTL index)
- **Cart System** — Add multiple courses, checkout in one payment; cart persisted in localStorage + Redux

### 👨‍🏫 Instructor Experience
- **Course Builder** — Hierarchical course editor: Course → Sections → Subsections → Video upload + downloadable PDF resources
- **Cloudinary Integration** — Direct video and thumbnail uploads to cloud storage, no server disk I/O
- **Analytics Dashboard** — Chart.js bar and pie charts for revenue, student enrollment, and per-course breakdown
- **Course Management** — Paginated course table; toggle draft/published status, edit or delete with confirmation
- **Public Instructor Profile** — Shareable profile page with all courses, total students, and average rating

### 🛡 Admin Experience
- **Category Management** — Create and curate course categories that instructors assign to courses
- **Review Moderation** — Paginated review list with one-click delete for spam or policy-violating content
- **Maintenance Mode** — Flip a global toggle to lock out all non-admin users; set a scheduled return time that auto-unlocks the platform; blast an email to all registered users

### 🏗 Platform Engineering
- **Paginated REST APIs** — All list endpoints support `?page=&limit=`; no full-table scans
- **Rate Limiting** — Auth routes: 5 req/15 min | Email routes (OTP/reset): 3 req/15 min — blocks brute-force and OTP spam
- **MongoDB Text Indexes** — Compound text index on course `name + description + tags` for fast full-text search
- **Transactional Emails** — Branded HTML email templates for OTP, enrollment confirmation, payment receipt, password reset, and maintenance alerts
- **Swagger / OpenAPI 3.0** — Interactive API documentation auto-generated from JSDoc comments
- **Fully Responsive** — Mobile-first Tailwind CSS layout across all pages

---

## 🏗 Architecture

```
StudyNotionProject/
│
├── src/                                 # React 18 + Vite frontend
│   ├── components/
│   │   ├── Common/                      # Navbar, Footer, ReviewSlider, ConfirmationModal
│   │   └── core/
│   │       ├── Auth/                    # LoginForm, SignupForm, OTP, ResetPassword
│   │       ├── Catalog/                 # CourseCard, CourseSlider, CategoryPage
│   │       ├── Dashboard/
│   │       │   ├── Admin/               # CreateCategory, ReviewModeration, MaintenanceMode
│   │       │   ├── InstructorDashboard/ # InstructorChart (Chart.js)
│   │       │   └── InstructorCourses/   # CoursesTable with pagination
│   │       ├── Course/                  # AddCourse, EditCourse, CourseBuilder
│   │       └── ViewCourse/              # VideoDetails (resume), VideoSidebar, ReviewModal
│   ├── pages/                           # 18 route-level pages
│   ├── services/
│   │   ├── apis.js                      # All API URLs in one place
│   │   ├── apiConnector.js              # Axios instance wrapper
│   │   └── operations/                  # Auth, Course, Profile, Payment async thunks
│   └── slices/                          # Redux Toolkit: auth, cart, course, profile, wishlist
│
└── server/                              # Node.js + Express backend
    ├── controllers/                     # 11 controllers — Auth, Course, Payment, Profile...
    ├── routes/                          # 6 route files with middleware guards
    ├── models/                          # 10 Mongoose schemas (see below)
    ├── middleware/                      # auth.js, isStudent, isInstructor, isAdmin
    ├── config/                          # database.js, cloudinary.js, razorpay.js
    ├── mail/templates/                  # 6 branded HTML email templates
    ├── utils/                           # imageUploader.js, formatDate.js
    ├── swagger.js                       # OpenAPI 3.0 spec config
    └── index.js                         # Express app — CORS, rate limits, route mounting
```

### 🗃 Data Model

```
User ─────────────────── Profile (1:1 extended info — bio, DOB, gender, contact)
User ─────────────────── Course[]  (instructor — courses created)
User ─────────────────── Course[]  (student — enrolled courses)
User ─────────────────── Course[]  (wishlist)
Course ───────────────── Section[] ──► SubSection[] (video URL + PDF resources)
Course ───────────────── RatingAndReview[]
Course ───────────────── Category  (many-to-one)
CourseProgress ────────── User + Course + completedVideos[] + videoProgress[{id, timestamp}]
OTP ──────────────────── TTL index — document auto-deleted after 5 minutes
Maintenance ──────────── Singleton document — global toggle + scheduled return time
```

---

## 🔌 API Reference

### Auth &nbsp; `/api/v1/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sendotp` | Send 6-digit OTP to email (rate limited: 3/15min) |
| `POST` | `/signup` | Register user (OTP must be valid & unexpired) |
| `POST` | `/login` | Authenticate → JWT returned |
| `POST` | `/reset-password-token` | Send reset link via email |
| `POST` | `/reset-password` | Update password using token |

### Courses &nbsp; `/api/v1/course`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/getAllCourses?page=1&limit=10` | Paginated published courses |
| `GET` | `/getCourseDetails/:id` | Full course with sections + subsections |
| `GET` | `/getInstructorCourses?page=1&limit=10` | Instructor's own courses (paginated) |
| `GET` | `/searchCourses?q=&category=&priceType=` | Full-text search with filters |
| `POST` | `/createCourse` | [Instructor] Create new course |
| `PUT` | `/editCourse` | [Instructor] Update course details |
| `DELETE` | `/deleteCourse` | [Instructor] Delete course |
| `POST` | `/addSection` | Add section to course |
| `POST` | `/addSubSection` | Add subsection (video + resources) |
| `POST` | `/createRating` | Student submits review |
| `DELETE` | `/deleteReview` | [Admin] Remove a review |

### Payments &nbsp; `/api/v1/payment`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/capturePayment` | Create Razorpay order (duplicate-enroll guard) |
| `POST` | `/verifyPayment` | Verify HMAC signature → atomic enrollment |
| `POST` | `/sendPaymentSuccessEmail` | Send payment receipt email |

### Profile &nbsp; `/api/v1/profile`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/getUserDetails` | My profile data |
| `PUT` | `/updateProfile` | Update bio, DOB, gender, contact |
| `GET` | `/getEnrolledCourses` | My courses with progress % |
| `GET` | `/getCertificate/:courseId` | Certificate data (validates 100% completion) |
| `GET` | `/getWishlist` | My saved courses |
| `POST` | `/addToWishlist` | Save a course |
| `DELETE` | `/removeFromWishlist` | Remove from wishlist |
| `GET` | `/instructorProfile/:id` | Public instructor profile + stats |

---

## 🔬 Engineering Deep-Dives

### 1. Video Resume (per-subsection timestamp)
On every video `pause` event, the current timestamp is saved to MongoDB — debounced 500 ms, skipped if delta < 5 seconds. When returning to the same subsection, the player fetches the saved timestamp and seeks after an 800 ms load delay. CourseProgress uses a compound index on `{courseID, userId}` for O(log n) lookups.

### 2. Race-condition-safe Payment Enrollment
Before creating a Razorpay order, the backend re-fetches enrollment status from MongoDB. If already enrolled (duplicate tab / double-click), it returns `409 Conflict` immediately. The enrollment step uses `$addToSet` in `findOneAndUpdate` — two simultaneous webhook calls cannot double-enroll the same student.

### 3. Paginated APIs with Smart UI
Every major list endpoint returns a `pagination` envelope:
```json
{
  "success": true,
  "data": [ "..." ],
  "pagination": { "totalPages": 5, "currentPage": 2, "totalCourses": 48, "limit": 10 }
}
```
The frontend renders numbered page buttons — active page highlighted, Prev/Next disabled at boundaries. Deleting the last item on a non-first page auto-decrements the page cursor.

### 4. Maintenance Mode with Auto-Expiry
The `Maintenance` model stores `{ isActive, message, returnAt }`. A `node-schedule` job fires every minute, checks if `returnAt < now`, and auto-deactivates maintenance — no manual toggling required. Admins can also blast a Nodemailer broadcast to all registered users in a single API call.

### 5. Completion Certificate (no external PDF library)
`GET /getCertificate/:courseId` validates server-side that the student has completed 100% of subsections. It returns structured data (name, course, instructor, date, lecture count). The React page renders a styled certificate layout and calls `window.print()` for browser-native PDF export — zero dependency on heavy PDF libraries.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas free cluster
- Razorpay test account (free)
- Cloudinary free account
- Gmail with App Password enabled (Settings → Security → 2-Step Verification → App passwords)

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/StudyNotionProject.git
cd StudyNotionProject
```

### 2. Set up the backend
```bash
cd server && npm install
```

Create `server/.env`:
```env
# Database
MONGODB_URL=mongodb+srv://<user>:<pass>@cluster.mongodb.net/studynotion

# Server
PORT=4000
FRONTEND_URL=http://localhost:5173

# Auth
JWT_SECRET=your_super_secret_jwt_key

# Email (Gmail SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

# Razorpay
RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret
```

### 3. Set up the frontend
```bash
# From project root
npm install
```

Create `.env` in project root:
```env
VITE_APP_BASE_URL=http://localhost:4000/api/v1
VITE_APP_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
```

### 4. Start both servers
```bash
# From project root — starts React (5173) + Express (4000)
npm run dev
```

| Service | URL |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:4000 |
| API Docs (Swagger) | http://localhost:4000/api/docs |

---

## 📦 Deployment Guide

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deploy on push; add `VITE_` env vars in dashboard |
| Backend | **Render** | Web Service, Node 18, add all `server/.env` vars in dashboard |
| Database | **MongoDB Atlas** | M0 free tier; whitelist `0.0.0.0/0` for Render's dynamic IPs |
| Media | **Cloudinary** | Free tier (25 GB storage); uses folders `studynotion/thumbnails`, `/videos`, `/pdfs` |
| Email | **Gmail SMTP** | Requires 2FA + App Password on Google account |

---

## 🛠 Tech Stack Summary

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 7.3 | Build tool + HMR dev server |
| Redux Toolkit | 1.9 | Global state (auth, cart, profile, course, wishlist) |
| React Router DOM | 6.9 | Client-side routing + protected routes |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Hook Form | 7.43 | Form handling + validation |
| Chart.js | 4.3 | Instructor analytics charts |
| Swiper.js | 9.3 | Review carousel |
| video-react | 0.16 | Video player with timestamp API |
| Axios | 1.3 | HTTP client |

### Backend
| Library | Version | Purpose |
|---|---|---|
| Express.js | 4.18 | REST API framework |
| Mongoose | 7.0 | MongoDB ODM + schema validation |
| jsonwebtoken | 9.0 | Stateless JWT auth |
| bcrypt | 5.1 | Password hashing |
| Nodemailer | 6.9 | Transactional email |
| Razorpay SDK | 2.8 | Payment order creation + verification |
| Cloudinary SDK | 1.36 | Cloud media uploads |
| express-rate-limit | 8.2 | Route-level rate limiting |
| swagger-jsdoc | 6.2 | OpenAPI spec from JSDoc |
| node-schedule | 2.1 | Cron-style maintenance auto-expiry |

---

## 👨‍💻 Author

**Faizan Khan**

[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/yourusername)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://linkedin.com/in/yourprofile)
[![Email](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:your@email.com)

---

<div align="center">

⭐ **If this project helped you, consider giving it a star!** ⭐

*Built with ❤️ using the MERN stack*

</div>
