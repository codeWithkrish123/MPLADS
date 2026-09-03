# 🏗️ MPLADS ML Sentinel - Complete System Architecture

## 1. THREE-TIER SYSTEM OVERVIEW

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│              (User Interface - What Users See)              │
│                                                             │
│  • Dashboard  • Projects  • Alerts  • Analysis  • Profile  │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Requests/Responses
                     │ (JSON data)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND (Node.js)                          │
│           (Business Logic - Data Processing)               │
│                                                             │
│  • Express Server  • API Gateway  • Data Transformation   │
│  • Authentication  • Caching  • Error Handling            │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTP Calls
                     │ (Fetch ML API)
                     ▼
┌─────────────────────────────────────────────────────────────┐
│            ML API (Remote - Render.com)                     │
│         (Intelligence - Real Risk Analysis)                │
│                                                             │
│  https://sih-2026-23oy.onrender.com/api                   │
│                                                             │
│  • 100+ projects with risk scores                          │
│  • ML-calculated anomaly detection                         │
│  • Real-time analysis                                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. REAL-TIME DATA FLOW (Step-by-Step)

### Example: User Clicks "View Projects"

```
STEP 1: User Action (Frontend)
┌──────────────────────────────────┐
│ User clicks "Project Queue"      │
│ in ML Sentinel menu              │
└────────────┬─────────────────────┘
             │
             ▼
STEP 2: Component Mounts
┌──────────────────────────────────┐
│ React ProjectQueueView            │
│ component initializes             │
│ useEffect runs on mount           │
└────────────┬─────────────────────┘
             │
             ▼
STEP 3: Frontend Makes Request
┌──────────────────────────────────┐
│ Frontend calls:                   │
│                                   │
│ apiCall('GET', '/api/ml/projects')
│                                   │
│ This goes to LOCAL BACKEND        │
└────────────┬─────────────────────┘
             │ HTTP GET to localhost:3000
             ▼
STEP 4: Backend Gateway Receives
┌──────────────────────────────────┐
│ Node.js server.ts                │
│ Route: GET /api/ml/projects      │
│                                   │
│ Endpoint handler executes         │
└────────────┬─────────────────────┘
             │
             ▼
STEP 5: Backend Calls Real ML API
┌──────────────────────────────────┐
│ Backend makes HTTP call:          │
│                                   │
│ fetch(                            │
│  'https://sih-2026-23oy...       │
│   /api/projects'                 │
│ )                                │
│                                   │
│ This goes to REMOTE SERVER       │
└────────────┬─────────────────────┘
             │ HTTP GET (Internet)
             ▼
STEP 6: Real ML API Processes
┌──────────────────────────────────┐
│ Render.com Server                │
│ • Queries database               │
│ • Calculates risk scores         │
│ • Runs ML analysis               │
│ • Prepares response              │
└────────────┬─────────────────────┘
             │ Returns JSON response
             ▼
STEP 7: Response Back to Backend
┌──────────────────────────────────┐
│ Backend receives:                │
│ {                                │
│   "count": 100,                  │
│   "total_matches": 70830,        │
│   "data": [100 projects...]      │
│ }                                │
│                                  │
│ Backend sends to frontend        │
└────────────┬─────────────────────┘
             │ HTTP 200 OK
             ▼
STEP 8: Frontend Receives Data
┌──────────────────────────────────┐
│ ProjectQueueView component       │
│ setProjects(data)                │
│ Updates React state              │
└────────────┬─────────────────────┘
             │
             ▼
STEP 9: React Re-renders
┌──────────────────────────────────┐
│ Component re-renders with data   │
│ Shows 100 project cards          │
│ Each with risk score             │
│ Users see real data ✅           │
└──────────────────────────────────┘

Total Time: ~500ms - 1 second
```

---

## 3. SYSTEM COMPONENTS

### Frontend (React - What Users See)

| Component | Location | Purpose | Status |
|-----------|----------|---------|--------|
| Dashboard | src/views/DashboardView.tsx | Overview of all data | ✅ |
| Project Queue | src/views/ProjectQueueView.tsx | Browse all projects | ✅ (FIXED) |
| Project Details | src/views/ProjectDetailView.tsx | Deep analysis of one project | ✅ |
| Risk Simulator | src/views/RiskSimulatorView.tsx | Test hypothetical projects | ✅ |
| Alerts Center | src/views/AlertCenterView.tsx | Manage flagged projects | ✅ |
| Custom Dataset | src/views/CustomDatasetView.tsx | Upload & analyze your data | ✅ |
| All Other Views | src/views/ | Various reports & analysis | ✅ |

### Backend (Node.js - Business Logic)

| Endpoint | Method | Purpose | Status |
|----------|--------|---------|--------|
| /api/ml/health | GET | Check API connectivity | ✅ |
| /api/ml/projects | GET | Get all 100+ projects | ✅ (FIXED) |
| /api/ml/projects/:id | GET | Get specific project | ✅ |
| /api/ml/investigations/:id | GET | Get investigation data | ✅ |
| /api/ml/analyze | POST | Real-time analysis | ✅ |
| /api/ml/search | GET | Full-text search | ✅ |

### ML API (Real Intelligence - Remote)

| Endpoint | Data Provided | Status |
|----------|---------------|--------|
| /api/projects | 100 CRITICAL projects | ✅ |
| /api/projects/{id} | Full project analysis | ✅ |
| /api/analyze | Real-time risk calculation | ✅ |
| /api/investigations | Investigation checklist | ✅ |
| /api/search | Project search results | ✅ |

---

## 4. DATA TRANSFORMATION PIPELINE

