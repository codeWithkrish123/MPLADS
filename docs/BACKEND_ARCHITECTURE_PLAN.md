# 🏗️ MPLADS Backend Architecture Plan

## 📌 Executive Summary

```
FRONTEND: React + TypeScript (✅ Already Built)
BACKEND: Node.js/FastAPI (To Build)
ML: Separate Service (ML Developer's Responsibility)
Database: PostgreSQL
Cache: Redis
Deployment: Docker + Docker Compose
```

---

## 🎯 Part 1: Understanding Your Frontend

### **Frontend Pages That Need Backend:**

```
AUTHENTICATION:
├─ SignInPage → POST /auth/login
├─ RoleSelectorPage → GET /auth/roles
└─ LogoutPage → POST /auth/logout

DASHBOARDS (Need Data):
├─ NationalOverviewView → GET /dashboard/national
├─ StateIntelligenceView → GET /dashboard/state/:stateId
├─ DistrictDashboardView → GET /dashboard/district/:districtId
├─ MPDashboardView → GET /dashboard/mp/:mpId
├─ StateNodalDashboardView → GET /dashboard/nodal/:nodalId
└─ PublicDashboard → GET /dashboard/public

ANALYSIS VIEWS (Need ML + Data):
├─ ExpenditureProgressView → GET /analysis/expenditure
├─ DelayPredictionView → POST /analysis/predict-delays (ML)
├─ CostAnomalyView → POST /analysis/anomalies (ML)
├─ DuplicateDetectionView → POST /analysis/duplicates (ML)
└─ WorkIntelligenceTableView → GET /data/works

SPECIALIZED:
├─ MapIntelligenceView → GET /map/districts
├─ AlertCenterView → GET /alerts
├─ ComplianceCenterView → GET /compliance
├─ AuditLogView → GET /audit-logs
├─ AIAssistantView → POST /chat (AI)
└─ CustomDatasetView → POST /datasets/custom
```

---

## 🛠️ Tech Stack Recommendation

### **Option 1: Node.js + Express (Fast Setup)**

```
PROS:
✅ Same language as frontend developers
✅ Quick to build
✅ Good for REST APIs
✅ Easy integration with React

CONS:
❌ Slower for heavy computation
❌ Less suitable for ML workloads
```

### **Option 2: FastAPI (Python - RECOMMENDED)**

```
PROS:
✅ Perfect for ML integration
✅ Very fast performance
✅ Auto-generated API docs (Swagger)
✅ Built-in data validation
✅ Excellent ML ecosystem

CONS:
❌ Different language
❌ Slightly more setup
```

### **RECOMMENDATION: FastAPI**

Why? You have ML developers. FastAPI is designed for ML+API.

---

## 📦 Infrastructure Stack

### **Technology Choices:**

```
BACKEND FRAMEWORK: FastAPI (Python)
WEB SERVER: Uvicorn
DATABASE: PostgreSQL
CACHE: Redis
BACKGROUND JOBS: Celery
MESSAGE QUEUE: RabbitMQ (or Redis)
CONTAINERIZATION: Docker
ORCHESTRATION: Docker Compose
```

---

## 🏛️ Backend Architecture

### **Folder Structure:**

```
backend/
├─ app/
│  ├─ __init__.py
│  ├─ main.py (Entry point)
│  ├─ config.py (Configuration)
│  ├─ dependencies.py (Shared dependencies)
│  │
│  ├─ api/
│  │  ├─ __init__.py
│  │  ├─ auth.py (Authentication endpoints)
│  │  ├─ dashboard.py (Dashboard endpoints)
│  │  ├─ analysis.py (Analysis endpoints)
│  │  ├─ data.py (Data endpoints)
│  │  └─ ml.py (ML integration endpoints)
│  │
│  ├─ models/
│  │  ├─ __init__.py
│  │  ├─ user.py
│  │  ├─ dashboard.py
│  │  ├─ expenditure.py
│  │  ├─ work.py
│  │  └─ district.py
│  │
│  ├─ schemas/
│  │  ├─ __init__.py
│  │  ├─ user.py (Request/response validation)
│  │  ├─ dashboard.py
│  │  ├─ analysis.py
│  │  └─ error.py
│  │
│  ├─ services/
│  │  ├─ __init__.py
│  │  ├─ auth_service.py (Authentication logic)
│  │  ├─ dashboard_service.py (Dashboard logic)
│  │  ├─ analysis_service.py (Analysis logic)
│  │  ├─ ml_service.py (ML integration)
│  │  └─ cache_service.py (Caching logic)
│  │
│  ├─ database/
│  │  ├─ __init__.py
│  │  ├─ connection.py (DB connection)
│  │  ├─ session.py (Session management)
│  │  └─ migrations/ (Alembic migrations)
│  │
│  ├─ utils/
│  │  ├─ __init__.py
│  │  ├─ logger.py
│  │  ├─ exceptions.py
│  │  ├─ validators.py
│  │  └─ decorators.py
│  │
│  ├─ ml/
│  │  ├─ __init__.py
│  │  └─ ml_client.py (Call external ML API)
│  │
│  └─ cache/
│     ├─ __init__.py
│     └─ redis_client.py
│
├─ tests/
│  ├─ __init__.py
│  ├─ test_auth.py
│  ├─ test_dashboard.py
│  └─ test_analysis.py
│
├─ requirements.txt
├─ Dockerfile
├─ docker-compose.yml
├─ .env.example
└─ README.md
```

