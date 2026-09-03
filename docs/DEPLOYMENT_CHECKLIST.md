# ✅ DEPLOYMENT CHECKLIST - MPLADS-UI

**Deployment Date:** ________________  
**Deployment Lead:** ________________  
**Environment:** PRODUCTION  
**Version:** 1.0.0

---

## 📋 PRE-DEPLOYMENT (T-48 Hours)

### Code Freeze
- [ ] All code committed to main branch
- [ ] Feature branches merged and deleted
- [ ] Version bumped in package.json
- [ ] Git tag created: `v1.0.0`
- [ ] CHANGELOG.md updated
- [ ] README.md reviewed

### Testing
- [ ] All unit tests passing: `npm run lint` ✓
- [ ] Manual smoke testing completed
- [ ] Accessibility audit completed
- [ ] Performance testing completed (Lighthouse ≥ 80)
- [ ] Cross-browser testing completed
- [ ] Mobile responsive testing completed

### Security Review
- [ ] No secrets in code/config files
- [ ] Dependencies checked: `npm audit` ✓
- [ ] Security headers configured
- [ ] CORS settings verified
- [ ] SSL certificates ready
- [ ] Authentication mechanisms verified

### Documentation
- [ ] Deployment plan reviewed
- [ ] Rollback procedure documented
- [ ] Environment variables listed
- [ ] API endpoints documented
- [ ] Known issues documented
- [ ] Team briefed

### Team Coordination
- [ ] Deployment lead assigned
- [ ] DevOps engineer assigned
- [ ] Backend engineer assigned
- [ ] QA lead assigned
- [ ] Communication channel established (Slack/Teams)
- [ ] Deployment window scheduled (12:00-14:00 IST)

---

## 🔧 PRE-DEPLOYMENT (T-24 Hours)

### Infrastructure Verification
- [ ] Production server accessible via SSH
- [ ] Disk space available (≥ 10 GB)
- [ ] Memory available (≥ 4 GB)
- [ ] Network connectivity verified
- [ ] Firewall rules verified
- [ ] Load balancer configured

### Database Preparation
- [ ] Database backup created
- [ ] Backup verified (can restore)
- [ ] Database user created
- [ ] Database permissions verified
- [ ] Migration scripts tested locally
- [ ] Rollback SQL scripts prepared

### Monitoring Setup
- [ ] Prometheus configured
- [ ] Grafana dashboards created
- [ ] AlertManager configured
- [ ] Log aggregation ready
- [ ] PM2 monitoring setup
- [ ] Slack/Email alerts configured

### Communication
- [ ] Deployment announcement sent to team
- [ ] Stakeholders notified
- [ ] Scheduled maintenance window set
- [ ] Status page updated
- [ ] Support team briefed
- [ ] Rollback contact list prepared

---

## 🚀 DEPLOYMENT DAY (T-60 Minutes)

### Final Checks
- [ ] All team members present and ready
- [ ] Monitoring dashboards open and visible
- [ ] Rollback procedures reviewed
- [ ] Communication channel active
- [ ] Production environment status: GREEN
- [ ] No active incidents

### Pre-Deployment Verification
- [ ] Latest code pulled from Git
- [ ] Commit hash recorded: ________________
- [ ] Build dependencies installed
- [ ] Production build created: `npm run build`
- [ ] Build output verified (dist/ folder)
- [ ] Database backups fresh
- [ ] No database locks

### Final Approval
- [ ] QA Lead sign-off: [ ] YES [ ] NO
- [ ] Product Manager approval: [ ] YES [ ] NO
- [ ] DevOps Lead approval: [ ] YES [ ] NO
- [ ] **GO/NO-GO DECISION:** [ ] GO [ ] NO-GO

---

## ⚡ DEPLOYMENT EXECUTION (T-0)

### Phase 1: Code Deployment (5-10 min)

```
Status: _________
Time: T+0 to T+10
```

- [ ] SSH into production server
- [ ] Navigate to `/app/mplads-ui`
- [ ] Create backup: `git archive --format=tar main | gzip > backup-$(date +%s).tar.gz`
- [ ] Pull latest code: `git pull origin main`
- [ ] Verify commit: `git log --oneline -1`
- [ ] Install dependencies: `npm ci --production`
- [ ] Create production build: `npm run build`
- [ ] Verify build output: `ls -lah dist/`

