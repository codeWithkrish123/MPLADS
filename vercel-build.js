#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Starting Vercel build process...');

try {
  // Step 1: Run npm build in MPLADS-UI
  console.log('Step 1: Building with Vite...');
  execSync('npm run build', { stdio: 'inherit' });
  
  // Step 2: Check if dist exists
  const distPath = path.join(__dirname, 'dist');
  const rootDistPath = path.join(__dirname, '..', 'dist');
  
  if (!fs.existsSync(distPath)) {
    console.error('ERROR: dist folder not found at', distPath);
    process.exit(1);
  }
  
  console.log('Step 2: Copying dist to repository root...');
  
  // Remove existing dist at root if it exists
  if (fs.existsSync(rootDistPath)) {
    fs.rmSync(rootDistPath, { recursive: true, force: true });
  }
  
  // Copy dist folder to root
  fs.cpSync(distPath, rootDistPath, { recursive: true });
  console.log('✓ dist folder copied to root:', rootDistPath);
  
  console.log('✓ Build process completed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
