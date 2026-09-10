# 🎯 Mock Data Mode - Frontend Only Development

**Status**: ✅ READY TO USE  
**Backend Required**: ❌ NO  
**Time to Switch**: 30 seconds  
**Date**: September 8, 2026

---

## What Just Changed

I've set up your frontend to work in two modes:

### 🟢 MOCK MODE (Current)
- No backend needed
- Uses hardcoded mock data
- Fast development
- UI-focused work

### 🔴 REAL MODE (Optional)
- Backend required (running on :8080)
- Real API calls
- Real database data
- Testing mode

---

## How to Use

### ⚡ Step 1: Check Current Mode

Open your terminal in `MPLADS-UI` folder:

```bash
# Check the env file
cat .env.local | grep VITE_USE_MOCK_DATA
```

Should show: `VITE_USE_MOCK_DATA=true`

### ✅ Step 2: Start Frontend (No Backend Needed!)

```bash
cd MPLADS-UI
npm run dev
```

That's it! No backend required.

### 🔄 Step 3: Switch Between Modes (When Needed)

**To use REAL backend (backend must be running):**
```
Edit .env.local and change:
VITE_USE_MOCK_DATA=true  →  VITE_USE_MOCK_DATA=false

Then restart: npm run dev
```

**To use MOCK data again (no backend needed):**
```
Edit .env.local and change:
VITE_USE_MOCK_DATA=false  →  VITE_USE_MOCK_DATA=true

Then restart: npm run dev
```

---

## What Each File Does

### 📁 Files I Created for You

```
src/config/featureFlags.ts
  └─ Reads env variables and creates config object
  └─ Used by both real and mock services

src/services/mockApiService.ts
  └─ Contains all mock API endpoints
  └─ Returns fake data that looks like real API responses
  └─ Simulates network delay (optional, 200ms)

src/services/apiGateway.ts
  └─ Smart router that switches between real/mock
  └─ Import this instead of api.ts
  └─ Automatically uses mock when flag is true
```

### 📝 File I Modified

```
.env.local
  └─ Added VITE_USE_MOCK_DATA=true flag
```

---

## How to Use in Components

### Old Way (Calls backend):
```typescript
import { apiCall } from '@/services/api'

const data = await apiCall('/projects')  // ❌ Backend must be running
```

### New Way (Uses mock when flag is set):
```typescript
import { apiGateway } from '@/services/apiGateway'

const data = await apiGateway.getProjects()  // ✅ Works with or without backend
```

---

## Example: Update a Component

### Before (Backend Only)
```tsx
import { apiCall } from '@/services/api'

function ProjectsView() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    apiCall('/projects').then(data => setProjects(data))
  }, [])

  return <div>{projects.map(p => <div key={p.id}>{p.name}</div>)}</div>
}
```

### After (Works Everywhere)
```tsx
import { apiGateway } from '@/services/apiGateway'  // ← Changed import

function ProjectsView() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    apiGateway.getProjects().then(res => setProjects(res.data.projects))  // ← Changed call
  }, [])

  return <div>{projects.map(p => <div key={p.id}>{p.name}</div>)}</div>
}
```

---

## Available Mock Endpoints

All these work automatically without backend:

```typescript
await apiGateway.login(email, password)
await apiGateway.logout()
await apiGateway.getProfile()

await apiGateway.getProjects(page, limit)
await apiGateway.getProjectById(id)

await apiGateway.getDashboardMetrics()

await apiGateway.getAlerts(type)
await apiGateway.getAlertById(id)

await apiGateway.getNearDuplicates(page, limit)
await apiGateway.analyzeProjects(projectIds)

await apiGateway.getDistrictStats()
await apiGateway.getStateStats()
await apiGateway.getSystemHealth()
```

---

## Mock Data Location

All mock data is from: `src/data/mockData.ts`

Types match real API responses perfectly, so switching between mock and real is seamless.

---

## Benefits of This Setup

