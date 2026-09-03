# Sprint 2: Database Setup & Integration
## Days 1-3: PostgreSQL + Data Persistence

**Goal**: Move from localStorage to real database  
**Duration**: 3-4 days  
**Status**: Starting Now  
**Difficulty**: Medium (straightforward SQL + ORM)

---

## Phase 1: Database Design

### Database Schema

```sql
-- Users Table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL, -- ministry, state, district, mp
  state VARCHAR(100),
  district VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  work_id VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(500) NOT NULL,
  description TEXT,
  state VARCHAR(100) NOT NULL,
  district VARCHAR(100) NOT NULL,
  category VARCHAR(100),
  sanctioned_cost DECIMAL(15,2) NOT NULL,
  actual_expenditure DECIMAL(15,2) DEFAULT 0,
  physical_progress DECIMAL(5,2) DEFAULT 0,
  risk_score DECIMAL(5,2) DEFAULT 50,
  risk_category VARCHAR(20), -- CRITICAL, HIGH, MEDIUM, LOW
  status VARCHAR(50), -- planned, ongoing, completed
  mp_id VARCHAR(100),
  mp_name VARCHAR(255),
  agency VARCHAR(255),
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  start_date DATE,
  expected_completion DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_work_id (work_id),
  INDEX idx_state (state),
  INDEX idx_risk_score (risk_score)
);

-- Alerts Table
CREATE TABLE alerts (
  id SERIAL PRIMARY KEY,
  alert_id VARCHAR(100) UNIQUE NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  severity VARCHAR(20) NOT NULL, -- CRITICAL, HIGH, MEDIUM, LOW
  reason TEXT NOT NULL,
  confidence DECIMAL(5,2),
  status VARCHAR(50) DEFAULT 'Open', -- Open, Investigated, Resolved
  detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  resolved_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_severity (severity),
  INDEX idx_status (status)
);

-- Analysis Results Table
CREATE TABLE analysis_results (
  id SERIAL PRIMARY KEY,
  analysis_id VARCHAR(100) UNIQUE NOT NULL,
  project_id INTEGER REFERENCES projects(id),
  risk_score DECIMAL(5,2),
  cost_efficiency DECIMAL(5,2),
  schedule_efficiency DECIMAL(5,2),
  anomalies_detected JSON,
  recommendations JSON,
  ml_model_version VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Audit Logs Table
CREATE TABLE audit_logs (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100),
  entity_id VARCHAR(100),
  old_value TEXT,
  new_value TEXT,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user_id (user_id),
  INDEX idx_created_at (created_at)
);

-- Custom Datasets Table
CREATE TABLE custom_datasets (
  id SERIAL PRIMARY KEY,
  dataset_name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id),
  projects JSON NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Phase 2: Setup Instructions

### Option A: Local PostgreSQL (Development)

#### Windows/Mac/Linux:
1. **Download PostgreSQL**
   - https://www.postgresql.org/download/
   - Version: 15 or later
   - Installation: Use default settings

2. **Create Database**
   ```sql
   -- Open pgAdmin or psql terminal
   CREATE DATABASE mplads_ml_sentinel;
   ```

3. **Create Tables**
   ```sql
   -- Run the schema above in the database
   ```

4. **Test Connection**
   ```bash
   psql -U postgres -d mplads_ml_sentinel
   ```

### Option B: Cloud PostgreSQL (Recommended for Production)

Choose one:

**Supabase (Easiest)**
- https://supabase.com
- Free tier: 500MB storage
- Auto-hosted, auto-backed up
- PostgreSQL compatible

**AWS RDS**
- https://aws.amazon.com/rds/
- Free tier: 1 year free
- Highly scalable
- Production-grade

**Railway.app**
- https://railway.app
- Simple deployment
- PostgreSQL included
- Great for startups

**Render**
- https://render.com
- PostgreSQL included
- Easy deploys
- Free tier available

---

## Phase 3: Node.js Integration

### Step 1: Install Prisma ORM

```bash
npm install @prisma/client
npm install -D prisma
```

### Step 2: Create .env Configuration

**File: `.env.local`**
```env
# Frontend
VITE_API_URL=http://localhost:3000

# Database (Choose one)
DATABASE_URL=postgresql://user:password@localhost:5432/mplads_ml_sentinel
# OR for Supabase:
# DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]

# Backend
NODE_ENV=development
PORT=3000

# Authentication
JWT_SECRET=your-secret-key-change-this-in-production
JWT_EXPIRY=7d

# Optional: Gemini AI
GEMINI_API_KEY=your-key-if-using-ai

