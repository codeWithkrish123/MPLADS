# 📋 Project Irregularity Alerts - Quick Start

## ❓ What This Page Does
Displays **machine-flagged anomalies** from your dataset that need administrative review, investigation, or audit action.

## ✅ Now Fixed: Alerts Show with Custom Dataset

### Before ❌
- Upload custom dataset → Alerts page empty

### After ✅
- Upload custom dataset → Alerts auto-generated for high-risk projects

---

## 🚀 How to Use

### Step 1: Upload Custom Dataset
1. Go to **"Custom Dataset & CSV Analyzer"** (Sidebar)
2. Click **"Upload CSV / JSON"**
3. Select your file with project data
4. File must have: `work_id`, `risk_score` fields

### Step 2: View Generated Alerts
1. Go to **"Project Irregularity Alerts"** (Sidebar)
2. **Alerts auto-appear** for projects with `risk_score >= 60`

### Step 3: Manage Alerts
```
Search          → Find by work ID, name, reason, district
Filter Severity → CRITICAL, HIGH, MEDIUM
Acknowledge     → Mark "reviewed, under investigation"
Resolve         → Mark "investigation complete"
Export Ledger   → Download alert trail (CSV)
```

---

## 🎯 Alert Severity Mapping

| Risk Score | Severity | Color | Action |
|------------|----------|-------|--------|
| ≥ 80      | CRITICAL | 🔴 Red    | Immediate review needed |
| 70-79     | HIGH     | 🟠 Orange | Priority investigation |
| 60-69     | MEDIUM   | 🟡 Yellow | Standard review |
| < 60      | NONE     | ✅ Green  | No alert |

---

## 📊 What Each Alert Shows

```
├─ Work ID: "WS/MP203/2023-24/10748"
├─ Project Name: "School Building Renovation"
├─ Location: "Ghaziabad, Uttar Pradesh"
├─ Category: "Educational Infrastructure"
├─ Risk Score: 85/100
├─ Severity: CRITICAL
├─ Reason: "High-risk project detected: Cost Anomaly 62% | Delay 45%"
├─ Detected: "31 Aug, 07:52 PM"
├─ Status: Open / Acknowledged / Resolved
└─ Confidence: 85%
```

---

## 🔧 Technical Details

### What Triggers an Alert
- **Condition:** `risk_score >= 60` in your dataset
- **No External Service Needed:** Uses data from your CSV/JSON
- **No API Key Required:** Completely local processing
- **Real-Time:** Alerts generated instantly on upload

### Where Alerts Come From
- ✅ Custom dataset (CSV/JSON upload)
- ✅ Manual grievance filing
- ❌ NOT from ML API (separate system)

### Alert Auto-Cleared When
- Dataset is removed → Alerts cleared
- Dataset updated → Alerts regenerated
- All projects have risk_score < 60 → "No high-risk projects" message

---

## 💡 Common Questions

**Q: Why don't I see alerts?**  
A: Check if your dataset has projects with `risk_score >= 60`. If all scores < 60, no alerts appear (expected behavior).

**Q: Do I need an ML API key?**  
A: No! Alerts are generated from your local dataset. No external service needed.

**Q: Can I acknowledge/resolve alerts?**  
A: Yes! Click "Acknowledge" to mark as reviewed, or "Resolve" to mark as investigated.

**Q: What if I upload a new dataset?**  
A: Old alerts are cleared, new alerts generated from the fresh dataset.

**Q: Can I download the alert trail?**  
A: Yes! Click "Export Alert Ledger (CSV)" for audit records.

---

## ✅ Implementation Status

| Feature | Status |
|---------|--------|
| Alert generation from custom dataset | ✅ Complete |
| Severity classification | ✅ Complete |
| Search & filter | ✅ Complete |
| Acknowledge / Resolve | ✅ Complete |
| Export ledger | ✅ Complete |
| Real-time updates | ✅ Complete |
| Bilingual (EN/HI) | ✅ Complete |

---

## 🎬 Example Workflow

```
1. You have 15 projects in CSV
   ├─ Project A: risk_score = 45 (low)
   ├─ Project B: risk_score = 72 (high)  ← Alert created
   ├─ Project C: risk_score = 88 (critical) ← Alert created
   └─ ... 12 more ...

2. Upload the CSV
   → System generates 2 alerts (B and C)
   → Shows in Alerts page

3. Review alerts
   → See Project B (HIGH): "Cost Anomaly 60%"
   → See Project C (CRITICAL): "Cost Anomaly 85%, Delay 70%"

4. Click on alert
   → View full project details
   → See investigation checklist
   → Flag for follow-up

5. Acknowledge alert
   → Status changes to "Acknowledged"
   → Added to audit log
   → Exported in CSV ledger

6. Export ledger
   → Download all alert records
   → Share with stakeholders
   → Archive for compliance
```

---

**Last Updated:** August 31, 2026  
**Status:** ✅ Production Ready
