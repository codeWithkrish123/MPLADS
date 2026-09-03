# ML Sentinel Backend API Testing & Integration Guide
## Complete API Contract & Testing Procedures

---

## 📡 API ENDPOINTS REQUIRED BY FRONTEND

All frontend ML views expect these endpoints to return data. Backend must either:
1. Proxy to ML API (https://sih-2026-23oy.onrender.com/api)
2. Implement gateway handlers
3. Configure CORS for direct frontend-to-ML API calls

### Endpoint: GET /api/ml/health
**Purpose:** Verify ML API is available  
**Called From:** Could be used for health checks  
**Frontend Usage:** Optional (monitoring)

**Request:**
```http
GET /api/ml/health HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "status": "ok",
  "service": "ML Sentinel API",
  "timestamp": "2026-08-31T19:25:00Z",
  "version": "1.0.0"
}
```

**Error Responses:**
- 503 Service Unavailable: ML API down
- 500 Internal Server Error: Backend gateway error

---

### Endpoint: GET /api/ml/projects
**Purpose:** List all projects with risk analysis  
**Called From:** ProjectQueueView.tsx  
**Frontend Usage:** Initial load + pagination + filtering

**Request:**
```http
GET /api/ml/projects?state=&district=&risk_level=HIGH&work_category=&minRisk=0&maxRisk=100&sortBy=composite_risk_score&sortOrder=desc&limit=50&offset=0 HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
Content-Type: application/json
```

**Query Parameters:**
```
state: string (optional) - State name filter
district: string (optional) - District name filter
risk_level: string (optional) - "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
work_category: string (optional) - Project category filter
minRisk: number (optional, default=0) - Minimum risk score
maxRisk: number (optional, default=100) - Maximum risk score
sortBy: string (optional, default="composite_risk_score") - Sort field
sortOrder: string (optional, default="desc") - "asc" | "desc"
limit: number (optional, default=50) - Items per page
offset: number (optional, default=0) - Pagination offset
```

**Expected Response (200 OK):**
```json
[
  {
    "work_id": "WS/2024/001",
    "state": "Uttar Pradesh",
    "district": "Ghaziabad",
    "work_category": "Drinking Water",
    "work_description": "Installation of piped water system",
    "composite_risk_score": 72.5,
    "risk_level": "HIGH",
    "sanction_amount": 5000000,
    "total_expenditure": 3500000,
    "work_status": "ongoing",
    "physical_progress": 45,
    "reason_codes": ["COST_PEER_DEVIATION_HIGH", "DELAY_MOBILIZATION_HIGH"]
  },
  {
    "work_id": "WS/2024/002",
    "state": "Uttar Pradesh",
    "district": "Noida",
    "work_category": "Rural Road",
    "work_description": "Road construction and maintenance",
    "composite_risk_score": 45.3,
    "risk_level": "MEDIUM",
    "sanction_amount": 3000000,
    "total_expenditure": 2100000,
    "work_status": "completed",
    "physical_progress": 85,
    "reason_codes": ["UNDER_UTILIZATION"]
  }
]
```

**Error Responses:**
- 400 Bad Request: Invalid filter parameters
- 401 Unauthorized: Missing/invalid token
- 500 Internal Server Error: Backend error

---

### Endpoint: GET /api/ml/projects/{projectId}
**Purpose:** Get detailed analysis for single project  
**Called From:** ProjectDetailView.tsx  
**Frontend Usage:** When user clicks project in queue

**Request:**
```http
GET /api/ml/projects/WS%2F2024%2F001 HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
```

**Note:** Project ID is URL-encoded (forward slashes become %2F)

**Expected Response (200 OK):**
```json
{
  "work_id": "WS/2024/001",
  "state": "Uttar Pradesh",
  "district": "Ghaziabad",
  "work_category": "Drinking Water",
  "work_description": "Installation of piped water system in rural area",
  "composite_risk_score": 72.5,
  "risk_level": "HIGH",
  "sanction_amount": 5000000,
  "total_expenditure": 3500000,
  "work_status": "ongoing",
  "physical_progress": 45,
  "sanction_date": "2024-01-15",
  "completion_date": "2024-12-31",
  "mock_visualization": {
    "lat": 28.6692,
    "lng": 77.4538
  },
  "reason_codes": [
    "COST_PEER_DEVIATION_HIGH",
    "DELAY_MOBILIZATION_HIGH"
  ]
}
```

**Error Responses:**
- 404 Not Found: Project doesn't exist
- 422 Unprocessable Entity: Project has insufficient historical data
- 401 Unauthorized: Missing/invalid token

---

### Endpoint: GET /api/ml/investigations/{projectId}
**Purpose:** Get investigation signals and recommendations  
**Called From:** ProjectDetailView.tsx  
**Frontend Usage:** Investigation checklist & signals display

**Request:**
```http
GET /api/ml/investigations/WS%2F2024%2F001 HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
```

**Expected Response (200 OK):**
```json
{
  "project_id": "WS/2024/001",
  "composite_risk_score": 72.5,
  "risk_level": "HIGH",
  "evidence_confidence_score": 0.87,
  "evidence_completeness_state": "COMPLETE",
  "active_signals": {
    "COST_PEER_DEVIATION_HIGH": true,
    "DELAY_MOBILIZATION_HIGH": true,
    "PROGRESS_STAGNATION": false,
    "UNDER_UTILIZATION": false
  },
  "recommendations": [
    {
      "check_type": "COST_PEER_DEVIATION_HIGH",
      "action": "Review project procurement documentation"
    },
    {
      "check_type": "COST_PEER_DEVIATION_HIGH",
      "action": "Compare unit rates with peer projects"
    },
    {
      "check_type": "DELAY_MOBILIZATION_HIGH",
      "action": "Review project mobilization timeline"
    }
  ],
  "data_limitations": [
    "Physical progress data incomplete for Q2 2024",
    "Contractor compliance records not available"
  ]
}
```

**Error Responses:**
- 404 Not Found: Project or investigation not found
- 401 Unauthorized: Missing/invalid token

---

### Endpoint: POST /api/ml/analyze
**Purpose:** Real-time risk analysis for new/hypothetical project  
**Called From:** RiskSimulatorView.tsx  
**Frontend Usage:** When user submits form with 8 fields

**Request:**
```http
POST /api/ml/analyze HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
Content-Type: application/json

{
  "work_id": "WS/NEW/2024/001",
  "district_name": "New Delhi",
  "work_category": "Drinking Water",
  "work_description": "Installation of piped water system in rural area",
  "sanctioned_amount": 5000000,
  "total_expenditure": 4500000,
  "sanction_date": "2024-01-15",
  "work_status": "ongoing"
}
```

**Request Body Fields (All Required):**
```
work_id: string - Project identifier
district_name: string - District name
work_category: string - Project category
work_description: string - Project description
sanctioned_amount: number - Budget in rupees
total_expenditure: number - Actual spending in rupees
sanction_date: string - ISO date format (YYYY-MM-DD)
work_status: string - "planned" | "ongoing" | "completed" | "stalled"
```

**Expected Response (200 OK):**
```json
{
  "work_id_clean": "WS/NEW/2024/001",
  "composite_risk_score": 52.3,
  "risk_level": "MEDIUM",
  "factors": [
    {
      "type": "COST_VARIANCE",
      "score": 15.5,
      "reason": "Expenditure is 90% of sanctioned amount (normal range: 70-95%)"
    },
    {
      "type": "BUDGET_UTILIZATION",
      "score": 18.2,
      "reason": "Fund utilization within acceptable range"
    },
    {
      "type": "TIMELINE_ANALYSIS",
      "score": 9.8,
      "reason": "Project timeline is reasonable"
    },
    {
      "type": "CATEGORY_BENCHMARK",
      "score": 8.8,
      "reason": "Project metrics align with category benchmarks"
    }
  ]
}
```

**Error Responses:**
- 400 Bad Request: Missing required fields or invalid format
- 401 Unauthorized: Missing/invalid token
- 422 Unprocessable Entity: Invalid field values
- 500 Internal Server Error: ML analysis failed

---

### Endpoint: GET /api/ml/search
**Purpose:** Full-text search across projects  
**Called From:** ProjectQueueView.tsx  
**Frontend Usage:** When user types in search box

**Request:**
```http
GET /api/ml/search?q=drinking+water&limit=100 HTTP/1.1
Host: localhost:8080
Authorization: Bearer {token}
```

**Query Parameters:**
```
q: string (required) - Search query
limit: number (optional, default=100) - Max results
```

**Expected Response (200 OK):**
```json
[
  {
    "work_id": "WS/2024/001",
    "state": "Uttar Pradesh",
    "district": "Ghaziabad",
    "work_category": "Drinking Water",
    "work_description": "Installation of piped water system",
    "composite_risk_score": 72.5,
    "risk_level": "HIGH"
  },
  {
    "work_id": "WS/2024/045",
    "state": "Maharashtra",
    "district": "Pune",
    "work_category": "Drinking Water",
    "work_description": "Water purification and distribution",
    "composite_risk_score": 35.8,
    "risk_level": "LOW"
  }
]
```

**Error Responses:**
- 400 Bad Request: Missing search query
- 401 Unauthorized: Missing/invalid token
- 500 Internal Server Error: Search failed

---

## 🧪 MANUAL TESTING PROCEDURES

### Test Scenario 1: Happy Path - View Project Queue
**Objective:** Verify project list loads with real ML data

**Steps:**
1. Start backend server (port 8080)
2. Start frontend dev server (port 5173 or 3000)
3. Open browser to http://localhost:3000
4. Login with credentials
5. Navigate to Sidebar → ML Sentinel & Risk Analysis → Project Queue
6. Observe: Projects load with risk scores

**Expected Result:**
```
✓ Page loads within 2 seconds
✓ Projects displayed in table format
✓ Risk scores visible (0-100 range)
✓ Risk levels color-coded (RED/ORANGE/YELLOW/GREEN)
✓ Pagination controls visible (showing 50 items)
✓ Search box functional
✓ Filter dropdowns populated
```

**Actual Result:** [Testing Required]

---

### Test Scenario 2: Search Functionality
**Objective:** Verify search returns filtered results

**Steps:**
1. From Project Queue view
2. Type "drinking" in search box
3. Wait 1-2 seconds
4. Observe results

**Expected Result:**
```
✓ Search executes automatically
✓ Results filtered to contain "drinking" in work_category or description
✓ Result count updates
✓ Projects re-rendered
```

**Actual Result:** [Testing Required]

---

### Test Scenario 3: Project Detail View
**Objective:** Verify detailed project analysis loads

**Steps:**
1. From Project Queue
2. Click on first project row
3. Observe detail view loads

**Expected Result:**
```
✓ Page loads within 2 seconds
✓ Project basic info displayed (ID, category, location)
✓ Risk score card visible
✓ Investigation checklist shown
✓ Reason codes displayed
✓ Back button functional
```

**Actual Result:** [Testing Required]

---

### Test Scenario 4: Risk Simulator Analysis
**Objective:** Verify ML analysis works end-to-end

**Steps:**
1. Navigate to Sidebar → Risk Simulator
2. Fill all 8 form fields:
   - Project ID: WS/TEST/2024/001
   - District: Test District
   - Category: Drinking Water
   - Description: Test project
   - Sanctioned: 5000000
   - Expenditure: 4500000
   - Sanction Date: 2024-01-15
   - Status: ongoing
3. Click "Analyze" button
4. Wait for analysis

**Expected Result:**
```
✓ Loading state shows during analysis
✓ Analysis completes within 3 seconds
✓ Risk score card appears
✓ Risk score between 0-100
✓ Risk level shown (CRITICAL/HIGH/MEDIUM/LOW)
✓ Contributing factors listed
✓ Legal disclaimer displayed
```

**Actual Result:** [Testing Required]

---

### Test Scenario 5: Error Handling - Invalid Credentials
**Objective:** Verify error handling on login failure

**Steps:**
1. Go to Sign-In page
2. Enter wrong email/password
3. Click Sign In

**Expected Result:**
```
✓ Error message displayed
✓ User not logged in
✓ Page doesn't navigate
✓ Error message is clear and helpful
```

**Actual Result:** [Testing Required]

---

### Test Scenario 6: Error Handling - Project Not Found
**Objective:** Verify graceful handling of missing project

**Steps:**
1. Navigate to ProjectDetailView (via URL or programmatically)
2. Pass invalid project ID: "INVALID_PROJECT_XYZ"
3. Observe page behavior

**Expected Result:**
```
✓ Error state shown instead of crashing
✓ Error message: "Project not found."
✓ Back button visible and functional
```

**Actual Result:** [Testing Required]

---

### Test Scenario 7: Error Handling - Insufficient Data
**Objective:** Verify handling of 422 response (insufficient data)

**Steps:**
1. Request project detail for incomplete project
2. Trigger 422 response from API

**Expected Result:**
```
✓ Error shown to user
✓ Message: "This project has insufficient historical data..."
✓ User not blocked
✓ Can still navigate away
```

**Actual Result:** [Testing Required]

---

### Test Scenario 8: API Timeout Handling
**Objective:** Verify timeout behavior

**Steps:**
1. Make API call with deliberate delay
2. Wait 30+ seconds

**Expected Result:**
```
✓ Request eventually times out or completes
✓ User receives feedback
✓ UI doesn't freeze
✓ User can retry or navigate away
```

**Actual Result:** [Testing Required]

---

### Test Scenario 9: Bilingual Support
**Objective:** Verify Hindi/English toggle

**Steps:**
1. Logged in to dashboard
2. Click language toggle (top-right)
3. Switch to Hindi
4. Navigate to Risk Simulator
5. Verify all text in Hindi

**Expected Result:**
```
✓ All UI text switches to Hindi
✓ Form labels in Hindi
✓ Error messages in Hindi
✓ Button text in Hindi
✓ Sidebar navigation in Hindi
```

**Actual Result:** [Testing Required]

---

### Test Scenario 10: Compliance Terminology
**Objective:** Verify banned words are replaced

**Steps:**
1. View project detail
2. Look for reason codes
3. Verify terminology

**Expected Result:**
```
✓ No "Fraud" anywhere (replaced with "Statistical anomaly")
✓ No "Corruption" (replaced with "Unusual pattern")
✓ No "Guilt" (replaced with "Priority indicator")
✓ Legal disclaimer present on all analysis views
```

**Actual Result:** [Testing Required]

---

## 🔧 BACKEND IMPLEMENTATION CHECKLIST

### Prerequisites
- [ ] Node.js/Express backend running
- [ ] ML API accessible (https://sih-2026-23oy.onrender.com/api)
- [ ] Database connected with test data
- [ ] Authentication system configured

### Required Endpoints to Implement/Configure

```typescript
// 1. Health check
app.get('/api/ml/health', async (req, res) => {
  // Return ML API health status
});

// 2. Project list with filters
app.get('/api/ml/projects', async (req, res) => {
  // Query parameters: state, district, risk_level, category, minRisk, maxRisk, sortBy, sortOrder, limit, offset
  // Return paginated project array
});

// 3. Project detail
app.get('/api/ml/projects/:projectId', async (req, res) => {
  // URL-decode projectId
  // Call ML API for analysis
  // Return project detail + risk analysis
});

// 4. Investigation data
app.get('/api/ml/investigations/:projectId', async (req, res) => {
  // Call ML API for investigation signals
  // Return recommendations + active signals
});

// 5. Real-time analysis
app.post('/api/ml/analyze', async (req, res) => {
  // Validate 8 required fields
  // Call ML API /v1/analyze
  // Return risk score + factors
});

// 6. Search functionality
app.get('/api/ml/search', async (req, res) => {
  // Query parameter: q (search string)
  // Search projects by work_id, category, description
  // Return matching projects
});
```

### ML API Proxy Pattern Example

```typescript
const ML_API_BASE = 'https://sih-2026-23oy.onrender.com/api';

// Generic proxy handler
async function proxyToMLAPI(path, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }
    
    const response = await fetch(`${ML_API_BASE}${path}`, options);
    
    if (!response.ok) {
      throw new Error(`ML API returned ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('ML API Error:', error);
    throw error;
  }
}

