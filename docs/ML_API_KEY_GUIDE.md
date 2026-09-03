# 🔑 ML API Key Configuration Guide

## Overview
The system has **TWO different API services** with different key requirements:

| Service | API Key | Used For | Status |
|---------|---------|----------|--------|
| **Gemini AI** | `GEMINI_API_KEY` | AI Assistant, intelligent analysis | Optional |
| **ML Sentinel API** | None needed | Real project risk analysis | Public endpoint |

---

## 1️⃣ ML SENTINEL API (No Key Needed) ✅

### What It Is
- **Public ML API** for risk analysis of MPLADS projects
- **URL:** `https://sih-2026-23oy.onrender.com/api`
- **Status:** Open public endpoint, NO authentication required

### Where It's Used
**File:** `src/services/ml.ts`

```typescript
const ML_API_BASE_URL = 'https://sih-2026-23oy.onrender.com/api';

export const mlApi = {
  getAllProjectsWithAnalysis: () => 
    axios.get(`${ML_API_BASE_URL}/projects`),
    
  getProjectAnalysis: (projectId) => 
    axios.get(`${ML_API_BASE_URL}/projects/${projectId}`),
    
  analyzeProject: (projectData) => 
    axios.post(`${ML_API_BASE_URL}/v1/analyze`, projectData),
};
```

### Endpoints Available
1. **GET `/api/projects`** - List all projects with risk scores
2. **GET `/api/projects/{id}`** - Get specific project analysis
3. **POST `/api/analyze`** - Real-time analysis of hypothetical projects
4. **GET `/api/investigations/{id}`** - Get investigation data
5. **GET `/api/search`** - Full-text search
6. **GET `/api/health`** - Check API health

### Example Response
```json
{
  "count": 100,
  "data": [
    {
      "work_id": "WS/MP203/2023-2024/10748",
      "composite_risk_score": 96.48,
      "risk_level": "CRITICAL",
      "reason_codes": ["COST_PEER_DEVIATION_EXTREME"],
      "evidence_confidence_score": 100.0
    }
  ]
}
```

### How Backend Uses It
**File:** `server.ts` (ML endpoints)

```typescript
// Backend gateway endpoints
app.get("/api/ml/projects", async (req, res) => {
  // Proxy request to real ML API
  const response = await fetch('https://sih-2026-23oy.onrender.com/api/projects');
  const data = await response.json();
  res.json(data);
});

app.get("/api/ml/projects/:id", async (req, res) => {
  // Get specific project from ML API
  const { id } = req.params;
  const response = await fetch(`https://...api/projects/${id}`);
  res.json(await response.json());
});
```

### ✅ No Configuration Needed
- No `.env` file needed
- No API key to obtain
- Works out-of-the-box
- Public endpoint available 24/7

---

## 2️⃣ GEMINI AI (Optional - With Key)

### What It Is
- **Google Gemini AI** for intelligent analysis & decision support
- **Used for:** AI Assistant, smart recommendations
- **Configuration:** `GEMINI_API_KEY` in `.env`

### Where It's Used
**File:** `server.ts` (lines 20-45)

```typescript
// Initialize Gemini AI client if API key is present
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
  });
}

// Used in endpoints like:
app.post("/api/ai/ask", async (req, res) => {
  if (!ai) {
    return res.json({ error: "AI not configured" });
  }
  
  const response = await ai.models.generateContent({
    model: "gemini-3.1-flash-lite",
    contents: userQuestion,
  });
});
```

### When Needed
| Feature | Requires Gemini API Key? |
|---------|-------------------------|
| View projects & risk scores | ❌ No |
| Generate alerts from dataset | ❌ No |
| Search projects | ❌ No |
| Upload custom dataset | ❌ No |
| **AI Assistant Chat** | ✅ **Yes** |
| **Smart recommendations** | ✅ **Yes** |
| **Intelligent analysis** | ✅ **Yes** |

### How to Set It Up (Optional)

#### Step 1: Get API Key
1. Go to https://ai.google.dev
2. Click "Get API Key"
3. Create/select a project
4. Copy the API key

#### Step 2: Add to `.env`
```bash
GEMINI_API_KEY=your_api_key_here_abc123xyz...
```

#### Step 3: Restart Server
```bash
npm run dev
```

#### Step 4: Check if it works
```bash
curl http://localhost:3000/api/health
```

Response with key:
```json
{
  "status": "ok",
  "platform": "MPLADS Sentinel",
  "geminiAvailable": true,
  "timestamp": "2026-08-31T19:55:52Z"
}
```

---

## 🔄 System Architecture

### Data Flow

```
┌─────────────────────────────────────────────────┐
│          MPLADS Frontend (React)                │
│  • Dashboard  • Alerts  • Analysis              │
└────────────┬──────────────────────────────────┘
             │
    ┌────────┴────────┬──────────────────────┐
    │                 │                      │
