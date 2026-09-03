# MPLADS - AI-Powered Monitoring Portal

🏛️ **Member of Parliament Local Area Development Scheme (MPLADS) - Transparent & Intelligent Monitoring System**

A modern, full-stack React application for monitoring and managing MPLADS projects with AI-powered anomaly detection, real-time tracking, and comprehensive analytics.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development Setup](#development-setup)
- [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [How It Works](#how-it-works)
- [Environment Configuration](#environment-configuration)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Overview

MPLADS Portal is a **Government of India initiative** that provides:

- **Real-time Monitoring**: Track MPLADS project progress, fund utilization, and delays
- **Anomaly Detection**: AI-powered system to identify suspicious patterns and fraud
- **Multi-Level Access**: Support for Ministry, MPs, District Authorities, and State Nodal Officers
- **Bilingual Interface**: Full support for English and Hindi
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional Government Portal**: Built with official government standards and compliance

---

## ✨ Features

### Core Functionality
- ✅ **AI-Powered Anomaly Detection** - ML models identify irregularities in fund utilization
- ✅ **Fraud Prevention** - Detects duplicate works, fake vendors, inflated costs
- ✅ **Real-time Monitoring** - Live project progress tracking and alerts
- ✅ **Data-Driven Insights** - Predictive analytics and comprehensive reports
- ✅ **Multi-Role Support** - Different dashboards for different user roles
- ✅ **State & District Drill-down** - Hierarchical data exploration
- ✅ **Audit Logging** - Complete activity tracking and compliance audit trail

### Technical Features
- 🎨 **Premium UI/UX** - Professional government portal design with 3D effects
- 🌍 **Bilingual Support** - English and Hindi interfaces
- ♿ **Accessibility** - High contrast mode, font size adjustment, screen reader support
- 📱 **Responsive Design** - Mobile-first approach
- ⚡ **Performance Optimized** - Fast loading with Vite bundling
- 🔐 **Secure** - TLS 1.3 encryption, IT Act 2000 compliance

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Type-safe development
- **Vite 6** - Lightning-fast build tool
- **Tailwind CSS 4** - Utility-first styling
- **React Router 7** - Client-side routing
- **Lucide React** - Beautiful icons
- **Recharts** - Data visualization
- **Leaflet** - Map intelligence

### Backend
- **Express.js** - Node.js server
- **TypeScript** - Type safety
- **TSX** - TypeScript execution

### Build & Dev Tools
- **ESBuild** - Fast JavaScript bundler
- **Autoprefixer** - CSS vendor prefixes
- **npm** - Package management

---

## 📋 Prerequisites

Before you begin, ensure you have installed:

1. **Node.js** (v16 or higher)
   - [Download Node.js](https://nodejs.org/)
   - Verify: `node --version`

2. **npm** (comes with Node.js)
   - Verify: `npm --version`

3. **Git** (for version control)
   - [Download Git](https://git-scm.com/)
   - Verify: `git --version`

4. **A Text Editor or IDE**
   - VS Code (recommended): [Download](https://code.visualstudio.com/)
   - Or any editor of your choice

---

## 🚀 Installation

### Step 1: Clone the Repository

```bash
# Clone the MPLADS repository
git clone https://github.com/codeWithkrish123/MPLADS.git

# Navigate to the project directory
cd MPLADS/MPLADS-UI
```

### Step 2: Install Dependencies

```bash
# Install all project dependencies
npm install
```

**What happens here:**
- Downloads all required packages from npm
- Installs frontend (React, Vite, Tailwind)
- Installs backend (Express, TypeScript)
- Creates `node_modules` folder with all dependencies

### Step 3: Create Environment Configuration (Optional)

```bash
# Copy the example environment file
cp .env.example .env
```

If `.env.example` doesn't exist, create `.env` file in the root with:
```
VITE_API_BASE_URL=http://localhost:3000
```

---

## 💻 Development Setup

### What Each Command Does:

```bash
# Starts the development server with hot reload
npm run dev
# - Starts on http://localhost:3000
# - Auto-refreshes when you save files
# - Shows TypeScript errors in terminal

# Type-checks the code (finds TypeScript errors)
npm run lint
# - Verifies all types are correct
# - Does NOT compile, just checks

# Builds for production
npm run build
# - Optimizes code for deployment
# - Minifies files
# - Creates dist/ folder

# Preview the production build locally
npm run preview
# - Shows how app looks when deployed

# Start production build (after running build)
npm start
# - Runs the compiled production server
```

---

## 🏃 Running Locally - Quick Start

### **Option 1: Development Mode (Recommended)**

```bash
# 1. Navigate to project directory
cd E:\MPLADS\MPLADS-UI

# 2. Install dependencies (first time only)
npm install

# 3. Start development server
npm run dev
```

**Expected Output:**
```
MPLADS Sentinel Server running on http://localhost:3000
```

**Then open your browser:**
- Go to `http://localhost:3000`
- You'll see the Landing Page

### **Option 2: Production Build**

```bash
# 1. Build the project
npm run build

# 2. Start the production server
npm start
```

---

## 📁 Project Structure

```
MPLADS-UI/
├── src/
│   ├── views/
│   │   ├── LandingPage.tsx          ← Main landing page (hero section)
│   │   ├── NationalOverviewView.tsx ← National dashboard
│   │   ├── StateIntelligenceView.tsx ← State-level analytics
│   │   ├── DistrictDashboardView.tsx ← District-level data
│   │   └── ... (other dashboard views)
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Topbar.tsx      ← Header with emblem and controls
│   │   │   ├── Sidebar.tsx     ← Navigation menu
│   │   │   └── GovFooter.tsx   ← Government footer
│   │   │
│   │   ├── gov/
│   │   │   ├── StateEmblem.tsx ← Government emblem component
│   │   │   └── ...
│   │   │
│   │   └── common/
│   │       ├── ErrorBoundary.tsx ← Error handling
│   │       ├── OnboardingTour.tsx ← User guide
│   │       └── ... (common components)
│   │
│   ├── assets/
│   │   ├── images/
│   │   │   ├── parliament-hero-premium.webp ← Hero background
│   │   │   ├── Emblem_of_India.svg ← Official emblem
│   │   │   └── ...
│   │   └── ...
│   │
│   ├── App.tsx          ← Main app component
│   ├── AppRoutes.tsx    ← Route definitions
│   ├── main.tsx         ← Entry point
│   ├── index.css        ← Global styles
│   └── types.ts         ← TypeScript type definitions
│
├── server.ts            ← Express server setup
├── vite.config.ts       ← Vite configuration
├── tailwind.config.js   ← Tailwind CSS config
├── tsconfig.json        ← TypeScript config
├── package.json         ← Project metadata & dependencies
├── README.md            ← This file
└── .env.example         ← Environment template
```

---

## 🔍 How It Works

### **Landing Page Flow:**

1. **User visits** `http://localhost:3000`
2. **LandingPage.tsx** renders with:
   - Header with Emblem of India SVG
   - Hero section with Parliament background (3D effects)
   - Feature cards showcasing capabilities
   - Government footer
   - Bilingual support (EN/HI)

3. **User clicks "Explore Dashboard"**
   - Navigates to National Overview dashboard
   - Shows statistics, maps, and analytics

4. **User selects a role** (Ministry, MP, District, State)
   - Dashboard updates with role-specific data
   - Sidebar shows relevant navigation options

### **Dashboard Architecture:**

```
App.tsx (Main state management)
    ↓
├── Landing Page (Public)
├── Login Page
└── Dashboard View (Protected)
    ├── Topbar (Header with emblem)
    ├── Sidebar (Navigation)
    ├── Main Content (Dynamic views)
    │   ├── National Overview
    │   ├── State Intelligence
    │   ├── District Dashboard
    │   ├── Work Management
    │   ├── Alert Center
    │   └── ... (other views)
    └── Drawers & Modals
```

### **Key Technologies in Action:**

- **React State**: Manages user role, current view, language
- **React Router**: Handles page navigation without full refresh
- **TypeScript**: Ensures type safety across the app
- **Tailwind CSS**: Responsive, utility-first styling
- **Vite**: Hot module replacement (HMR) for instant updates

---

## 🔐 Environment Configuration

Create a `.env` file in the project root:

```bash
# API Configuration
VITE_API_BASE_URL=http://localhost:3000

# Feature Flags (optional)
VITE_ENABLE_MOCK_DATA=true
VITE_DEBUG_MODE=false

# Government Settings
VITE_PORTAL_NAME=MPLADS
VITE_MINISTRY=Ministry of Statistics & Programme Implementation
```

---

## 🐛 Troubleshooting

### **Issue: Port 3000 is already in use**

```bash
# On Windows, find process using port 3000
netstat -ano | findstr :3000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F

# Or use a different port
PORT=3001 npm run dev
```

### **Issue: Dependencies not installing**

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall
npm install
```

### **Issue: TypeScript errors after code changes**

```bash
# Check for all errors
npm run lint

# Fix the errors shown in the output
# Usually in the file:line format shown
```

### **Issue: App not loading on localhost:3000**

```bash
# Check if server is running (should see: "MPLADS Sentinel Server running on...")
# If not, start it: npm run dev

# Check browser console for errors (F12 → Console tab)
# Clear browser cache (Ctrl+Shift+Delete)
# Try in incognito/private mode
```

---

## 📚 Understanding the Code

### **Main Entry Points:**

1. **src/main.tsx** - React app initialization
2. **src/App.tsx** - Main app component with routing logic
3. **src/views/LandingPage.tsx** - Landing page with hero section
4. **src/components/layout/Topbar.tsx** - Dashboard header with emblem

### **Key Concepts:**

- **Views**: Full-page components (LandingPage, Dashboard, etc.)
- **Components**: Reusable UI pieces (Topbar, Sidebar, Cards)
- **State Management**: React hooks (useState, useEffect)
- **Routing**: React Router for navigation
- **Styling**: Tailwind CSS utility classes

---

## 🔄 Git Workflow - Pushing to GitHub

### **Create and Push Feature Branch:**

```bash
# 1. Create a new branch for your changes
git checkout -b feature/mplads-ui-enhancements

# 2. Add all changes
git add .

# 3. Commit with a meaningful message
git commit -m "Add hero section polish and dashboard emblem integration"

# 4. Push to GitHub (replace origin with your remote if different)
git push -u origin feature/mplads-ui-enhancements
```

### **Create Pull Request on GitHub:**

1. Go to https://github.com/codeWithkrish123/MPLADS
2. Click "New Pull Request"
3. Select your branch
4. Add title: "MPLADS UI Enhancements - Hero Section & Dashboard"
5. Add description with your changes
6. Click "Create Pull Request"

---

## 📖 Next Steps

1. ✅ Install Node.js and npm
2. ✅ Clone the repository
3. ✅ Run `npm install`
4. ✅ Run `npm run dev`
5. ✅ Open http://localhost:3000
6. ✅ Explore the Landing Page and Dashboard
7. ✅ Make your changes
8. ✅ Push to GitHub with meaningful commits

---

## 📞 Support

For issues or questions:
- Check the [Troubleshooting](#troubleshooting) section
- Review console errors (F12 in browser)
- Check TypeScript errors: `npm run lint`

---

## 📄 License

This project is part of the Government of India's MPLADS initiative.

---

**Happy Coding! 🚀**

---

*Last Updated: September 3, 2026 - Deployment Verification*
