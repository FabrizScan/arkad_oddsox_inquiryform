# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OddSox Leads Form - A multi-step React form for music event booking inquiries. The project uses a **separated frontend/backend architecture** for security, deployed entirely on Cloudflare infrastructure.

**Key Architecture Decision**: The project was refactored (v2.0) to separate frontend and backend to prevent exposing sensitive API keys (Supabase, N8N) in the browser bundle.

## Repository Structure

This is a monorepo with two workspaces:

- **frontend/** - React + Vite application (deployed to Cloudflare Pages)
- **backend/** - Cloudflare Workers API (deployed to Cloudflare Workers)
- **package.json** (root) - Workspace configuration with convenience scripts

## Development Commands

### Setup
```bash
npm run install:all                    # Install all dependencies (root + frontend + backend)
```

### Local Development
```bash
npm run dev                           # Start frontend dev server (alias for dev:frontend)
npm run dev:frontend                  # Frontend on http://localhost:5173
npm run dev:backend                   # Backend on http://localhost:8787 (separate terminal)
```

**Important**: When developing locally, you need to run both frontend and backend servers simultaneously in separate terminals.

### Build
```bash
npm run build                         # Build frontend only (alias for build:frontend)
npm run build:frontend                # Build React app to frontend/dist
npm run build:backend                 # Build backend (handled by wrangler)
```

### Deploy
```bash
# Backend deployment
npm run deploy:backend:staging        # Deploy to staging environment
npm run deploy:backend:production     # Deploy to production environment

# Frontend deployment
npm run deploy:frontend               # Build frontend (deploy via Cloudflare Pages dashboard)

# Combined deployment
npm run deploy:cloudflare             # Deploy backend + build frontend for Cloudflare
npm run deploy:vercel                 # Deploy backend + build frontend for Vercel
```

### Preview
```bash
npm run preview                       # Preview production build locally (frontend)
```

## Architecture Details

### Frontend (React + Vite)

**Location**: `frontend/`
**Entry Point**: `frontend/src/main.jsx` → `frontend/src/App.jsx`

**Key Concepts**:
- **Multi-step form**: 5 steps managed via `currentStep` state in App.jsx
  - Step 1: Event Info (EventType, Date)
  - Step 2: Location & Venue (Google Places integration)
  - Step 3: Guests & Dress Code
  - Step 4: Music Details (Musicians, Duration)
  - Step 5: Contact & Notes (Final submission)
- **URL prefilling**: Supports query parameters to pre-fill form fields (see `getUrlParams()` in App.jsx:23-36)
- **Adaptive API Client**: `frontend/src/utils/apiClient.js` automatically detects deployment platform
  - On Cloudflare Pages: Attempts to use Service Bindings for direct Worker communication
  - On Vercel/other: Falls back to HTTP URL-based communication
  - Environment variable: `VITE_BACKEND_API_URL`

**Components Structure**:
- Each step is a separate component in `frontend/src/components/`
- `Stepper.jsx` - Visual progress indicator
- `ErrorBoundary.jsx` - React error handling wrapper

**Styling**: CSS files in `frontend/src/styles/`

### Backend (Cloudflare Workers)

**Location**: `backend/`
**Entry Point**: `backend/src/index.js`

**Responsibilities**:
- Validate form data (required fields check)
- Send data to Supabase table `n8n_oddsox_leads_form`
- Trigger N8N webhook (non-blocking - errors don't fail submission)
- CORS handling for frontend communication

**Environment Variables** (configured in Cloudflare dashboard):
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `N8N_WEBHOOK_URL`

**Configuration**: `backend/wrangler.toml`
- Supports `staging` and `production` environments
- Different worker names per environment

### Communication Between Frontend and Backend

**Two modes supported**:

1. **Cloudflare Service Bindings** (optimal for Cloudflare Pages deployment):
   - Configured in `frontend/wrangler.toml` (lines 5-8)
   - Direct Worker-to-Worker communication (no HTTP overhead)
   - Binding name: `BACKEND_WORKER`
   - Service name: `oddsox-inquiry-form-backend` (production)

2. **HTTP URL** (fallback, works everywhere):
   - Configured via `VITE_BACKEND_API_URL` environment variable
   - Traditional REST API calls
   - Required for Vercel or local development

The `ApiClient` class in `frontend/src/utils/apiClient.js` handles automatic detection and fallback.

### Cloudflare Pages Functions

**Location**: `frontend/functions/[[path]].js`

This file configures service bindings for Cloudflare Pages deployment. It makes the `BACKEND_WORKER` binding available to the frontend at runtime.

## Environment Variables Setup

### Frontend (.env.local for local dev)
```bash
VITE_GOOGLE_API_KEY=your-google-maps-api-key
VITE_BACKEND_API_URL=http://localhost:8787      # Local backend URL
```

### Backend (.env for local dev)
```bash
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/oddsox-leads
```

**Production**: Configure these in Cloudflare dashboard (Workers and Pages settings), NOT in code.

## Data Flow

```
User fills form → Frontend (React)
                     ↓
                 ApiClient detects platform
                     ↓
         ┌───────────┴────────────┐
         ↓                        ↓
  Service Binding            HTTP Request
  (Cloudflare Pages)      (Vercel/Fallback)
         ↓                        ↓
         └───────────┬────────────┘
                     ↓
            Backend Worker validates
                     ↓
         ┌───────────┴────────────┐
         ↓                        ↓
    Supabase Insert          N8N Webhook
    (blocking)               (non-blocking)
```

## Form Data Schema

**Frontend form fields** are mapped to **backend payload** in `App.jsx:97-135` (`mapFormDataToPayload()`):

Key transformations:
- `isDateRange` boolean → `date_type: "range" | "single"`
- `eventType: "other"` → uses `otherEventType` value
- `concertDurationType` + `extraSets` → combined `concert_duration` string
- `location` contains "name, address" from Google Places API

**Required fields** (validated in backend/src/index.js:34):
- user_type, event_type, start_date, location, indoor_outdoor, guests, concert_duration, full_name, email

## Deployment Platforms

### Cloudflare Pages + Workers (Recommended)

**Backend Deploy**:
```bash
cd backend
npm run deploy:production
```

**Frontend Deploy**:
1. Connect GitHub repo to Cloudflare Pages
2. Build command: `npm run build:frontend`
3. Build output: `frontend/dist`
4. Configure Service Binding in Pages dashboard:
   - Variable name: `BACKEND_WORKER`
   - Service: `oddsox-leads-backend-prod`
   - Environment: `production`

### Vercel (Alternative)

Works via HTTP fallback. Set `VITE_BACKEND_API_URL` to the deployed Cloudflare Worker URL.

## Security Notes

**Before v2.0 (Vulnerable)**:
- Environment variables exposed in frontend bundle
- API keys visible in browser DevTools
- Direct Supabase/N8N calls from browser

**After v2.0 (Secure)**:
- All sensitive keys stored in Cloudflare Workers environment
- Frontend only communicates with backend
- No API keys in JavaScript bundle

## Debugging Tips

- **Frontend errors**: Check browser console and Network tab
- **Backend errors**: Check Cloudflare Workers dashboard logs or `wrangler dev` output
- **Service binding issues**: Verify binding configuration in Cloudflare Pages dashboard
- **Form validation errors**: Check `mapFormDataToPayload()` in App.jsx and backend validation

## Important Implementation Notes

- **Airtable integration**: Form supports `airtable_record_id` and `airtable_contact_id` via URL params (mapped to `record_id` and `contact_id` in payload)
- **Musicians field**: Array type, stored as JSON in database
- **N8N failures**: Intentionally non-blocking (logged but don't stop form submission)
- **No tests configured**: `npm test` will fail (placeholder script)
