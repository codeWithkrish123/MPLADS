# Sprint 1: Frontend-Backend Integration
## Week 1 - Connect Views to Real API

**Goal**: Wire all frontend views to backend API endpoints  
**Duration**: 2-3 days  
**Status**: Starting Now  
**Difficulty**: Medium (straightforward wiring)

---

## Overview

Currently:
- Frontend displays **mock data** (hardcoded)
- Backend has **11 working endpoints**
- Connection is **missing**

After Sprint 1:
- Frontend calls backend ✅
- Real data displays ✅
- No console errors ✅
- All API calls logged ✅

---

## Task 1: Wire ProjectQueueView to /api/ml/projects

**File**: `src/views/ProjectQueueView.tsx`  
**Endpoint**: `GET /api/ml/projects`  
**Time**: 30 minutes  
**Status**: ⏳ TO DO

### Current Code (Lines 1-50)

```typescript
// PROBLEM: Uses mock data, doesn't call backend
const [projects, setProjects] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(50);
```

### What to Change

**Step 1**: Import useEffect hook (already done)

**Step 2**: Add useEffect to fetch data
```typescript
useEffect(() => {
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall(
        "GET",
        "/api/ml/projects",
        {
          page: currentPage,
          page_size: pageSize,
          risk_level: "HIGH" // Optional filter
        }
      );
      
      // Response structure from backend:
      // {
      //   count: 50,
      //   total_matches: 1240,
      //   page: 1,
      //   page_size: 50,
      //   data: [{ id, name, risk_score, ... }]
      // }
      
      setProjects(response.data || []);
      console.log(`✅ Fetched ${response.count} projects`);
      
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch projects";
      setError(errorMsg);
      console.error("❌ Error fetching projects:", errorMsg);
    } finally {
      setLoading(false);
    }
  };
  
  fetchProjects();
}, [currentPage, pageSize]); // Re-fetch when page changes
```

**Step 3**: Update render to show loading state
```typescript
if (loading) {
  return (
    <div className="flex items-center justify-center h-96">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading projects...</p>
      </div>
    </div>
  );
}
```

**Step 4**: Show error if API call fails
```typescript
if (error) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-800 font-semibold">Error Loading Projects</p>
      <p className="text-red-600 text-sm mt-1">{error}</p>
      <button 
        onClick={() => window.location.reload()}
        className="mt-3 px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
      >
        Retry
      </button>
    </div>
  );
}
```

### Test It
1. Run `npm run dev`
2. Navigate to "Project Queue" in sidebar
3. Should see loading spinner briefly
4. Then see real projects from ML API
5. Check browser console (no errors)

### Expected Output
```
✅ Fetched 50 projects
✅ Projects: [
  { id: "PROJ-001", name: "School Building...", risk_score: 85, ... },
  { id: "PROJ-002", name: "Road Construction...", risk_score: 62, ... },
  ...
]
```

---

## Task 2: Wire RiskSimulatorView to /api/ml/analyze

**File**: `src/views/RiskSimulatorView.tsx`  
**Endpoint**: `POST /api/ml/analyze`  
**Time**: 45 minutes  
**Status**: ⏳ TO DO

### Current Code (Problem)

```typescript
// PROBLEM: Form submission doesn't call backend
const handleAnalyze = () => {
  // Currently just shows mock results
  setAnalysisResult({ /* mock data */ });
};
```

### What to Change

**Step 1**: Add form state
```typescript
const [formData, setFormData] = useState({
  work_id: "",
  district_name: "Pune",
  work_category: "School",
  work_description: "",
  sanctioned_amount: 0,
  total_expenditure: 0,
  sanction_date: new Date().toISOString().split('T')[0],
  work_status: "ongoing"
});

const [analyzing, setAnalyzing] = useState(false);
```

**Step 2**: Update form inputs to track state
```typescript
const handleInputChange = (field: string, value: any) => {
  setFormData(prev => ({
    ...prev,
    [field]: value
  }));
};
```

