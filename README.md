# JALRAKSHAK (जल रक्षक)
> *"Every Drop Matters. Every Action Counts."*

A community-centered web platform that empowers citizens to report water-related issues (pollution, contamination, waste, leaks), organizes records in a central database, and tracks resolution status transparently.

---

> **PROTOTYPE NOTICE:**  
> JALRAKSHAK is an early-stage prototype demonstrating a community-centered approach to identifying and tracking water-related concerns. Future versions may expand to include geographic visualization, verified water-quality information, and collaboration with relevant organizations.  
> *This prototype is not an official government monitoring service, regulatory agency, or emergency reporting system.*

---

## Architecture & Cross-Platform Cloud Hosting Overview

```
User / Evaluator Browser
       │
       ▼ HTTPS Requests
Production Frontend (Vercel / Netlify / Render Static / Docker Nginx)
       │
       ▼ HTTPS API Requests (VITE_API_BASE_URL)
Cloud Backend (Render / Railway / Fly.io / Docker Container)
       │
       ▼ Managed Database Connection (DATABASE_URL)
Cloud PostgreSQL Database (Render / Neon / Supabase / Docker Postgres)
```

- **Frontend**: React 18, Vite, JavaScript, CSS Variables, React Router v6.
- **Backend**: Python 3.10+, FastAPI, SQLAlchemy 2.x, Pydantic v2, Psycopg2.
- **Database**: PostgreSQL (with automated scheme normalization & connection pooling).
- **Hosting Options Configured Out of the Box**:
  - **Render 1-Click Full Stack Blueprint**: Automatically provisions DB, Backend, and Frontend via `render.yaml`.
  - **Vercel + Render**: Frontend on Vercel CDN (`vercel.json`), Backend & PostgreSQL on Render.
  - **Docker Compose Anywhere**: Deploy whole stack on any VPS/cloud server via `docker-compose.yml`.
  - **Railway / Netlify / Fly.io**: Dedicated configs (`railway.toml`, `backend/Procfile`, `frontend/netlify.toml`, `backend/fly.toml`).

> 📖 **Full cross-platform cloud hosting steps are detailed in [`DEPLOYMENT.md`](./DEPLOYMENT.md).**

---

## Project Structure

```
JALRAKSHAK/
├── frontend/
│   ├── public/
│   │   └── favicon.svg           # Water-drop favicon
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── EmptyState.jsx / .css
│   │   │   ├── Footer.jsx / .css
│   │   │   ├── Loader.jsx / .css
│   │   │   ├── Navbar.jsx / .css
│   │   │   ├── ReportCard.jsx / .css
│   │   │   ├── StatCard.jsx / .css
│   │   │   ├── StatusBadge.jsx / .css
│   │   │   └── WaveDecoration.jsx / .css
│   │   ├── pages/                # Website pages
│   │   │   ├── About.jsx / .css
│   │   │   ├── Dashboard.jsx / .css
│   │   │   ├── ExploreReports.jsx / .css
│   │   │   ├── Home.jsx / .css
│   │   │   ├── NotFound.jsx / .css
│   │   │   ├── ReportDetails.jsx / .css
│   │   │   └── ReportIssue.jsx / .css
│   │   ├── services/
│   │   │   └── api.js            # Central API service client
│   │   ├── App.jsx / .css        # Route definitions and layout shell
│   │   ├── index.css             # Theme variables, resets, button styles
│   │   └── main.jsx              # React root entry
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── vercel.json               # SPA client-side route rewrites
│   └── .env.example
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── config.py             # Settings & database URL normalizer
│   │   ├── database.py           # SQLAlchemy engine & session factory
│   │   ├── models.py             # WaterReport ORM model with indexes
│   │   ├── routes.py             # FastAPI REST endpoints
│   │   ├── schemas.py            # Pydantic validation schemas
│   │   ├── utils.py              # Unique report code generator
│   │   └── main.py               # FastAPI app, CORS, lifespan startup
│   ├── requirements.txt
│   └── .env.example
├── .gitignore
└── README.md
```

---