---

## 📝 Core APIs to Build

### **1. Authentication APIs**

```python
POST /auth/register
├─ Input: email, password, role
├─ Output: token, user_id
└─ Database: Users table

POST /auth/login
├─ Input: email, password
├─ Output: access_token, refresh_token
└─ Validation: Check credentials

POST /auth/logout
├─ Input: token
├─ Action: Invalidate token
└─ Redis: Remove from cache

GET /auth/roles
├─ Output: [admin, state_nodal, mp, citizen]
└─ Cache: 1 day
```

### **2. Dashboard APIs**

```python
GET /dashboard/national
├─ Output: National stats, charts data
├─ Data Source: PostgreSQL
├─ Cache: 1 hour (Redis)
└─ Fields: total_funds, states_count, districts_count, works_count

GET /dashboard/state/{state_id}
├─ Output: State-wise dashboard
├─ Filter: By state_id
├─ Cache: 30 minutes
└─ Fields: budget, expenditure, progress, delays

GET /dashboard/district/{district_id}
├─ Output: District-wise dashboard
├─ Filter: By district_id
├─ Cache: 30 minutes
└─ Nested: Works, expenditure data

GET /dashboard/mp/{mp_id}
├─ Output: MP specific data
├─ Filter: By mp_id
└─ Fields: constituency works, budget
```

### **3. Analysis APIs (ML Integration)**

```python
POST /analysis/predict-delays
├─ Input: work_id, historical_data
├─ Calls: ML Service
├─ Output: delay_probability, predicted_date
├─ Processing: Async (Celery job)
└─ Cache: Results for 1 day

POST /analysis/anomalies
├─ Input: expenditure_data
├─ Calls: ML Service
├─ Output: anomalies, risk_score
├─ Algorithm: Isolation Forest

POST /analysis/duplicates
├─ Input: work_data
├─ Calls: ML Service
├─ Output: duplicate_matches, similarity_score
├─ Algorithm: NLP similarity

GET /analysis/expenditure
├─ Output: Expenditure trends
├─ Data Source: Works table
├─ Aggregation: Group by state, district, time
└─ Cache: 2 hours
```

### **4. Data APIs**

```python
GET /data/works
├─ Pagination: limit=50, offset=0
├─ Filters: state, district, status, date_range
├─ Output: Works list with details
└─ Fields: work_id, name, budget, status, progress

GET /data/works/{work_id}
├─ Output: Complete work details
├─ Relations: Connected data
└─ Fields: All work information

GET /data/districts
├─ Output: All districts
├─ Nested: state_name, total_works, total_budget
└─ Cache: 24 hours

GET /data/export
├─ Formats: CSV, Excel, PDF
├─ Filters: Customizable
└─ Async: Generate and email to user
```

---

## 🔗 Part 2: ML Developer Integration

### **What is ML Developer's Job?**

```
ML DEVELOPER BUILDS:
┌─────────────────────────────────────────┐
│  Separate ML Service                    │
│  (Different Server/Container)           │
│                                         │
│  Endpoints:                             │
│  ├─ /predict-delays                     │
│  ├─ /detect-anomalies                   │
│  ├─ /find-duplicates                    │
│  ├─ /analyze-risk                       │
│  └─ /forecast-expenditure               │
│                                         │
│  Tech: Python, TensorFlow, Scikit-learn │
│  Output: JSON predictions               │
└─────────────────────────────────────────┘
```

### **URL Example (ML Developer Provides):**

```
https://sih-2026-pvuc.onrender.com/docs

This gives you:
✅ All ML endpoints
✅ What data to send
✅ What responses to expect
✅ Example requests
```

### **How You Call ML APIs:**

