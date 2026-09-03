# ML API Integration Explanation

## Overview
The MPLADS ML Sentinel system has a **backend server (Node.js/Express)** that acts as a **gateway/proxy** to an external ML API. This server validates all requests, handles errors properly, and forwards them to the real ML service.

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser (React)                          │
│              Frontend at http://localhost:3000               │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP Requests)
┌─────────────────────────────────────────────────────────────┐
│              Backend Server (Node.js + Express)              │
│             Running on same http://localhost:3000            │
│                                                              │
│  ✓ Input Validation (Zod)                                  │
│  ✓ Error Handling (422 OpenAPI format)                     │
│  ✓ Request/Response Transformation                         │
│  ✓ ML API Gateway (proxy)                                  │
└─────────────────────────────────────────────────────────────┘
                            ↓ (HTTP Requests)
┌─────────────────────────────────────────────────────────────┐
│            Real ML API (External Service)                    │
│   https://sih-2026-23oy.onrender.com/api                   │
│                                                              │
│  • ML Model for anomaly detection                          │
│  • Cost analysis                                            │
│  • Risk scoring                                             │
│  • Project analysis                                         │
└─────────────────────────────────────────────────────────────┘
```

---

## What We Built

### 1. **ML API Gateway Endpoints** (11 total)

#### GET /api/ml/health
- **Purpose**: Check if ML API is alive
- **Response**: Status of both gateway and ML service
- **No validation needed**

```json
{
  "status": "ok",
  "service": "ML Sentinel Gateway",
  "ml_api_status": "operational",
  "timestamp": "2026-08-31T22:00:00Z"
}
```

---

#### GET /api/ml/projects
- **Purpose**: List all anomalous projects from ML API
- **Query Parameters** (all optional, validated with Zod):
  - `page`: Page number (default: 1, min: 1)
  - `page_size`: Items per page (default: 100, max: 1000)
  - `risk_level`: Filter by risk (CRITICAL, HIGH, MEDIUM, LOW)
  - `state`: Filter by state
  - `district`: Filter by district
  - `min_risk`: Minimum risk score
  - `max_risk`: Maximum risk score

**Example Request:**
```
GET /api/ml/projects?page=1&page_size=50&risk_level=HIGH&state=Maharashtra
```

**Response:**
```json
{
  "count": 50,
  "total_matches": 1240,
  "page": 1,
  "page_size": 50,
  "data": [
    {
      "id": "PROJ-001",
      "name": "School Building Renovation",
      "risk_score": 85,
      "risk_category": "CRITICAL",
      "state": "Maharashtra",
      "district": "Pune",
      "expenditure": 450000,
      "status": "ongoing"
    }
  ]
}
```

---

#### GET /api/ml/projects/:id
- **Purpose**: Get detailed analysis of a specific project
- **Parameter**: `id` (Project ID, required)
- **Validation**: Checks that ID is not empty

**Example Request:**
```
GET /api/ml/projects/PROJ-001
```

**Response:**
```json
{
  "id": "PROJ-001",
  "name": "School Building Renovation",
  "work_id": "W-2025-001",
  "state": "Maharashtra",
  "district": "Pune",
  "sanctioned_cost": 1000000,
  "actual_expenditure": 450000,
  "physical_progress": 45,
  "risk_score": 85,
  "cost_anomaly_score": 62,
  "delay_score": 78,
  "recommendation": "Investigate project for cost anomalies and delays",
  "ml_model_version": "v2.1"
}
```

---

#### GET /api/ml/investigations/:id
- **Purpose**: Get investigation/audit trail for a project
- **Parameter**: `id` (Investigation ID, required)
- **Returns**: Historical analysis, flagged issues, audit notes

**Response:**
```json
{
  "investigation_id": "INV-001",
  "project_id": "PROJ-001",
  "flagged_on": "2026-08-31T10:00:00Z",
  "issues": [
    {
      "type": "cost_anomaly",
      "severity": "HIGH",
      "description": "Cost exceeded sanctioned amount by 45%",
      "evidence": "Budget vs Expenditure analysis"
    },
    {
      "type": "delay",
      "severity": "CRITICAL",
      "description": "Project 8 months behind schedule",
      "evidence": "Timeline analysis"
    }
  ],
  "next_review_date": "2026-09-15T00:00:00Z"
}
```

---

#### POST /api/ml/analyze
- **Purpose**: Submit a project for real-time ML analysis
- **Method**: POST
- **Body Parameters** (all required, validated with Zod):
  - `work_id`: Unique work identifier
  - `district_name`: District name
  - `work_category`: Category (e.g., "School", "Road", "Water")
  - `work_description`: Description text
  - `sanctioned_amount`: Budget (number > 0)
  - `total_expenditure`: Spent so far (number >= 0)
  - `sanction_date`: Date sanctioned (ISO format)
  - `work_status`: Current status (ongoing, completed, etc.)

**Example Request:**
```bash
POST /api/ml/analyze
Content-Type: application/json

