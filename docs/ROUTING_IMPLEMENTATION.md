# React Router Implementation Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                   Browser URL Bar                        │
│              (e.g., /overview, /alerts)                 │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│              AppRoutes.tsx (Router)                      │
│  ┌──────────────────────────────────────────────────┐   │
│  │ <Routes>                                         │   │
│  │   <Route path="/overview" element={<App />} />   │   │
│  │   <Route path="/alerts" element={<App />} />     │   │
│  │   ...23 more routes...                           │   │
│  │   <Route path="*" element={<Navigate />} />      │   │
│  │ </Routes>                                        │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  App.tsx (Main Component)               │
│  ┌──────────────────────────────────────────────────┐   │
│  │ const navigate = useNavigate()                   │   │
│  │ const location = useLocation()                   │   │
│  │                                                  │   │
│  │ const navigateTo = (view) => {                   │   │
│  │   const path = getRoutePath(view)                │   │
│  │   navigate(path)  // Updates URL                 │   │
│  │   setCurrentView(view) // Updates state          │   │
│  │ }                                                │   │
│  │                                                  │   │
│  │ useEffect(() => {                               │   │
│  │   // Sync URL changes to state                   │   │
│  │   const viewName = extractViewFromPathname()     │   │
│  │   setCurrentView(viewName)                       │   │
│  │ }, [location.pathname])                          │   │
│  │                                                  │   │
│  │ return (                                         │   │
│  │   <Sidebar onSelectView={navigateTo} />         │   │
│  │   <MainContent currentView={currentView} />      │   │
│  │ )                                                │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
         ┌───────────────┴────────────────┐
         ▼                                ▼
    ┌──────────────────┐          ┌──────────────────┐
    │  Sidebar.tsx     │          │ View Components  │
    │  ┌────────────┐  │          │ (Overview, etc)  │
    │  │ <Link>     │  │          │ ┌──────────────┐ │
    │  │ to={path}  │──┼──────────▶ │ navigateTo() │ │
    │  │ </Link>    │  │          │ │ useLocation()│ │
    │  └────────────┘  │          │ └──────────────┘ │
    └──────────────────┘          └──────────────────┘
         │                              │
         └──────────┬───────────────────┘
                    ▼
         ┌──────────────────────┐
         │ routeConfig.ts       │
         │ ┌──────────────────┐ │
         │ │ ROUTE_CONFIG     │ │
         │ │ getRoutePath()   │ │
         │ │ getRouteByName() │ │
         │ │ canAccessRoute() │ │
         │ └──────────────────┘ │
         └──────────────────────┘
```

## File Structure

```
src/
├── App.tsx                          # Main app component (refactored)
├── AppRoutes.tsx                    # Route definitions
├── routes/
│   └── routeConfig.ts               # Centralized route configuration
├── hooks/
│   └── useAppNavigation.ts           # Custom navigation hook
├── components/
│   └── layout/
│       └── Sidebar.tsx              # Updated to use Link components
└── views/
    ├── LandingPage.tsx
    ├── LoginPage.tsx
    ├── NationalOverviewView.tsx
    ├── StateIntelligenceView.tsx
    ├── DistrictDashboardView.tsx
    ├── ... (all other views)
    └── AuditLogView.tsx
```

## Data Flow

### 1. User Clicks Sidebar Item

```
User clicks "Alerts" in Sidebar
    ↓
<Link to="/alerts"> triggers
    ↓
React Router updates URL to "/alerts"
    ↓
location.pathname changes
    ↓
useEffect in App.tsx fires
    ↓
Extract "alerts" from URL path
    ↓
setCurrentView("alerts")
    ↓
App re-renders with alerts view
    ↓
Browser address bar shows: /alerts
```

### 2. Programmatic Navigation (Internal)

```
handleOpenWorkDetail() called
    ↓
navigateTo("duplicate")
    ↓
getRoutePath("duplicate") returns "/duplicate"
    ↓
navigate("/duplicate") - React Router
    ↓
setCurrentView("duplicate") - State
    ↓
URL changes to /duplicate
    ↓
useEffect syncs state
    ↓
DuplicateDetectionView renders
```

### 3. Direct URL Navigation

```
User types: http://localhost/mp-dashboard
    ↓
React Router matches "/mp-dashboard" route
    ↓
location.pathname = "/mp-dashboard"
    ↓
useEffect in App.tsx fires
    ↓
Extract "mpDashboard" from URL
    ↓
setCurrentView("mpDashboard")
    ↓
MPDashboardView renders
    ↓
User sees MP Dashboard
```

## Route Configuration Example

### routeConfig.ts Structure

```typescript
interface RouteConfig {
  path: string;              // URL path: "/overview"
  name: string;              // Route ID: "overview"
  label: string;             // Display name (English)
  labelHi: string;           // Display name (Hindi)
  icon?: string;             // Icon for sidebar
  group?: string;            // Group name for organization
  requiresAuth?: boolean;    // Authentication required
  roles?: UserRole[];        // Allowed roles
  badge?: string;            // Badge text
  description?: string;      // Route description
}

