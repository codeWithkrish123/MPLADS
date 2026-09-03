# 🔄 ML Sentinel vs Project Irregularity Alerts - DIFFERENCE

## Quick Comparison Table

| Aspect | ML Sentinel & Risk Analysis | Project Irregularity Alerts |
|--------|---------------------------|---------------------------|
| **Data Source** | Real ML API + ML Sentinel projects | Your custom dataset + Manual grievances |
| **Purpose** | Browse & analyze all projects | Manage flagged anomalies |
| **Shows** | ALL projects with risk scores | ONLY high-risk projects (score >= 60) |
| **Data Type** | Complete project information | Alert records (flagged issues) |
| **Action Items** | View details, investigate, analyze | Acknowledge, resolve, export audit trail |
| **Status** | Open, In Progress, Completed | Open, Acknowledged, Resolved |
| **Data Origin** | Remote ML API | Local dataset or system events |

---

## 📊 DETAILED DIFFERENCES

### 1️⃣ **ML Sentinel & Risk Analysis**

**Purpose:** Browse and view ALL projects with risk scores

**Data Source:**
- Remote ML API: `https://sih-2026-23oy.onrender.com/api/projects`
- 100+ real projects with ML analysis
- Real risk scores calculated by ML model

**Shows:**
```
Project 1: work_id = "WS/MP203/2023-24/10748"
           risk_score = 96.48 (CRITICAL)
           reason_codes = [COST_PEER_DEVIATION_EXTREME, ...]
           
Project 2: work_id = "WS/MP204/2023-24/10749"
           risk_score = 92.15 (CRITICAL)
           reason_codes = [MOBILIZATION_DELAY_HIGH, ...]
           
Project 3: work_id = "WS/MP205/2023-24/10750"
           risk_score = 85.32 (CRITICAL)
           
... 97+ more projects ...
```

**What You Can Do:**
- ✅ Browse projects
- ✅ Search by ID, name, district
- ✅ Filter by risk level (CRITICAL, HIGH, MEDIUM, LOW)
- ✅ View project details
- ✅ See investigation recommendations
- ✅ Analyze hypothetical projects (RiskSimulator)
- ✅ View detailed breakdown of anomalies

**Example View:**
```
┌─────────────────────────────────────────────────────┐
│  ML SENTINEL & RISK ANALYSIS                        │
├─────────────────────────────────────────────────────┤
│                                                      │
│  Project Queue (100 projects loaded)                │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ WS/MP203/2023-24/10748                      │   │
│  │ School Building Renovation                  │   │
│  │ Ghaziabad, Uttar Pradesh                    │   │
│  │                                              │   │
│  │ Risk Score: 96.48 🔴 CRITICAL              │   │
│  │ Cost Anomaly: 62%                          │   │
│  │ Delay: 45%                                 │   │
│  │                                              │   │
│  │ [View Details] [Investigate] [Analyze]     │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ WS/MP204/2023-24/10749                      │   │
│  │ Community Health Center                     │   │
│  │ ...                                         │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ... 98 more projects ...                          │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Key Features:**
- Browse 100+ projects from ML API
- Real ML analysis data
- Detailed investigation data
- Risk simulator for hypothetical analysis
- Direct integration with ML Sentinel system

---

### 2️⃣ **Project Irregularity Alerts**

**Purpose:** Manage alerts for HIGH-RISK projects that need action

**Data Source:**
- Your custom dataset uploads
- Manual grievances filed by users
- ONLY projects with risk_score >= 60 become alerts

**Shows:**
```
Alert 1: work_id = "CUSTOM-123-1"
         severity = "CRITICAL" (risk_score 85)
         status = "Open"
         reason = "High-risk project detected: Cost Anomaly 85%"
         detected_at = "31 Aug, 07:52 PM"
         
Alert 2: work_id = "CUSTOM-456-2"
         severity = "HIGH" (risk_score 72)
         status = "Acknowledged"
         reason = "High-risk project detected: Delay 45%"
         
Alert 3: work_id = "GRIEVANCE-789"
         severity = "MEDIUM"
         status = "Open"
         reason = "Citizen Grievance Filed: Project delay reported"
