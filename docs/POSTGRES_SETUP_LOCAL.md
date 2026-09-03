# PostgreSQL Local Setup - Quick Start

**Status**: PostgreSQL is already installed ✅  
**Next**: Connect to your MPLADS project  
**Time**: 10 minutes

---

## Step 1: Verify PostgreSQL is Running

### Windows
```bash
# Check if PostgreSQL service is running
Get-Service postgresql-x64-* | Select-Object Name, Status

# Should show: Running
```

### Mac/Linux
```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql
# or
brew services list | grep postgres
```

---

## Step 2: Create Database

### Open PostgreSQL Terminal
```bash
# Windows: Open pgAdmin or command line
psql -U postgres

# Mac/Linux
psql -U postgres
```

### Create Database & User
```sql
-- Create database
CREATE DATABASE mplads_ml_sentinel;

-- Create user (optional but recommended)
CREATE USER mplads_user WITH PASSWORD 'your_secure_password';

-- Grant permissions
ALTER ROLE mplads_user CREATEDB;
GRANT ALL PRIVILEGES ON DATABASE mplads_ml_sentinel TO mplads_user;

-- Verify
\l
# Should show: mplads_ml_sentinel
```

---

## Step 3: Update .env.local

**File: `.env.local`**

Replace the DATABASE_URL with:

```env
# PostgreSQL Local Connection
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/mplads_ml_sentinel

# Or if you created a user:
# DATABASE_URL=postgresql://mplads_user:your_secure_password@localhost:5432/mplads_ml_sentinel

# Other settings
NODE_ENV=development
PORT=3000
JWT_SECRET=dev-secret-change-in-production
```

---

## Step 4: Install Prisma

```bash
cd E:\MPLADS\MPLADS-UI

npm install @prisma/client prisma
```

---

## Step 5: Run Migrations

```bash
# Generate Prisma client
npx prisma generate

# Create tables
npx prisma migrate dev --name init

# This will:
# 1. Create migration
# 2. Run against your PostgreSQL
# 3. Generate Prisma client
```

---

## Step 6: Verify Connection

```bash
# Open Prisma Studio (visual database browser)
npx prisma studio

# Should open: http://localhost:5555
# You should see 6 empty tables:
# - users
# - projects
# - alerts
# - analysis_results
# - audit_logs
# - custom_datasets
```

---

## Step 7: Start Development Server

```bash
npm run dev

# Should show:
# ✅ Connected to PostgreSQL database
# Server running at http://localhost:3000
```

---

## Step 8: Test API

```bash
# In browser or curl
curl http://localhost:3000/api/ml/health

# Should return:
# {
#   "status": "ok",
#   "service": "ML Sentinel Gateway",
#   "ml_api_status": "operational"
# }
```

---

## Troubleshooting

### "Connection refused"
```bash
# Make sure PostgreSQL service is running
# Windows: Services app → PostgreSQL → Start
# Mac: brew services start postgresql
# Linux: sudo systemctl start postgresql
```

### "Password authentication failed"
```bash
# Check your password in .env.local
# Verify user exists in PostgreSQL:
psql -U postgres -c "\du"
```

### "Database does not exist"
```bash
# Create it:
psql -U postgres -c "CREATE DATABASE mplads_ml_sentinel;"
```

### "Port 5432 already in use"
```bash
# Use different port:
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/mplads_ml_sentinel
# And change PostgreSQL config to use 5433
```

### "Permission denied"
```bash
# Grant permissions:
psql -U postgres << EOF
GRANT ALL PRIVILEGES ON DATABASE mplads_ml_sentinel TO postgres;
EOF
```

---

## Success Checklist

- [ ] PostgreSQL service running
- [ ] Database `mplads_ml_sentinel` created
- [ ] .env.local has correct DATABASE_URL
- [ ] `npx prisma generate` successful
- [ ] `npx prisma migrate dev --name init` successful
- [ ] `npx prisma studio` opens at http://localhost:5555
- [ ] 6 tables visible in Prisma Studio
- [ ] `npm run dev` starts without errors
- [ ] `curl http://localhost:3000/api/ml/health` returns 200

---

## Commands Reference

```bash
# View all databases
psql -U postgres -l

# Connect to specific database
psql -U postgres -d mplads_ml_sentinel

# View all tables
\dt

# View table structure
\d projects

# Exit psql
\q

# Backup database
pg_dump -U postgres mplads_ml_sentinel > backup.sql

# Restore database
psql -U postgres mplads_ml_sentinel < backup.sql
```

---

## Next Steps

After successful connection:

1. **Seed Sample Data** (Optional)
   ```bash
   npx prisma db seed
   ```

2. **View Data**
   ```bash
   npx prisma studio
   # Browse all tables
   ```

3. **Deploy to Production**
   - Follow SPRINT_3_COMPLETE_ENTERPRISE.md
   - Day 7: Deployment guide

---

## Connection String Format

```
postgresql://[user]:[password]@[host]:[port]/[database]

Examples:
postgresql://postgres:postgres@localhost:5432/mplads_ml_sentinel
postgresql://mplads_user:password@localhost:5432/mplads_ml_sentinel
postgresql://username:pass@192.168.1.100:5432/mplads_ml_sentinel
```

---

**STATUS**: PostgreSQL Local Setup Complete ✅

**Next**: Run `npm run dev` and start using the system!

All data now persists in PostgreSQL! 🎉
