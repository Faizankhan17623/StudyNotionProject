# StudyNotion — Resume Project Descriptions

---

## OPTION 1 — STANDARD RESUME (use this one, works for 90% of resumes)

**StudyNotion — Full-Stack EdTech Platform**
`React` `Node.js` `MongoDB` `Express` `Redux Toolkit` `Tailwind CSS` `Razorpay` `Cloudinary`
[Live Demo](https://study-notion-project-swart.vercel.app)

- Engineered a full-stack online learning platform from scratch with three independent role-based experiences — Student, Instructor, and Admin — each with dedicated dashboards, protected routes, and JWT-based authentication
- Integrated Razorpay payment gateway with server-side HMAC signature verification and atomic MongoDB operations, eliminating double-enrollment bugs caused by simultaneous payment requests
- Built a smart video learning experience with per-lecture timestamp persistence, automatic playback resumption, real-time progress tracking, and server-validated course completion certificates
- Designed full-text course search using compound MongoDB text indexes, paginated REST APIs to avoid full-table scans, and instructor analytics dashboards powered by Chart.js
- Secured the platform with OTP-based email verification (TTL auto-expiry), bcrypt password hashing, and express-rate-limit on sensitive routes to block brute-force attacks
- Deployed across Vercel, Render, MongoDB Atlas, and Cloudinary — with auto-generated Swagger/OpenAPI 3.0 interactive API documentation

---

## OPTION 2 — PUNCHY VERSION (if you want fewer bullets, more impact)

**StudyNotion — Full-Stack EdTech Platform**
`React` `Node.js` `MongoDB` `Express` `Redux Toolkit` `Razorpay` `Cloudinary`
[Live](https://study-notion-project-swart.vercel.app)

- Built a production-deployed online learning marketplace with role-based access for Students, Instructors, and Admins — complete with JWT auth, OTP verification, and route-level brute-force protection
- Implemented Razorpay checkout with HMAC payment verification and atomic MongoDB enrollment to handle race conditions; added per-lecture video resumption and auto-generated completion certificates
- Delivered full-text course search, paginated APIs, Chart.js instructor dashboards, Cloudinary media uploads, and 6 transactional email templates — deployed live on Vercel + Render + MongoDB Atlas

---

## OPTION 3 — SENIOR / DETAILED VERSION (for companies that care about depth)

**StudyNotion — Full-Stack EdTech Platform**
`React 18` `Vite` `Node.js` `Express.js` `MongoDB Atlas` `Redux Toolkit` `Tailwind CSS`
[Live Demo](https://study-notion-project-swart.vercel.app) | [API Docs](https://studynotion-backend.onrender.com/api/docs)

- Architected a full-stack EdTech marketplace supporting three distinct user roles (Student, Instructor, Admin) with middleware-based access control, JWT authentication, and protected client-side routing using React Router v6
- Implemented Razorpay payment integration with server-side HMAC verification; used MongoDB's `$addToSet` atomic operator to guarantee race-condition-safe enrollment under concurrent payment requests
- Engineered a hierarchical course builder (Course → Sections → Subsections) with Cloudinary-backed video/PDF uploads, draft-to-publish workflow, and real-time course preview for instructors
- Built per-subsection video timestamp persistence using debounced pause events — automatically resuming playback from the last saved position; completion certificates generated server-side after validating 100% course progress
- Designed paginated REST APIs across all list endpoints to prevent full-table scans; implemented compound MongoDB text indexes on course name, description, and tags for efficient full-text search with category and price-range filtering
- Secured auth flows with OTP email verification (MongoDB TTL index, 5-minute auto-expiry), bcrypt password hashing, and express-rate-limit (5 req / 15 min) on auth and OTP routes
- Built platform maintenance mode with node-schedule cron jobs for auto-unlock, bulk email alerts to all users, and a real-time frontend maintenance gate
- Deployed frontend on Vercel and backend on Render; auto-generated Swagger/OpenAPI 3.0 interactive API documentation from JSDoc comments across 43 REST endpoints

---

## ONE-LINER (for LinkedIn headline or portfolio tagline)

Built StudyNotion — a production-deployed full-stack EdTech platform with Razorpay payments, role-based dashboards, real-time video progress, and cloud media storage across a MERN stack architecture.

---

## TECH STACK (paste next to the project title on your resume)

**Frontend:** React 18, Vite, Redux Toolkit, React Router v6, Tailwind CSS, Chart.js, Axios, React Hook Form
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Razorpay, Cloudinary, Nodemailer, Swagger
**Infrastructure:** Vercel · Render · MongoDB Atlas · Cloudinary · Gmail SMTP
