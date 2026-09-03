# 🚀 API Integration Quick Reference

## Backend API URL
```
https://sih-2026-pvuc.onrender.com/docs
```

---

## Quick Setup (3 Files)

### 1. Create API Service

**File:** `src/services/mlApi.ts`

```typescript
const BASE_URL = 'https://sih-2026-pvuc.onrender.com';

export const mlAPI = {
  // GET request example
  getDistricts: async () => {
    const res = await fetch(`${BASE_URL}/api/districts`);
    return res.json();
  },

  // POST request example
  analyzeExpenditure: async (data: any) => {
    const res = await fetch(`${BASE_URL}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  // GET with parameter example
  getResults: async (id: string) => {
    const res = await fetch(`${BASE_URL}/api/results/${id}`);
    return res.json();
  }
};
```

---

### 2. Use in Component

**File:** `src/views/DashboardPage.tsx`

```typescript
import { mlAPI } from '../services/mlApi';
import { useEffect, useState } from 'react';

export function DashboardPage() {
  const [districts, setDistricts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    mlAPI.getDistricts()
      .then(data => setDistricts(data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {districts.map(d => (
        <div key={d.id}>{d.name}</div>
      ))}
    </div>
  );
}
```

---

### 3. Handle POST Requests

```typescript
async function handleAnalyze(formData: any) {
  try {
    const result = await mlAPI.analyzeExpenditure(formData);
    console.log('Analysis result:', result);
  } catch (error) {
    console.error('Analysis failed:', error);
  }
}
```

---

## Common Patterns

### Pattern 1: Simple GET
```typescript
const data = await fetch('https://sih-2026-pvuc.onrender.com/api/data')
  .then(r => r.json());
```

### Pattern 2: POST with Body
```typescript
const data = await fetch('https://sih-2026-pvuc.onrender.com/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ key: 'value' })
}).then(r => r.json());
```

### Pattern 3: With Error Handling
```typescript
try {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data;
} catch (error) {
  console.error('API Error:', error);
  throw error;
}
```

### Pattern 4: With Loading State
```typescript
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const data = await mlAPI.getDistricts();
    setData(data);
  } finally {
    setLoading(false);
  }
};
```

---

## Testing in Browser

1. Open: `F12` (DevTools)
2. Go to: `Network` tab
3. Click button that calls API
4. Check:
   - Status: `200` (success)
   - URL: correct endpoint
   - Response: valid JSON

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS Error | Ask backend to enable CORS headers |
| 404 Error | Check API URL is correct |
| Timeout | Backend might be slow, check if it's running |
| Wrong data format | Log response and adjust code |
| "undefined" error | Check if data exists before using |

---

## Folder Structure

```
src/
├─ services/
│  └─ mlApi.ts ← API functions here
├─ views/
│  ├─ Dashboard.tsx ← Use API here
│  └─ Analysis.tsx ← Use API here
└─ components/
   └─ DataTable.tsx ← Use API here
```

---

## Next Steps

1. ✅ Explore: `https://sih-2026-pvuc.onrender.com/docs`
2. ✅ Create: `src/services/mlApi.ts`
3. ✅ Add functions for each endpoint
4. ✅ Import in components
5. ✅ Test in browser DevTools
6. ✅ Display results in UI

Done! 🎉
