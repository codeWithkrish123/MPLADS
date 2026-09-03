# 👤 MPLADS ML Sentinel - Complete User Guide

## FOR END USERS: How to Use This Website

---

## 📖 TABLE OF CONTENTS

1. Getting Started
2. Understanding the Dashboard
3. Using Each Page
4. Real-Time Features Explained
5. Common Tasks & How-To
6. Troubleshooting

---

## 1️⃣ GETTING STARTED

### First Time Login

```
Step 1: Open Website
└─ http://localhost:3000 (local)
   OR
   https://mplads-sentinel.gov.in (production)

Step 2: Login
├─ Username: your.username
├─ Password: your.password
└─ Click "Sign In"

Step 3: Dashboard Loads
├─ See your home screen
├─ All data is LIVE from ML system
└─ You're ready to use!
```

### What You'll See

```
┌──────────────────────────────────────────────┐
│ MPLADS SENTINEL - Government Dashboard       │
├──────────────────────────────────────────────┤
│                                              │
│ SIDEBAR (Left)                               │
│ ├─ Dashboard                                 │
│ ├─ National Overview                         │
│ ├─ ML Sentinel & Risk Analysis               │
│ │  ├─ Project Queue (ML)                    │
│ │  └─ Risk Simulator (Test)                 │
│ ├─ Project Irregularity Alerts               │
│ ├─ Custom Dataset & Analyzer                 │
│ ├─ Compliance Center                         │
│ └─ Settings                                  │
│                                              │
│ MAIN CONTENT (Right)                         │
│ ├─ Large dashboard with stats                │
│ ├─ Charts & graphs                           │
│ └─ Quick access buttons                      │
│                                              │
└──────────────────────────────────────────────┘
```

---

## 2️⃣ UNDERSTANDING THE DASHBOARD

### What Each Number Means

```
Dashboard Shows (in Real-Time):

Total Projects:
├─ How many MPLADS projects exist nationwide
└─ Updated from ML API data

Average Risk Score:
├─ Overall risk across all projects
├─ Range: 0-100
├─ Higher = More risky
└─ Color coded: GREEN (safe) → RED (dangerous)

High-Risk Alerts:
├─ Projects flagged by ML system
├─ Need investigation or action
└─ Usually 20-30% of total projects

Anomaly Detection:
├─ Unusual patterns found
├─ Cost inflation
├─ Completion delays
├─ Duplicate work
└─ All flagged for review
```

### Dashboard Colors

```
🟢 GREEN = Low Risk (Score 0-40)
   └─ Safe to proceed normally

🟡 YELLOW = Medium Risk (Score 40-60)
   └─ Review recommended

🟠 ORANGE = High Risk (Score 60-80)
   └─ Investigation needed

🔴 RED = Critical Risk (Score 80-100)
   └─ URGENT action required
```

---

## 3️⃣ USING EACH PAGE

### Page 1: Dashboard
**What it does**: Overview of your projects and alerts

**What you see**:
```
┌─ Top Stats (4 cards)
│  ├─ Total Projects
│  ├─ Average Risk
│  ├─ High Risk Alerts
│  └─ This Month Flagged
│
├─ Charts
│  ├─ Risk distribution graph
│  ├─ Alerts timeline
│  └─ Cost anomaly pie chart
│
└─ Quick Actions
   ├─ View All Alerts
   ├─ Upload Dataset
   └─ View High Risk Projects
```

**How to use**:
- Click on any stat to see details
- Hover on charts for values
- Click "View More" to drill down

---

### Page 2: ML Sentinel & Risk Analysis → Project Queue
**What it does**: Browse ALL 100+ high-risk projects from ML API

**What you see**:
```
SEARCH BOX
├─ Find projects by:
│  ├─ Project ID (WS/MP203/...)
│  ├─ Project name
│  ├─ District
│  └─ Risk level

FILTER BUTTONS (Top)
├─ Risk Level: ALL / CRITICAL / HIGH / MEDIUM / LOW
├─ Category: Infrastructure / Education / Health / etc.
└─ Sort By: Risk Score / Cost / District

PROJECT CARDS (Main Area)
├─ Each card shows ONE project
├─ Project ID
├─ Name & Description
├─ Location (State, District)
├─ Risk Score (color-coded)
├─ Cost breakdown
├─ Delay info
└─ Action buttons
```

