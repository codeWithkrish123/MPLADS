# 🚀 PRODUCTION DEPLOYMENT PLAN - VERCEL + REAL DATA

**Goal:** Deploy MPLADS-UI to production with real backend data  
**Date:** September 3, 2026  
**Status:** In Progress

---

## 📋 PHASE 1: REMOVE MOCK DATA (IN PROGRESS)

### Files with Mock Data to Clean:
1. **src/data/mockData.ts** - Main mock data file (delete after removing dependencies)
2. **src/context/AuthContext.tsx** - Mock user data (replace with API calls)
3. **src/views/StateIntelligenceView.tsx** - Mock state data (use API)
4. **src/views/DistrictDashboardView.tsx** - Mock district data (use API)
5. **src/views/AuditLogView.tsx** - Mock audit logs (use API)
6. **src/views/ProjectDetailView.tsx** - Mock project data (use API)
7. **src/views/CustomDatasetView.tsx** - Mock datasets (use API)
8. **src/views/MapIntelligenceView.tsx** - Mock map data (use API)
9. **src/views/DuplicateDetectionView.tsx** - Mock duplicates (use API)
10. **src/services/authMiddleware.ts** - Mock authentication
11. **src/services/authRoutes.ts** - Mock routes
12. **src/services/emailService.ts** - Mock email
13. **src/App.tsx** - Mock data fallbacks

### Strategy:
✅ Replace mock data with API calls  
✅ Keep component structure intact  
✅ Use loading/error states  
✅ Fallback to empty states (not mock data)  

---

## 📋 PHASE 2: API INTEGRATION

### Update services to call real API:
- **src/services/api.ts** - Ensure all API endpoints configured
- **src/services/authMiddleware.ts** - Real authentication
- Connect to backend endpoints

---

## 📋 PHASE 3: VERCEL DEPLOYMENT

### Setup Vercel:
1. Connect GitHub repository
2. Configure environment variables
3. Enable auto-deployment on commit
4. Set production domain

### Auto-Deployment:
- ✅ On every commit to `feature/mplad-frontend`
- ✅ Tests run automatically
- ✅ Build on Vercel servers
- ✅ Instant live deployment
- ✅ Automatic rollback if build fails

---

## 📋 PHASE 4: ENVIRONMENT VARIABLES

### Add to Vercel:
```
VITE_API_BASE_URL=https://your-backend-api.com
VITE_API_KEY=your_api_key
NODE_ENV=production
```

---

## 🎯 IMPLEMENTATION STEPS

1. Clean mock data from all views
2. Update API service to use real endpoints
3. Add environment variables
4. Test locally with real API
5. Push to GitHub
6. Deploy to Vercel
7. Enable auto-deployment

---

**Next Step:** Clean mock data from files

