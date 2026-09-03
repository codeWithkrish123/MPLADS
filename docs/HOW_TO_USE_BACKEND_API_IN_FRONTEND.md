# 🔗 How to Use Backend API with Frontend

## 📍 What You Got

**ML Developer gave you:**
```
https://sih-2026-pvuc.onrender.com/docs
```

**This is:**
- API Documentation URL (Swagger/OpenAPI)
- Shows all available endpoints
- Shows what data you can send/receive
- Shows request/response formats

---

## 🎯 3 Simple Steps

### **STEP 1: Explore the API Documentation**

**Go to:** `https://sih-2026-pvuc.onrender.com/docs`

**What you'll see:**
- List of all API endpoints
- Each endpoint shows:
  - HTTP method (GET, POST, PUT, DELETE)
  - URL path
  - Parameters needed
  - Response format (JSON)
  - Example requests/responses

**Example:**
```
GET /api/districts
POST /api/analyze
GET /api/results/{id}
```

---

### **STEP 2: Understand the Base URL**

**Base URL:** `https://sih-2026-pvuc.onrender.com`

**To call an endpoint:**
```
https://sih-2026-pvuc.onrender.com + /api/districts
= https://sih-2026-pvuc.onrender.com/api/districts
```

---

### **STEP 3: Create Frontend Code to Call API**

In your React frontend, create API service:

**File:** `src/services/mlApi.ts`

```typescript
// Base URL for ML API
const API_BASE_URL = "https://sih-2026-pvuc.onrender.com";

// Example: Fetch districts data
export async function getDistricts() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/districts`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching districts:", error);
    throw error;
  }
}

// Example: Analyze data
export async function analyzeData(payload: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw error;
  }
}

// Example: Get results by ID
export async function getResults(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/results/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching results:", error);
    throw error;
  }
}
```

---

## 🏗️ How to Integrate Into Components

### **Example Component Using API:**

**File:** `src/views/AnalysisPage.tsx`

```typescript
import React, { useState, useEffect } from 'react';
import { analyzeData, getResults } from '../services/mlApi';