**How to use**:

```
Task 1: Find a specific project
├─ Click search box
├─ Type project ID or name
├─ Click Enter or wait 300ms
└─ See filtered results

Task 2: Filter by risk
├─ Click "CRITICAL" button (red)
├─ See only critical projects
├─ Results update instantly

Task 3: View project details
├─ Find project in list
├─ Click "View Details" button
└─ See full analysis page (Page 3)
```

---

### Page 3: Project Details (Deep Dive)
**What it does**: Detailed analysis of ONE specific project

**What you show**:
```
PROJECT HEADER
├─ Project ID
├─ Name & Description
├─ Location map pin
└─ Risk Score (BIG + BOLD)

RISK BREAKDOWN (Horizontal)
├─ Cost Anomaly Score
├─ Delay Risk Score
├─ Duplicate Risk Score
├─ Compliance Score
└─ Each shown as % with color

WHY IS IT RISKY?
├─ Reason Code 1: "Cost is 5738% above average"
├─ Reason Code 2: "Delayed 170 days from start"
├─ Reason Code 3: "Similar project in same district"
├─ Reason Code 4: "Low compliance match"
└─ All with evidence scores

RECOMMENDED CHECKS (Checklist)
├─ ☐ Review cost estimate & Bill of Quantities
├─ ☐ Verify vendor invoices
├─ ☐ Compare material quantities
├─ ☐ Check administrative timeline
├─ ☐ Verify contractor status
├─ ☐ Check for delays/disputes
├─ ☐ Document audit
├─ ☐ Compare with similar projects
├─ ☐ Verify no double-funding
├─ ☐ Confirm project boundaries
├─ ☐ Check compliance with guidelines
└─ ☐ Get detailed scope from agency

ACTION BUTTONS
├─ Print Investigation Report
├─ Flag for Further Review
├─ Mark As Investigated
└─ Export Data
```

**How to use**:

```
Task 1: Understand why project is risky
├─ Read "Reason Codes" section
├─ Scroll through explanations
└─ Understand each anomaly

Task 2: Start investigation
├─ Read "Recommended Checks" section
├─ Start checking items one by one
├─ ✓ Mark as completed
└─ Track progress

Task 3: Export for audit
├─ Click "Export Data"
├─ Choose format (PDF/Excel)
└─ Save to your computer
```

---

### Page 4: Risk Simulator
**What it does**: Test "what-if" scenarios - Enter made-up project, see if it would be flagged

**What you see**:
```
8 INPUT FIELDS (REQUIRED)
├─ 1. Project Name
├─ 2. State
├─ 3. District  
├─ 4. Sanctioned Cost (₹)
├─ 5. Actual Expenditure (₹)
├─ 6. Physical Progress (%)
├─ 7. Financial Progress (%)
└─ 8. Category (dropdown)

RUN ANALYSIS BUTTON
└─ "Analyze This Project"

RESULTS
├─ Real-time risk calculation
├─ Risk Score (0-100)
├─ Risk Level (CRITICAL/HIGH/MEDIUM/LOW)
├─ Reason codes (why it's risky)
├─ Recommendations
├─ Investigation checklist
└─ Full analysis report
```

**How to use**:

```
Example: Test a new project

Step 1: Fill in details
├─ Name: "New School Building"
├─ State: "Uttar Pradesh"
├─ District: "Ghaziabad"
├─ Sanctioned: 5,000,000
├─ Spent: 3,100,000 (62% of budget)
├─ Physical Progress: 35%
├─ Financial: 40%
└─ Category: "Educational"

Step 2: Click "Analyze This Project"
└─ System sends to ML API

Step 3: See results
├─ Risk Score: 72 (HIGH - 🟠 orange)
├─ Reason: "Cost inflation likely, too much spent early"
├─ Recommendation: "Review cost breakdown"
└─ Status: "Needs investigation"

Step 4: Decide action
├─ If low risk: Approve normally
├─ If high risk: Flag for review
└─ Use this to make decisions
```

---

### Page 5: Project Irregularity Alerts
**What it does**: Manage flagged projects from your custom dataset

