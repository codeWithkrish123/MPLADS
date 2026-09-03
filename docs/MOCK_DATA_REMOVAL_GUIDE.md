# 🧹 MOCK DATA REMOVAL GUIDE

**Objective:** Remove all mock data and prepare frontend for real backend API  
**Date:** September 3, 2026  
**Status:** Ready to Execute

---

## 📋 FILES TO CLEAN

### HIGH PRIORITY (Core Data):
1. **src/views/StateIntelligenceView.tsx**
   - Remove: mockDistricts array (5 items)
   - Keep: Component logic, UI structure
   - Use: Props from parent or API call

2. **src/views/DistrictDashboardView.tsx**
   - Remove: Mock work data
   - Keep: Component logic
   - Use: Real API data

3. **src/views/AuditLogView.tsx**
   - Remove: Mock audit logs
   - Keep: Table structure
   - Use: Real audit data from API

4. **src/views/ProjectDetailView.tsx**
   - Remove: Mock project data
   - Keep: Detail view layout
   - Use: Real project data

### MEDIUM PRIORITY (Services):
5. **src/services/authMiddleware.ts**
   - Remove: Mock user validation
   - Keep: Middleware structure
   - Use: Real backend authentication

6. **src/services/authRoutes.ts**
   - Remove: Mock route handling
   - Keep: Route definitions
   - Use: Real API routes

### LOW PRIORITY (Optional):
7. **src/data/mockData.ts**
   - Can keep as fallback
   - Or delete if not needed

---

## 🎯 REPLACEMENT PATTERN

### Before (with mock):
```typescript
const mockDistricts = [...];
const dataToUse = districts?.length ? districts : mockDistricts;
```

### After (no mock):
```typescript
const dataToUse = districts || [];
// Show empty state if no data
```

Or use loading state:
```typescript
if (isLoading) return <Spinner />;
if (error) return <ErrorMessage />;
if (!data) return <EmptyState />;
return <Table data={data} />;
```

---

## 🔄 RECOMMENDED APPROACH

### Option 1: Complete Removal (RECOMMENDED)
```typescript
// Just use the prop/API data
const [data, setData] = useState([]);

useEffect(() => {
  // Call real API here
  fetchFromAPI().then(setData);
}, []);

// Show empty state if no data
if (!data || data.length === 0) {
  return <EmptyState />;
}

return <Table data={data} />;
```

### Option 2: Keep Fallback (Temporary)
```typescript
// Keep minimal fallback for development
const fallbackData = [];

const dataToUse = data || fallbackData;
```

---

## ✅ CHECKLIST

- [ ] Remove mockDistricts from StateIntelligenceView.tsx
- [ ] Remove mock work data from DistrictDashboardView.tsx
- [ ] Remove mock audit logs from AuditLogView.tsx
- [ ] Remove mock project data from ProjectDetailView.tsx
- [ ] Remove mock data from AuthContext.tsx
- [ ] Remove mock data from CustomDatasetView.tsx
- [ ] Remove mock data from MapIntelligenceView.tsx
- [ ] Remove mock data from DuplicateDetectionView.tsx
- [ ] Update authMiddleware.ts to use real auth
- [ ] Test all views with empty state
- [ ] Commit changes
- [ ] Push to GitHub

---

## 🚀 NEXT STEPS

1. Clean mock data (this document)
2. Add API calls to views
3. Test locally
4. Deploy to Vercel
5. Connect real backend

---

**Status:** Ready to implement  
**Priority:** HIGH  
**Impact:** Makes frontend production-ready