```
Raw ML API Data
├─ work_id_clean: "WS/MP203/2023-2024/10748"
├─ composite_risk_score: 96.48
├─ reason_codes: [COST_PEER_DEVIATION_EXTREME, ...]
├─ recommended_checks: [list of 12 checks]
└─ evidence_confidence_score: 100.0
        │
        ▼
Backend Processes & Validates
├─ Checks data structure
├─ Handles errors
├─ Applies caching (optional)
└─ Formats for frontend
        │
        ▼
Frontend Receives & Transforms
├─ Parses JSON
├─ Stores in React state
├─ Applies filtering/sorting
└─ Renders to UI
        │
        ▼
User Sees
├─ Project cards with risk score
├─ Color-coded severity (RED/ORANGE/YELLOW)
├─ Risk breakdown charts
├─ Investigation recommendations
└─ Action buttons (View, Analyze, etc.)
```

---

## 5. REAL-TIME UPDATE MECHANISM

### How Live Updates Work

```
User Opens App
    ├─ Frontend loads (React)
    ├─ Components mount
    ├─ useEffect hooks fire
    │
    ├─ Request 1: GET /api/ml/projects
    │  → Backend → ML API → Returns 100 projects
    │  → Frontend renders project list
    │
    ├─ Request 2: GET /api/ml/search (on user search)
    │  → Backend → ML API → Search results
    │  → Frontend updates search results
    │
    ├─ Request 3: POST /api/ml/analyze (user analyzes project)
    │  → Backend → ML API → Risk calculation
    │  → Frontend shows analysis
    │
    └─ All updates are real-time (NO caching of ML data)
```

### Key Points

- **No WebSocket**: System uses simple HTTP requests
- **On-Demand**: Data fetched when user requests it
- **Fresh Data**: Every request gets latest from ML API
- **Backend Proxy**: Frontend never calls ML API directly
- **Security**: All requests go through backend first

---

## 6. AUTHENTICATION & SECURITY

```
User Login Flow
    │
    ├─ User enters credentials
    ├─ Frontend sends to /api/auth/login
    ├─ Backend validates
    ├─ Returns JWT token
    ├─ Frontend stores in localStorage
    │
    └─ Every Request After Login
       ├─ Frontend attaches token to headers
       ├─ Authorization: Bearer {token}
       ├─ Backend validates token
       ├─ If valid: Process request
       ├─ If invalid: Return 401 Unauthorized
       └─ Frontend redirects to login
```

---

## 7. ERROR HANDLING

```
Error Scenarios:

1. Network Error
   ├─ Frontend can't reach backend
   ├─ apiCall catches error
   ├─ setError("Failed to fetch projects")
   └─ User sees error message

2. Backend Error
   ├─ Backend receives request
   ├─ Tries to call ML API
   ├─ ML API is down
   ├─ Backend catches error
   ├─ Returns error JSON
   └─ Frontend displays error

3. ML API Error
   ├─ Backend successfully calls ML API
   ├─ ML API returns error
   ├─ Backend catches and logs
   ├─ Returns error to frontend
   └─ User sees "ML API unavailable"

4. Data Validation Error
   ├─ API returns unexpected format
   ├─ Frontend validation fails
   ├─ setError("Invalid data format")
   └─ User sees validation error
```

---

## 8. TECHNOLOGY STACK

### Frontend
- **Framework**: React 18
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **State Management**: React Hooks (useState, useContext)

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Port**: 3000 (default)
- **Features**: 
  - ML API proxy/gateway
  - Error handling
  - Request logging
  - CORS support

### ML API (External)
- **Provider**: Render.com (cloud platform)
- **URL**: https://sih-2026-23oy.onrender.com/api
- **Data**: 70,000+ MPLADS projects
- **Analysis**: ML-driven risk scoring
- **Updates**: Real-time (daily updates)

---

## 9. KEY FEATURES EXPLANATION

### Feature 1: Project Queue
- **What**: Browse all 100+ high-risk projects
- **How**: 
  1. ML API has project data
  2. Backend proxies requests
  3. Frontend displays as cards
- **Real-time**: Yes - fetches latest on each load

### Feature 2: Risk Simulator
- **What**: Test hypothetical project risks
- **How**:
  1. User fills 8 project fields
  2. Frontend sends to backend
  3. Backend sends to ML API for analysis
  4. Returns risk score + recommendations
- **Real-time**: Yes - instant calculation

### Feature 3: Alert Generator
- **What**: Flags high-risk projects for action
- **How**:
  1. Custom dataset uploaded
  2. Frontend finds projects with score >= 60
  3. Creates alerts automatically
  4. Users can acknowledge/resolve
- **Real-time**: Yes - generated on upload

### Feature 4: Investigation Details
- **What**: Deep dive into why a project is risky
- **How**:
  1. User clicks project
  2. Backend fetches full investigation data
  3. Shows reason codes + recommendations
  4. Displays investigation checklist
- **Real-time**: Yes - fresh data each click

---

## 10. PRODUCTION READINESS CHECKLIST

| Item | Status | Notes |
|------|--------|-------|
| Frontend Build | ✅ | 0 errors, 1,741 modules |
| Backend Endpoints | ✅ | 6 endpoints working |
| ML API Connection | ✅ | 100+ projects confirmed |
| Error Handling | ✅ | Global error catching |
| Security | ⚠️ | Auth system in place, needs review |
| Performance | ⚠️ | App bundle ~930KB, could optimize |
| Documentation | ⚠️ | In progress |
| Testing | ⚠️ | Manual testing complete, need unit tests |

---

**Summary**: MPLADS ML Sentinel is a **three-tier real-time system** where frontend communicates with backend, which communicates with remote ML API. All data flows are live, all requests are fresh, and the system handles 70,000+ projects with ML-driven risk analysis.