{
  "work_id": "W-2025-001",
  "district_name": "Pune",
  "work_category": "School",
  "work_description": "Renovation of primary school building with new lab facilities",
  "sanctioned_amount": 1000000,
  "total_expenditure": 450000,
  "sanction_date": "2025-01-15T00:00:00Z",
  "work_status": "ongoing"
}
```

**Response (Real-time ML Analysis):**
```json
{
  "analysis_id": "ANAL-001",
  "work_id": "W-2025-001",
  "risk_score": 85,
  "risk_category": "CRITICAL",
  "cost_efficiency": 45,
  "schedule_efficiency": 35,
  "anomalies_detected": [
    {
      "type": "COST_ANOMALY",
      "confidence": 0.94,
      "message": "Project spending 2.25x faster than planned"
    },
    {
      "type": "DELAY_RISK",
      "confidence": 0.87,
      "message": "Project 8 months behind expected completion"
    }
  ],
  "recommendations": [
    "Review budget allocation",
    "Expedite remaining work phases",
    "Investigate cost overruns"
  ],
  "ml_model_version": "v2.1",
  "analysis_timestamp": "2026-08-31T22:30:00Z"
}
```

---

#### GET /api/ml/search
- **Purpose**: Full-text search across all projects
- **Query Parameters** (all optional, validated):
  - `q`: Search query (required, min 1 char)
  - `limit`: Results limit (default: 100, max: 1000)

**Example Request:**
```
GET /api/ml/search?q=school+renovation&limit=50
```

**Response:**
```json
{
  "query": "school renovation",
  "total_results": 342,
  "results": [
    {
      "id": "PROJ-001",
      "type": "project",
      "name": "Primary School Building Renovation",
      "district": "Pune",
      "relevance": 0.98
    }
  ]
}
```

---

## Input Validation System (Zod)

### How Zod Works

Every endpoint validates input using **Zod** schemas defined in `src/services/validation.ts`:

```typescript
// Example: ProjectsQuerySchema validates GET /api/ml/projects
export const ProjectsQuerySchema = z.object({
  page: z.number().int().min(1).default(1),
  page_size: z.number().int().min(1).max(1000).default(100),
  risk_level: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']).optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  min_risk: z.number().min(0).max(100).optional(),
  max_risk: z.number().min(0).max(100).optional(),
});
```

### Validation Flow

```
User Request → Backend Receives → Zod Validates → 
  ✓ Valid? → Transform & Forward to ML API
  ✗ Invalid? → Return 422 Error with Details
```

---

## Error Handling (422 OpenAPI Format)

When validation fails, we return **422 Unprocessable Entity** with OpenAPI format:

### Example Invalid Request:
```bash
GET /api/ml/projects?page=-1&page_size=2000
```

### Example Error Response:
```json
{
  "status": 422,
  "detail": [
    {
      "loc": ["query", "page"],
      "msg": "Number must be greater than or equal to 1",
      "type": "validation_error"
    },
    {
      "loc": ["query", "page_size"],
      "msg": "Number must be less than or equal to 1000",
      "type": "validation_error"
    }
  ],
  "timestamp": "2026-08-31T22:30:00Z",
  "path": "/api/ml/projects"
}
```

---

## Frontend Integration

### How Frontend Uses ML API

**File: `src/services/api.ts`**

The frontend has an API client that:
1. Calls backend endpoints (not ML API directly)
2. Includes error handling for 422 validation errors
3. Shows user-friendly error messages

```typescript
// Example: Fetch projects from ML API via backend
const response = await apiCall(
  "GET",
  "/api/ml/projects",
  { page: 1, page_size: 50, risk_level: "HIGH" }
);