**Verification:**
```bash
✓ Code deployed
✓ Build successful
✓ dist/ folder present
✓ dist/server.cjs exists
```

### Phase 2: Database Migration (5 min)

```
Status: _________
Time: T+10 to T+15
```

- [ ] Stop application: `pm2 stop mplads-ui`
- [ ] Run migrations: `npx knex migrate:latest --env production`
- [ ] Verify migrations: `npx knex migrate:status --env production`
- [ ] Load seed data (if any): `npx knex seed:run --env production`
- [ ] Backup database: `pg_dump $DB_NAME | gzip > db-backup-$(date +%s).sql.gz`

**Verification:**
```bash
✓ Migrations completed
✓ No SQL errors
✓ Database backup created
```

### Phase 3: Application Restart (5 min)

```
Status: _________
Time: T+15 to T+20
```

- [ ] Delete old PM2 processes: `pm2 delete mplads-ui`
- [ ] Start new instances: `pm2 start ecosystem.config.js`
- [ ] Verify running: `pm2 status`
- [ ] Check logs: `pm2 logs mplads-ui --lines 50`
- [ ] Wait for startup: `sleep 10`

**Verification:**
```bash
✓ PM2 processes started
✓ No errors in logs
✓ Application responding
```

### Phase 4: Health Checks (5 min)

```
Status: _________
Time: T+20 to T+25
```

- [ ] HTTP health check: `curl -s http://localhost:3000 | head -20`
- [ ] API health check: `curl -s http://localhost:3000/api/health | jq .`
- [ ] Landing page loads: `curl -s https://mplads.gov.in | grep "MPLADS"`
- [ ] Dashboard loads: `curl -s https://mplads.gov.in/overview`
- [ ] Check error logs: `grep ERROR /var/log/mplads/*.log`

**Verification:**
```bash
✓ Health checks passed
✓ No application errors
✓ Pages loading
```

### Phase 5: Load Balancer Update (3 min)

```
Status: _________
Time: T+25 to T+28
```

- [ ] Verify Nginx config: `sudo nginx -t`
- [ ] Reload Nginx: `sudo systemctl reload nginx`
- [ ] Test routing: `curl -I https://mplads.gov.in`
- [ ] Check SSL certificate: `openssl s_client -connect mplads.gov.in:443 < /dev/null`

**Verification:**
```bash
✓ Nginx config valid
✓ Routing working
✓ SSL certificate valid
```

---

## ✓ POST-DEPLOYMENT VALIDATION (T+30)

### Immediate Validation (5 min)

```
Status: _________
Time: T+30 to T+35
```

**Functional Tests:**
- [ ] Landing page loads without errors
- [ ] Navigation works
- [ ] Dashboard loads
- [ ] Charts rendering
- [ ] Forms functional
- [ ] API endpoints responding

**Run automated health check:**
```bash
bash health-check.sh
```

**Verification:**
```bash
✓ All pages accessible
✓ No console errors
✓ Charts rendering
```

### Performance Validation (10 min)

```
Status: _________
Time: T+35 to T+45
```

- [ ] Check response times: `ab -n 100 -c 10 https://mplads.gov.in/`
- [ ] Monitor CPU: `top -b -n 1`
- [ ] Monitor Memory: `free -h`
- [ ] Check disk: `df -h`
- [ ] View Prometheus metrics: Open `http://localhost:9090`
- [ ] Open Grafana dashboard: Open `http://localhost:3000/grafana`

**Expected Metrics:**
```
Response Time: < 200ms average ✓
CPU Usage: < 60% ✓
Memory: < 70% ✓
Error Rate: < 0.1% ✓
```

### User Testing (10 min)

```
Status: _________
Time: T+45 to T+55
```

- [ ] Internal users able to login
- [ ] Dashboard data visible
- [ ] Filters working
- [ ] Search functionality working
- [ ] Export functionality working
- [ ] No reported issues

### Monitoring Validation (5 min)

```
Status: _________
Time: T+55 to T+60
```

- [ ] Prometheus scraping metrics: `curl -s http://localhost:9090/api/v1/targets | jq .`
- [ ] Grafana dashboards showing data
- [ ] Log aggregation working: Check recent logs in UI
- [ ] Alerts configured and armed
- [ ] Slack notifications working