```python
# In backend/app/ml/ml_client.py

class MLClient:
    BASE_URL = "https://sih-2026-pvuc.onrender.com"
    
    async def predict_delays(self, work_data: dict) -> dict:
        """Call ML service for delay prediction"""
        response = await httpx.post(
            f"{self.BASE_URL}/predict-delays",
            json=work_data,
            timeout=30.0
        )
        return response.json()
    
    async def detect_anomalies(self, expenditure_data: dict) -> dict:
        """Call ML service for anomaly detection"""
        response = await httpx.post(
            f"{self.BASE_URL}/detect-anomalies",
            json=expenditure_data,
            timeout=30.0
        )
        return response.json()
```

### **Why Different Services?**

```
SEPARATED BECAUSE:
├─ ML needs GPU/Heavy computation
├─ Different scaling requirements
├─ ML dev team works independently
├─ Can deploy ML separately
├─ Easy to update ML without affecting backend
└─ ML can be called by multiple services
```

---

## 🐳 Docker & Deployment Setup

### **Docker Compose File (docker-compose.yml)**

```yaml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: mplads
      POSTGRES_USER: mplads_user
      POSTGRES_PASSWORD: secure_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  # Redis Cache
  redis:
    image: redis:7
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Backend API
  backend:
    build: ./backend
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://mplads_user:password@postgres:5432/mplads
      REDIS_URL: redis://redis:6379
      ML_API_URL: https://sih-2026-pvuc.onrender.com
    depends_on:
      - postgres
      - redis
    volumes:
      - ./backend:/app

  # Celery Worker (Background Jobs)
  celery_worker:
    build: ./backend
    command: celery -A app.celery worker --loglevel=info
    environment:
      DATABASE_URL: postgresql://mplads_user:password@postgres:5432/mplads
      REDIS_URL: redis://redis:6379
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

---

## 📊 Database Schema (PostgreSQL)

### **Core Tables:**

```sql
-- Users Table
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  role ENUM('admin', 'state_nodal', 'mp', 'citizen'),
  state_id UUID,
  district_id UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Works Table
CREATE TABLE works (
  id UUID PRIMARY KEY,
  name VARCHAR(255),
  description TEXT,
  state_id UUID,
  district_id UUID,
  mp_id UUID,
  budget DECIMAL(12, 2),
  expenditure DECIMAL(12, 2),
  status ENUM('planned', 'ongoing', 'completed', 'delayed'),
  start_date DATE,
  end_date DATE,
  progress_percentage INT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- ML Results Cache
CREATE TABLE ml_predictions (
  id UUID PRIMARY KEY,
  work_id UUID,
  prediction_type ENUM('delay', 'anomaly', 'duplicate'),
  result JSONB,
  confidence_score DECIMAL(3, 2),
  created_at TIMESTAMP,
  expires_at TIMESTAMP
);

-- Audit Logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  user_id UUID,
  action VARCHAR(255),
  resource_type VARCHAR(100),
  resource_id UUID,
  timestamp TIMESTAMP
);
```

---

## ⚡ Caching Strategy (Redis)

```python
# Cache patterns for fast response

# 1. Dashboard Cache (expires in 1 hour)
CACHE_KEY = f"dashboard:national:{timestamp_bucket}"

# 2. ML Results Cache (expires in 24 hours)
CACHE_KEY = f"ml_prediction:work:{work_id}"

# 3. User Session Cache (expires in 30 days)
CACHE_KEY = f"session:{user_id}:{token_hash}"

# 4. Data Cache (expires in 2 hours)
CACHE_KEY = f"data:works:{state_id}:{district_id}"
```

---

## 🚀 Development Roadmap

### **Phase 1: Core Setup (Week 1)**
- [ ] FastAPI project setup
- [ ] PostgreSQL + Redis connection
- [ ] Docker configuration
- [ ] Basic project structure

### **Phase 2: Authentication (Week 1-2)**
- [ ] User registration/login
- [ ] JWT tokens
- [ ] Role-based access control (RBAC)

### **Phase 3: Data APIs (Week 2-3)**
- [ ] Works CRUD operations
- [ ] District/State data endpoints
- [ ] Filtering, pagination, sorting

### **Phase 4: Dashboard APIs (Week 3-4)**
- [ ] National dashboard
- [ ] State/District dashboards
- [ ] Data aggregation logic
- [ ] Caching implementation

### **Phase 5: ML Integration (Week 4-5)**
- [ ] ML client setup
- [ ] Call ML endpoints
- [ ] Async processing (Celery)
- [ ] Result caching

### **Phase 6: Testing & Optimization (Week 5-6)**
- [ ] Unit tests
- [ ] Integration tests
- [ ] Performance tuning
- [ ] Documentation

---

## 📋 Example: Building Delay Prediction Endpoint

### **Step 1: Define Request Schema**

```python
# app/schemas/analysis.py
from pydantic import BaseModel

