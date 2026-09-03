# 🚀 RUN THESE COMMANDS NOW

**Goal**: Get database connected and running  
**Time**: 10 minutes max  
**Status**: All files ready!

---

## Execute These Commands (Copy-Paste)

### Step 1: Create Database (1 minute)
```bash
# Open PowerShell and run this:
psql -U postgres -c "CREATE DATABASE mplads_ml_sentinel;"
```

**Expected output**:
```
CREATE DATABASE
```

If error "database already exists", that's fine - continue to Step 2.

---

### Step 2: Install Prisma (2 minutes)
```bash
# From your project directory
cd E:\MPLADS\MPLADS-UI

npm install @prisma/client prisma
```

**Expected output**:
```
added 123 packages
```

---

### Step 3: Generate Prisma Client (1 minute)
```bash
npx prisma generate
```

**Expected output**:
```
✔ Generated Prisma Client v5.x.x
```

---

### Step 4: Run Migrations (2 minutes)
```bash
npx prisma migrate dev --name init
```

**Expected output**:
```
✔ Created migration
✔ Your database is now in sync with your schema.
```

---

### Step 5: Verify in Prisma Studio (1 minute)
```bash
npx prisma studio
```

**Expected output**:
```
Prisma Studio is running on http://localhost:5555
```

**Then**:
- Browser opens automatically
- You should see 6 empty tables
- Close the browser when done (Ctrl+C to stop)

---

### Step 6: Start Development Server (1 minute)
```bash
npm run dev
```

**Expected output**:
```
✅ Connected to PostgreSQL database
Local: http://localhost:3000
API Docs: http://localhost:3000/api/docs
```

---

### Step 7: Test in Browser (1 minute)
```
Open: http://localhost:3000

You should see:
- Dashboard loading
- Dark blue sidebar
- Tricolor stripe at top
- Data loading from database
```

---

## ✅ Success Checklist

- [ ] Database created: `mplads_ml_sentinel`
- [ ] Prisma installed
- [ ] Prisma client generated
- [ ] Migrations ran successfully
- [ ] Prisma Studio shows 6 tables
- [ ] Dev server started
- [ ] Browser shows dashboard
- [ ] No console errors

---

## If You Get Errors

### "psql: command not found"
PostgreSQL not in PATH. Add it:
```bash
# Add to PATH (Windows)
$env:Path += ";C:\Program Files\PostgreSQL\15\bin"
```

### "Password authentication failed"
Check your PostgreSQL password:
```bash
psql -U postgres
# If this works, password is "postgres"
# Update .env.local if different
```

### "Port 5432 already in use"
PostgreSQL not running. Start it:
```bash
# Windows Services: Start PostgreSQL
# Or: brew services start postgresql (Mac)
```

### "Error: connect ECONNREFUSED"
PostgreSQL service not running. Start it first!

---

## All Done! 🎉

You now have:
✅ PostgreSQL database running  
✅ Prisma connected  
✅ 6 tables created  
✅ Development server running  
✅ System persisting data  

---

## What's Next?

### Option 1: Explore the System (Now)
- Open http://localhost:3000
- Click around
- Try Project Queue
- Try Risk Simulator

### Option 2: Seed Sample Data (5 min)
```bash
# Create prisma/seed.ts (template in docs)
npm install -D ts-node
npx prisma db seed
```

### Option 3: Deploy to Production (Tomorrow)
- Follow SPRINT_3_COMPLETE_ENTERPRISE.md
- Add authentication
- Add tests
- Deploy

---

**Ready?** 

Execute the commands above in order. Each one should succeed before moving to next.

**Stuck?** Check POSTGRES_SETUP_LOCAL.md for troubleshooting.

**Let's go!** 🚀
