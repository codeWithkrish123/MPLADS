# 🚀 MPLADS-UI PRODUCTION DEPLOYMENT PLAN

**Status:** Ready for Deployment  
**Date Created:** September 3, 2026  
**Environment:** Government Portal (Production-Grade)  
**Version:** 1.0.0

---

## 📋 TABLE OF CONTENTS

1. [Executive Summary](#executive-summary)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Build & Optimization](#build--optimization)
4. [Deployment Architecture](#deployment-architecture)
5. [Environment Configuration](#environment-configuration)
6. [Database & Data Setup](#database--data-setup)
7. [Security & Compliance](#security--compliance)
8. [Monitoring & Observability](#monitoring--observability)
9. [Deployment Steps](#deployment-steps)
10. [Post-Deployment Validation](#post-deployment-validation)
11. [Rollback Plan](#rollback-plan)
12. [Support & Maintenance](#support--maintenance)

---

## 🎯 EXECUTIVE SUMMARY

**MPLADS-UI** is a government portal for monitoring MPLADS (Member of Parliament Local Area Development Scheme) projects. This document outlines the complete production deployment strategy.

**Key Details:**
- **Frontend:** React 19 + TypeScript + Tailwind CSS 4
- **Backend:** Express.js + Node.js
- **Bundler:** Vite 6 + ESBuild
- **Target Environment:** Government Server (On-Premises or Cloud)
- **Deployment Time:** ~30-45 minutes
- **Expected Downtime:** 0 minutes (blue-green deployment recommended)

---

## ✅ PRE-DEPLOYMENT CHECKLIST

### Code Quality Gate
- [ ] All tests passing (if test suite exists)
- [ ] `npm run lint` passes with no errors
- [ ] Code review completed and approved
- [ ] All branches merged to main/master
- [ ] Git commit tags created for version tracking
- [ ] No console.log or debug code in production builds

### Documentation
- [ ] README.md updated with deployment instructions
- [ ] Environment variables documented
- [ ] API endpoints documented (if backend)
- [ ] Known issues documented
- [ ] Rollback procedure documented

### Security
- [ ] No secrets in `.env` files
- [ ] Secrets stored in secure vault (AWS Secrets Manager, Azure Key Vault, etc.)
- [ ] Dependencies scanned for vulnerabilities: `npm audit`
- [ ] HTTPS configured
- [ ] CORS properly configured
- [ ] API authentication verified

### Performance
- [ ] Bundle size < 500KB (gzipped)
- [ ] Lighthouse score ≥ 80
- [ ] Core Web Vitals passed
- [ ] Images optimized
- [ ] CSS/JS minified

### Compliance
- [ ] WCAG AA accessibility verified
- [ ] Government standards compliance checked
- [ ] Data privacy (GDPR/India) compliant
- [ ] IT Act 2000 compliance verified

---

## 🏗️ BUILD & OPTIMIZATION

### Build Command
```bash
npm run build
```

**What this does:**
1. Compiles React + TypeScript with Vite
2. Bundles and minifies CSS/JS
3. Creates optimized `dist/` folder
4. Builds backend server with ESBuild
5. Generates source maps for debugging

### Build Output Structure
```
dist/
├── index.html              # Frontend entry point
├── assets/
│   ├── *.js               # Bundled JavaScript (minified)
│   ├── *.css              # Bundled styles (minified)
│   └── images/            # Optimized assets
├── server.cjs             # Compiled backend server
└── server.cjs.map         # Source map for debugging
```

### Optimization Steps

**1. Remove Debug Code**
```bash
# Search for and remove console.log statements
grep -r "console\." src/ --include="*.tsx" --include="*.ts"
```

**2. Check Bundle Size**
```bash
# After build, check dist size
du -sh dist/
# Expected: 300-500 KB gzipped
```

**3. Verify Lighthouse Score**
```bash
# Run Lighthouse audit
npm run build
npm run preview  # Test locally first
# Then audit in Chrome DevTools
```

**4. Test Production Build Locally**
```bash
npm run build
npm start
# Should run on http://localhost:3000
# Test all pages and features
```

---

## 🏛️ DEPLOYMENT ARCHITECTURE

### Recommended Infrastructure

#### Option 1: Government On-Premises Server
```
Government Data Center
    ├── Load Balancer (Nginx/HAProxy)
    ├── Web Server 1 (Node.js + Express)
    ├── Web Server 2 (Node.js + Express)
    ├── Database Server (PostgreSQL/MySQL)
    ├── File Storage (NFS/Local)
    └── Monitoring Stack (Prometheus/Grafana)
```

#### Option 2: Government Cloud (AWS/Azure)
```
Government Cloud Account
    ├── Load Balancer (ALB/Application Gateway)
    ├── Container Registry (ECR/ACR)
    ├── Container Orchestration (ECS/AKS)
    ├── Managed Database (RDS/Cosmos)
    ├── Object Storage (S3/Blob)
    └── Monitoring (CloudWatch/Azure Monitor)
```

### Recommended Deployment Method

**Blue-Green Deployment** (Zero-Downtime)
```
Before Deployment:
  PRODUCTION → Blue Server (Old Version)

During Deployment:
  PRODUCTION → Blue Server (Old Version)
  STAGING    → Green Server (New Version) [Testing]

After Validation:
  PRODUCTION → Green Server (New Version)
  Blue Server → Kept as Rollback
```

---

## 🔧 ENVIRONMENT CONFIGURATION

### Production Environment Variables

Create `.env.production`:
```env
# Application
NODE_ENV=production
PORT=3000
VITE_API_BASE_URL=https://mplads.gov.in/api

# Database
DB_HOST=db.mplads.gov.in
DB_PORT=5432
DB_NAME=mplads_production
DB_USER=mplads_prod_user
DB_PASSWORD=<SECURE_PASSWORD_FROM_VAULT>

# Security
TLS_CERT_PATH=/etc/ssl/certs/mplads.gov.in.crt
TLS_KEY_PATH=/etc/ssl/private/mplads.gov.in.key
JWT_SECRET=<SECURE_JWT_SECRET_FROM_VAULT>

# Google Cloud AI (if using genai)
GOOGLE_GENAI_API_KEY=<SECURE_KEY_FROM_VAULT>

# Monitoring
LOG_LEVEL=info
SENTRY_DSN=<YOUR_SENTRY_DSN>
PROMETHEUS_PORT=9090

# Government Compliance
GOV_PORTAL_NAME=MPLADS
GOV_MINISTRY=Ministry of Statistics & Programme Implementation
GOV_SCHEME_NAME=Member of Parliament Local Area Development Scheme
```

### Secure Configuration Loading

```bash
# Load from secure vault (example: AWS Secrets Manager)
aws secretsmanager get-secret-value \
  --secret-id mplads-prod-env \
  --region ap-south-1 | jq -r '.SecretString' > .env.production
```

---

## 🗄️ DATABASE & DATA SETUP

### Database Initialization

1. **Create PostgreSQL Database**
```sql
CREATE DATABASE mplads_production;
CREATE USER mplads_prod_user WITH PASSWORD '<SECURE_PASSWORD>';
GRANT ALL PRIVILEGES ON DATABASE mplads_production TO mplads_prod_user;
```

2. **Run Migrations** (if applicable)
```bash
# Example with Knex.js
npx knex migrate:latest --env production
```

3. **Seed Master Data**
```bash
# Load government data, states, districts, etc.
npx knex seed:run --env production
```

### Backup Strategy

```bash
# Daily backups
0 2 * * * /usr/local/bin/backup-mplads.sh

# Backup script content:
#!/bin/bash
BACKUP_FILE="/backups/mplads_$(date +%Y%m%d_%H%M%S).sql"
pg_dump -h $DB_HOST -U $DB_USER $DB_NAME | gzip > $BACKUP_FILE
# Upload to secure storage (S3/Azure Blob)
aws s3 cp $BACKUP_FILE s3://mplads-backups/
```

---

## 🔐 SECURITY & COMPLIANCE

### SSL/TLS Certificate

```bash
# Install certificate (provided by government)
cp /path/to/mplads.gov.in.crt /etc/ssl/certs/
cp /path/to/mplads.gov.in.key /etc/ssl/private/
chmod 400 /etc/ssl/private/mplads.gov.in.key
```

### Nginx Configuration

```nginx
# /etc/nginx/sites-available/mplads.conf

upstream mplads_backend {
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;  # Second instance for load balancing
}

server {
    listen 80;
    server_name mplads.gov.in;
    return 301 https://$server_name$request_uri;  # Redirect HTTP to HTTPS
}

server {
    listen 443 ssl http2;
    server_name mplads.gov.in;

    # SSL Configuration
    ssl_certificate /etc/ssl/certs/mplads.gov.in.crt;
    ssl_certificate_key /etc/ssl/private/mplads.gov.in.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    # Compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/json application/javascript;
    gzip_min_length 1000;

    # Proxy to backend
    location / {
        proxy_pass http://mplads_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 30s;
        proxy_connect_timeout 5s;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirect to HTTPS)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw allow 9090/tcp  # Prometheus (internal only)
```

### API Security

```javascript
// server.ts - Add security middleware
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

const app = express();

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS configuration (government portal)
app.use(cors({
    origin: ['https://mplads.gov.in', 'https://www.mplads.gov.in'],
    credentials: true
}));
```

---

## 📊 MONITORING & OBSERVABILITY

### Application Monitoring

```bash
# Install PM2 for process management
npm install -g pm2

# Create ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "mplads-ui",
    script: "./dist/server.cjs",
    instances: 2,
    exec_mode: "cluster",
    env: {
      NODE_ENV: "production"
    },
    error_file: "/var/log/mplads/error.log",
    out_file: "/var/log/mplads/out.log",
    merge_logs: true
  }]
};
EOF

# Start with PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Log Management

```bash
# Create log directory
mkdir -p /var/log/mplads
chown -R mplads:mplads /var/log/mplads

# Rotate logs
cat > /etc/logrotate.d/mplads << 'EOF'
/var/log/mplads/*.log {
    daily
    rotate 30
    compress
    delaycompress
    notifempty
    create 640 mplads mplads
}
EOF
```

### Prometheus Monitoring

```yaml
# /etc/prometheus/prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'mplads-ui'
    static_configs:
      - targets: ['localhost:9090']
    metrics_path: '/metrics'
```

### Grafana Dashboards

- Monitor application uptime
- Track response times
- Monitor error rates
- Database connection pool
- Memory and CPU usage
- Request rates by endpoint

---

## 🚀 DEPLOYMENT STEPS

### Step 1: Pre-Deployment Verification

```bash
# Login to production server
ssh admin@mplads-prod.gov.in

# Create deployment directory
mkdir -p /app/mplads-ui
cd /app/mplads-ui
```

### Step 2: Pull Latest Code

```bash
# Clone or pull latest changes
git clone https://github.com/codeWithkrish123/MPLADS.git
cd MPLADS/MPLADS-UI

# Verify branch and commit
git branch -v
git log --oneline -5
```

### Step 3: Install Dependencies

```bash
# Install production dependencies only
npm ci --production

# Verify installation
npm list --depth=0
```

### Step 4: Build Application

```bash
# Create build
npm run build

# Verify build output
ls -lah dist/
du -sh dist/
```

### Step 5: Run Pre-Deployment Tests

```bash
# Test production build locally
npm start &
sleep 5

# Test endpoints
curl -s http://localhost:3000 | head -20
curl -s http://localhost:3000/api/health

# Kill test server
kill %1
```

### Step 6: Database Migrations

```bash
# If using database
npx knex migrate:latest --env production
npx knex seed:run --env production
```

### Step 7: Start Application with PM2

```bash
# Stop existing instances
pm2 stop all
pm2 delete all

# Start new instances
pm2 start ecosystem.config.js

# Verify running
pm2 status
pm2 logs
```

### Step 8: Verify Deployment

```bash
# Wait for startup
sleep 10

# Check application health
curl -s https://mplads.gov.in/api/health | jq .

# Check logs
pm2 logs mplads-ui
```

### Step 9: Load Balancer Update

```bash
# Update Nginx/HAProxy to route traffic to new instances
sudo nginx -t
sudo systemctl reload nginx

# Verify routing
curl -I https://mplads.gov.in
```

---

## ✓ POST-DEPLOYMENT VALIDATION

### Functional Testing

```bash
# Test critical paths
echo "Testing Landing Page..."
curl -s https://mplads.gov.in | grep -q "MPLADS" && echo "✓ Landing page OK"

echo "Testing Dashboard..."
curl -s https://mplads.gov.in/overview | grep -q "National Overview" && echo "✓ Dashboard OK"

echo "Testing API endpoints..."
curl -s https://mplads.gov.in/api/health | jq . && echo "✓ API OK"
```

### Performance Validation

```bash
# Check response times
ab -n 100 -c 10 https://mplads.gov.in/
# Expected: < 200ms average response time

# Check build size
ls -lh dist/assets/
# Expected: < 500KB gzipped
```

### Security Validation

```bash
# Check SSL configuration
openssl s_client -connect mplads.gov.in:443 < /dev/null

# Check security headers
curl -I https://mplads.gov.in | grep "Strict-Transport-Security"
```

### Monitoring Validation

```bash
# Verify logs are being written
tail -f /var/log/mplads/out.log

# Check PM2 monitoring
pm2 monit

# Check Prometheus metrics
curl -s http://localhost:9090/metrics | head -20
```

---

## 🔄 ROLLBACK PLAN

### Scenario: Deployment Failed or Issues Detected

### Immediate Rollback (< 5 minutes)

```bash
# Stop current version
pm2 stop mplads-ui

# Restore previous version from git
git checkout HEAD~1

# Rebuild
npm run build

# Start previous version
pm2 start ecosystem.config.js

# Verify
curl -s https://mplads.gov.in/api/health
```

### Database Rollback (if needed)

```bash
# Restore from backup
BACKUP_FILE=$(aws s3 ls s3://mplads-backups/ | tail -1 | awk '{print $4}')
aws s3 cp s3://mplads-backups/$BACKUP_FILE ./

# Restore database
gunzip -c $BACKUP_FILE | psql -h $DB_HOST -U $DB_USER $DB_NAME
```

### Keep Previous Version Running

```bash
# Always keep N-1 version available
git tag -a v1.0.0 -m "Production release v1.0.0"
git tag -a v1.0.1 -m "Production release v1.0.1 (current)"

# Quick switch to previous version
git checkout v1.0.0
npm run build
pm2 restart mplads-ui
```

---

## 📞 SUPPORT & MAINTENANCE

### Deployment Team Roles

| Role | Responsibility |
|------|-----------------|
| **Deployment Lead** | Oversees entire deployment, makes go/no-go decision |
| **DevOps Engineer** | Infrastructure setup, monitoring, logs |
| **Backend Engineer** | Database migrations, API testing |
| **Frontend Engineer** | UI testing, performance validation |
| **QA Lead** | Functional testing, regression testing |

### Deployment Checklist (Day-Of)

```
Pre-Deployment (T-60 min)
  [ ] All team members briefed
  [ ] Rollback plan reviewed
  [ ] Backups verified
  [ ] Monitoring dashboards open
  [ ] Communication channels ready

Deployment (T-0)
  [ ] Code pulled and built
  [ ] Tests passing
  [ ] Database migrations successful
  [ ] Application started

Post-Deployment (T+30 min)
  [ ] All endpoints responding
  [ ] Performance metrics good
  [ ] No error spikes
  [ ] Users not reporting issues

Final Sign-off (T+60 min)
  [ ] Health check: PASS
  [ ] Performance check: PASS
  [ ] Error rate: Normal
  [ ] QA approval: YES
  [ ] Deployment: SUCCESS
```

### Runbook: Critical Issues

**Issue: High Error Rate**
```bash
# Check application logs
pm2 logs mplads-ui | grep -i error

# Check system resources
top -b -n 1 | head -10

# Increase log level temporarily
export LOG_LEVEL=debug
pm2 restart mplads-ui
```

**Issue: High Response Time**
```bash
# Check database
psql -h $DB_HOST -U $DB_USER -d $DB_NAME -c "SELECT * FROM pg_stat_statements;"

# Check network
mtr -c 100 mplads.gov.in

# Restart application
pm2 restart mplads-ui
```

**Issue: Memory Leak**
```bash
# Monitor memory usage
pm2 monit

# Force garbage collection
pm2 restart mplads-ui

# If persists, rollback to previous version
git checkout HEAD~1
npm run build
pm2 restart mplads-ui
```

### Maintenance Schedule

```
Daily:
  - Check application logs for errors
  - Monitor resource usage
  - Verify backups completed

Weekly:
  - Review performance metrics
  - Check for security updates
  - Test disaster recovery plan

Monthly:
  - Full backup verification
  - Security audit
  - Performance optimization review
  - Update documentation
```

---

## 📈 EXPECTED METRICS (Post-Deployment)

### Performance Targets
- **Page Load Time:** < 2 seconds
- **API Response Time:** < 200ms
- **Lighthouse Score:** ≥ 80
- **Uptime:** 99.9% or higher

### Quality Targets
- **Error Rate:** < 0.1%
- **Failed Requests:** < 1%
- **CPU Usage:** < 70%
- **Memory Usage:** < 80%

### Business Metrics
- **User Concurrency:** Handle 1000+ concurrent users
- **Transactions/sec:** Handle 100+ req/sec
- **Database Connections:** Pool size 20-50

---

## 📄 SIGN-OFF

**Deployment Authorization:**

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Deployment Lead | _____________ | ______ | ______ |
| DevOps Manager | _____________ | ______ | ______ |
| QA Lead | _____________ | ______ | ______ |
| Product Manager | _____________ | ______ | ______ |

**Go/No-Go Decision:** [ ] GO  [ ] NO-GO

**Decision Reason:** _______________________________________________

---

## 📚 APPENDIX

### A. Environment Setup Script

```bash
#!/bin/bash
# setup-production.sh

set -e

echo "🚀 Setting up MPLADS-UI Production Environment"

# Create directories
mkdir -p /app/mplads-ui
mkdir -p /var/log/mplads
mkdir -p /var/lib/mplads

# Load environment
cd /app/mplads-ui
aws secretsmanager get-secret-value \
  --secret-id mplads-prod-env \
  --region ap-south-1 | jq -r '.SecretString' > .env.production

# Install dependencies
npm ci --production

# Build application
npm run build

# Create PM2 ecosystem
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: "mplads-ui",
    script: "./dist/server.cjs",
    instances: 2,
    exec_mode: "cluster",
    env: { NODE_ENV: "production" }
  }]
};
EOF

echo "✓ Environment setup complete"
```

### B. Health Check Script

```bash
#!/bin/bash
# health-check.sh

ENDPOINT="https://mplads.gov.in"

echo "Checking MPLADS-UI Health..."

# Check landing page
if curl -s $ENDPOINT | grep -q "MPLADS"; then
    echo "✓ Landing page OK"
else
    echo "✗ Landing page FAILED"
    exit 1
fi

# Check API
if curl -s $ENDPOINT/api/health | jq . > /dev/null; then
    echo "✓ API OK"
else
    echo "✗ API FAILED"
    exit 1
fi

# Check SSL
if openssl s_client -connect mplads.gov.in:443 < /dev/null | grep -q "Verify return code: 0"; then
    echo "✓ SSL OK"
else
    echo "✗ SSL FAILED"
    exit 1
fi

echo "✓ All health checks passed"
```

---

**Version:** 1.0.0  
**Status:** Ready for Production Deployment  
**Last Updated:** September 3, 2026  
**Next Review:** After first production deployment