**Step 3**: Update handleAnalyze to call backend
```typescript
const handleAnalyze = async () => {
  try {
    // Validate required fields
    if (!formData.work_id || !formData.work_description) {
      alert("Please fill in all required fields");
      return;
    }

    setAnalyzing(true);
    console.log("🔄 Analyzing project...", formData);

    const response = await apiCall(
      "POST",
      "/api/ml/analyze",
      formData
    );

    // Response structure:
    // {
    //   analysis_id: "ANAL-001",
    //   risk_score: 85,
    //   risk_category: "CRITICAL",
    //   anomalies_detected: [
    //     { type: "COST_ANOMALY", confidence: 0.94, message: "..." }
    //   ],
    //   recommendations: ["Review budget", "..."]
    // }

    setAnalysisResult(response);
    console.log("✅ Analysis complete:", response);

  } catch (error: any) {
    console.error("❌ Analysis failed:", error);
    alert(`Analysis failed: ${error.message}`);
  } finally {
    setAnalyzing(false);
  }
};
```

**Step 4**: Update button to show loading state
```typescript
<button
  onClick={handleAnalyze}
  disabled={analyzing}
  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
>
  {analyzing ? "Analyzing..." : "Analyze Project"}
</button>
```

### Test It
1. Fill in the form:
   - Work ID: "W-2025-001"
   - Description: "School renovation with lab"
   - Sanctioned Amount: "1000000"
   - Expenditure: "450000"
2. Click "Analyze Project"
3. Should see loading state
4. Results appear with risk score

### Expected Output
```
✅ Analysis complete: {
  risk_score: 85,
  risk_category: "CRITICAL",
  anomalies_detected: [
    {
      type: "COST_ANOMALY",
      confidence: 0.94,
      message: "Project spending 2.25x faster than planned"
    }
  ]
}
```

---

## Task 3: Wire SearchBox to /api/ml/search

**File**: `src/components/common/CommandPalette.tsx`  
**Endpoint**: `GET /api/ml/search`  
**Time**: 45 minutes  
**Status**: ⏳ TO DO

### Current Code (Problem)

```typescript
// PROBLEM: Search doesn't call backend
const [results, setResults] = useState([]);
// Static/empty results only
```

### What to Change

**Step 1**: Add search state and fetch function
```typescript
const [searchQuery, setSearchQuery] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [searching, setSearching] = useState(false);

// Debounced search (don't call API on every keystroke)
useEffect(() => {
  if (!searchQuery || searchQuery.length < 2) {
    setSearchResults([]);
    return;
  }

  const timer = setTimeout(async () => {
    try {
      setSearching(true);
      console.log("🔎 Searching for:", searchQuery);

      const response = await apiCall(
        "GET",
        "/api/ml/search",
        {
          q: searchQuery,
          limit: 20
        }
      );

      // Response structure:
      // {
      //   query: "school renovation",
      //   total_results: 342,
      //   results: [
      //     { id, name, district, relevance }
      //   ]
      // }

      setSearchResults(response.results || []);
      console.log(`✅ Found ${response.results?.length || 0} results`);

    } catch (error: any) {
      console.error("❌ Search failed:", error);
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }, 300); // Wait 300ms after user stops typing

  return () => clearTimeout(timer);
}, [searchQuery]);
```

**Step 2**: Update input to track search query
```typescript
<input
  type="text"
  placeholder="Search projects, districts, rules..."
  value={searchQuery}
  onChange={(e) => setSearchQuery(e.target.value)}
  className="w-full px-3 py-2 border rounded"
/>
```

**Step 3**: Display results with loading state
```typescript
{searching && (
  <div className="p-4 text-center text-slate-500">
    Searching...
  </div>
)}

{!searching && searchResults.length > 0 && (
  <div className="space-y-2">
    {searchResults.map(result => (
      <div
        key={result.id}
        className="p-3 hover:bg-slate-100 cursor-pointer rounded"
        onClick={() => onSelectResult(result)}
      >
        <div className="font-semibold text-sm">{result.name}</div>
        <div className="text-xs text-slate-600">{result.district}</div>
      </div>
    ))}
  </div>
)}

{!searching && searchQuery && searchResults.length === 0 && (
  <div className="p-4 text-center text-slate-500">
    No results found
  </div>
)}
```

