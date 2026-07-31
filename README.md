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
[📖 API Docs](https://studynotion-backend.onrender.com/api-docs) &nbsp;•&nbsp;
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
| 📖 Swagger Docs | https://studynotion-backend.onrender.com/api-docs | Render |

> **Razorpay Test Card**: `4111 1111 1111 1111` — Any future expiry — CVV: `123`

---

## 🎯 What is StudyNotion?

StudyNotion is a **full-stack EdTech platform** inspired by Udemy/Coursera — built with a real-world architecture to demonstrate end-to-end product engineering skills.

It supports **three distinct user roles** with a fully separate experience for each:

| Role | Can Do |
|---|---|
| 🎓 **Student** | Browse catalog, purchase courses, watch videos with resume, take notes, ask questions, earn certificates |
| 👨‍🏫 **Instructor** | Build courses (sections → videos → PDFs), create coupons, view earnings analytics, manage students |
| 🛡 **Admin** | Manage categories, moderate reviews, monitor live site traffic, toggle platform maintenance mode |

---

## ✨ Features

### 🎓 Student Experience
- **Smart Course Discovery** — Full-text search across course names, tags, and descriptions; filter by category, price type, rating, and language; sort by relevance/price
- **Razorpay Checkout** — Secure multi-course payment flow with HMAC signature verification, duplicate-enroll protection, and free-course enrollment (no payment step)
- **Coupons** — Apply instructor-issued discount codes at checkout
- **Video Resume** — Timestamp saved on every `pause` event; player resumes exactly where you left off across sessions
- **Progress Tracking** — Per-subsection completion tracking with a real-time progress bar
- **Completion Certificates** — Auto-generated certificate (validated server-side at 100% completion), printable via browser
- **Lecture Notes** — Take timestamped notes per lecture, view/edit/delete them, jump back to the exact moment in the video
- **Q&A / Discussion Forum** — Ask questions on a lecture, get answers from instructors or other students, upvote/downvote, mark resolved
- **Downloadable Resources** — Download PDFs/docs attached to lectures by the instructor
- **Wishlist** — Save courses for later; persisted in the database
- **OTP Verification** — Email-based OTP at signup with resend timer and MongoDB TTL auto-expiry
- **Login Anomaly Alerts** — Every login triggers an email with IP-based location (city/region/country/timezone) via ipinfo.io
- **Cart System** — Add multiple courses, checkout in one payment; cart persisted in localStorage + Redux

### 👨‍🏫 Instructor Experience
- **Course Builder** — Hierarchical course editor: Course → Sections → Subsections → Video upload + downloadable PDF resources
- **Cloudinary Integration** — Direct video and thumbnail uploads to cloud storage, no server disk I/O
- **Coupon Management** — Create, activate/deactivate, and delete discount codes per course
- **Analytics Dashboard** — Chart.js bar and pie charts for revenue, student enrollment, and per-course breakdown
- **Course Management** — Paginated course table; toggle draft/published status, edit or delete with confirmation
- **Q&A Answering** — Answer student questions and mark them resolved
- **Public Instructor Profile** — Shareable profile page with all courses, total students, and average rating
- **Approval Gate** — New instructor accounts are flagged `approved: false` until an admin approves them

### 🛡 Admin Experience
- **Category Management** — Create and curate course categories that instructors assign to courses
- **Review Moderation** — Paginated review list with one-click delete for spam or policy-violating content
- **Live Analytics** — Real-time visitor dashboard (active visitors via heartbeat, page views, geo breakdown)
- **Platform Analytics** — Aggregate stats across users, courses, and revenue
- **Maintenance Mode** — Flip a global toggle to lock out all non-admin users (auto-logs out anyone active); set a scheduled return time that auto-unlocks the platform; blast an email to all registered users

### 🏗 Platform Engineering
- **Paginated REST APIs** — All list endpoints support `?page=&limit=`; no full-table scans
- **Rate Limiting** — Auth routes: 5 req/15 min | Email routes (OTP/reset): 3 req/15 min — blocks brute-force and OTP spam
- **MongoDB Text Indexes** — Compound text index on course `name + description + tags` for fast full-text search
- **Transactional Emails** — Branded HTML email templates for OTP, enrollment confirmation, payment receipt, password reset, contact-form response, and maintenance alerts
- **In-App Notifications** — Notification feed with read/unread state and mark-all-read
- **Contact Form** — Public contact form that emails a confirmation back to the sender
- **Swagger / OpenAPI 3.0** — Interactive API documentation auto-generated from JSDoc comments, served at `/api-docs`
- **Request Sanitization & Logging** — `express-mongo-sanitize` against NoSQL injection, `morgan` request logging, `express-status-monitor` health dashboard
- **Fully Responsive** — Mobile-first Tailwind CSS layout across all pages

---

## 🏗 Architecture

```
StudyNotionProject/
│
├── src/                                 # React 18 + Vite frontend
│   ├── components/
│   │   ├── Common/                      # Navbar, Footer, MaintenanceBanner, AnnouncementTicker...
│   │   └── core/
│   │       ├── Auth/                    # LoginForm, SignupForm, PrivateRoute, AdminRoute, OpenRoute
│   │       ├── Catalog/                 # CourseCard, CourseSlider
│   │       ├── ContactUsPage/           # ContactForm, ContactDetails
│   │       ├── Dashboard/
│   │       │   ├── Admin/               # CreateCategory, ReviewModeration, MaintenanceMode, AdminAnalytics
│   │       │   ├── AddCourse/           # CourseBuilder, CourseInformation, PublishCourse, Upload
│   │       │   ├── EditCourse/
│   │       │   ├── Cart/
│   │       │   ├── Settings/            # EditProfile, ChangeProfilePicture, UpdatePassword, DeleteAccount
│   │       │   ├── InstructorDashboard/ # InstructorChart (Chart.js)
│   │       │   └── InstructorCourses/   # CoursesTable, CouponModal
│   │       ├── Course/                  # CourseAccordionBar, CourseDetailsCard
│   │       └── ViewCourse/              # VideoDetails (resume), Notes, QandA, CourseReviewModal
│   ├── pages/                           # 18 route-level pages
│   ├── hooks/                           # useTracker (page view/heartbeat), useOnClickOutside, useRouteMatch
│   ├── data/                            # Static nav/footer/homepage content, country codes
│   ├── services/
│   │   ├── apis.js                      # All API URLs in one place
│   │   ├── apiConnector.js              # Axios instance wrapper
│   │   └── operations/                  # Auth, Course, Profile, Payment, Contact, Notification thunks
│   ├── slices/                          # Redux Toolkit: auth, cart, course, profile, wishlist, notification, viewCourse
│   └── reducer/                         # Root reducer
│
└── server/                              # Node.js + Express backend
    ├── controllers/                     # 17 controllers — Auth, Course, Payment, Coupon, Note, Question...
    ├── routes/                          # 8 route files with middleware guards
    ├── models/                          # 16 Mongoose schemas (see below)
    ├── middleware/                      # auth.js — auth, isStudent, isInstructor, isAdmin, optionalAuth
    ├── config/                          # database.js, cloudinary.js, razorpay.js
    ├── mail/templates/                  # 8 branded HTML email templates
    ├── utils/                           # imageUploader.js, mailSender.js, secToDuration.js
    ├── scripts/                         # seedData.js, updateCourseMetadata.js
    ├── swagger.js                       # OpenAPI 3.0 spec config
    └── index.js                         # Express app — CORS, rate limits, route mounting
```

### 🗃 Data Model

```
User ─────────────────── Profile (1:1 extended info — bio, DOB, gender, contact)
User ─────────────────── Course[]  (instructor — courses created)
User ─────────────────── Course[]  (student — enrolled courses, via studentsEnroled on Course)
User ─────────────────── Course[]  (wishlist)
User ─────────────────── Notification[]
Course ───────────────── Section[] ──► SubSection[] (video URL + PDF resources)
Course ───────────────── RatingAndReview[]
Course ───────────────── Category  (many-to-one)
Course ───────────────── Coupon[]
Course + SubSection ──── Question[] ──► Answer[] (embedded, upvotes/downvotes)
Course + SubSection ──── Note[]  (per-student, timestamped)
CourseProgress ────────── User + Course + completedVideos[] + videoProgress[{id, timestamp}]
OTP ──────────────────── TTL index — document auto-deleted after 5 minutes
Maintenance ──────────── Singleton document — global toggle + scheduled return time
PageView / VisitorHeartbeat ── Anonymous or logged-in visit tracking for live analytics
```

---

## 🔌 API Reference

Full interactive documentation (all endpoints, request/response schemas) is served via Swagger at **`/api-docs`**. Summary below.

### Auth &nbsp; `/api/v1/auth`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/sendotp` | Send 6-digit OTP to email (rate limited: 3/15min) |
| `POST` | `/signup` | Register user (OTP must be valid & unexpired, rate limited: 5/15min) |
| `POST` | `/login` | Authenticate → JWT returned, IP-geolocation login alert emailed |
| `POST` | `/changepassword` | Change password (requires old password) |
| `POST` | `/reset-password-token` | Send reset link via email |
| `POST` | `/reset-password` | Update password using token |

### Courses, Sections, Q&A, Coupons & Notes &nbsp; `/api/v1/course`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/getAllCourses` | Paginated published courses |
| `POST` | `/getCourseDetails` | Full course with sections + subsections |
| `POST` | `/getFullCourseDetails` | Full course details for an enrolled/authenticated user |
| `GET` | `/getInstructorCourses` | [Instructor] Own courses (paginated) |
| `GET` | `/searchCourses` | Full-text search with filters |
| `GET` | `/getFilterOptions` | Distinct categories/languages/levels for filter UI |
| `POST` | `/createCourse` / `PUT` `/editCourse` / `DELETE` `/deleteCourse` | [Instructor] Course CRUD |
| `POST` | `/addSection` `/updateSection` `/deleteSection` | [Instructor] Section CRUD |
| `POST` | `/addSubSection` `/updateSubSection` `/deleteSubSection` | [Instructor] Subsection CRUD (video + resources) |
| `POST` | `/updateCourseProgress` | [Student] Mark a subsection complete |
| `POST` | `/updateVideoTimestamp` / `GET` `/getVideoTimestamp` | [Student] Video resume timestamp |
| `POST` | `/createRating` / `GET` `/getReviews` / `GET` `/getAverageRating` / `DELETE` `/deleteReview` | Reviews (create: student, delete: admin) |
| `POST` | `/askQuestion` / `GET` `/getQuestions` / `POST` `/answerQuestion` | [Student] Q&A forum |
| `PUT` | `/upvoteQuestion` `/downvoteQuestion` | [Student] Vote on a question |
| `PUT` | `/resolveQuestion` | [Instructor] Mark a question resolved |
| `POST` | `/createCoupon` / `GET` `/getCourseCoupons` / `DELETE` `/deleteCoupon` / `PUT` `/toggleCoupon` | [Instructor] Coupon management |
| `POST` | `/applyCoupon` | [Student] Apply a coupon at checkout |
| `POST` | `/addNote` / `GET` `/getNotes` / `GET` `/getAllCourseNotes` / `PUT` `/editNote` / `DELETE` `/deleteNote` | [Student] Lecture notes |
| `POST` | `/createCategory` / `GET` `/showAllCategories` / `POST` `/getCategoryPageDetails` | Category management (create: admin) |
| `GET` | `/adminAnalytics` | [Admin] Platform-wide analytics |

### Payments &nbsp; `/api/v1/payment`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/capturePayment` | [Student] Create Razorpay order (duplicate-enroll guard) |
| `POST` | `/enrollFree` | [Student] Enroll directly in a free course, no payment |
| `POST` | `/verifyPayment` | [Student] Verify HMAC signature → atomic enrollment |
| `POST` | `/sendPaymentSuccessEmail` | [Student] Send payment receipt email |

### Profile &nbsp; `/api/v1/profile`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/getUserDetails` | My profile data |
| `PUT` | `/updateProfile` | Update bio, DOB, gender, contact |
| `PUT` | `/updateDisplayPicture` | Upload new profile picture to Cloudinary |
| `DELETE` | `/deleteProfile` | Delete account (cascades: profile, enrollments, progress) |
| `GET` | `/getEnrolledCourses` | My courses with progress % |
| `GET` | `/getCertificate/:courseId` | Certificate data (validates 100% completion) |
| `GET` | `/getWishlist` / `POST` `/addToWishlist` / `DELETE` `/removeFromWishlist` | Wishlist management |
| `GET` | `/instructorDashboard` | [Instructor] Own courses + stats |
| `GET` | `/instructorProfile/:instructorId` | Public instructor profile + stats |

### Notifications &nbsp; `/api/v1/notifications`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | My notifications |
| `PUT` | `/markRead` / `/markAllRead` | Mark notification(s) as read |

### Maintenance &nbsp; `/api/v1/maintenance`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/status` | Public — frontend polls this to show/hide the maintenance banner |
| `POST` | `/set` | [Admin] Toggle maintenance mode, set message + return time |
| `POST` | `/notify` | [Admin] Email all users about maintenance |

### Live Analytics &nbsp; `/api/v1/analytics`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/heartbeat` | Track an active visitor (works for guests too) |
| `POST` | `/pageview` | Track a page view |
| `GET` | `/live` | [Admin] Real-time visitor/page-view dashboard data |

### Contact &nbsp; `/api/v1/reach`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/contact` | Submit contact form, sends confirmation email |

---

## 🔬 Engineering Deep-Dives

### 1. Video Resume (per-subsection timestamp)
On every video `pause` event, the current timestamp is saved to MongoDB. When returning to the same subsection, the player fetches the saved timestamp and seeks to it. CourseProgress uses a compound index on `{courseID, userId}` for fast lookups.

### 2. Race-condition-safe Payment Enrollment
Before creating a Razorpay order, the backend re-fetches enrollment status from MongoDB. If already enrolled (duplicate tab / double-click), it rejects immediately. Enrollment across multiple purchased courses happens inside a single MongoDB transaction — all-or-nothing.

### 3. Paginated APIs with Smart UI
Major list endpoints return a `pagination` envelope (`totalPages`, `currentPage`, `limit`, total count). The frontend renders numbered page buttons — active page highlighted, Prev/Next disabled at boundaries.

### 4. Maintenance Mode with Auto-Expiry
The `Maintenance` model stores `{ isActive, message, returnAt, updatedBy }`. The frontend polls `/api/v1/maintenance/status` every 5 minutes; when active, non-admin users are auto-logged-out and shown a full-screen maintenance page, while admins see a persistent banner instead. Admins can also blast a broadcast email to all registered users in one call.

### 5. Completion Certificate
`GET /getCertificate/:courseId` validates server-side that the student has completed 100% of subsections before returning certificate data (name, course, instructor, date, lecture count). The React page renders a styled certificate layout and calls `window.print()` for browser-native export — no PDF library dependency.

### 6. Live Visitor Analytics
The frontend fires silent `heartbeat` and `pageview` calls in the background (via the `useTracker` hook) for every visitor, logged in or not. Admins get a real-time dashboard of active visitors and page views without any third-party analytics SaaS.

### 7. Lecture Q&A and Notes
Questions and timestamped notes are scoped per-course and per-subsection. Questions support nested answers (with an `isInstructorAnswer` flag), upvote/downvote arrays, and an instructor-only resolve toggle. Notes store a `videoTimestamp` so a student can jump straight back to the moment they wrote it.

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas free cluster
- Razorpay test account (free)
- Cloudinary free account
- An SMTP-capable email account (e.g. Gmail with an App Password)

### 1. Clone the repository
```bash
git clone https://github.com/Faizankhan17623/StudyNotionProject.git
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

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_app_password

# Cloudinary
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=studynotion

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
VITE_RAZORPAY_KEY=rzp_test_xxxxxxxxxxxx
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
| API Docs (Swagger) | http://localhost:4000/api-docs |

---

## 📦 Deployment Guide

| Layer | Platform | Notes |
|---|---|---|
| Frontend | **Vercel** | Auto-deploy on push; add `VITE_` env vars in dashboard |
| Backend | **Render** | Web Service, Node 18, add all `server/.env` vars in dashboard |
| Database | **MongoDB Atlas** | M0 free tier; whitelist `0.0.0.0/0` for Render's dynamic IPs |
| Media | **Cloudinary** | Uses folders for thumbnails, videos, and PDF resources |
| Email | **SMTP** | Gmail requires 2FA + App Password |

See [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) for the full step-by-step deployment walkthrough.

---

## 🛠 Tech Stack Summary

### Frontend
| Library | Version | Purpose |
|---|---|---|
| React | 18.2 | UI framework |
| Vite | 7.3 | Build tool + HMR dev server |
| Redux Toolkit | 1.9 | Global state (auth, cart, profile, course, wishlist, notification) |
| React Router DOM | 6.9 | Client-side routing + protected routes |
| Tailwind CSS | 3.4 | Utility-first styling |
| React Hook Form | 7.43 | Form handling + validation |
| Chart.js / react-chartjs-2 | 4.3 / 5.2 | Instructor & admin analytics charts |
| Swiper | 12.1 | Review carousel |
| video-react | 0.16 | Video player with timestamp API |
| Axios | 1.3 | HTTP client |
| react-markdown / showdown | — | Markdown rendering |
| @vercel/analytics, @vercel/speed-insights | — | Traffic and Core Web Vitals monitoring |

### Backend
| Library | Version | Purpose |
|---|---|---|
| Express.js | 4.18 | REST API framework |
| Mongoose | 7.0 | MongoDB ODM + schema validation |
| jsonwebtoken | 9.0 | Stateless JWT auth |
| bcrypt | 5.1 | Password hashing |
| Nodemailer | 9.0 | Transactional email |
| Razorpay SDK | 2.8 | Payment order creation + verification |
| Cloudinary SDK | 2.7 | Cloud media uploads |
| express-rate-limit | 8.2 | Route-level rate limiting |
| express-mongo-sanitize | 2.2 | NoSQL injection protection |
| express-fileupload | 1.4 | Multipart video/PDF/image upload handling |
| express-status-monitor | 1.3 | Live server health dashboard |
| express-useragent / morgan | — | Request parsing / logging |
| swagger-jsdoc / swagger-ui-express | 6.2 / 5.0 | OpenAPI spec generated from JSDoc, served at `/api-docs` |
| node-schedule | 2.1 | Cron-style maintenance auto-expiry |
| otp-generator | 4.0 | Signup OTP generation |

---

## 👨‍💻 Author

**Faizan Khan** — [Faizankhan17623](https://github.com/Faizankhan17623)

---

<div align="center">

⭐ **If this project helped you, consider giving it a star!** ⭐

*Built with ❤️ using the MERN stack*

</div>