---

## 🟢 DEPLOYMENT COMPLETE (T+60)

### Final Sign-Off

```
Deployment Lead: _________________ Date: __________
Signature: _____________________

QA Lead: _________________ Date: __________
Signature: _____________________

DevOps Manager: _________________ Date: __________
Signature: _____________________

Product Manager: _________________ Date: __________
Signature: _____________________
```

### Deployment Summary

**Status:** ✅ SUCCESSFUL / ⚠️ PARTIAL / ❌ FAILED

**Key Metrics:**
- Deployment Duration: ________ minutes
- Downtime: ________ minutes (Target: 0)
- Issues Found: ________ (Target: 0)
- Rollback Required: [ ] YES [ ] NO

**Issues Encountered (if any):**
1. _________________________________________________________________________
2. _________________________________________________________________________
3. _________________________________________________________________________

**Resolution:**
_____________________________________________________________________________
_____________________________________________________________________________

---

## 🔄 POST-DEPLOYMENT MONITORING (T+1 Hour to T+24 Hours)

### Continuous Monitoring

- [ ] Error rate normal (< 0.1%)
- [ ] Response times normal (< 200ms)
- [ ] No memory leaks detected
- [ ] Database performance normal
- [ ] No user complaints
- [ ] All alerts green

### First Hour Checks (Every 15 min)

```
T+0:00   [ ] Status: GREEN / YELLOW / RED
T+0:15   [ ] Status: GREEN / YELLOW / RED
T+0:30   [ ] Status: GREEN / YELLOW / RED
T+0:45   [ ] Status: GREEN / YELLOW / RED
T+1:00   [ ] Status: GREEN / YELLOW / RED
```

### Daily Monitoring (First 7 Days)

```
Day 1:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 2:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 3:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 4:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 5:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 6:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
Day 7:   [ ] Status: GREEN / YELLOW / RED   Notes: ___________
```

---

## 🚨 IF ISSUES DETECTED

### Decision Tree

**Is error rate > 5%?**
- [ ] YES → Immediate Rollback (See Rollback Procedure)
- [ ] NO → Continue monitoring

**Are users unable to login?**
- [ ] YES → Immediate Rollback (See Rollback Procedure)
- [ ] NO → Continue monitoring

**Is response time > 1 second?**
- [ ] YES → Scale horizontally or investigate
- [ ] NO → Continue monitoring

**Is database connection failing?**
- [ ] YES → Check database status, restart if needed
- [ ] NO → Continue monitoring

### Quick Support Contacts

| Role | Name | Phone | Slack |
|------|------|-------|-------|
| Deployment Lead | _________ | _________ | @_________ |
| DevOps Lead | _________ | _________ | @_________ |
| Backend Lead | _________ | _________ | @_________ |
| DBA | _________ | _________ | @_________ |

---

## 📝 ROLLBACK PROCEDURE

**When to Rollback:** Error rate > 5%, Critical functionality broken, Database issues

### Rollback Steps (< 10 minutes)

```bash
# 1. Stop current version
pm2 stop mplads-ui
pm2 delete mplads-ui

# 2. Restore previous version
git checkout HEAD~1  # or git checkout v0.9.0
npm run build

# 3. Restore database if needed
gunzip -c db-backup-<TIMESTAMP>.sql.gz | psql -h $DB_HOST -U $DB_USER $DB_NAME

# 4. Restart application
pm2 start ecosystem.config.js
pm2 status

# 5. Verify
curl -s https://mplads.gov.in/api/health
```

**Post-Rollback:**
- [ ] Confirm all systems functional
- [ ] Notify stakeholders
- [ ] Schedule incident post-mortem
- [ ] Update documentation

---

## 📋 FINAL NOTES

**Date Deployed:** ________________  
**Time Deployed:** ________________  
**Deployed By:** ________________  
**Reviewed By:** ________________

**Deployment Notes:**
_____________________________________________________________________________
_____________________________________________________________________________
_____________________________________________________________________________

**Lessons Learned:**
_____________________________________________________________________________
_____________________________________________________________________________

**Next Steps:**
_____________________________________________________________________________
_____________________________________________________________________________

---

**Document Version:** 1.0  
**Last Updated:** September 3, 2026
