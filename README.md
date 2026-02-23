# StudyNotion Edtech Project



      313 +# StudyNotion — Full Session Work Log
      314 +**Project:** `D:/StudyNotionProject`
      315 +**Date:** 2026-02-23
      316 +**Stack:** React + Vite + Redux | Node.js + Express + MongoDB | Razorpay | Tailwind CSS
      317 +
      318 +---
      319 +
      320 +## 1. Backend Console.log Cleanup
      321 +Commented out all debug `console.log` statements across the entire backend (kept `console.error` for r
          +eal errors). Files cleaned:
      322 +- `server/controllers/Course.js`, `payments.js`, `Category.js`, `ContactUs.js`, `Subsection.js`, `Sect
          +ion.js`, `profile.js`
      323 +- `server/middleware/auth.js` — was logging full JWT payload on every request
      324 +- `server/utils/mailSender.js`, `imageUploader.js`
      325 +- `server/models/OTP.js`
      326 +
      327 +---
      328 +
      329 +## 2. Navbar & Category Fixes
      330 +
      331 +### Problem: Navbar dropdown was empty, catalog not showing
      332 +**Root cause:** `process.env.REACT_APP_BASE_URL` is `undefined` in Vite — Vite only reads `import.meta
          +.env.VITE_*` vars.
      333 +
      334 +**Files changed:**
      335 +| File | Change |
      336 +|------|--------|
      337 +| `D:/StudyNotionProject/.env` | Renamed `REACT_APP_BASE_URL` → `VITE_APP_BASE_URL` |
      338 +| `src/services/apis.js` | Changed to `import.meta.env.VITE_APP_BASE_URL` |
      339 +| `vite.config.js` | Removed broken `loadEnv`+`process.env` defines; kept only `global: 'globalThis'`
          +|
      340 +| `src/components/Common/Navbar.jsx` | Removed `courses.length > 0` filter that was hiding categories
          +|
      341 +
      342 +### Problem: Catalog page crashed when only 1 category exists
      343 +**Root cause:** Backend tried `categoriesExceptSelected[index]._id` when array was empty.
      344 +**Fix:** Added null guard in `server/controllers/Category.js` — `differentCategory` set to null if no
          +other categories exist. Frontend wrapped Section 2 in a conditional.
      345 +
      346 +---
      347 +
      348 +## 3. Razorpay Payment Fix
      349 +
      350 +### Problem: "Could not initiate order" error
      351 +**Three causes found and fixed:**
      352 +1. `receipt: Math.random(Date.now()).toString()` → produces `"0.6789"` — the dot is not allowed → Fixe
          +d to `receipt_${Date.now()}`
      353 +2. `server/.env` had `KEY = "value"` format (spaces + quotes) causing dotenv misparse → Cleaned to `KE
          +Y=value`
      354 +3. Frontend and backend were using different Razorpay key_ids → Synced both to use `rzp_test_iGM75HL9k
          +1D76I`
      355 +
      356 +---
      357 +
      358 +## 4. FEATURE-1: Course Search and Filter ✅ (already done in prev session)
      359 +Marked as done in `STUDYNOTION_FEATURES.md` with implementation notes:
      360 +- Text index on Course model
      361 +- `GET /api/v1/course/searchCourses` endpoint with `q`, `category`, `priceType`, `minRating`, `sortBy`
      362 +- Search icon in Navbar, `/search` route, `SearchResults.jsx` page with filter sidebar
      363 +
      364 +---
      365 +
      366 +## 5. FEATURE-3: Rate Limiting ✅
      367 +- `express-rate-limit` v8 was already installed
      368 +- `authLimiter` (5 req/15 min) applied to: `/login`, `/signup`, `/reset-password`
      369 +- `emailLimiter` (3 req/15 min) — new, stricter — applied to: `/sendotp`, `/reset-password-token`
      370 +
      371 +---
      372 +
      373 +## 6. FEATURE-6: Student Wishlist ✅
      374 +**Backend:**
      375 +- `wishlist` field added to `server/models/User.js`
      376 +- `addToWishlist`, `removeFromWishlist`, `getWishlist` controllers in `server/controllers/profile.js`
      377 +- 3 routes in `server/routes/profile.js` (auth + isStudent)
      378 +
      379 +**Frontend:**
      380 +- `src/slices/wishlistSlice.js` — new Redux slice
      381 +- `src/reducer/index.js` — registered wishlistReducer
      382 +- `src/services/operations/profileAPI.js` — API calls + seeds wishlist on login
      383 +- `src/components/core/Catalog/Course_Card.jsx` — heart icon (filled/outline) with optimistic update
      384 +- `src/pages/Wishlist.jsx` — student dashboard wishlist page
      385 +- Route + sidebar link added
      386 +
      387 +---
      388 +
      389 +## 7. FEATURE-11: OTP Resend Cooldown UI ✅
      390 +- `src/pages/VerifyEmail.jsx` — 60-second countdown `useEffect`, "Resend in 42s" button disabled durin
          +g countdown
      391 +
      392 +---
      393 +
      394 +## 8. FEATURE-12: Course Reviews Moderation ✅
      395 +**Backend:**
      396 +- `deleteReview` controller in `server/controllers/RatingandReview.js`
      397 +- `DELETE /course/deleteReview` (auth + isAdmin) in `server/routes/Course.js`
      398 +
      399 +**Frontend:**
      400 +- `src/components/core/Dashboard/Admin/ReviewModeration.jsx` — lists all reviews, delete button
      401 +- Route + admin sidebar link added
      402 +
      403 +---
      404 +
      405 +## 9. FEATURE-21: Email Templates Redesign ✅
      406 +Redesigned all 6 templates in `server/mail/templates/` with modern dark-themed HTML:
      407 +- **Design:** Dark bg (`#161D29`), yellow accent (`#FFD60A`), table-based layout (email-client safe)
      408 +- **Templates upgraded:** `emailVerificationTemplate.js`, `courseEnrollmentEmail.js`, `paymentSuccessE
          +mail.js`, `passwordUpdate.js`, `loginTemplate.js`, `contactFormRes.js`
      409 +- Support email updated: `faizankhan901152@gmail.com` → `info@studynotion.com` across all templates
      410 +- Each template has a unique icon, info card layout, branded CTA button
      411 +
      412 +---
      413 +
      414 +## 10. FEATURE-22: Maintenance Mode ✅
      415 +
      416 +### Backend (new files):
      417 +| File | Description |
      418 +|------|-------------|
      419 +| `server/models/Maintenance.js` | Mongoose model: `isActive`, `message`, `returnAt`, `updatedBy` |
      420 +| `server/controllers/Maintenance.js` | `getMaintenanceStatus` (public) · `setMaintenance` (admin) · `
          +sendMaintenanceNotification` (bulk email to all users) |
      421 +| `server/routes/Maintenance.js` | `GET /status` · `POST /set` · `POST /notify` |
      422 +| `server/mail/templates/maintenanceNotification.js` | Branded dark-theme HTML email with optional ret
          +urn date |
      423 +
      424 +### Frontend (new files):
      425 +| File | Description |
      426 +|------|-------------|
      427 +| `src/components/Common/MaintenanceBanner.jsx` | Yellow banner shown site-wide when maintenance is ac
          +tive; polls status every 5 min |
      428 +| `src/components/core/Dashboard/Admin/MaintenanceMode.jsx` | Admin panel — toggle on/off, set message
          + + return date, send bulk email notification |
      429 +
      430 +### Wired up:
      431 +- `server/index.js` — registered `/api/v1/maintenance` routes
      432 +- `src/services/apis.js` — added `maintenanceEndpoints`
      433 +- `src/App.jsx` — `<MaintenanceBanner />` above Navbar, `dashboard/maintenance` route (AdminRoute)
      434 +- `src/data/dashboard-links.js` — "Maintenance" link added for admin (`VscTools` icon)
      435 +
      436 +---
      437 +
      438 +## Summary — Features Added Today
      439 +
      440 +| # | Feature | Status |
      441 +|---|---------|--------|
      442 +| 1 | Backend console.log cleanup | ✅ Done |
      443 +| 2 | Navbar / Catalog fix | ✅ Done |
      444 +| 3 | Razorpay payment fix | ✅ Done |
      445 +| 4 | Rate Limiting (FEATURE-3) | ✅ Done |
      446 +| 5 | Student Wishlist (FEATURE-6) | ✅ Done |
      447 +| 6 | OTP Resend Cooldown (FEATURE-11) | ✅ Done |
      448 +| 7 | Reviews Moderation (FEATURE-12) | ✅ Done |
      449 +| 8 | Email Templates Redesign (FEATURE-21) | ✅ Done |
      450 +| 9 | Maintenance Mode (FEATURE-22) | ✅ Done |
      451 +
      452 +---
      453 +
      454 +## Signing Off
      455 +Session ended: **2026-02-23**
      456 +A very productive session — 9 features/fixes shipped across the full stack.
      457 +Backend rate limiting, wishlist, reviews moderation, payment fixes, and a full maintenance mode system
          + with bulk email notifications were all built from scratch.
      458 +All email templates were upgraded from plain white HTML to a modern dark-themed design.
      459 +
      460 +**Next priorities for StudyNotion:**
      461 +- FEATURE-2: Course Completion Certificate (PDF via puppeteer)
      462 +- FEATURE-4: Admin Analytics Dashboard (Chart.js + MongoDB aggregation)
      463 +- FEATURE-5: Free Course Preview (instructor marks first video free)
      464 +- FEATURE-7: Instructor Application & Approval Flow