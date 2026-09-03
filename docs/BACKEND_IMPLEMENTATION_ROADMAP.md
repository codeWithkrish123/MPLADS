# 🚀 COMPLETE BACKEND IMPLEMENTATION ROADMAP

## Overview

This is a complete implementation plan for all 35+ backend API endpoints needed for the MPLADS system to function fully with the frontend.

---

## 📊 Implementation Phases

### Phase 1: Authentication & Core Data (Week 1)
**Status:** ✅ ALREADY IMPLEMENTED
```
✅ 9 Authentication endpoints
✅ 5 Core data endpoints (states, districts, works)
✅ Audit logging (3 endpoints)

Files:
- authRoutes.ts (559 lines)
- database.ts (268 lines)
- authMiddleware.ts (146 lines)
- emailService.ts (215 lines)
```

### Phase 2: Alerts & Analysis (Week 2)
**Status:** ⏳ NEEDS IMPLEMENTATION
```
📋 8 Alert and analysis endpoints
  - GET /analysis/anomalies
  - GET /analysis/investigations
  - GET /analysis/cost-anomalies
  - GET /analysis/delays
  - GET /analysis/duplicates
  - GET /analysis/compliance
  - GET /audit-logs
  - POST /audit-logs/log

Estimated Lines: 400-500
Dependencies: Phase 1
```

### Phase 3: Dashboard & User Management (Week 3)
**Status:** ⏳ NEEDS IMPLEMENTATION
```
📋 5 Dashboard & user endpoints
  - GET /dashboard/summary
  - GET /analytics/overview
  - GET /user/profile
  - PUT /user/profile
  - GET /user/preferences

Estimated Lines: 200-300
Dependencies: Phase 1
```

### Phase 4: Additional Features (Week 4)
**Status:** ⏳ NEEDS IMPLEMENTATION
```
📋 7 Additional feature endpoints
  - POST /grievances/submit
  - GET /grievances
  - GET /notifications
  - PUT /notifications/{id}/read
  - GET /reports
  - POST /reports/generate
  - GET /export

Estimated Lines: 300-400
Dependencies: Phase 1, 2
```

---

## Phase 2: Alerts & Analysis Implementation

### New File: `src/services/analysisRoutes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authMiddleware } from './authMiddleware';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

// ========== ANOMALIES ENDPOINT ==========
router.get('/anomalies', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('📊 Fetching anomalies for user:', req.user?.email);
    
    // Get anomalies from database based on user role
    const anomalies = [
      {
        id: 'ALERT_001',
        work_id: 'WORK_001',
        work_name: 'Road Construction Project',
        severity: 'HIGH',
        category: 'cost_anomaly',
        message: 'Cost overrun detected - 15% over budget',
        amount: 500000,
        detected_at: new Date().toISOString(),
        status: 'open',
        confidence: 92
      },
      {
        id: 'ALERT_002',
        work_id: 'WORK_002',
        work_name: 'Water Supply Project',
        severity: 'MEDIUM',
        category: 'delay',
        message: 'Project delay detected - 30 days behind schedule',
        days_delayed: 30,
        detected_at: new Date().toISOString(),
        status: 'open',
        confidence: 85
      }
    ];

    res.status(200).json({
      success: true,
      data: anomalies
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch anomalies'
    });
  }
});

// ========== INVESTIGATIONS ENDPOINT ==========
router.get('/investigations', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔍 Fetching risk investigations');
    
    const investigations = [
      {
        id: 'INV_001',
        work_id: 'WORK_001',
        risk_level: 'HIGH',
        reason: 'Cost overrun and material shortage',
        recommendations: [
          'Review budget allocation',
          'Expedite material procurement',
          'Assess contractor performance'
        ],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: 'active'
      }
    ];

    res.status(200).json({
      success: true,
      data: investigations
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch investigations'
    });
  }
});

// ========== COST ANOMALIES ENDPOINT ==========
router.get('/cost-anomalies', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const costAnomalies = [
      {
        work_id: 'WORK_001',
        work_name: 'Road Construction',
        anomaly_type: 'overspend',
        budgeted_amount: 5000000,
        actual_spent: 5500000,
        variance_amount: 500000,
        variance_percentage: 10,
        reason: 'Material price escalation',
        detected_at: new Date().toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: costAnomalies
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cost anomalies'
    });
  }
});

// ========== DELAY PREDICTIONS ENDPOINT ==========
router.get('/delays', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const delays = [
      {
        work_id: 'WORK_001',
        work_name: 'Road Construction',
        scheduled_completion: '2026-12-31',
        predicted_completion: '2027-03-15',
        predicted_delay_days: 75,
        confidence_score: 88,
        primary_cause: 'Resource unavailability',
        impact_level: 'HIGH'
      }
    ];

    res.status(200).json({
      success: true,
      data: delays
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delay predictions'
    });
  }
});

// ========== DUPLICATE DETECTION ENDPOINT ==========
router.get('/duplicates', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const duplicates = [
      {
        id: 'DUP_001',
        works: ['WORK_001', 'WORK_002'],
        similarity_score: 92,
        reason: 'Same beneficiary, overlapping geographic area',
        recommendation: 'Review and consolidate projects',
        detected_at: new Date().toISOString()
      }
    ];

    res.status(200).json({
      success: true,
      data: duplicates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch duplicate detection'
    });
  }
});