```

**What You Can Do:**
- ✅ Search alerts by work ID, name, reason, district
- ✅ Filter by severity (CRITICAL, HIGH, MEDIUM, LOW)
- ✅ Acknowledge alerts (mark as reviewed)
- ✅ Resolve alerts (mark as investigated)
- ✅ Export alert ledger (CSV) for audit
- ✅ Track audit trail (who, when, what)
- ✅ Update alert status

**Example View:**
```
┌─────────────────────────────────────────────────────┐
│  PROJECT IRREGULARITY ALERTS                        │
├─────────────────────────────────────────────────────┤
│  Operational Triage                                  │
│  12 Active Signals                                   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ CUSTOM-123-1                                │   │
│  │ School Building Renovation                  │   │
│  │ Ghaziabad, Uttar Pradesh                    │   │
│  │                                              │   │
│  │ Severity: 🔴 CRITICAL                      │   │
│  │ Risk Score: 85/100                          │   │
│  │ Reason: Cost Anomaly 85% | Delay 45%      │   │
│  │ Status: ⭕ Open                            │   │
│  │ Detected: 31 Aug, 07:52 PM                │   │
│  │                                              │   │
│  │ [Acknowledge] [Resolve] [View Details]     │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ CUSTOM-456-2                                │   │
│  │ Community Health Center                     │   │
│  │ ...                                         │   │
│  │ Status: ✓ Acknowledged                     │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  [Export Alert Ledger (CSV)]                       │
│                                                      │
└─────────────────────────────────────────────────────┘
```

**Key Features:**
- Alerts for action/review
- Status tracking (Open → Acknowledged → Resolved)
- Audit trail export
- Severity-based filtering
- Administrative triage interface

---

## 🎯 Side-by-Side Workflow Comparison

### ML Sentinel Workflow
```
1. User goes to "ML Sentinel & Risk Analysis"
   
2. System shows 100+ projects from remote ML API
   
3. User searches/filters projects
   
4. User clicks on project for details
   
5. Shows:
   ✓ Full project info
   ✓ Risk breakdown (cost, delay, anomalies)
   ✓ Investigation recommendations
   ✓ Reason codes for anomalies
   
6. User can:
   ✓ View details
   ✓ Analyze risks
   ✓ Check investigation checklist
   ✓ Make decisions based on data
```

### Alerts Workflow
```
1. User uploads custom CSV/JSON dataset
   
2. System auto-generates alerts for high-risk projects (score >= 60)
   
3. User goes to "Project Irregularity Alerts"
   
4. Alerts page shows flagged projects (ONLY those >= 60)
   
5. Shows:
   ✓ Alert ID & severity
   ✓ Project work ID & name
   ✓ Risk reason
   ✓ Current status
   ✓ Detection timestamp
   
6. User can:
   ✓ Search/filter alerts
   ✓ Acknowledge (mark reviewed)
   ✓ Resolve (mark investigated)
   ✓ Export audit trail
```

---

## 📈 Data Relationship

```
ML API (100+ projects)
    │
    ├─ Has projects with all risk levels:
    │  • 92-97 score (CRITICAL)
    │  • 70-91 score (HIGH)
    │  • 60-69 score (MEDIUM)
    │  • 40-59 score (LOW)
    │
    └─ You browse ALL of them

Your Custom Dataset
    │
    ├─ Has projects with all risk scores
    │
    ├─ Filter: risk_score >= 60
    │
    └─ Creates Alerts (only high-risk ones)
```

---

## 💡 Use Cases

### Use **ML Sentinel & Risk Analysis** When:
- ✅ You want to **explore all projects**
- ✅ You want to **see complete risk analysis**
- ✅ You want to **understand WHY a project is high-risk**
- ✅ You want to **analyze hypothetical scenarios** (RiskSimulator)
- ✅ You want **detailed investigation recommendations**
- ✅ You want to **research patterns** across many projects
- ✅ You want **real ML-driven risk assessment**

### Use **Project Irregularity Alerts** When:
- ✅ You want to **manage flagged projects**
- ✅ You want to **track which projects need action**
- ✅ You want to **acknowledge you've reviewed** an alert
- ✅ You want to **mark investigation complete** (Resolved)
- ✅ You want to **maintain audit trail** for compliance
- ✅ You want to **export records** for stakeholders
- ✅ You want **action-oriented view** (not exploratory)

---

## 🔄 How They Work Together

```
Step 1: Upload Custom Dataset
         │
         ▼