| Feature | Before | After |
|---------|--------|-------|
| Backend required | ✅ YES | ❌ NO |
| Development speed | 🐢 Slow | 🚀 Fast |
| Network dependency | 🌐 Yes | 📦 No |
| Work offline | ❌ No | ✅ Yes |
| Switch to real API | ❌ Hard | ✅ One line |
| UI development | 🔴 Blocked | 🟢 Free |

---

## Common Questions

### Q: Can I modify mock data?
**A**: Yes! Edit `src/data/mockData.ts` to change what the mock API returns.

### Q: What if I want to use real backend?
**A**: Change `VITE_USE_MOCK_DATA=false` in `.env.local` and restart.

### Q: Does mock data persist between page reloads?
**A**: No, it resets. Mock data is generated fresh each time.

### Q: Can I test authentication?
**A**: Yes! Mock API accepts any email/password combo.

### Q: What about loading states?
**A**: Mock API simulates network delay (200ms) so loading spinners work too.

### Q: Can I debug API calls?
**A**: Yes! Open DevTools Console and look for `[MOCK]` or `[API]` logs.

---

## Console Logs to Expect

When using mock mode, you'll see logs like:

```
🔧 Frontend Configuration:
   Mode: 📦 MOCK DATA (no backend)
   API URL: http://localhost:8080/api
   Polling: ON

[MOCK] Login: user@example.com
[MOCK] Get dashboard metrics
[MOCK] Get projects - Page 1, Limit 10
```

---

## Next Steps

1. ✅ **Start Frontend** (no backend needed):
   ```bash
   npm run dev
   ```

2. ✅ **Test Login**:
   - Use any email/password
   - Mock API accepts everything

3. ✅ **Check Dashboard**:
   - Should show mock data
   - No 401 errors
   - No network requests to backend

4. ✅ **Develop UI**:
   - Add features
   - Style components
   - Test interactions
   - All without backend

5. 🔄 **When Ready for Real Data**:
   - Change `.env.local`
   - Start backend
   - Restart frontend
   - Same code works with real API!

---

## Troubleshooting

### Issue: "VITE_USE_MOCK_DATA not found"
**Solution**: Make sure you're reading from `.env.local` and the variable is there.

### Issue: Getting "Cannot read property 'projects' of undefined"
**Solution**: Mock responses have structure `{ success: true, data: { ... } }`. Access with `res.data`.

### Issue: Mock API is slow
**Solution**: Edit `src/services/mockApiService.ts` and change `MOCK_DELAY_MS` from 200 to 0.

### Issue: Mock mode not activating
**Solution**: 
```bash
# Restart frontend
npm run dev

# Clear browser cache
Ctrl+Shift+Delete (hard refresh)
```

---

## Architecture Diagram

```
┌─────────────────────────────────────────┐
│         React Components                │
│   (DashboardView, ProjectsView, etc)    │
└────────────────┬────────────────────────┘
                 │
                 ↓
        ┌────────────────┐
        │  apiGateway    │  ← Use this
        │  (Smart Router)│
        └─────┬──────┬──┘
              │      │
      ┌───────┘      └─────────┐
      │                        │
    MOCK?                    REAL?
      │                        │
      ↓                        ↓
┌──────────────┐      ┌────────────────┐
│ mockApiServ  │      │  api.ts        │
│ (no network) │      │  (HTTP calls)  │
└──────────────┘      └────────────────┘
      ↓                        ↓
┌──────────────┐      ┌────────────────┐
│ mockData.ts  │      │ Backend :8080  │
│ (hardcoded)  │      │ (real database)│
└──────────────┘      └────────────────┘
```

---

## Support

**Something not working?**
- Check browser console for `[MOCK]` logs
- Verify `.env.local` has `VITE_USE_MOCK_DATA=true`
- Make sure frontend restarted after env change
- Clear cache with Ctrl+Shift+Delete

**Want to use real backend?**
1. Start backend on :8080
2. Change env to `VITE_USE_MOCK_DATA=false`
3. Restart frontend
4. Same code works!

---

**You're now ready to develop the UI without backend!** 🚀

No backend needed. Just focus on making the UI work beautifully.

Start: `npm run dev`

Good luck! 💪