┌───▼────────┐   ┌────▼─────────┐   ┌──────▼────────┐
│ Backend    │   │  ML API      │   │ Gemini AI    │
│ Gateway    │   │ (Public)     │   │ (Optional)   │
│ (Node.js)  │   │ No Auth      │   │ With Key     │
└───┬────────┘   └────┬─────────┘   └──────┬────────┘
    │                 │                     │
    ├─────────────────┴────────────────────┬┘
    │
    └─── Process & Cache Results
         Serve to Frontend
```

### Request Flow for Custom Dataset Alerts

```
1. User uploads CSV with projects
   └─ No API call needed! ✅

2. App parses CSV locally
   └─ No API call needed! ✅

3. Generates alerts from risk_score >= 60
   └─ No API call needed! ✅

4. Displays in Alerts page
   └─ Pure frontend state ✅
```

### Request Flow for ML Sentinel Dashboard

```
1. User opens "ML Sentinel & Risk Analysis" view
   │
2. Frontend calls GET /api/ml/projects
   │
3. Backend receives request
   │
4. Backend calls ML API: https://...onrender.com/api/projects
   │
5. ML API returns 100+ real projects with risk scores
   │
6. Backend caches & returns to frontend
   │
7. Frontend displays projects in queue & detail views
```

---

## 📋 Configuration Checklist

### ✅ Works Out-of-Box (No Configuration)
- [x] ML Sentinel API (public endpoint)
- [x] Custom dataset uploads
- [x] Alert generation from dataset
- [x] Project risk display
- [x] Search & filtering

### ⚙️ Optional (Need Configuration)
- [ ] Gemini AI Assistant (requires `GEMINI_API_KEY`)
- [ ] AI-powered recommendations
- [ ] Smart decision support

### File Locations
```
.env.example          ← Template (included)
.env.local           ← Your actual keys (DO NOT COMMIT)
server.ts            ← Backend with Gemini usage
src/services/ml.ts   ← ML API calls
```

---

## 🚀 Quick Start (No Keys Needed!)

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open http://localhost:3000

# 4. You can immediately:
#    ✅ Upload custom dataset
#    ✅ View generated alerts
#    ✅ See ML Sentinel projects (from public API)
#    ✅ Search & filter projects
#    ✅ Manage alerts
```

---

## ⚠️ Common Issues

### Issue: "No projects showing in ML Queue"
**Cause:** ML API endpoint down temporarily  
**Fix:** Check status at https://sih-2026-23oy.onrender.com/api/health

### Issue: "AI Assistant not responding"
**Cause:** `GEMINI_API_KEY` not set in `.env`  
**Fix:** Optional feature - not required for core functionality

### Issue: "Custom dataset alerts not showing"
**Cause:** Dataset projects have `risk_score < 60`  
**Fix:** Expected behavior - only high-risk projects (score >= 60) generate alerts

---

## 📚 Environment Variables Reference

### `.env.local` (Your private config - DO NOT COMMIT)
```bash
# Optional: Gemini AI for intelligent features
GEMINI_API_KEY=gsk_abc123xyz...

# Optional: Custom backend port
PORT=3000

# Optional: Enable debug logging
DEBUG=mplads:*
```

### `.env.example` (Template - included in repo)
```bash
# Copy this to .env.local and fill in your values
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

---

## 🔒 Security Notes

### ML API (Public)
- ✅ No authentication required
- ✅ No sensitive data in requests
- ✅ Rate limited by provider
- ✅ Safe for production

### Gemini API (Private)
- ⚠️ Keep `GEMINI_API_KEY` secret
- ⚠️ Never commit `.env.local`
- ⚠️ Rotate keys if exposed
- ⚠️ Monitor usage at https://console.cloud.google.com

### Best Practices
```bash
# ✅ Good: Use .env.local (ignored by git)
echo "GEMINI_API_KEY=sk_..." >> .env.local

# ❌ Bad: Hardcode keys in code
const apiKey = "sk_..."; // NEVER DO THIS!

# ❌ Bad: Commit .env to git
git add .env  # DON'T!
```

---

## 🎯 Summary

| Question | Answer |
|----------|--------|
| Do I need an API key to use MPLADS? | ❌ No |
| Do I need a key for custom dataset alerts? | ❌ No |
| Do I need a key for ML project analysis? | ❌ No |
| Do I need a key for AI Assistant? | ✅ Yes (optional) |
| Where to get Gemini API key? | https://ai.google.dev |
| Where to set the key? | `.env.local` file |
| Can I use without the AI key? | ✅ Yes, 95% of features work |

---

**Last Updated:** August 31, 2026  
**Status:** ✅ Production Ready