# Optional: ML API
ML_API_BASE_URL=https://sih-2026-23oy.onrender.com/api
```

### Step 3: Create Prisma Schema

**File: `prisma/schema.prisma`**
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int     @id @default(autoincrement())
  email     String  @unique
  name      String
  passwordHash String
  role      String  // ministry, state, district, mp
  state     String?
  district  String?
  isActive  Boolean @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  auditLogs AuditLog[]
  datasets  CustomDataset[]
}

model Project {
  id                  Int     @id @default(autoincrement())
  workId              String  @unique
  name                String
  description         String?
  state               String
  district            String
  category            String?
  sanctionedCost      Decimal
  actualExpenditure   Decimal @default(0)
  physicalProgress    Decimal @default(0)
  riskScore           Decimal @default(50)
  riskCategory        String?
  status              String?
  mpId                String?
  mpName              String?
  agency              String?
  latitude            Decimal?
  longitude           Decimal?
  startDate           DateTime?
  expectedCompletion  DateTime?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  alerts   Alert[]
  analysis AnalysisResult[]

  @@index([workId])
  @@index([state])
  @@index([riskScore])
}

model Alert {
  id          Int     @id @default(autoincrement())
  alertId     String  @unique
  projectId   Int
  project     Project @relation(fields: [projectId], references: [id])
  severity    String
  reason      String
  confidence  Decimal?
  status      String  @default("Open")
  detectedAt  DateTime @default(now())
  resolvedAt  DateTime?
  createdAt   DateTime @default(now())

  @@index([severity])
  @@index([status])
}

model AnalysisResult {
  id               Int     @id @default(autoincrement())
  analysisId       String  @unique
  projectId        Int
  project          Project @relation(fields: [projectId], references: [id])
  riskScore        Decimal?
  costEfficiency   Decimal?
  scheduleEfficiency Decimal?
  anomaliesDetected String  // JSON as string
  recommendations  String  // JSON as string
  mlModelVersion   String?
  createdAt        DateTime @default(now())
}

model AuditLog {
  id            Int     @id @default(autoincrement())
  userId        Int
  user          User    @relation(fields: [userId], references: [id])
  action        String
  entityType    String?
  entityId      String?
  oldValue      String?
  newValue      String?
  ipAddress     String?
  userAgent     String?
  createdAt     DateTime @default(now())

  @@index([userId])
  @@index([createdAt])
}

model CustomDataset {
  id        Int     @id @default(autoincrement())
  name      String
  userId    Int
  user      User    @relation(fields: [userId], references: [id])
  projects  String  // JSON array as string
  uploadDate DateTime @default(now())
  isActive  Boolean @default(false)
  createdAt DateTime @default(now())
}
```

### Step 4: Initialize Database

```bash
# Create migration
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# Seed database (optional)
npx prisma db seed
```

---

## Phase 4: Backend Integration

### Step 1: Update server.ts with Database

**File: `server.ts` (additions)**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Initialize Prisma on startup
async function initializeDatabase() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to PostgreSQL database");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  }
}

// Call on startup
await initializeDatabase();

// Graceful shutdown
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
```

### Step 2: Create Database Service

**File: `src/services/database.ts` (NEW)**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const db = {
  // Projects
  projects: {
    async getAll(filters?: any) {
      return await prisma.project.findMany({
        where: filters,
        orderBy: { riskScore: "desc" },
        take: 100
      });
    },

    async getById(workId: string) {
      return await prisma.project.findUnique({
        where: { workId }
      });
    },

    async create(data: any) {
      return await prisma.project.create({
        data
      });
    },

    async update(workId: string, data: any) {
      return await prisma.project.update({
        where: { workId },
        data
      });
    },

    async search(query: string) {
      return await prisma.project.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { district: { contains: query, mode: "insensitive" } }
          ]
        }
      });
    }
  },

  // Alerts
  alerts: {
    async getAll() {
      return await prisma.alert.findMany({
        orderBy: { detectedAt: "desc" }
      });
    },

    async create(data: any) {
      return await prisma.alert.create({
        data
      });
    },

    async updateStatus(alertId: string, status: string) {
      return await prisma.alert.update({
        where: { alertId },
        data: { status }
      });
    }
  },

  // Audit Logs
  auditLogs: {
    async create(data: any) {
      return await prisma.auditLog.create({
        data
      });
    }
  },

  // Analysis Results
  analysis: {
    async create(data: any) {
      return await prisma.analysisResult.create({
        data
      });
    },

    async getLatest(projectId: number) {
      return await prisma.analysisResult.findFirst({
        where: { projectId },
        orderBy: { createdAt: "desc" }
      });
    }
  }
};
```

### Step 3: Update API Endpoints

**Example: GET /api/projects**

```typescript
app.get("/api/projects", async (req: Request, res: Response) => {
  try {
    const { page = 1, page_size = 100, risk_level } = req.query;

    const where: any = {};
    if (risk_level) where.riskCategory = risk_level;

    const projects = await prisma.project.findMany({
      where,
      skip: ((page as number) - 1) * (page_size as number),
      take: page_size as number,
      orderBy: { riskScore: "desc" }
    });

    const total = await prisma.project.count({ where });

    return res.json({
      count: projects.length,
      total_matches: total,
      page,
      page_size,
      data: projects
    });
  } catch (error: any) {
    return sendInternalError(res, error, { path: "/api/projects" });
  }
});
```

---

## Phase 5: Data Migration

### Step 1: Migrate from localStorage

