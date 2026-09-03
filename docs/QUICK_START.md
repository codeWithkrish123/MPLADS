# ⚡ Quick Start Guide - MPLADS Portal

## 🚀 Get Started in 5 Minutes

### **Step 1: Prerequisites Check** (2 minutes)
```bash
# Check Node.js version (should be v16+)
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

If any command doesn't work, install from:
- Node.js: https://nodejs.org/
- Git: https://git-scm.com/

---

### **Step 2: Clone Repository** (1 minute)
```bash
# Clone the repository
git clone https://github.com/codeWithkrish123/MPLADS.git

# Navigate to UI directory
cd MPLADS/MPLADS-UI
```

---

### **Step 3: Install Dependencies** (1 minute)
```bash
# Install all packages
npm install
```

**What's installing:**
- React 19 (UI framework)
- Vite 6 (build tool)
- Tailwind CSS (styling)
- Express.js (backend server)
- TypeScript (type safety)
- And 20+ other packages

---

### **Step 4: Start Development Server** (1 minute)
```bash
# Start the dev server
npm run dev
```

**Expected output:**
```
MPLADS Sentinel Server running on http://localhost:3000
```

**Open browser and visit:** `http://localhost:3000`

---

## 📱 What You'll See

1. **Landing Page** (Beautiful hero section with Parliament background)
2. **Navigation Header** (Emblem of India + Government branding)
3. **Dashboard** (Click "Explore Dashboard" to view)
4. **Features Section** (AI Detection, Fraud Prevention, etc.)
5. **Footer** (Government links and compliance info)

---

## 🛑 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Run `npm run dev -- --port 3001` |
| npm install fails | Run `npm cache clean --force` then `npm install` |
| TypeScript errors | Run `npm run lint` to see errors |
| Page not loading | Check browser console (F12) for errors |

---

## 📤 Next: Push to GitHub

After making changes, follow these commands:

```bash
# 1. Create a feature branch
git checkout -b feature/your-feature-name

# 2. Add your changes
git add .

# 3. Commit with message
git commit -m "Your descriptive commit message"

# 4. Push to GitHub
git push -u origin feature/your-feature-name

# 5. Create Pull Request on GitHub.com
```

---

## 🎓 Project Structure

```
src/
├── views/           (Full page components)
├── components/      (Reusable UI components)
├── assets/          (Images, SVGs)
├── App.tsx          (Main app logic)
└── main.tsx         (Entry point)
```

---

## ✅ Done!

You're all set to develop the MPLADS Portal! 🎉

For more details, see [README.md](README.md)
