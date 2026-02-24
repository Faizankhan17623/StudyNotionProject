# StudyNotion – Deployment Guide
> This file tells you **exactly what to change** when you deploy the project online.
> After deployment you will get two URLs — one for the **frontend** and one for the **backend**.
> Replace every placeholder shown below with your real URLs.

---

## Quick Summary of URLs You Will Get

| Service | Platform | URL format you get (example) |
|---|---|---|
| Frontend | Vercel | `https://studynotion-frontend.vercel.app` |
| Backend  | Render / Railway | `https://studynotion-backend.onrender.com` |

---

## PART 1 — FRONTEND CHANGES

### File: `.env` (create this file in the root of the project — same folder as `package.json`)

```env
# ✅ Change this to your deployed backend URL after deploying the backend
VITE_APP_BASE_URL=https://studynotion-backend.onrender.com/api/v1

# ❌ DO NOT change anything else on the frontend side
```

**During local development use:**
```env
VITE_APP_BASE_URL=http://localhost:4000/api/v1
```

---

### File: `index.html` (SEO — update canonical & og:url)

After you know your final frontend URL, search for these 3 lines and replace the URL:

```html
<!-- Line to find and update -->
<link rel="canonical" href="https://studynotion-frontend.vercel.app/" />
<meta property="og:url" content="https://studynotion-frontend.vercel.app/" />
<meta property="og:image" content="https://studynotion-frontend.vercel.app/og-banner.png" />
```

Replace `https://studynotion-frontend.vercel.app` with your actual Vercel URL.

---

### File: `src/vercel.json` (already correct — DO NOT touch)

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```
This ensures React Router works properly on Vercel. Leave it as-is.

---

## PART 2 — BACKEND CHANGES

### File: `server/.env` (create or update this file inside the `server/` folder)

```env
# ─── DATABASE ─────────────────────────────────────────────
# ✅ Keep your existing MongoDB Atlas URL — it works from the cloud too
MONGODB_URL=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/StudyNotion

# ─── FRONTEND URL ─────────────────────────────────────────
# ✅ CHANGE THIS — set it to your deployed frontend Vercel URL
FRONTEND_URL=https://studynotion-frontend.vercel.app

# ─── SERVER PORT ──────────────────────────────────────────
# ✅ Keep as-is. Render/Railway will override this automatically
PORT=4000

# ─── JWT ──────────────────────────────────────────────────
# ❌ DO NOT change — keep your existing secret
JWT_SECRET=your_jwt_secret_here
TOKEN_NAME=your_token_name_here

# ─── CLOUDINARY ───────────────────────────────────────────
# ❌ DO NOT change — these work from anywhere in the world
CLOUD_NAME=your_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FOLDER_NAME=StudyNotion

# ─── EMAIL (SMTP) ─────────────────────────────────────────
# ❌ DO NOT change — Gmail SMTP works from anywhere
MAIL_HOST=smtp.gmail.com
MAIL_USER=your_email@gmail.com
MAIL_PASS=your_gmail_app_password

# ─── RAZORPAY ─────────────────────────────────────────────
# ❌ DO NOT change — Razorpay keys work from anywhere
RAZORPAY_KEY=rzp_test_xxxxxxxxxx
RAZORPAY_SECRET=your_razorpay_secret
```

### What to change vs what to keep (BACKEND)

| Variable | Change? | Reason |
|---|---|---|
| `MONGODB_URL` | ❌ Keep | MongoDB Atlas is already cloud-hosted |
| `FRONTEND_URL` | ✅ **CHANGE** | Must point to your Vercel frontend URL |
| `PORT` | ❌ Keep | Render/Railway auto-assigns port |
| `JWT_SECRET` | ❌ Keep | Same secret is fine |
| `CLOUD_NAME` / `API_KEY` / `API_SECRET` | ❌ Keep | Cloudinary is cloud-based |
| `MAIL_HOST` / `MAIL_USER` / `MAIL_PASS` | ❌ Keep | Gmail works from anywhere |
| `RAZORPAY_KEY` / `RAZORPAY_SECRET` | ❌ Keep | Razorpay works from anywhere |

---

### File: `server/index.js` — CORS (update after knowing frontend URL)

Currently the backend allows all origins (`"*"`). This is fine for testing.
For production, change it to only allow your frontend:

```js
// CURRENT (allows everyone — ok for testing):
app.use(cors({ origin: "*", credentials: true }));