### Test It
1. Open the search box (Cmd+K or search button)
2. Type "school" (2+ characters)
3. Should see loading indicator briefly
4. Results appear from ML API search
5. Click a result to navigate

---

## Task 4: Wire AlertCenterView to Real Alerts

**File**: `src/views/AlertCenterView.tsx`  
**Endpoint**: Uses alerts from App.tsx state  
**Time**: 30 minutes  
**Status**: ⏳ TO DO

### Current Code (Problem)

```typescript
// PROBLEM: Shows mock alerts only
interface AlertCenterViewProps {
  alerts: RiskAlert[];  // Already comes from App.tsx
  // But not updated in real-time
}
```

### What to Change

**In App.tsx** (Add real alert fetching):
```typescript
// Add useEffect to fetch alerts periodically
useEffect(() => {
  const fetchAlerts = async () => {
    try {
      // Get all projects to check for high-risk ones
      const response = await apiCall(
        "GET",
        "/api/ml/projects",
        { risk_level: "CRITICAL", page_size: 100 }
      );

      // Convert projects to alerts
      const newAlerts = response.data?.map((project: any) => ({
        id: `ALT-${project.id}`,
        severity: project.risk_score > 80 ? "CRITICAL" : "HIGH",
        work_id: project.id,
        work_name: project.name,
        state: project.state,
        district: project.district,
        category: project.category,
        reason: `Risk Score: ${project.risk_score}% - ${project.anomaly_type || 'Cost Anomaly'}`,
        detected_at: new Date().toLocaleString(),
        confidence: Math.round(project.confidence * 100) || 85,
        status: "Open",
        risk_score: project.risk_score,
        anomaly_type: project.anomaly_type || "Cost Anomaly"
      })) || [];

      setAlerts(newAlerts);
      console.log(`✅ Loaded ${newAlerts.length} alerts`);

    } catch (error: any) {
      console.error("❌ Error fetching alerts:", error);
    }
  };

  fetchAlerts();
  
  // Refresh alerts every 5 minutes
  const interval = setInterval(fetchAlerts, 5 * 60 * 1000);
  
  return () => clearInterval(interval);
}, []);
```

### Test It
1. Navigate to "Alert Center" in sidebar
2. Should see real alerts from high-risk projects
3. Alerts refresh every 5 minutes automatically
4. Click on an alert to see details

---

## Task 5: Add Loading & Error States to All Views

**Files**: All view files  
**Time**: 1 hour  
**Status**: ⏳ TO DO

### Pattern to Follow

Every view should have:

```typescript
// State
const [data, setData] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

// Fetch data
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await apiCall("GET", "/api/endpoint", {});
      setData(response.data || []);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

// Render loading state
if (loading) {
  return <LoadingSpinner />;
}

// Render error state
if (error) {
  return <ErrorMessage error={error} />;
}

// Render data
return <div>{/* display data */}</div>;
```

### Apply to These Views
- [ ] ProjectQueueView (Task 1)
- [ ] RiskSimulatorView (Task 2)
- [ ] SearchBox (Task 3)
- [ ] AlertCenterView (Task 4)
- [ ] MapIntelligenceView
- [ ] CostAnomalyView
- [ ] DelayPredictionView
- [ ] DuplicateDetectionView

---

## Testing Checklist

### After Task 1 (ProjectQueueView)
- [ ] Navigate to "Project Queue"
- [ ] See loading spinner briefly
- [ ] Projects load from API
- [ ] No console errors
- [ ] Pagination works

### After Task 2 (RiskSimulatorView)
- [ ] Fill in form completely
- [ ] Click "Analyze"
- [ ] See loading state
- [ ] Results display
- [ ] Risk score shows correct color
- [ ] Anomalies listed