// ========== COMPLIANCE ENDPOINT ==========
router.get('/compliance', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const compliance = [
      {
        work_id: 'WORK_001',
        work_name: 'Road Construction',
        issue_type: 'missing_document',
        issue_description: 'Completion certificate pending',
        severity: 'medium',
        deadline: '2026-09-15',
        status: 'pending'
      }
    ];

    res.status(200).json({
      success: true,
      data: compliance
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch compliance issues'
    });
  }
});

export default router;
```

### Add to server.ts:
```typescript
import analysisRoutes from './src/services/analysisRoutes';
app.use('/analysis', analysisRoutes);
```

---

## Phase 3: Dashboard Implementation

### New File: `src/services/dashboardRoutes.ts`

```typescript
import { Router, Request, Response } from 'express';
import { authMiddleware } from './authMiddleware';

const router = Router();

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    name: string;
  };
}

// ========== DASHBOARD SUMMARY ==========
router.get('/summary', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const summary = {
      total_projects: 1500,
      total_budget: 5000000000,
      total_spent: 3500000000,
      utilization_rate: 70,
      on_track: 800,
      at_risk: 400,
      delayed: 300,
      completed: 200,
      alerts_count: 45,
      critical_alerts: 5,
      last_updated: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      data: summary
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard summary'
    });
  }
});

// ========== ANALYTICS OVERVIEW ==========
router.get('/analytics/overview', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const overview = {
      monthly_progress: [
        { month: 'January', completed: 50, ongoing: 150, delayed: 20 },
        { month: 'February', completed: 75, ongoing: 130, delayed: 25 }
      ],
      state_performance: [
        { state: 'UP', score: 85 },
        { state: 'MH', score: 82 }
      ],
      risk_distribution: [
        { risk_level: 'Low', count: 800 },
        { risk_level: 'Medium', count: 400 },
        { risk_level: 'High', count: 300 }
      ]
    };

    res.status(200).json({
      success: true,
      data: overview
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch analytics'
    });
  }
});

export default router;
```

---

## Phase 4: Additional Features

### New File: `src/services/featureRoutes.ts`

```typescript
// Grievances
POST /grievances/submit
GET /grievances?status=open

// Notifications
GET /notifications?limit=20
PUT /notifications/{id}/read

// Reports
GET /reports?type=monthly&month=09
POST /reports/generate
```

---

## Database Schema Changes Needed

### For Phase 2 (Analysis):
```sql
CREATE TABLE anomalies (
  id VARCHAR(50) PRIMARY KEY,
  work_id VARCHAR(50),
  anomaly_type VARCHAR(50),
  severity VARCHAR(20),
  message TEXT,
  detected_at TIMESTAMP,
  status VARCHAR(20)
);

CREATE TABLE investigations (
  id VARCHAR(50) PRIMARY KEY,
  work_id VARCHAR(50),
  risk_level VARCHAR(20),
  recommendations TEXT,
  created_at TIMESTAMP
);
```

### For Phase 3 (Dashboard):
```sql
CREATE TABLE user_preferences (
  user_id VARCHAR(50) PRIMARY KEY,
  theme VARCHAR(20),
  language VARCHAR(10),
  notifications BOOLEAN
);

CREATE TABLE dashboard_metrics (
  metric_id VARCHAR(50) PRIMARY KEY,
  metric_name VARCHAR(100),
  metric_value DECIMAL(15,2),
  updated_at TIMESTAMP
);
```

### For Phase 4 (Features):
```sql
CREATE TABLE grievances (
  id VARCHAR(50) PRIMARY KEY,
  work_id VARCHAR(50),
  description TEXT,
  status VARCHAR(20),
  created_at TIMESTAMP
);

CREATE TABLE notifications (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50),
  message TEXT,
  read BOOLEAN,
  created_at TIMESTAMP
);
```

---

## Implementation Checklist

### Phase 1: ✅ DONE
- [x] Authentication endpoints (9)
- [x] Core data endpoints (5)
- [x] Activity logging (3)
- [x] Email service
- [x] JWT tokens
- [x] RBAC

### Phase 2: ⏳ TODO
- [ ] Anomalies endpoint
- [ ] Investigations endpoint
- [ ] Cost anomalies endpoint
- [ ] Delay predictions endpoint
- [ ] Duplicate detection endpoint
- [ ] Compliance endpoint
- [ ] Database schemas
- [ ] Testing

### Phase 3: ⏳ TODO
- [ ] Dashboard summary endpoint
- [ ] Analytics overview endpoint
- [ ] User profile endpoints
- [ ] User preferences endpoints
- [ ] Database schemas
- [ ] Testing

### Phase 4: ⏳ TODO
- [ ] Grievances endpoints
- [ ] Notifications endpoints
- [ ] Reports endpoints
- [ ] Database schemas
- [ ] Testing

---

## Estimated Timeline

```
Phase 1: ✅ Complete (Already done)
Phase 2: 3-4 days
Phase 3: 2-3 days
Phase 4: 3-4 days

Total: 8-11 days for all phases
```

---

## Testing Strategy

1. **Unit Tests:** Test each endpoint independently
2. **Integration Tests:** Test endpoint chains
3. **Postman:** Use collection to test all endpoints
4. **Load Testing:** Verify performance

---

## Production Deployment

1. Setup PostgreSQL database
2. Run migrations
3. Configure environment variables
4. Deploy backend
5. Deploy frontend
6. Monitor logs and performance

---