export function AnalysisPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Function to call backend
  async function handleAnalyze() {
    setLoading(true);
    setError(null);
    
    try {
      // Prepare data to send
      const payload = {
        district: "Mumbai",
        year: 2024,
        metrics: ["budget", "expenditure"]
      };
      
      // Call API
      const response = await analyzeData(payload);
      
      // Store results
      setResults(response);
      
    } catch (err) {
      setError("Failed to analyze data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1>Analysis Dashboard</h1>
      
      <button onClick={handleAnalyze} disabled={loading}>
        {loading ? "Analyzing..." : "Run Analysis"}
      </button>
      
      {error && <div style={{color: 'red'}}>{error}</div>}
      
      {results && (
        <div>
          <h2>Results:</h2>
          <pre>{JSON.stringify(results, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
```

---

## 📋 Step-by-Step: Using Backend Data

### **Example: Display Districts in Dropdown**

```typescript
// Step 1: Import the API function
import { getDistricts } from '../services/mlApi';

function DistrictSelector() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Step 2: Fetch data when component loads
  useEffect(() => {
    async function fetchData() {
      try {
        const data = await getDistricts();
        setDistricts(data);
      } catch (error) {
        console.error("Failed to load districts");
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);

  // Step 3: Display in UI
  if (loading) return <div>Loading...</div>;

  return (
    <select>
      <option>Select District</option>
      {districts.map(district => (
        <option key={district.id} value={district.id}>
          {district.name}
        </option>
      ))}
    </select>
  );
}
```

---

## 🔄 Complete Workflow

### **Flow Diagram:**

```
User clicks button in React
        ↓
Component calls API function
        ↓
API function sends HTTP request
        ↓
Request goes to: https://sih-2026-pvuc.onrender.com/api/...
        ↓
Backend (ML) processes request
        ↓
Backend returns JSON response
        ↓
Frontend receives data
        ↓
Component updates UI with results
        ↓
User sees data on screen
```

---

## ✅ Checklist: Setup Backend Integration

```
☑️ Get API documentation URL
   → https://sih-2026-pvuc.onrender.com/docs

☑️ Read documentation
   → Understand endpoints
   → Note request/response format

☑️ Create API service file
   → src/services/mlApi.ts
   → Add functions for each endpoint

☑️ Import in components
   → import { getDistricts } from '../services/mlApi'

☑️ Call API in useEffect
   → Fetch data when component loads

☑️ Display data in UI
   → Map data to components
   → Show loading/error states

☑️ Test in browser
   → Check DevTools Network tab
   → Verify API responses
```

---

## 🛠️ Common Patterns

### **Pattern 1: Simple GET Request**

```typescript
const data = await fetch('https://sih-2026-pvuc.onrender.com/api/data').then(r => r.json());
```

### **Pattern 2: POST with Data**

```typescript
const response = await fetch('https://sih-2026-pvuc.onrender.com/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ /* your data */ })
});
const data = await response.json();
```

### **Pattern 3: With Authentication**

```typescript
const response = await fetch('https://sih-2026-pvuc.onrender.com/api/data', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_TOKEN_HERE'
  }
});
```

---

## 📍 Where to Add Code

### **Your Frontend Structure:**

```
src/
├─ services/
│  ├─ mlApi.ts ← CREATE THIS
│  └─ api.ts (existing)
│
├─ views/
│  ├─ LandingPage.tsx
│  ├─ DashboardPage.tsx ← USE API HERE
│  └─ AnalysisPage.tsx ← USE API HERE
│
└─ components/
   └─ ... (other components)
```

---

## 🔍 Testing Your API Integration

### **In Browser DevTools:**

1. Open: `F12` (DevTools)
2. Go to: `Network` tab
3. Click your button that calls API
4. You should see:
   - `XHR` or `Fetch` request
   - URL: `https://sih-2026-pvuc.onrender.com/...`
   - Status: `200` (success)
   - Response: JSON data

---

## ⚠️ Common Issues & Solutions

### **Issue: "CORS Error"**

**Error message:**
```
Access to XMLHttpRequest at 'https://...' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```

**Solution:** Ask ML developer to enable CORS headers
```
Backend needs to add:
Access-Control-Allow-Origin: *
```

### **Issue: "Cannot read property 'data'"**

**Problem:** API response format different than expected

**Solution:** 
1. Check actual response in DevTools
2. Adjust code to match actual format
3. Log response: `console.log(response)`

### **Issue: "Undefined is not a function"**

**Problem:** API function not imported

**Solution:**
```typescript
// Check import is correct
import { getDistricts } from '../services/mlApi';  // ✅ Correct
```

---

## 🎯 Next Steps

1. **Go to:** `https://sih-2026-pvuc.onrender.com/docs`
2. **Read:** API documentation
3. **Identify:** Which endpoints you need
4. **Create:** API service file
5. **Add:** Functions for each endpoint
6. **Use:** In your React components
7. **Test:** In DevTools Network tab

---

## 📚 Example: Complete Integration

**File: `src/services/mlApi.ts`**
```typescript
const API_URL = "https://sih-2026-pvuc.onrender.com";

export const mlAPI = {
  // Get all districts
  getDistricts: () => 
    fetch(`${API_URL}/api/districts`).then(r => r.json()),

  // Analyze expenditure
  analyzeExpenditure: (data: any) =>
    fetch(`${API_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  // Get predictions
  getPredictions: (year: number) =>
    fetch(`${API_URL}/api/predictions/${year}`).then(r => r.json()),
};
```

**Use in component:**
```typescript
import { mlAPI } from '../services/mlApi';

// In useEffect:
const data = await mlAPI.getDistricts();
```

---

## 🚀 You're Ready!

Now you can:
✅ Call backend APIs from frontend
✅ Display data in React components
✅ Handle loading/error states
✅ Integrate ML predictions
✅ Build complete workflows

**Start by exploring the API docs at:**
```
https://sih-2026-pvuc.onrender.com/docs
```

**Questions?** Read the swagger/OpenAPI documentation there!