**What you see**:
```
ALERTS SUMMARY (Top)
├─ Total Active Alerts: X
├─ Critical: Y
├─ High: Z
├─ Medium: W

SEARCH & FILTER
├─ Search by Project ID, Name, Reason, District
├─ Filter by Severity: ALL / CRITICAL / HIGH / MEDIUM
├─ Filter by Status: Open / Acknowledged / Resolved

ALERT LIST (Main)
Each Alert shows:
├─ ⚠️ Alert ID
├─ Project Work ID
├─ Project Name
├─ Location (State, District)
├─ Category
├─ Risk Score & Severity (color)
├─ Why it was flagged (reason)
├─ Current Status (Open / Acknowledged / Resolved)
├─ Detection Timestamp
├─ Action Buttons: Acknowledge / Resolve / View Details

EXPORT BUTTON
└─ "Export Alert Ledger (CSV)"
   └─ For audit compliance
```

**How to use**:

```
Task 1: Review an alert
├─ Click on alert to expand
├─ Read the reason it was flagged
├─ Understand the risk

Task 2: Acknowledge
├─ Click "Acknowledge" button
├─ Status changes to: "Acknowledged"
├─ Meaning: "I've reviewed this, investigation started"

Task 3: Resolve
├─ After investigating...
├─ Click "Resolve" button
├─ Status changes to: "Resolved"
├─ Meaning: "Investigation complete, issue addressed"

Task 4: Export for audit
├─ Click "Export Alert Ledger (CSV)"
├─ Choose format
├─ Send to auditors/stakeholders
└─ Compliance documented ✓
```

---

### Page 6: Custom Dataset & CSV Analyzer
**What it does**: Upload your own project data, analyze it locally

**What you see**:
```
UPLOAD BUTTONS
├─ "Upload CSV / JSON"
├─ "Add Manual Record"
└─ "Load Sample Data"

SUMMARY CARDS (after upload)
├─ Loaded Records: X works
├─ Total Cost: Y crores
├─ Average Risk: Z%
└─ Dataset Status: Active/Empty

DATASET TABLE
Each row shows:
├─ Work ID
├─ Description
├─ Location (District, State)
├─ Category
├─ Sanctioned Cost
├─ Expenditure
├─ Physical Progress %
├─ Risk Score
└─ Action: Inspect / Delete

RISK AUDIT SECTION
├─ Cost Inflation Flags: X works
├─ Duplicate Risk: Y matches
├─ Milestone Delays: Z projects
└─ All problems highlighted
```

**How to use**:

```
Task 1: Upload your data

Step 1: Prepare CSV file
├─ Columns needed:
│  ├─ work_id
│  ├─ description
│  ├─ state
│  ├─ district
│  ├─ category
│  ├─ sanctioned_cost
│  ├─ actual_expenditure
│  ├─ physical_progress
│  └─ risk_score
│
└─ Save as: project_data.csv

Step 2: Upload file
├─ Click "Upload CSV / JSON"
├─ Select file
├─ Click Open

Step 3: System processes
├─ Validates each row
├─ Checks for anomalies
├─ Generates alerts
└─ Ready for analysis

Task 2: Review dataset
├─ See table with all rows
├─ Click on any row for details
├─ Check risk audit section
└─ Understand patterns

Task 3: Export results
├─ Select rows to export
├─ Choose format (CSV/Excel)
└─ Save for analysis
```

---

## 4️⃣ REAL-TIME FEATURES EXPLAINED

### What "Real-Time" Means

```
❌ NOT Real-Time (Outdated)
├─ Data shown is from yesterday
├─ Need to refresh manually
├─ Might miss important updates
└─ Delays in decisions

✅ REAL-TIME (Live)
├─ Data is current as of NOW
├─ Updates instantly when you request
├─ Never missed information
└─ Fast decision-making
```

### How Real-Time Works in This System

```
You click "View Projects"
    ↓
Frontend sends request to Backend (your computer)
    ↓
Backend immediately asks ML API (remote server)
    ↓
ML API searches 70,000+ projects
    ↓
ML API calculates risk scores
    ↓
Results returned to Backend
    ↓
Backend sends to your screen
    ↓
You see latest data (Real-Time!) ✓

Time: ~500ms to 1 second
```

### Which Features Are Real-Time?