// If validation fails (422), error handler shows field-specific messages
if (error.isValidationError()) {
  const fieldErrors = error.getValidationErrorsForField("page_size");
  // fieldErrors = ["Number must be less than or equal to 1000"]
}
```

### UI Components Using ML API

**1. Project Queue View** (`ProjectQueueView.tsx`)
```typescript
// Calls: GET /api/ml/projects
// Displays list of high-risk projects flagged by ML
// Allows filtering by risk level, state, etc.
```

**2. Risk Simulator** (`RiskSimulatorView.tsx`)
```typescript
// Calls: POST /api/ml/analyze
// User submits project details
// Gets real-time ML analysis with risk score
```

**3. Alert Center** (`AlertCenterView.tsx`)
```typescript
// Displays alerts generated by ML model
// Each alert links to /api/ml/investigations/:id
```

---

## API Flow Example: Analyzing a Project

### Step 1: User Fills Form
```
Risk Simulator View
├─ work_id: "W-2025-001"
├─ district_name: "Pune"
├─ work_category: "School"
├─ work_description: "School renovation..."
├─ sanctioned_amount: 1000000
├─ total_expenditure: 450000
├─ sanction_date: "2025-01-15"
└─ work_status: "ongoing"
```

### Step 2: Frontend Validates (Client-side)
```javascript
// Basic validation in React
if (!work_id || !district_name) {
  showError("Missing required fields");
  return;
}
```

### Step 3: Frontend Submits to Backend
```bash
POST http://localhost:3000/api/ml/analyze
{
  "work_id": "W-2025-001",
  "district_name": "Pune",
  ...
}
```

### Step 4: Backend Validates with Zod
```typescript
// Server-side validation
const validation = validateSchema(AnalyzeProjectSchema, req.body);
if (!validation.success) {
  return sendValidationError(res, validation.errors);
}
```

### Step 5: Backend Calls ML API
```bash
POST https://sih-2026-23oy.onrender.com/api/v1/analyze
{
  "work_id": "W-2025-001",
  ...
}
```

### Step 6: ML API Analyzes & Returns Result
```json
{
  "risk_score": 85,
  "anomalies": [...],
  "recommendations": [...]
}
```

### Step 7: Backend Returns to Frontend
```json
{
  "status": 200,
  "analysis": {
    "risk_score": 85,
    ...
  }
}
```

### Step 8: Frontend Displays Results
```
Risk Simulator View
├─ Risk Score: 85 (CRITICAL)
├─ Cost Efficiency: 45%
├─ Anomalies:
│  ├─ Cost Anomaly (94% confidence)
│  └─ Delay Risk (87% confidence)
└─ [View Full Report]
```

---

## Key Points Summary

| Aspect | Details |
|--------|---------|
| **Architecture** | Frontend (React) → Backend Gateway (Node.js) → Real ML API |
| **Validation** | Zod schemas on every endpoint |
| **Error Format** | OpenAPI 422 standard |
| **ML API URL** | `https://sih-2026-23oy.onrender.com/api` |
| **Endpoints** | 6 main endpoints (health, projects, search, analyze, investigations) |
| **Response Format** | JSON with proper pagination and metadata |
| **Frontend Integration** | ApiError class handles 422 errors, shows field-specific messages |

---

## Testing the API

### Using Swagger UI
```
Navigate to: http://localhost:3000/api/docs
```
You can test all endpoints with interactive documentation!

### Using curl
```bash
# Health check
curl http://localhost:3000/api/ml/health

# Get projects
curl "http://localhost:3000/api/ml/projects?page=1&risk_level=HIGH"

# Analyze project
curl -X POST http://localhost:3000/api/ml/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "work_id": "W-001",
    "district_name": "Pune",
    "work_category": "School",
    "work_description": "School renovation",
    "sanctioned_amount": 1000000,
    "total_expenditure": 450000,
    "sanction_date": "2025-01-15T00:00:00Z",
    "work_status": "ongoing"
  }'
```

---

## Why This Architecture?

1. **Security**: Frontend never talks directly to external ML API
2. **Validation**: All requests validated before reaching ML API
3. **Error Handling**: Consistent error format (422 OpenAPI)
4. **Flexibility**: Can modify requests/responses without frontend changes
5. **Monitoring**: Easy to log and debug API calls
6. **Rate Limiting**: Can add rate limiting at gateway level
7. **Caching**: Can cache ML API responses for performance

---

## What's Next?

1. **Production Deployment**: Deploy backend to cloud
2. **Authentication**: Add JWT/API key authentication
3. **Caching**: Implement Redis caching for common queries
4. **Monitoring**: Add APM (Application Performance Monitoring)
5. **Load Testing**: Test performance with high volume
6. **Documentation**: Auto-generate API docs from Swagger