Step 2: System generates alerts from high-risk projects
         │
         ├─ Project A: risk_score 85 → Alert ✅
         ├─ Project B: risk_score 72 → Alert ✅
         ├─ Project C: risk_score 45 → No Alert ❌
         │
         ▼
Step 3: View Alerts page
         │
         ├─ See 2 flagged projects
         │
         ├─ Acknowledge Alert 1 (Project A)
         │
         ├─ Resolve Alert 2 (Project B)
         │
         ├─ Export audit trail
         │
         ▼
Step 4: Want more details about Project A?
         │
         └─ Go to ML Sentinel & Risk Analysis
             └─ Search for Project A
             └─ See full analysis, recommendations, etc.
```

---

## 📊 Data Example

### ML Sentinel Shows:
```json
{
  "work_id": "WS/MP203/2023-24/10748",
  "name": "School Building Renovation",
  "state": "Uttar Pradesh",
  "district": "Ghaziabad",
  "category": "Educational Infrastructure",
  
  "risk_score": 96.48,
  "risk_level": "CRITICAL",
  
  "cost_analysis": {
    "sanctioned": 5000000,
    "spent": 3100000,
    "anomaly_percentage": 62
  },
  
  "delay_analysis": {
    "expected_completion": "2026-03-31",
    "predicted_completion": "2026-06-15",
    "delay_days": 76,
    "delay_percentage": 45
  },
  
  "reason_codes": [
    "COST_PEER_DEVIATION_EXTREME",
    "MOBILIZATION_DELAY_HIGH"
  ],
  
  "investigation_checklist": [
    "Review cost breakup against peer projects",
    "Verify payment authorizations",
    "Check material quality reports",
    "Interview site engineer"
  ],
  
  "evidence_confidence_score": 100.0
}
```

### Alerts Shows:
```json
{
  "id": "ALT-WS/MP203-1725126552000-0",
  "severity": "CRITICAL",
  "work_id": "WS/MP203/2023-24/10748",
  "work_name": "School Building Renovation",
  "state": "Uttar Pradesh",
  "district": "Ghaziabad",
  "category": "Educational Infrastructure",
  
  "reason": "High-risk project detected: Risk Score 96.48% | Cost Anomaly: 62% | Delay: 45%",
  
  "detected_at": "31 Aug, 07:52 PM",
  "confidence": 85,
  "status": "Open",
  "risk_score": 96.48,
  "anomaly_type": "Cost Anomaly"
}
```

---

## 🎯 Summary: What's Different?

| Feature | ML Sentinel | Alerts |
|---------|------------|--------|
| **View Type** | Exploratory/Research | Action/Management |
| **Data** | ALL projects (100+) | HIGH-RISK ONLY (>= 60) |
| **Focus** | Analysis & Investigation | Status & Compliance |
| **Data Source** | Remote ML API | Local Dataset + Events |
| **Primary Action** | View details, analyze | Acknowledge, resolve |
| **Output** | Risk insights | Audit trail |
| **Use Case** | "What's wrong?" | "What do I do about it?" |

---

## ❓ Common Questions

**Q: Can I find the same project in both views?**
A: Yes! If a project appears in both:
- ML Sentinel: You see full analysis & details
- Alerts: You see alert status & management options

**Q: Should I go to Alerts first or ML Sentinel first?**
A: Typically:
1. Upload custom dataset
2. Check Alerts (auto-generated from dataset)
3. Go to ML Sentinel to investigate more (optional)
4. Acknowledge/Resolve in Alerts when done

**Q: What if project isn't in Alerts?**
A: It means risk_score < 60 (not flagged). You can still view it in ML Sentinel if available.

**Q: Can I create alerts manually?**
A: Yes! File a grievance, and it becomes an alert automatically.

**Q: Can I export data from ML Sentinel?**
A: ML Sentinel = for exploration (no export currently)
Alerts = Export alert ledger (CSV) for audit

---

**Key Takeaway:**
- **ML Sentinel** = "Explore & Understand"
- **Alerts** = "Act & Report"

They work together but serve different purposes! 🎯