// Usage example
app.get('/api/ml/projects', async (req, res) => {
  try {
    const data = await proxyToMLAPI('/projects');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

---

## 📊 DATA VALIDATION RULES

### Risk Score
- **Type:** number
- **Range:** 0-100
- **Required:** Yes
- **Validation:** `score >= 0 && score <= 100`

### Risk Level
- **Type:** string (enum)
- **Valid Values:** "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
- **Required:** Yes
- **Mapping:**
  - CRITICAL: 70-100
  - HIGH: 50-69
  - MEDIUM: 30-49
  - LOW: 0-29

### Amounts
- **Type:** number
- **Minimum:** 0
- **Maximum:** 999999999999 (12 digits)
- **Validation:** `amount >= 0 && amount <= 999999999999`

### Dates
- **Type:** string (ISO 8601)
- **Format:** YYYY-MM-DD
- **Example:** "2024-01-15"
- **Validation:** Valid ISO date

### Work Status
- **Type:** string (enum)
- **Valid Values:** "planned" | "ongoing" | "completed" | "stalled"
- **Required:** Yes

### Project ID
- **Format:** May contain slashes (e.g., "WS/2024/001")
- **URL-encoded:** Yes (slashes → %2F)
- **Validation:** No special characters except forward slash

---

## 🚨 ERROR CODE MAPPINGS

| HTTP Code | Meaning | Frontend Handling |
|-----------|---------|------------------|
| 200 | Success | Display data normally |
| 400 | Bad Request | Show "Invalid request" error |
| 401 | Unauthorized | Redirect to login |
| 404 | Not Found | Show "Project not found" |
| 422 | Unprocessable Entity | Show "Insufficient data" |
| 429 | Rate Limited | Show "Too many requests, try again later" |
| 500 | Server Error | Show "Server error, please contact support" |
| 503 | Service Unavailable | Show "Service temporarily unavailable" |

---

## ✅ VERIFICATION CHECKLIST

Before deploying to production:

- [ ] All 6 ML endpoints implemented/configured
- [ ] 5+ test projects in database with varied risk scores
- [ ] Authentication working (login returns valid token)
- [ ] API response times < 1.5 seconds
- [ ] Error responses match documentation
- [ ] Search functionality working
- [ ] Filters applying correctly
- [ ] Pagination working (limit/offset)
- [ ] URL encoding working for project IDs
- [ ] Legal disclaimer on all analysis views
- [ ] No banned words in responses
- [ ] Bilingual support verified
- [ ] Mobile responsive design tested
- [ ] Browser compatibility tested (Chrome, Firefox, Safari, Edge)
- [ ] Load test with 100+ concurrent users
- [ ] SSL/HTTPS configured
- [ ] CORS configured (if frontend and backend on different origins)
- [ ] Rate limiting configured
- [ ] Logging configured
- [ ] Monitoring alerts configured

---

## 🎯 SUCCESS CRITERIA

### Backend Testing Complete When:
1. ✅ All 6 endpoints respond with correct data format
2. ✅ All error scenarios handled gracefully
3. ✅ Response times acceptable (< 1.5s)
4. ✅ Data validation working
5. ✅ Authentication enforced
6. ✅ Load tested successfully

### Frontend Testing Complete When:
1. ✅ Login flow works end-to-end
2. ✅ Project Queue displays real data
3. ✅ Project Detail loads correctly
4. ✅ Risk Simulator analyzes and displays results
5. ✅ Search/filter functionality working
6. ✅ Error messages clear and helpful
7. ✅ No console errors
8. ✅ Responsive on mobile/tablet
9. ✅ Bilingual support verified
10. ✅ All compliance checks passed

---

## 📞 CONTACT & SUPPORT

**Questions about API contract?**
- Review src/services/api.ts for client-side implementation
- Check src/services/ml.ts for ML API base URL
- See RiskSimulatorView.tsx for payload examples
- See ProjectDetailView.tsx for error handling patterns

**Performance tuning?**
- Add caching layer for project list
- Implement pagination efficiently
- Use database indexes on common filters (state, district, risk_level)
- Consider background jobs for heavy ML analysis

**Debugging?**
- Enable browser DevTools Network tab
- Monitor backend logs for API errors
- Test ML API directly: curl https://sih-2026-23oy.onrender.com/api/health
- Use Postman/Insomnia for endpoint testing

---

**Generated:** 2026-08-31 19:25 IST  
**For:** Full-Stack QA Testing  
**Status:** Backend Implementation Required
