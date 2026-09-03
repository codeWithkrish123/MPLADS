# 🗺️ API Key Usage Map

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    MPLADS SENTINEL SYSTEM                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────────────────────────────────────────────┐      │
│  │  FRONTEND (React)                                    │      │
│  │  • Dashboard                                         │      │
│  │  • Alerts (from custom dataset) ✅ NO KEY NEEDED    │      │
│  │  • ML Projects (from API) ✅ NO KEY NEEDED          │      │
│  │  • Custom Dataset Upload ✅ NO KEY NEEDED           │      │
│  │  • AI Assistant ⚠️ NEEDS GEMINI KEY                │      │
│  └──────────────────┬───────────────────────────────────┘      │
│                     │                                           │
│       ┌─────────────┴──────────────────┐                       │
│       │                                │                       │
│  ┌────▼─────────────────┐      ┌──────▼──────────────────┐    │
│  │  BACKEND (Node.js)   │      │  DIRECT FRONTEND       │    │
│  │  server.ts           │      │  (No Backend Needed)   │    │
│  │                      │      │                        │    │
│  │  Endpoints:          │      │  • CSV parsing         │    │
│  │  /api/health ✅      │      │  • Alert generation    │    │
│  │  /api/ml/* ✅        │      │  • State management    │    │
│  │  /api/ai/ask ⚠️      │      │  • Local rendering     │    │
│  └────┬──────────────────┘      └─────┬──────────────────┘    │
│       │                              │                        │
│       └──────────────────┬───────────┘                        │
│                          │                                    │
│       ┌──────────────────┴──────────────────────┐             │
│       │                                         │             │
│  ┌────▼─────────────────────┐      ┌───────────▼────────┐   │
│  │  ML SENTINEL API         │      │  GEMINI AI         │   │
│  │ (Public - No Key)        │      │ (Requires Key)     │   │
│  │                          │      │                    │   │
│  │  https://sih-2026...     │      │ GEMINI_API_KEY=..  │   │
│  │  /api/projects ✅        │      │                    │   │
│  │  /api/analyze ✅         │      │ Used by:           │   │
│  │  /api/health ✅          │      │ • AI Assistant     │   │
│  │                          │      │ • Smart features   │   │
│  └──────────────────────────┘      └────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Feature to API Key Mapping

### ✅ Features That DON'T Need API Key

```
┌─────────────────────────────────────┐
│  Custom Dataset Upload              │
│  └─ CSV/JSON parsing (local)        │
│  └─ Alert generation (local)        │
│  └─ Risk classification (local)     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  ML Sentinel Dashboard              │
│  └─ GET /api/ml/projects            │
│  └─ GET /api/ml/projects/{id}       │
│  └─ POST /api/ml/analyze            │
│  └─ GET /api/ml/search              │
│  └─ Backend fetches from public API │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Alert Management                   │
│  └─ Search & filter (local)         │
│  └─ Acknowledge/Resolve (local)     │
│  └─ Export ledger (local)           │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Project Analysis                   │
│  └─ View project details            │
│  └─ See risk breakdown              │
│  └─ Investigation checklist         │
└─────────────────────────────────────┘
```

### ⚠️ Features That NEED Gemini API Key

```
┌─────────────────────────────────────┐
│  AI Assistant                       │
│  └─ POST /api/ai/ask                │
│  └─ REQUIRES: GEMINI_API_KEY        │
│  └─ Config: .env.local              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Smart Recommendations              │
│  └─ Intelligent analysis            │
│  └─ REQUIRES: GEMINI_API_KEY        │
│  └─ Config: .env.local              │
└─────────────────────────────────────┘
```

---

## Request Flow Diagram

### Flow 1: Custom Dataset → Alerts (NO KEY NEEDED) ✅

```
┌─────────────────────────────────────────────────────┐
│ User: Upload CSV File                               │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Frontend (React)                                    │
│ • Read file content                                 │
│ • Parse CSV/JSON                                    │
│ └─ ALL LOCAL - NO NETWORK CALL ✅                 │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ App.tsx State                                       │
│ customDataset = [project1, project2, ...]          │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ useEffect Hook (Line 195)                           │
│ • Loop through projects                             │
│ • Check if risk_score >= 60                         │
│ • Generate RiskAlert objects                        │
│ └─ ALL LOCAL - NO NETWORK CALL ✅                 │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ setAlerts(generatedAlerts)                          │
│ State updated with new alerts                       │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ AlertCenterView Component                           │
│ • Display alerts with severity colors              │
│ • Allow search, filter, acknowledge, resolve       │
│ └─ ALL LOCAL - NO NETWORK CALL ✅                 │
└─────────────────────────────────────────────────────┘

✅ ZERO API CALLS NEEDED - NO KEY REQUIRED!
```

---

### Flow 2: ML Sentinel Projects (PUBLIC API - NO KEY) ✅

```
┌─────────────────────────────────────────────────────┐
│ User: Click "ML Sentinel & Risk Analysis"           │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Frontend: Call GET /api/ml/projects                 │
│ (Backend gateway endpoint)                          │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Node.js Backend (server.ts)                         │
│ Receives GET /api/ml/projects                       │
│ └─ NO API KEY NEEDED ✅                            │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Backend forwards to ML API:                         │
│ GET https://sih-2026-23oy.onrender.com/api/projects│
│ └─ PUBLIC ENDPOINT ✅                              │
│ └─ NO AUTHENTICATION REQUIRED ✅                   │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ ML API Response:                                    │
│ {                                                   │
│   "count": 100,                                     │
│   "data": [                                         │
│     {                                               │
│       "work_id": "WS/MP203/...",                   │
│       "risk_score": 96.48,                          │
│       "reason_codes": [...]                         │
│     }                                               │
│   ]                                                 │
│ }                                                   │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Backend returns to Frontend                         │
│ Frontend displays in ProjectQueueView               │
│ • Project cards with risk scores                    │
│ • Click for details                                 │
│ • Investigation data shown                          │
└─────────────────────────────────────────────────────┘

✅ PUBLIC ML API - NO KEY REQUIRED!
```

---

### Flow 3: AI Assistant (REQUIRES GEMINI KEY) ⚠️

```
┌─────────────────────────────────────────────────────┐
│ User: Click "AI Assistant"                          │
│ Type question: "Analyze project WS/MP203/..."       │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Frontend: POST /api/ai/ask                          │
│ Body: {question, context, state, district}         │
└─────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────┐
│ Node.js Backend (server.ts line 72+)                │
│ Check: Is GEMINI_API_KEY in .env?                  │
│                                                     │
│ IF YES ✅                    IF NO ❌               │
│ ├─ ai exists                ├─ ai is null          │
│ └─ Proceed                  └─ Return error        │
└─────────────────────────────────────────────────────┘
                     │
         ┌───────────┴────────────┐
         │                        │
    ✅ With Key                ❌ Without Key
         │                        │
         ▼                        ▼
    ┌─────────────┐          ┌──────────────┐
    │ Call Gemini │          │ Error: AI    │
    │ API with    │          │ not          │
    │ prompt +    │          │ configured  │
    │ context     │          │              │
    └─────────────┘          └──────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ ai.models.generateContent({          │
    │   model: "gemini-3.1-flash-lite",   │
    │   contents: question,                │
    │   config: {                          │
    │     systemInstruction: prompt,       │
    │   }                                  │
    │ })                                   │
    └──────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ Gemini AI Response:                  │
    │ "Based on your data, project        │
    │  WS/MP203/... has high risk of      │
    │  cost inflation due to ..."         │
    └──────────────────────────────────────┘
         │
         ▼
    ┌──────────────────────────────────────┐
    │ Backend returns response             │
    │ Frontend displays in AI panel        │
    └──────────────────────────────────────┘

⚠️ REQUIRES GEMINI_API_KEY in .env.local
```

---

## Configuration Matrix

```
╔════════════════════════════════════════════════════════════╗
║                   API KEY REQUIREMENTS                     ║
╠════════════════════════════════════════════════════════════╣
║ Feature                    │ Key Type     │ Mandatory?     ║
╠════════════════════════════════════════════════════════════╣
║ Custom Dataset Upload      │ None         │ ❌ No         ║
║ Alert Generation           │ None         │ ❌ No         ║
║ ML Sentinel Projects       │ None         │ ❌ No         ║
║ Project Search             │ None         │ ❌ No         ║
║ Project Detail View        │ None         │ ❌ No         ║
║ Alert Management           │ None         │ ❌ No         ║
║ Compliance Center          │ None         │ ❌ No         ║
║ Dashboard Views            │ None         │ ❌ No         ║
║ ──────────────────────────┼──────────────┼────────────── ║
║ AI Assistant               │ Gemini       │ ✅ Yes*       ║
║ Smart Recommendations      │ Gemini       │ ✅ Yes*       ║
╠════════════════════════════════════════════════════════════╣
║ * Optional - works without key, AI features disabled      ║
╚════════════════════════════════════════════════════════════╝
```

---

## Where to Add API Key

### File: `.env.local`

```bash
# DON'T COMMIT THIS FILE TO GIT!

# Optional: Gemini API Key for AI Assistant
GEMINI_API_KEY=gsk_abc123xyz...

# Optional: Backend port
PORT=3000

# Optional: Debug logging
DEBUG=mplads:*
```

### How to Get Gemini API Key

1. Visit: https://ai.google.dev
2. Click "Get API Key"
3. Create/select a Google Cloud project
4. Copy the generated key
5. Paste into `.env.local`
6. Restart: `npm run dev`

---

## File References

### Backend Implementation
- **File:** `server.ts`
- **Lines:** 20-45 (Gemini initialization)
- **Lines:** 72+ (AI Assistant endpoint)

### Frontend Services
- **File:** `src/services/ml.ts`
- **Content:** ML Sentinel API calls (no key needed)

### Frontend State
- **File:** `src/App.tsx`
- **Lines:** 195-235 (Alert generation - no API call)

---

## Summary Table

```
╔═════════════════════════════════════════════════════════════════╗
║                    QUICK REFERENCE                             ║
╠═════════════════════════════════════════════════════════════════╣
║                                                                 ║
║  ❓ "Do I need an API key to use MPLADS?"                     ║
║  ✅ NO - System works perfectly without any key               ║
║                                                                 ║
║  ❓ "Can I upload custom dataset and get alerts?"             ║
║  ✅ YES - Works 100% locally, no API key needed              ║
║                                                                 ║
║  ❓ "Can I view ML Sentinel projects?"                        ║
║  ✅ YES - Public API endpoint, no key needed                 ║
║                                                                 ║
║  ❓ "When do I need an API key?"                              ║
║  ✅ ONLY for AI Assistant (optional feature)                 ║
║                                                                 ║
║  ❓ "Which API key do I need?"                                ║
║  ✅ Gemini API Key (from ai.google.dev)                      ║
║                                                                 ║
║  ❓ "Where to add the key?"                                   ║
║  ✅ In .env.local file as GEMINI_API_KEY                     ║
║                                                                 ║
║  ❓ "What if I don't add the key?"                            ║
║  ✅ App works fine - just AI Assistant won't work            ║
║                                                                 ║
║  ❓ "Is Gemini key free?"                                     ║
║  ✅ Yes - Google gives free quota                            ║
║                                                                 ║
╚═════════════════════════════════════════════════════════════════╝
```

---

**Last Updated:** August 31, 2026  
**Version:** 1.0  
**Status:** ✅ Production Ready
