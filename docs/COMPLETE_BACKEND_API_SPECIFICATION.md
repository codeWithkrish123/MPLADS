# 📋 COMPLETE BACKEND API SPECIFICATION

## All Endpoints Used by Frontend

This document lists ALL backend API endpoints that the frontend needs to fully function.

---

## 🔑 Authentication Endpoints (9 endpoints)

### 1. GovID Login
```
POST /auth/login-with-role

Request:
{
  "email": "admin.mospi@nic.in",
  "password": "demo_password",
  "role": "ministry",
  "department": "Ministry of Statistics"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": {
    "id": "user_1",
    "email": "admin.mospi@nic.in",
    "role": "ministry",
    "name": "admin",
    "department": "Ministry of Statistics"
  },
  "expiresIn": 86400
}
```

### 2. OTP Request
```
POST /auth/otp/request

Request:
{
  "email": "user@nic.in",
  "channel": "email"
}

Response:
{
  "success": true,
  "message": "OTP sent to your email",
  "otpId": "otp_1234567890",
  "expiresIn": 300
}
```

### 3. OTP Verify
```
POST /auth/otp/verify

Request:
{
  "otpId": "otp_1234567890",
  "otp": "123456",
  "email": "user@nic.in"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": { ... },
  "expiresIn": 86400
}
```

### 4. OTP Resend
```
POST /auth/otp/resend

Request:
{
  "otpId": "otp_1234567890"
}

Response:
{
  "success": true,
  "message": "OTP resent to your email",
  "expiresIn": 300
}
```

### 5. Parichay SSO Initiate
```
POST /auth/parichay/initiate

Request:
{
  "redirectUrl": "http://localhost:5173/auth/parichay/callback"
}

Response:
{
  "success": true,
  "authUrl": "https://parichay.gov.in/oauth/authorize?...",
  "state": "base64_state"
}
```

### 6. Parichay Callback
```
POST /auth/parichay/callback

Request:
{
  "code": "authorization_code",
  "state": "state_value"
}

Response:
{
  "success": true,
  "token": "JWT_TOKEN",
  "user": { ... },
  "expiresIn": 86400
}
```

### 7. Validate Token
```
POST /auth/validate

Headers:
Authorization: Bearer JWT_TOKEN

Request:
{
  "token": "JWT_TOKEN"
}

Response:
{
  "success": true,
  "valid": true,
  "user": {
    "id": "user_1",
    "email": "admin.mospi@nic.in",
    "role": "ministry"
  },
  "expiresIn": 85000
}
```

### 8. Get Roles
```
GET /auth/roles

Response:
{
  "success": true,
  "roles": ["ministry", "mp", "district", "state_nodal", "agency"]
}
```

### 9. Logout
```
POST /auth/logout

Headers:
Authorization: Bearer JWT_TOKEN

Request:
{}

Response:
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 📊 Data Endpoints (Dashboard & Analysis)

### 10. Get All States
```
GET /data/states

Response:
{
  "success": true,
  "data": [
    {
      "code": "UP",
      "name": "Uttar Pradesh",
      "projects_count": 150,
      "budget": 500000000,
      "utilization": 75.5
    },
    ...
  ]
}
```

### 11. Get State by Code
```
GET /data/states/{stateCode}

Response:
{
  "success": true,
  "data": {
    "code": "UP",
    "name": "Uttar Pradesh",
    "projects_count": 150,
    "budget": 500000000,
    "utilization": 75.5,
    "projects": [ ... ],
    "statistics": { ... }
  }
}
```

### 12. Get All Districts
```
GET /data/districts

Response:
{
  "success": true,
  "data": [
    {
      "id": "DIST_001",
      "code": "GZ",
      "name": "Ghaziabad",
      "state": "UP",
      "projects_count": 25,
      "budget": 50000000
    },
    ...
  ]
}
```

### 13. Get Districts by State
```
GET /data/districts?state=Uttar Pradesh

Response:
{
  "success": true,
  "data": [
    {
      "id": "DIST_001",
      "code": "GZ",
      "name": "Ghaziabad",
      "state": "UP",
      "projects_count": 25,
      "budget": 50000000
    },
    ...
  ]
}
```

### 14. Get District by ID
```
GET /data/districts/{districtId}

Response:
{
  "success": true,
  "data": {
    "id": "DIST_001",
    "code": "GZ",
    "name": "Ghaziabad",
    "state": "UP",
    "projects_count": 25,
    "budget": 50000000,
    "projects": [ ... ]
  }
}
```

### 15. Get All Works/Projects
```
GET /data/works?page=1&limit=20&state=Uttar Pradesh&status=ongoing