| Feature | Real-Time? | Why |
|---------|-----------|-----|
| Project Queue | ✅ YES | Fetches fresh on each view |
| Risk Simulator | ✅ YES | ML API calculates instantly |
| Project Details | ✅ YES | Fresh data each click |
| Alerts (from upload) | ✅ YES | Generated on upload |
| Search | ✅ YES | Live search results |
| Filters | ✅ YES | Update as you change |

---

## 5️⃣ COMMON TASKS & HOW-TO

### Task 1: Find High-Risk Projects
```
1. Click "ML Sentinel & Risk Analysis"
2. Click "Project Queue"
3. Click "CRITICAL" button (red)
4. Wait for results
5. See only critical projects
6. Click on any to investigate
```

### Task 2: Investigate a Risky Project
```
1. Go to Project Queue
2. Find the project
3. Click "View Details"
4. Read the "Why is it risky?" section
5. Follow the recommended checks
6. Mark checks as complete (✓)
7. Click "Mark As Investigated"
```

### Task 3: Upload Your Own Data
```
1. Click "Custom Dataset & CSV Analyzer"
2. Click "Upload CSV / JSON"
3. Select your Excel/CSV file
4. Wait for upload
5. Review the data table
6. Check Risk Audit section
7. Alerts auto-generated!
```

### Task 4: Manage Alerts
```
1. Click "Project Irregularity Alerts"
2. See all flagged projects
3. Click on an alert
4. Click "Acknowledge" (you've seen it)
5. Do your investigation
6. Click "Resolve" (done investigating)
7. Status updated ✓
```

### Task 5: Export for Audit
```
1. Go to any page with data
2. Look for "Export" button
3. Click it
4. Choose format:
   - CSV (Excel)
   - PDF (Print-friendly)
   - JSON (Data experts)
5. Save to your computer
6. Share with auditors
```

---

## 6️⃣ TROUBLESHOOTING

### Problem 1: "Page shows no data"
```
Cause: Backend not running / ML API down

Solution:
├─ Check if backend is running
├─ Run: npm run dev (in terminal)
├─ Wait 10 seconds for startup
├─ Refresh browser (F5)
├─ Try again
```

### Problem 2: "API Error: Not Found"
```
Cause: Old fix not applied / Data format issue

Solution:
├─ Make sure code is latest
├─ Run: npm run build
├─ Restart: npm run dev
├─ Clear browser cache (Ctrl+Shift+Del)
├─ Try again
```

### Problem 3: "Search is not working"
```
Cause: Search endpoint not reached / Empty results

Solution:
├─ Check if data loaded first
├─ Type at least 2 characters
├─ Click Enter or wait 300ms
├─ Check browser console (F12)
├─ Look for error messages
```

### Problem 4: "Upload failed"
```
Cause: File format wrong / Data validation failed

Solution:
├─ Check file format (CSV or JSON only)
├─ Check columns have correct names
├─ Make sure no blank rows
├─ Try smaller file first
├─ Check error message for details
```

### Problem 5: "Risk score seems wrong"
```
Cause: Different calculation method / Missing data

Solution:
├─ ML API uses complex algorithm
├─ Multiple factors considered
├─ Not just one metric
├─ Compare with similar projects
├─ Trust ML calculation
├─ Flag if obviously wrong
```

---

## 🎓 LEARNING PATH FOR NEW USERS

```
Day 1: Basic Understanding
├─ Read this entire guide
├─ Log in to system
├─ Explore Dashboard
└─ See overall layout

Day 2: Explore Project Queue
├─ Go to Project Queue
├─ Browse 100+ projects
├─ Click on a few projects
├─ Read their details
└─ Understand risk scoring

Day 3: Try Risk Simulator
├─ Go to Risk Simulator
├─ Enter test project data
├─ See risk score
├─ Change values
├─ See how score changes
└─ Understand what affects risk

Day 4: Manage Alerts
├─ Upload sample CSV file
├─ See alerts generated
├─ Acknowledge alerts
├─ Resolve alerts
└─ Export audit trail

Day 5: Real Work
├─ Upload your own data
├─ Investigate high-risk projects
├─ Document findings
├─ Export for stakeholders
└─ Regular monitoring
```

---

**Summary**: This system helps you **find risky MPLADS projects in real-time**, **investigate them**, **manage alerts**, and **export audit trails**. All data is **live from ML API**, **up-to-date**, and **ready for decision-making**.
