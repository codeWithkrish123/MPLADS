# Quick Database Setup Guide

**Goal**: Get PostgreSQL running in 5 minutes  
**Time**: 5-10 minutes  
**Difficulty**: Easy

---

## Option 1: Supabase (Easiest - Recommended)

### Step 1: Sign Up
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub or email
4. Create a new organization and project

### Step 2: Get Connection String
1. In Supabase Dashboard, go to **Settings** → **Database**
2. Copy the "Connection string" (choose "URI" format)
3. It looks like: `postgresql://[user].[project_id]:[password]@db.[region].supabase.co:5432/postgres`

### Step 3: Update .env.local
```env
DATABASE_URL=postgresql://[user].[project_id]:[password]@db.[region].supabase.co:5432/postgres
```

### Step 4: Run Migrations
```bash
npx prisma migrate deploy
# Or for fresh setup:
npx prisma migrate dev --name init
```

### Step 5: Done!
```bash
# Test connection
npx prisma studio
```

**Total Time**: 5 minutes  
**Cost**: Free tier available (500MB)

---

## Option 2: Docker (Local PostgreSQL - Fast)

### Step 1: Install Docker
- Download from https://www.docker.com/products/docker-desktop/
- Install and start

### Step 2: Run PostgreSQL Container
```bash
docker run --name mplads-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mplads_ml_sentinel \
  -p 5432:5432 \
  -d postgres:15
```

### Step 3: Update .env.local
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mplads_ml_sentinel
```

### Step 4: Run Migrations
```bash
npx prisma migrate dev --name init
```

### Step 5: Done!
```bash
npx prisma studio
```

**Total Time**: 5 minutes (after Docker install)  
**Cost**: Free

---

## Option 3: Local PostgreSQL (Manual Install)

### Windows
1. Download: https://www.postgresql.org/download/windows/
2. Run installer (use default password: `postgres`)
3. Add to PATH (usually automatic)
4. Open pgAdmin or terminal

### Mac
```bash
brew install postgresql
brew services start postgresql
```

### Linux
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

### All Platforms
```bash
# Create database
createdb mplads_ml_sentinel

# Create user (optional)
createuser mplads_user
```

### Update .env.local
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mplads_ml_sentinel
```

### Run Migrations
```bash
npx prisma migrate dev --name init
```

**Total Time**: 10-15 minutes

---

## Common Issues & Fixes

### "Cannot connect to database"
```bash
# Check if database is running
psql -U postgres -d mplads_ml_sentinel

# If not found, create it:
createdb mplads_ml_sentinel
```

### "Port 5432 already in use"
```bash
# Change port in .env.local
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/mplads_ml_sentinel
```

### "Module not found: @prisma/client"
```bash
# Reinstall Prisma
npm install @prisma/client prisma
npx prisma generate
```

### "Prisma migrate failed"
```bash
# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or drop and recreate:
dropdb mplads_ml_sentinel
createdb mplads_ml_sentinel
npx prisma migrate dev --name init
```

---

## Next Steps

### After Database is Set Up:

1. **Verify Connection**
```bash
npx prisma studio
# Opens http://localhost:5555
# You should see empty tables
```

2. **Seed Sample Data** (Optional)
```bash
# Create prisma/seed.ts (see template below)
npm install -D ts-node
npx prisma db seed
```

3. **Start Server**
```bash
npm run dev
# Now data persists!
```

4. **Test in Browser**
```
http://localhost:3000
```

---

## Seed Template (prisma/seed.ts)

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample projects
  const project1 = await prisma.project.create({
    data: {
      workId: "W-2025-001",
      name: "School Building Renovation",
      state: "Maharashtra",
      district: "Pune",
      category: "School",
      sanctionedCost: 1000000,
      actualExpenditure: 450000,
      physicalProgress: 45,
      riskScore: 85,
      riskCategory: "CRITICAL",
      status: "ongoing",
    },
  });

  console.log("✅ Created project:", project1.workId);

  // Create sample alert
  const alert = await prisma.alert.create({
    data: {
      alertId: "ALT-001",
      projectId: project1.id,
      severity: "CRITICAL",
      reason: "Cost anomaly detected",
      confidence: 0.94,
    },
  });

  console.log("✅ Created alert:", alert.alertId);
  console.log("✅ Database seeded!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Add to package.json:
```json
{
  "prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"commonjs\"} prisma/seed.ts"
  }
}
```

---

## Success Checklist

- [ ] Database created
- [ ] .env.local configured
- [ ] `npx prisma migrate dev` successful
- [ ] `npx prisma studio` opens
- [ ] Can see 6 empty tables
- [ ] Sample data seeded (optional)
- [ ] `npm run dev` starts
- [ ] http://localhost:3000 loads
- [ ] Data persists after refresh

---

## Production Setup

For production deployment:

1. **Use Supabase or AWS RDS** (not local)
2. **Set secure DATABASE_URL** in production environment
3. **Run migrations**: `npx prisma migrate deploy`
4. **Enable backups** in database settings
5. **Monitor performance** (add indices as needed)

---

## Quick Reference Commands

```bash
# Create new migration
npx prisma migrate dev --name add_feature

# Deploy existing migrations
npx prisma migrate deploy

# Rollback migration
npx prisma migrate resolve --rolled-back add_feature

# Reset database (WARNING: deletes data)
npx prisma migrate reset

# View database in UI
npx prisma studio

# Generate Prisma client
npx prisma generate

# Check schema status
npx prisma db push

# Seed database
npx prisma db seed
```

---

**You're ready! Choose Option 1 (Supabase) for fastest setup.** ✅

Next: Update server.ts to use the database service.