Response:
{
  "success": true,
  "data": [
    {
      "work_id": "WORK_001",
      "name": "Road Construction",
      "state": "UP",
      "district": "Ghaziabad",
      "budget": 5000000,
      "spent": 3500000,
      "status": "ongoing",
      "progress": 70,
      "risk_score": 45,
      "description": "..."
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

### 16. Get Work by ID
```
GET /data/works/{workId}

Response:
{
  "success": true,
  "data": {
    "work_id": "WORK_001",
    "name": "Road Construction",
    "state": "UP",
    "district": "Ghaziabad",
    "budget": 5000000,
    "spent": 3500000,
    "status": "ongoing",
    "progress": 70,
    "risk_score": 45,
    "cost_anomaly_score": 15,
    "delay_score": 30,
    "description": "...",
    "timeline": { ... },
    "stakeholders": [ ... ],
    "documents": [ ... ]
  }
}
```

### 17. Search Works
```
GET /data/works?search=road

Response:
{
  "success": true,
  "data": [
    {
      "work_id": "WORK_001",
      "name": "Road Construction",
      ...
    },
    ...
  ]
}
```

---

## 🚨 Alert & Analysis Endpoints (8 endpoints)

### 18. Get All Alerts
```
GET /analysis/anomalies

Response:
{
  "success": true,
  "data": [
    {
      "id": "ALERT_001",
      "work_id": "WORK_001",
      "work_name": "Road Construction",
      "severity": "HIGH",
      "category": "cost_anomaly",
      "message": "Cost overrun detected",
      "detected_at": "2026-09-01T10:30:00Z",
      "status": "open"
    },
    ...
  ]
}
```

### 19. Get Risk Investigations
```
GET /analysis/investigations

Response:
{
  "success": true,
  "data": [
    {
      "id": "INV_001",
      "work_id": "WORK_001",
      "risk_level": "HIGH",
      "reason": "Cost overrun and delay",
      "recommendations": [ ... ],
      "created_at": "2026-09-01T10:30:00Z"
    },
    ...
  ]
}
```

### 20. Get Cost Anomalies
```
GET /analysis/cost-anomalies

Response:
{
  "success": true,
  "data": [
    {
      "work_id": "WORK_001",
      "work_name": "Road Construction",
      "anomaly_type": "overspend",
      "amount": 500000,
      "percentage": 15,
      "detected_at": "2026-09-01T10:30:00Z"
    },
    ...
  ]
}
```

### 21. Get Delay Predictions
```
GET /analysis/delays

Response:
{
  "success": true,
  "data": [
    {
      "work_id": "WORK_001",
      "work_name": "Road Construction",
      "expected_completion": "2026-12-31",
      "predicted_delay": "2027-03-31",
      "delay_days": 90,
      "confidence": 85
    },
    ...
  ]
}
```

### 22. Get Duplicate Detection
```
GET /analysis/duplicates

Response:
{
  "success": true,
  "data": [
    {
      "id": "DUP_001",
      "works": ["WORK_001", "WORK_002"],
      "similarity": 92,
      "reason": "Same beneficiary, overlapping areas"
    },
    ...
  ]
}
```

### 23. Get Compliance Issues
```
GET /analysis/compliance

Response:
{
  "success": true,
  "data": [
    {
      "work_id": "WORK_001",
      "issue_type": "missing_document",
      "description": "Completion certificate pending",
      "severity": "medium",
      "deadline": "2026-09-15"
    },
    ...
  ]
}
```

### 24. Get Audit Logs
```
GET /audit-logs?user=admin@nic.in&action=LOGIN

Response:
{
  "success": true,
  "data": [
    {
      "id": "LOG_001",
      "action": "LOGIN",
      "user": "admin@nic.in",
      "role": "ministry",
      "timestamp": "2026-09-01T10:30:00Z",
      "status": "success"
    },
    ...
  ]
}
```

### 25. Log Activity
```
POST /audit-logs/log

Request:
{
  "action": "VIEW_WORK",
  "details": {
    "work_id": "WORK_001",
    "role": "ministry"
  },
  "timestamp": "2026-09-01T10:30:00Z"
}

Response:
{
  "success": true,
  "message": "Activity logged"
}
```

---

## 💾 Additional Endpoints (Data Management)

### 26. Get Dashboard Summary
```
GET /dashboard/summary

Response:
{
  "success": true,
  "data": {
    "total_projects": 1500,
    "total_budget": 5000000000,
    "total_spent": 3500000000,
    "utilization_rate": 70,
    "on_track": 800,
    "at_risk": 400,
    "delayed": 300,
    "completed": 200,
    "alerts_count": 45,
    "critical_alerts": 5
  }
}
```

### 27. Get Analytics Data
```
GET /analytics/overview

Response:
{
  "success": true,
  "data": {
    "monthly_progress": [ ... ],
    "state_performance": [ ... ],
    "risk_distribution": [ ... ],
    "budget_utilization": [ ... ]
  }
}
```

### 28. Get User Profile
```
GET /user/profile

Headers:
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "data": {
    "id": "user_1",
    "email": "admin.mospi@nic.in",
    "name": "Admin Officer",
    "role": "ministry",
    "department": "Ministry of Statistics",
    "permissions": [ ... ],
    "preferences": { ... }
  }
}
```

### 29. Update User Profile
```
PUT /user/profile

Headers:
Authorization: Bearer JWT_TOKEN

Request:
{
  "name": "Updated Name",
  "preferences": {
    "theme": "dark",
    "language": "hi"
  }
}

Response:
{
  "success": true,
  "data": { ... }
}
```

### 30. Get User Preferences
```
GET /user/preferences

Headers:
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "data": {
    "theme": "dark",
    "language": "en",
    "notifications": true
  }
}
```

---

## 📝 Additional Features Endpoints

### 31. Submit Grievance
```
POST /grievances/submit

Request:
{
  "work_id": "WORK_001",
  "description": "Issue with project execution",
  "attachments": [ ... ],
  "priority": "high"
}

Response:
{
  "success": true,
  "grievance_id": "GR_001",
  "status": "submitted"
}
```

### 32. Get Grievances
```
GET /grievances?status=open&work_id=WORK_001

Response:
{
  "success": true,
  "data": [
    {
      "id": "GR_001",
      "work_id": "WORK_001",
      "description": "Issue description",
      "status": "open",
      "created_at": "2026-09-01"
    },
    ...
  ]
}
```

### 33. Get Notifications
```
GET /notifications?limit=20

Headers:
Authorization: Bearer JWT_TOKEN

Response:
{
  "success": true,
  "data": [
    {
      "id": "NOTIF_001",
      "type": "alert",
      "message": "High risk alert for WORK_001",
      "read": false,
      "created_at": "2026-09-01T10:30:00Z"
    },
    ...
  ]
}
```

### 34. Mark Notification as Read
```
PUT /notifications/{notificationId}/read

Response:
{
  "success": true,
  "message": "Notification marked as read"
}
```

### 35. Get Reports
```
GET /reports?type=monthly&month=09&year=2026

Response:
{
  "success": true,
  "data": {
    "report_id": "RPT_001",
    "type": "monthly",
    "period": "September 2026",
    "summary": { ... },
    "details": [ ... ],
    "generated_at": "2026-09-01"
  }
}
```

---

## 📋 Total API Count

- **Authentication:** 9 endpoints
- **Data Management:** 8 endpoints
- **Alerts & Analysis:** 8 endpoints
- **Additional Features:** 7 endpoints
- **User Management:** 3 endpoints

**TOTAL: 35+ Backend Endpoints**

---

## Implementation Priority

### Phase 1 (Critical - Must Have)
```
✅ 9 Authentication endpoints
✅ 5 Core data endpoints (states, districts, works)
✅ 5 Alert endpoints
✅ 3 Activity logging endpoints
```

### Phase 2 (Important - Should Have)
```
✅ Dashboard summary endpoint
✅ User profile endpoints
✅ Notification endpoints
```

### Phase 3 (Nice to Have)
```
✅ Grievance management
✅ Report generation
✅ Advanced analytics
```

---

## Response Format Standard

All endpoints follow this format:

### Success (200)
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional message"
}
```

### Error (400/422/401/500)
```json
{
  "success": false,
  "error": "Error message",
  "validationErrors": [
    {
      "loc": ["field"],
      "msg": "Error description",
      "type": "error_type"
    }
  ]
}
```

---

## Testing with Postman

Use the provided Postman collection to test all 35+ endpoints:
- Import: MPLADS_API_Postman_Collection_Complete.json
- Follow: POSTMAN_TESTING_GUIDE.md

---

