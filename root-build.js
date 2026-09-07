#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔨 Starting Vercel build from root...');

try {
  const mpladsUIDir = path.join(__dirname, 'MPLADS-UI');
  const rootDir = __dirname;
  const rootDistPath = path.join(rootDir, 'dist');
  
  console.log('📁 Root directory:', rootDir);
  console.log('📁 MPLADS-UI directory:', mpladsUIDir);
  
  // Step 1: Install dependencies in MPLADS-UI
  console.log('\n✓ Step 1: Installing dependencies in MPLADS-UI...');
  execSync('npm install --legacy-peer-deps', { 
    cwd: mpladsUIDir,
    stdio: 'inherit' 
  });
  
  // Step 2: Run build in MPLADS-UI
  console.log('\n✓ Step 2: Building MPLADS-UI with Vite...');
  execSync('npm run build', { 
    cwd: mpladsUIDir,
    stdio: 'inherit' 
  });
  
  // Step 3: Check if dist exists in MPLADS-UI
  const mpladsDistPath = path.join(mpladsUIDir, 'dist');
  if (!fs.existsSync(mpladsDistPath)) {
    console.error('❌ ERROR: dist folder not created at', mpladsDistPath);
    process.exit(1);
  }
  console.log('✓ Dist folder found at:', mpladsDistPath);
  
  // Step 4: Copy dist to root
  console.log('\n✓ Step 3: Copying dist from MPLADS-UI to root...');
  
  // Remove existing dist at root if it exists
  if (fs.existsSync(rootDistPath)) {
    fs.rmSync(rootDistPath, { recursive: true, force: true });
    console.log('  Removed old dist directory');
  }
  
  // Copy dist folder
  fs.cpSync(mpladsDistPath, rootDistPath, { recursive: true });
  console.log('✓ Dist copied successfully to:', rootDistPath);
  
  // Step 5: Verify dist exists at root and contains files
  if (!fs.existsSync(rootDistPath)) {
    console.error('❌ ERROR: Failed to copy dist to root');
    process.exit(1);
  }
  
  const files = fs.readdirSync(rootDistPath);
  console.log('✓ Root dist contains:', files);
  
  if (files.length === 0) {
    console.error('❌ ERROR: dist folder is empty');
    process.exit(1);
  }
  
  // Verify index.html exists
  const indexPath = path.join(rootDistPath, 'index.html');
  if (!fs.existsSync(indexPath)) {
    console.error('❌ ERROR: index.html not found in dist');
    process.exit(1);
  }
  console.log('✓ index.html found in dist');
  
  console.log('\n✅ Build completed successfully!\n');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}
