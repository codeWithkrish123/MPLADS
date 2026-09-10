# 🚀 MPLADS Sentinel - Cloudflare Pages Deployment & Security Guide

This guide provides step-by-step instructions to deploy the **MPLADS Sentinel Frontend** to **Cloudflare Pages** with enterprise-grade security, automatic Git CI/CD deployment, single-page application (SPA) routing, and protection against web threats.

---

## 🔒 Why Cloudflare Pages is the Best Choice for Security & Speed

1. **Global Anycast CDN & DDoS Mitigation**: Built-in, un-metered protection against Layer 3/4 and Layer 7 DDoS attacks.
2. **Automatic SSL/TLS Encryption**: Free Universal SSL certificates with TLS 1.3 enabled by default.
3. **Web Application Firewall (WAF) & Bot Management**: Filters out malicious traffic, automated scrapers, and exploit attempts before reaching your application.
4. **Instant Edge Delivery**: Static assets served from 300+ edge locations worldwide with ultra-low latency.
5. **Zero-Trust Access Integration**: Easily restrict access to specific domain users or government administrators using Cloudflare Zero Trust.

---

## 🛠️ Step 1: Pre-Deployment Configuration (Already Applied)

We have already configured SPA routing and custom HTTP security headers inside `MPLADS-UI/public/`:

1. **`public/_redirects`**: Ensures single-page application deep linking works smoothly without returning `404 Not Found` when refreshing sub-pages like `/live-command` or `/ghost-verification`.
   ```text
   /* /index.html 200
   ```

2. **`public/_headers`**: Enforces strict security policies at the HTTP header level.
   ```text
   /*
     X-Frame-Options: DENY
     X-Content-Type-Options: nosniff
     Referrer-Policy: strict-origin-when-cross-origin
     Permissions-Policy: camera=(), microphone=(), geolocation=()
     Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
     Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' https://mplads-backend-gateway.aditya93193.workers.dev https://sih-2026-23oy.onrender.com https://*.workers.dev; worker-src 'self' blob:; frame-ancestors 'none';
   ```

---

## 🌐 Method 1: Automatic Deployment via GitHub (Recommended)

This method connects your GitHub repository (`https://github.com/codeWithkrish123/MPLADS.git`) directly to Cloudflare Pages for automatic deployments on every commit.

### **Step 1.1: Log into Cloudflare**
1. Go to [dash.cloudflare.com](https://dash.cloudflare.com/) and log in (or create a free account).
2. On the sidebar navigation, click on **Workers & Pages**.
3. Click on **Create Application** and select the **Pages** tab.
4. Click **Connect to Git**.

### **Step 1.2: Connect GitHub Repository**
1. Select **GitHub** and authorize Cloudflare to access your GitHub account.
2. Select your repository: `codeWithkrish123/MPLADS`.
3. Click **Begin setup**.

### **Step 1.3: Configure Build & Deployment Settings**
Fill in the deployment configuration options as follows:

| Field | Recommended Value | Explanation |
| :--- | :--- | :--- |
| **Project name** | `mplads-sentinel` | Your production application name |
| **Production branch** | `main` or `feature/mplad-frontend` | Select the branch you want to serve |
| **Framework preset** | `Vite` (or `None`) | Pre-configures Vite build defaults |
| **Root directory** | `MPLADS-UI` | ⚠️ **Crucial**: Your frontend lives inside `MPLADS-UI` subfolder |
| **Build command** | `npm run build` | Compiles Vite production bundle |
| **Build output directory** | `dist` | Folder containing compiled static assets |

---

### **Step 1.4: Add Production Environment Variables**
Scroll down to **Environment Variables (advanced)** and click **Add variable** for each entry:

| Variable Name | Value | Purpose |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://mplads-backend-gateway.aditya93193.workers.dev/api` | Backend Cloudflare Gateway URL |
| `VITE_ML_API_URL` | `https://sih-2026-23oy.onrender.com/api` | Production ML Analytics Engine API |
| `VITE_ENABLE_MOCK_DATA` | `false` | Disables mock data; forces real API mode |
| `NODE_VERSION` | `20` | Ensures modern Node.js build runtime |

---

### **Step 1.5: Save and Deploy**
1. Click **Save and Deploy**.
2. Cloudflare will clone your repository, install dependencies via `npm install`, build your assets via `npm run build`, and deploy them globally.
3. Once completed, Cloudflare will output your live URL:
   `https://mplads-sentinel.pages.dev`

---

## 💻 Method 2: Manual CLI Deployment using Wrangler

If you prefer to deploy directly from your local terminal command line without GitHub integration:

1. **Install Cloudflare Wrangler CLI**:
   ```bash
   npm install -g wrangler
   ```

2. **Log into Cloudflare**:
   ```bash
   npx wrangler login
   ```

3. **Navigate to the frontend folder and build**:
   ```bash
   cd e:\MPLADS\MPLADS-UI
   npm run build
   ```

4. **Deploy to Cloudflare Pages**:
   ```bash
   npx wrangler pages deploy dist --project-name=mplads-sentinel
   ```

---

## 🛡️ Step 3: Enterprise Security & Hardening Configuration

After deploying your application, apply these maximum security configurations in your Cloudflare Dashboard:

### **3.1 SSL/TLS Encryption**
1. Go to **SSL/TLS** -> **Overview**.
2. Set SSL/TLS Encryption mode to **Full (strict)**.
3. Go to **SSL/TLS** -> **Edge Certificates**:
   - Turn **Always Use HTTPS** to **ON**.
   - Set **Minimum TLS Version** to **TLS 1.3**.
   - Enable **HTTP Strict Transport Security (HSTS)** with 1-year duration.

### **3.2 Cloudflare Web Application Firewall (WAF)**
1. Go to **Security** -> **WAF** -> **Custom Rules**.
2. Create rules to block known bot networks, high-risk ASNs, and OWASP Top 10 web vulnerabilities (SQLi, XSS, Path Traversal).

### **3.3 DDoS & Bot Management**
1. Go to **Security** -> **Bots**.
2. Enable **Bot Fight Mode** to block automated scrapers and abuse tools automatically.

### **3.4 Custom Domain Setup (Optional)**
1. In Cloudflare Pages, click on **Custom domains** -> **Set up a custom domain**.
2. Enter your domain name (e.g. `sentinel.mplads.gov.in` or `mplads.yourdomain.com`).
3. Cloudflare will automatically provision and manage free SSL certificates.

---

## ✅ Deployment Checklist & Verification

After deployment, test the live link:
1. Navigating to `https://mplads-sentinel.pages.dev` should load the main dashboard.
2. Clicking sidebar routes (e.g. `/live-command`, `/ghost-verification`, `/case-management`, `/scenario-simulation`) should navigate cleanly without error.
3. Refreshing the browser while on `/live-command` should reload the page correctly (verifies `_redirects`).
4. Inspect Network tab in Developer Tools: verify requests hit `https://mplads-backend-gateway.aditya93193.workers.dev/api` and `https://sih-2026-23oy.onrender.com/api`.
5. Check Response Headers to confirm `X-Frame-Options: DENY`, `Strict-Transport-Security`, and `Content-Security-Policy` are active.