## Local Development Setup

### 1. Prerequisites
- **Node.js** (v18 or newer) and **npm**
- **Python** (v3.10 or newer) and **pip**
- A running **PostgreSQL** instance (local, or a free Render PostgreSQL database URL)

---

### 2. Backend Setup

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment:
   - **Windows:**
     ```powershell
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **macOS / Linux:**
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create your local environment file:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/jalrakshak
   FRONTEND_ORIGIN=http://localhost:5173
   PORT=8000
   ```

5. Start the FastAPI development server:
   ```bash
   uvicorn app.main:app --reload --port 8000
   ```
   Tables (`water_reports`) are created automatically on startup.
   - Interactive Swagger API docs: [http://localhost:8000/docs](http://localhost:8000/docs)
   - Health check: [http://localhost:8000/api/health](http://localhost:8000/api/health)

---

### 3. Frontend Setup

1. Open a second terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment configuration file:
   ```bash
   cp .env.example .env
   ```
   Ensure `.env` contains:
   ```env
   VITE_API_BASE_URL=http://localhost:8000
   ```

4. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Open your browser to: [http://localhost:5173](http://localhost:5173)

---

## Production Deployment Guide

### Phase 1: Deploy PostgreSQL Database on Render

1. Sign in to your [Render Dashboard](https://dashboard.render.com).
2. Click **New +** → **PostgreSQL**.
3. Fill in:
   - **Name**: `jalrakshak-db`
   - **Database**: `jalrakshak`
   - **User**: `jalrakshak_user`
   - **Region**: Choose closest to you (e.g., Singapore, Frankfurt, or Oregon).
   - **Plan**: Select the free tier (or smallest available instance).
4. Click **Create Database**.
5. Once provisioned, find the **Connections** section:
   - Copy the **Internal Database URL** (if deploying backend on Render in the same region) or **External Database URL** (begins with `postgres://...` or `postgresql://...`).

---

### Phase 2: Deploy Backend Web Service on Render

1. In Render Dashboard, click **New +** → **Web Service**.
2. Connect your Git repository.
3. Configure the service settings:
   - **Name**: `jalrakshak-api`
   - **Root Directory**: `backend`
   - **Environment**: `Python 3`
   - **Region**: Same region as your database.
   - **Branch**: `main`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:
   - `DATABASE_URL`: Paste the PostgreSQL URL from Phase 1.
   - `FRONTEND_ORIGIN`: Initially set to `http://localhost:5173` (you will update this with your Vercel URL in Phase 4).
   - `PORT`: `8000` (Render also sets this automatically).
5. Click **Create Web Service**.
6. Wait for the deploy to complete. Once deployed, note down your Render service URL (e.g., `https://jalrakshak-api.onrender.com`).
7. Test the health endpoint in your browser:
   `https://jalrakshak-api.onrender.com/api/health` → should return `{"status":"healthy","database":"connected"}`.

---

### Phase 3: Deploy Frontend on Vercel

1. Sign in to your [Vercel Dashboard](https://vercel.com).
2. Click **Add New...** → **Project**.
3. Import your Git repository.
4. In the Project Configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click *Edit* and select `frontend`.
   - **Build Command**: `npm run build` (or leave default).
   - **Output Directory**: `dist` (default).
5. Under **Environment Variables**:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://jalrakshak-api.onrender.com` *(use your actual Render backend URL without trailing slash)*
6. Click **Deploy**.
7. Once deployed, copy your production Vercel domain (e.g., `https://jalrakshak.vercel.app`).

---

### Phase 4: Connect Services (Lock Down CORS)

1. Return to your [Render Dashboard](https://dashboard.render.com).
2. Go to your `jalrakshak-api` Web Service → **Environment**.
3. Edit `FRONTEND_ORIGIN` and change it to your actual Vercel origin:
   ```env
   FRONTEND_ORIGIN=https://jalrakshak.vercel.app
   ```
   *(If you also test locally, you can pass comma-separated origins: `https://jalrakshak.vercel.app,http://localhost:5173`)*
4. Save Changes. Render will automatically redeploy the backend with the new CORS origin.

---

## How to Extend and Maintain

### 1. How to Change Website Colors
All colors are centralized in `frontend/src/index.css` under the `:root` pseudo-class:
```css
:root {
  --deep-navy: #153746;       /* Primary headers and deep accents */
  --primary-blue: #247BA0;    /* Main brand color & primary buttons */
  --muted-teal: #5A9D91;      /* Secondary accents and icons */
  --pale-aqua: #E5F3F2;       /* Light backgrounds and badge tints */
  --warm-off-white: #F8F8F4;  /* Body page background */
  --white: #FFFFFF;
  --text-main: #24343A;       /* High-contrast body text */
  --text-secondary: #68777C;  /* Subtitles and metadata */
  --border-color: #E0E8E7;    /* Subtle card borders */
  --status-pending: #E8A838;
  --status-investigating: #247BA0;
  --status-resolved: #5A9D91;
}
```
Modifying any of these values automatically updates the theme across every component.

---

### 2. How to Add a New Page to the Frontend
1. Create your page component in `frontend/src/pages/MyNewPage.jsx` and styling in `frontend/src/pages/MyNewPage.css`.
2. Register the route in `frontend/src/App.jsx`:
   ```jsx
   import MyNewPage from './pages/MyNewPage'
   // Inside <Routes>:
   <Route path="/my-page" element={<MyNewPage />} />
   ```
3. Add a navigation link in `frontend/src/components/Navbar.jsx`:
   ```jsx
   { to: '/my-page', label: 'My Page' },
   ```

---

### 3. How to Add a New Field to a Report
Example: Adding an optional `water_body_type` (e.g. Lake, River, Canal, Well, Municipal Tap):

1. **Update Backend ORM Model (`backend/app/models.py`)**:
   ```python
   water_body_type: Mapped[str | None] = mapped_column(String(50), nullable=True)
   ```
2. **Update Pydantic Schemas (`backend/app/schemas.py`)**:
   - In `ReportCreate`:
     ```python
     water_body_type: Optional[str] = Field(None, max_length=50)
     ```
   - In `ReportPublic`:
     ```python
     water_body_type: Optional[str] = None
     ```
3. **Update Route Creation (`backend/app/routes.py`)**:
   Pass `payload.water_body_type` to `WaterReport(...)`.
4. **Update Frontend Form (`frontend/src/pages/ReportIssue.jsx`)**:
   Add the field to state, validation, input control, and payload submission.
5. **Update Details Display (`frontend/src/pages/ReportDetails.jsx`)**:
   Render `report.water_body_type` in the details view.

---

### 4. How to Add a New API Endpoint
1. Open `backend/app/routes.py`.
2. Define your endpoint using the APIRouter:
   ```python
   @router.get("/api/categories")
   def get_categories():
       return [cat.value for cat in IssueCategory]
   ```
3. Add a wrapper in `frontend/src/services/api.js`:
   ```javascript
   export async function getCategories() {
     return request('/api/categories');
   }
   ```

---

## API Reference Summary

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API Root status and version indicator |
| `GET` | `/api/health` | Service and database connectivity health check |
| `GET` | `/api/stats` | Aggregated report counts and category distribution |
| `POST` | `/api/reports` | Submit a new water issue (generates unique report code) |
| `GET` | `/api/reports` | Paginated public reports with search and filter queries |
| `GET` | `/api/reports/{code}` | Public details of a single report by human-readable ID |

---

## Final Verification Checklist

- [x] Responsive layout tested on desktop and mobile viewports
- [x] Clear visual identity with water conservation aesthetic
- [x] CSS variables used for all branding colors and typography
- [x] Zero-count and empty states handled without simulated fake data
- [x] Form validated client-side and server-side
- [x] Sensitive contact info (email) excluded from public responses
- [x] Database URL handled securely via environment variables
- [x] CORS configured strictly without wildcard in production
- [x] SPA client routing supported via `vercel.json`
- [x] Clear prototype notices placed on Home, About, and Dashboard