// PRODUCTION (replace with your actual Vercel URL):
app.use(cors({
  origin: "https://studynotion-frontend.vercel.app",
  credentials: true,
}));
```

---

## PART 3 — STEP-BY-STEP DEPLOYMENT (No Custom Domain Needed)

You will host for **free** on these platforms:
- **Frontend** → [Vercel](https://vercel.com) (free tier)
- **Backend** → [Render](https://render.com) (free tier) or [Railway](https://railway.app)

---

### STEP 1 — Deploy the Backend on Render

1. Go to [render.com](https://render.com) → Sign up / Log in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Connect your GitHub repo → select `StudyNotionProject`
4. Fill in the settings:
   - **Name:** `studynotion-backend`
   - **Root Directory:** `server`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
5. Scroll down to **"Environment Variables"** → add all your `.env` variables one by one
6. Click **"Create Web Service"**
7. Wait 2-3 minutes → you will get a URL like:
   ```
   https://studynotion-backend.onrender.com
   ```
8. **Copy this URL** — you will need it for the frontend

> **Free Tier Note:** Render's free tier spins down after 15 minutes of inactivity. First request after sleep takes ~30 seconds. Upgrade to paid ($7/month) to avoid this.

---

### STEP 2 — Deploy the Frontend on Vercel

1. Go to [vercel.com](https://vercel.com) → Sign up / Log in with GitHub
2. Click **"New Project"** → import your GitHub repo
3. Fill in settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `.` (leave blank / project root)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Go to **"Environment Variables"** section → add:
   ```
   Name:  VITE_APP_BASE_URL
   Value: https://studynotion-backend.onrender.com/api/v1
   ```
5. Click **"Deploy"**
6. Wait 1-2 minutes → you will get a URL like:
   ```
   https://studynotion-frontend.vercel.app
   ```

---

### STEP 3 — Go Back and Update FRONTEND_URL on Render

1. Go to your Render dashboard → select your backend service
2. Click **"Environment"** tab
3. Update:
   ```
   FRONTEND_URL = https://studynotion-frontend.vercel.app
   ```
4. Save → Render will auto-redeploy

---

### STEP 4 — Update SEO URLs in index.html

Open `index.html` and replace all occurrences of `https://studynotion-frontend.vercel.app` with your actual Vercel URL (it may be different if you named your project differently).

---

### STEP 5 — Test Everything

After deployment, test these flows:
- [ ] Home page loads
- [ ] Sign up / Login works
- [ ] OTP email arrives
- [ ] Course listing shows
- [ ] Payment flow works (Razorpay test mode)
- [ ] Image upload works (Cloudinary)

---

## How Will People Find My Site Without a Custom Domain?

Your site will be **publicly accessible on the internet** to anyone — no domain purchase needed.

| What you get | URL |
|---|---|
| Frontend (Vercel) | `https://studynotion-frontend.vercel.app` |
| Backend (Render) | `https://studynotion-backend.onrender.com` |

**Anyone in the world can open your frontend URL in their browser and use your app.**

The Vercel URL ends in `.vercel.app` and Render URL ends in `.onrender.com` — these are real internet URLs, not localhost.

### To share your site:
- Share the Vercel link: `https://studynotion-frontend.vercel.app`
- Add it to your resume / portfolio
- Share on LinkedIn / GitHub

### To get a custom domain later (optional):
1. Buy a domain on [Namecheap](https://namecheap.com) (~$10/year) or [GoDaddy](https://godaddy.com)
2. In Vercel → Settings → Domains → Add your domain
3. Point your domain's DNS to Vercel (Vercel gives you exact instructions)

---

## Environment Variable Checklist

### Frontend `.env` (root folder)
- [ ] `VITE_APP_BASE_URL` → backend Render URL + `/api/v1`

### Backend `server/.env`
- [ ] `FRONTEND_URL` → frontend Vercel URL
- [ ] `MONGODB_URL` → same as local (MongoDB Atlas)
- [ ] `JWT_SECRET` → same as local
- [ ] `CLOUD_NAME`, `API_KEY`, `API_SECRET` → same as local
- [ ] `MAIL_HOST`, `MAIL_USER`, `MAIL_PASS` → same as local
- [ ] `RAZORPAY_KEY`, `RAZORPAY_SECRET` → same as local

---

*Last updated: 2026-02-24*