// Example entries:
ROUTE_CONFIG = {
  overview: {
    path: "/overview",
    name: "overview",
    label: "National Overview",
    labelHi: "राष्ट्रीय अवलोकन",
    requiresAuth: true,
    ...
  },
  
  mpDashboard: {
    path: "/mp-dashboard",
    name: "mpDashboard",
    label: "MP Constituency Dashboard",
    roles: ["Member of Parliament"],
    ...
  },
  
  costAnomaly: {
    path: "/cost-anomaly",
    name: "costAnomaly",
    label: "Cost Anomaly & Benchmarks",
    badge: "+220%",
    ...
  }
}
```

## Hook Usage

### useAppNavigation Hook

```typescript
import { useAppNavigation } from "./hooks/useAppNavigation";

function MyComponent() {
  const {
    navigateTo,              // Function to navigate
    getCurrentView,          // Get current view name
    goBack,                  // Navigate back
    goHome,                  // Go to landing
    navigateWithParams,      // Navigate with URL params
    currentPath,             // Current URL path
    currentSearch            // Current query string
  } = useAppNavigation();

  return (
    <>
      <button onClick={() => navigateTo("overview")}>
        Go to Overview
      </button>
      
      <p>Current view: {getCurrentView()}</p>
      <p>Current path: {currentPath}</p>
      
      <button onClick={goBack}>Back</button>
    </>
  );
}
```

## Sidebar Integration

### Before (Button-Based)

```typescript
<button 
  onClick={() => onSelectView("overview")}
>
  National Overview
</button>
```

### After (Link-Based)

```typescript
<Link 
  to="/overview"
  onClick={() => onSelectView("overview")}
>
  <Icon />
  <span>National Overview</span>
</Link>
```

Benefits:
- ✅ Native browser navigation
- ✅ Works with middle-click (open in new tab)
- ✅ Proper semantic HTML
- ✅ Better accessibility
- ✅ URL updates immediately

## URL Format Rules

### Naming Convention

```
✅ Correct (kebab-case, lowercase)
/overview
/cost-anomaly
/mp-dashboard
/state-nodal
/audit-logs
/district-intelligence

❌ Incorrect (camelCase or other formats)
/costAnomaly
/mpDashboard
/Cost-Anomaly
/OVERVIEW
```

### Route Path Mapping

```typescript
Route Name → URL Path → Display
────────────────────────────────
"overview" → "/overview" → National Overview
"costAnomaly" → "/cost-anomaly" → Cost Anomaly Dashboard
"mpDashboard" → "/mp-dashboard" → MP Constituency Dashboard
"stateIntel" → "/state-intelligence" → State Intelligence
"auditLogs" → "/audit-logs" → Audit Logs & History
```

## State Management

### Current View State

```typescript
const [currentView, setCurrentView] = useState("landing");

// Updated in two ways:

// 1. Programmatic navigation
navigateTo("overview"); // Also updates state internally

// 2. URL change (on page load or direct URL navigation)
useEffect(() => {
  const viewFromUrl = extractViewFromPathname(location.pathname);
  setCurrentView(viewFromUrl);
}, [location.pathname]);
```

## Error Handling & Fallbacks

### Redirect for Unknown Routes

```typescript
// In AppRoutes.tsx
<Route path="*" element={<Navigate to="/" replace />} />

// Result: /unknown-page → redirected to /
```

### Backward Compatibility

```typescript
// Old URLs automatically redirect to new format
<Route path="/costAnomaly" element={<Navigate to="/cost-anomaly" replace />} />
<Route path="/mpDashboard" element={<Navigate to="/mp-dashboard" replace />} />

// Result: /costAnomaly → /cost-anomaly
```

## Testing URLs

### Quick Test Cases

1. **Click Sidebar Items**
   - Click each sidebar item
   - Verify URL updates in address bar
   - Verify correct view displays

2. **Direct URL Navigation**
   - Type `/overview` in address bar
   - Type `/alerts` in address bar
   - Type `/mp-dashboard` in address bar
   - Verify correct views display

3. **Browser History**
   - Navigate to 3 different pages
   - Click back button
   - Verify page and URL change correctly

4. **Backward Compatibility**
   - Try old URL: `/costAnomaly`
   - Should redirect to `/cost-anomaly`

5. **Invalid Routes**
   - Try `/unknown-page`
   - Should redirect to `/`

## Performance Considerations

✅ **Lightweight URLs**: No large query parameters  
✅ **Lazy Loading Ready**: Can be added later if needed  
✅ **Efficient Routing**: React Router optimizes rendering  
✅ **No Full Page Reloads**: SPA navigation only  

## Future Enhancements

1. **Query Parameters**
   ```
   /overview?state=UP&district=Ghaziabad
   /alerts?severity=CRITICAL&status=Open
   ```

2. **Dynamic Route Parameters**
   ```
   /work/:workId
   /project/:projectId/details
   ```

3. **Route Guards**
   ```
   Private routes that check authentication
   Role-specific route access
   ```

4. **Analytics**
   ```
   Track page views by URL
   Analyze user navigation patterns
   ```

5. **Dynamic Breadcrumbs**
   ```
   Generate breadcrumbs from URL path
   Allow navigation via breadcrumbs
   ```

---

**Implementation Date**: September 2, 2026  
**React Router Version**: 7.18.3  
**Status**: ✅ Complete and Tested