**File: `scripts/migrate.ts` (NEW)**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function migrateData() {
  try {
    console.log("🔄 Starting data migration from localStorage...");

    // Get data from browser (if available)
    // In production, you'd export this from browser DevTools
    const customDataset = [
      // ... paste your 544 projects here
    ];

    // Create projects in database
    for (const project of customDataset) {
      await prisma.project.create({
        data: {
          workId: project.work_id,
          name: project.name || "Unnamed Project",
          description: project.description,
          state: project.state,
          district: project.district,
          category: project.category,
          sanctionedCost: project.sanctioned_cost || 0,
          actualExpenditure: project.actual_expenditure || 0,
          physicalProgress: project.physical_progress || 0,
          riskScore: project.risk_score || 50,
          riskCategory: project.risk_category,
          status: project.status || "ongoing"
        }
      });
    }

    console.log(`✅ Migrated ${customDataset.length} projects`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateData();
```

---

## Phase 6: Testing

### Test Checklist

- [ ] Database connection works
- [ ] Create project in database
- [ ] Retrieve project from database
- [ ] Update project
- [ ] Delete project (implement if needed)
- [ ] Search projects
- [ ] Get alerts
- [ ] Pagination works
- [ ] Filters work
- [ ] Audit logs record

### Test Command

```bash
# Run Prisma Studio to view database
npx prisma studio

# This opens http://localhost:5555
# You can browse all tables and data visually
```

---

## Phase 7: Environment Setup

### Development
```bash
# .env.local
DATABASE_URL=postgresql://localhost/mplads_ml_sentinel
NODE_ENV=development
```

### Staging
```bash
# .env.staging
DATABASE_URL=postgresql://user:password@staging-db.example.com/mplads
NODE_ENV=staging
```

### Production
```bash
# .env.production
DATABASE_URL=postgresql://user:password@prod-db.example.com/mplads
NODE_ENV=production
JWT_SECRET=<random-secret>
```

---

## Phase 8: Deployment Options

### Option A: Supabase (Recommended for Quick Setup)

1. Create account: https://supabase.com
2. Create new project
3. Run SQL schema
4. Get connection string
5. Add to .env.local
6. Done!

**Pros**: Free, easy, hosted  
**Cons**: Limited free tier  
**Time**: 30 minutes

### Option B: AWS RDS

1. Go to AWS Console
2. Create RDS PostgreSQL instance
3. Configure security groups
4. Get endpoint
5. Add to .env.local
6. Done!

**Pros**: Scalable, professional  
**Cons**: More complex, costs money  
**Time**: 1 hour

### Option C: Self-Hosted

1. Install PostgreSQL locally
2. Create database
3. Run schema
4. Use localhost connection string
5. Deploy on your own server

**Pros**: Full control, free  
**Cons**: Manual maintenance  
**Time**: 2-3 hours

---

## Installation Steps (Complete Guide)

### Quick Setup (Using Supabase)

#### Step 1: Install Dependencies
```bash
npm install @prisma/client prisma
```

#### Step 2: Create Supabase Account
- Go to https://supabase.com
- Click "Start your project"
- Create organization and project
- Note your connection string

#### Step 3: Add to .env.local
```env
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]
```

#### Step 4: Initialize Database
```bash
npx prisma migrate dev --name init
```

#### Step 5: Test Connection
```bash
npx prisma studio
# Opens browser, shows database
```

#### Step 6: Seed Sample Data (Optional)
```bash
# Create prisma/seed.ts
npm install -D ts-node

# Run seed
npx prisma db seed
```

---

## Verification Checklist

- [ ] PostgreSQL installed/accessible
- [ ] Prisma installed
- [ ] .env.local configured
- [ ] `prisma migrate` successful
- [ ] `prisma studio` opens
- [ ] Can see empty tables in studio
- [ ] API endpoints updated
- [ ] Data persists after restart
- [ ] Filters work
- [ ] Search works
- [ ] Build passes

---

## Troubleshooting

### Issue: "Connection refused"
**Solution**: Check database is running
```bash
# Windows: Services > PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### Issue: "Cannot find module @prisma/client"
**Solution**: Reinstall dependencies
```bash
npm install
npx prisma generate
```

### Issue: "Migration failed"
**Solution**: Reset database and retry
```bash
npx prisma migrate reset
```

### Issue: "Port 5432 already in use"
**Solution**: Change port in connection string
```env
DATABASE_URL=postgresql://user:password@localhost:5433/mplads
```

---

## Next Steps After Database

1. ✅ Database running
2. ✅ Data persisting
3. ⏳ Add JWT Authentication
4. ⏳ Add user management
5. ⏳ Add role-based access
6. ⏳ Create test suite
7. ⏳ Deploy to production

---

## Time Estimate

| Task | Time |
|------|------|
| Install Prisma | 10 min |
| Create schema | 20 min |
| Setup Supabase/RDS | 30 min |
| Run migrations | 10 min |
| Test connection | 10 min |
| Update endpoints | 30 min |
| Test all features | 30 min |
| **TOTAL** | **2.5 hours** |

---

**Status**: Database implementation ready  
**Next Step**: Choose hosting option and execute setup  
**Success**: When `npx prisma studio` opens and shows tables  

Let's make this persistent! 🚀
