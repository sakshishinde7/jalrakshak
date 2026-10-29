# JALRAKSHAK — Cross-Platform Cloud Hosting Guide

This guide details how to host JALRAKSHAK publicly across cloud platforms. You do not need to run the application on `localhost`.

---

## Supported Hosting Platforms Matrix

| Component | Primary Cloud Option | Supported Alternatives | Config Included |
|---|---|---|---|
| **Database** | Render PostgreSQL | Supabase, Neon, AWS RDS, Docker Postgres | Automatic in `render.yaml` & `docker-compose.yml` |
| **Backend API** | Render Web Service | Railway, Fly.io, Cloud Run, Any VPS | `backend/Dockerfile`, `render.yaml`, `backend/Procfile`, `railway.toml` |
| **Frontend Web** | Vercel | Render Static Site, Netlify, Any Nginx server | `vercel.json`, `frontend/netlify.toml`, `frontend/Dockerfile` |
| **Full Stack (All-in-One)** | Render Blueprint (1-Click) | Docker Compose (1-Command on VPS) | `render.yaml`, `docker-compose.yml` |

---

## Option 1: 1-Click Full Stack on Render (Simplest)

The repository includes a `render.yaml` Infrastructure-as-Code Blueprint that provisions the **Database**, **FastAPI Backend**, and **React Frontend** in a single step with zero manual environment wiring.

1. Create a free account at [Render.com](https://render.com).
2. Push your project to GitHub (or GitLab).
3. In Render Dashboard, click **Blueprints** → **New Blueprint Instance**.
4. Select your GitHub repository.
5. Render will automatically read `render.yaml` and display:
   - **Database**: `jalrakshak-db` (PostgreSQL)
   - **Web Service**: `jalrakshak-api` (FastAPI)
   - **Static Site**: `jalrakshak-frontend` (React + Vite)
6. Click **Apply**.
7. Render will automatically:
   - Provision the PostgreSQL database.
   - Inject the internal `DATABASE_URL` into the backend.
   - Build and start the backend on port 8000.
   - Inject the backend API URL into the frontend build.
   - Deploy both with live HTTPS URLs!

---

## Option 2: Frontend on Vercel + Backend on Render (Separated Architecture)

This is the standard production architecture separating static edge CDN from the API.

### Step 1: Deploy Database on Render
1. In [Render Dashboard](https://dashboard.render.com), click **New +** → **PostgreSQL**.
2. Name: `jalrakshak-db`, Database: `jalrakshak`, User: `jalrakshak_user`.
3. Choose the **Free tier** and click **Create Database**.
4. Copy the **Internal Database URL** (e.g. `postgres://jalrakshak_user:...@dpg-...:5432/jalrakshak`).

### Step 2: Deploy Backend on Render
1. Click **New +** → **Web Service** → Connect your GitHub repo.
2. Fill in:
   - **Name**: `jalrakshak-api`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
3. Add Environment Variables:
   - `DATABASE_URL` = *(Your copied Render PostgreSQL URL)*
   - `FRONTEND_ORIGIN` = `*` (or your Vercel URL once known)
   - `PORT` = `8000`
4. Click **Create Web Service**.
5. Once live, copy your backend URL: e.g. `https://jalrakshak-api.onrender.com`.
6. Confirm health by opening in browser: `https://jalrakshak-api.onrender.com/api/health`.

### Step 3: Deploy Frontend on Vercel
1. Go to [Vercel Dashboard](https://vercel.com) → **Add New...** → **Project**.
2. Import your GitHub repository.
3. Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` (or leave root since `vercel.json` is at the root)
4. Environment Variables:
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://jalrakshak-api.onrender.com` *(your actual Render backend URL without trailing slash)*
5. Click **Deploy**.
6. Vercel will build and give you a public URL: e.g. `https://jalrakshak.vercel.app`.

---

## Option 3: Deploy Anywhere with Docker Compose (VPS / AWS / DigitalOcean / GCP)

If you have a Linux VPS (Ubuntu, Debian, CentOS) on DigitalOcean, AWS EC2, Linode, Hetzner, or Google Cloud Compute:

1. SSH into your server:
   ```bash
   ssh root@your-server-ip
   ```
2. Clone your repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/jalrakshak.git
   cd jalrakshak
   ```
3. Run with Docker Compose:
   ```bash
   docker compose up -d --build
   ```
4. This starts:
   - `jalrakshak_db`: Managed PostgreSQL on port 5432.
   - `jalrakshak_api`: FastAPI backend on port 8000.
   - `jalrakshak_web`: Production Nginx serving the React SPA on port 80.
5. Open `http://your-server-ip` in any web browser!

---

## Option 4: Deploy on Railway (1-Click Git Deploy)

1. Sign in to [Railway.app](https://railway.app).
2. Click **New Project** → **Provision PostgreSQL**.
3. In the same project, click **New** → **GitHub Repo** → select `jalrakshak`.
4. Railway will automatically detect the Python backend or Dockerfile.
5. In the backend service settings:
   - Set Root Directory to `backend`.
   - Add reference variable: `DATABASE_URL` → select the provisioned PostgreSQL database.
6. Deploy the frontend as a static service pointing `VITE_API_BASE_URL` to Railway's generated backend domain.

---

## Option 5: Frontend on Netlify

1. Go to [Netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**.
2. Select your repository.
3. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
4. Add environment variable:
   - `VITE_API_BASE_URL` = `https://your-backend-url.onrender.com`
5. Click **Deploy Site**. The included `frontend/netlify.toml` and `_redirects` ensure SPA routing works without 404s.

---

## Troubleshooting Cloud Deployments

### 1. Database Connection Schemes
SQLAlchemy 2.x requires the driver prefix `postgresql+psycopg2://`. The backend configuration in `backend/app/config.py` automatically rewrites any incoming `postgres://` or `postgresql://` string provided by Render/Railway into the required format.

### 2. CORS Preflight Blocks
If your browser console shows a CORS error:
1. Verify that `FRONTEND_ORIGIN` on your backend matches the frontend domain (e.g. `https://jalrakshak.vercel.app`).
2. You can also specify comma-separated origins: `https://jalrakshak.vercel.app,https://jalrakshak.netlify.app`.
3. The backend also allows setting `FRONTEND_ORIGIN=*` for wide-open access during demonstrations.

### 3. SPA Route Refreshing (404 on /reports or /dashboard)
When users refresh a URL directly like `https://yoursite.com/reports`:
- On **Vercel**: handled by `vercel.json` rewrites.
- On **Netlify**: handled by `netlify.toml` and `_redirects`.
- On **Nginx / Docker**: handled by `try_files $uri $uri/ /index.html;` in `frontend/nginx.conf`.
- On **Render Static Sites**: handled by `render.yaml` rewrite routes.