### After Task 3 (SearchBox)
- [ ] Open search (Cmd+K)
- [ ] Type "school"
- [ ] Results appear
- [ ] Click result navigates
- [ ] Debouncing works (no spam requests)

### After Task 4 (AlertCenterView)
- [ ] Navigate to "Alerts"
- [ ] See real critical alerts
- [ ] Click alert shows details
- [ ] Alerts auto-refresh

### After Task 5 (All Views)
- [ ] All views call API
- [ ] All show loading states
- [ ] All show error states
- [ ] No console errors anywhere
- [ ] Build still passes

---

## API Response Examples

### GET /api/ml/projects Response
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
      "work_id": "W-2025-001",
      "state": "Maharashtra",
      "district": "Pune",
      "sanctioned_cost": 1000000,
      "actual_expenditure": 450000,
      "physical_progress": 45,
      "risk_score": 85,
      "risk_category": "CRITICAL",
      "cost_anomaly_score": 62,
      "delay_score": 78,
      "category": "School"
    }
  ]
}
```

### POST /api/ml/analyze Response
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
  ]
}
```

### GET /api/ml/search Response
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

## Troubleshooting

### Issue: API call returns 422 error
**Solution**: Check the request parameters match Zod schema
- `page` must be >= 1
- `page_size` must be <= 1000
- `risk_level` must be one of: CRITICAL, HIGH, MEDIUM, LOW

### Issue: API call returns 500 error
**Solution**: Check backend is running
```bash
# Make sure server is started
npm run dev

# Check Swagger UI
http://localhost:3000/api/docs
```

### Issue: CORS error in browser
**Solution**: Backend should handle CORS, but if not:
```typescript
// In server.ts (already added)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
```

### Issue: Data not updating
**Solution**: Check useEffect dependencies
```typescript
useEffect(() => {
  fetchData();
}, [currentPage, pageSize]); // Re-run when these change
```

### Issue: Loading state never goes away
**Solution**: Check error handling, add finally block
```typescript
} finally {
  setLoading(false); // Always called, even on error
}
```

---

## Next Steps After Sprint 1

### If Sprint 1 Succeeds ✅
- [ ] All frontend views calling backend
- [ ] No console errors
- [ ] Real data displaying
- [ ] Move to Sprint 2: Database & Caching

### If Sprint 1 Has Issues 🔴
- [ ] Debug API calls (check console)
- [ ] Test in Swagger UI (/api/docs)
- [ ] Verify backend is running
- [ ] Check network tab in browser F12

---

## Code Review Checklist

Before pushing code:

- [ ] All API calls use try/catch
- [ ] Error states handled
- [ ] Loading states visible
- [ ] No console errors
- [ ] No unused variables
- [ ] Comments on complex logic
- [ ] Build passes: `npm run build`
- [ ] Tests pass (if any): `npm test`

---

## Success Criteria

### By End of Day 1:
- [ ] Task 1 complete (ProjectQueueView)
- [ ] Task 2 complete (RiskSimulatorView)

### By End of Day 2:
- [ ] Task 3 complete (SearchBox)
- [ ] Task 4 complete (AlertCenterView)

### By End of Day 3:
- [ ] Task 5 complete (All views updated)
- [ ] All tests passing
- [ ] Code review approved
- [ ] Ready for Sprint 2

---

## Time Estimate

| Task | Time | Status |
|------|------|--------|
| Task 1: ProjectQueueView | 30 min | ⏳ TO DO |
| Task 2: RiskSimulatorView | 45 min | ⏳ TO DO |
| Task 3: SearchBox | 45 min | ⏳ TO DO |
| Task 4: AlertCenterView | 30 min | ⏳ TO DO |
| Task 5: All Views | 60 min | ⏳ TO DO |
| Testing & Debugging | 30 min | ⏳ TO DO |
| **TOTAL** | **240 min** | **= 4 hours** |

---

**Status**: Ready to implement  
**Start Time**: Now  
**Expected Completion**: Today or tomorrow  
**Next Review**: When all tasks done

Let's build! 🚀