class DelayPredictionRequest(BaseModel):
    work_id: str
    historical_progress: list[float]
    deadline_date: datetime
    budget_variance: float
```

### **Step 2: Create ML Service Call**

```python
# app/services/ml_service.py

class MLService:
    async def predict_delays(self, work_data):
        ml_client = MLClient()
        prediction = await ml_client.predict_delays(work_data)
        return prediction
```

### **Step 3: Build API Endpoint**

```python
# app/api/analysis.py
from fastapi import APIRouter, Depends

router = APIRouter(prefix="/analysis")

@router.post("/predict-delays")
async def predict_delays(
    request: DelayPredictionRequest,
    ml_service: MLService = Depends(),
    cache = Depends(get_cache)
):
    # Check cache first
    cached = await cache.get(f"prediction:{request.work_id}")
    if cached:
        return cached
    
    # Call ML service
    prediction = await ml_service.predict_delays(request.dict())
    
    # Cache result for 24 hours
    await cache.set(
        f"prediction:{request.work_id}",
        prediction,
        expire=86400
    )
    
    return prediction
```

### **Step 4: Fast Processing**

```
WHY IT'S FAST:
├─ Redis caching: 1-2ms response
├─ Async/await: Non-blocking I/O
├─ Connection pooling: Reused connections
├─ Batch ML calls: Process multiple together
└─ Database indexes: Fast queries
```

---

## 📈 Performance Optimization

```
TECHNIQUES:
1. Database Indexing
   ├─ Index on: state_id, district_id, status
   └─ Improves query by 100x

2. Connection Pooling
   ├─ Reuse connections: 50-100 connections
   └─ Reduces overhead

3. Redis Caching
   ├─ Cache dashboards: 1 hour
   ├─ Cache ML results: 24 hours
   └─ Cache lists: 2 hours

4. Async Processing
   ├─ Long ML jobs: Background (Celery)
   ├─ Email reports: Queue
   └─ Data export: Async task

5. Pagination
   ├─ Works table: 50 items per page
   ├─ Reduces data transfer
   └─ Faster response
```

---

## ✅ Quick Start Commands

```bash
# 1. Clone repository
git clone <repo>

# 2. Setup environment
cp .env.example .env

# 3. Start with Docker
docker-compose up -d

# 4. Run migrations
docker-compose exec backend alembic upgrade head

# 5. Check API docs
# Go to: http://localhost:8000/docs
```

---

## 🎯 ML Developer Workflow (Explanation)

### **ML Developer's Job Flow:**

```
ML Developer
    ├─ Builds ML models
    ├─ Creates Python service (FastAPI/Flask)
    ├─ Deploys to server (Render/AWS)
    ├─ Provides docs URL ← YOU GET THIS
    └─ Your backend calls this API

You (Backend Developer)
    ├─ Read ML docs
    ├─ Create ML client
    ├─ Call ML endpoints
    ├─ Process results
    └─ Return to frontend
```

### **What You Do with ML URL:**

```
Given: https://sih-2026-pvuc.onrender.com/docs

Step 1: Read documentation
Step 2: Identify endpoints needed
Step 3: Create client to call them
Step 4: Handle responses
Step 5: Cache results
Step 6: Return to frontend
```

---

## 🎉 Summary

```
BACKEND TECH STACK:
├─ Framework: FastAPI (Python)
├─ Database: PostgreSQL
├─ Cache: Redis
├─ Background: Celery
├─ Containers: Docker
└─ Speed: ⚡ Very fast!

WHY THESE CHOICES:
├─ FastAPI: Fast, auto-docs, ML-friendly
├─ PostgreSQL: Reliable, powerful queries
├─ Redis: Ultra-fast caching
├─ Docker: Easy deployment anywhere
└─ Celery: Background jobs for ML

ML DEVELOPER PROVIDES:
├─ API documentation
├─ Endpoints for predictions
├─ Request/response formats
└─ Your job: Call these APIs

DEPLOYMENT:
├─ Docker Compose locally
├─ Push to AWS/GCP/Heroku for production
├─ Everything scales automatically
└─ Easy updates
```

---

## 🚀 Next Steps

1. **Approve this architecture**
2. **Setup development environment**
3. **Create FastAPI project**
4. **Build authentication**
5. **Connect to database**
6. **Create initial APIs**
7. **Integrate with ML service**
8. **Test everything**
9. **Deploy with Docker**

**Ready to start? Let me know!**
