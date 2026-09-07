#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Get the current working directory (where Vercel runs the build)
const cwd = process.cwd();
console.log('Current working directory:', cwd);

// List what's in the current directory
const files = fs.readdirSync(cwd);
console.log('Files in current directory:', files);

// Check if dist exists
const distPath = path.join(cwd, 'dist');
console.log('Checking for dist at:', distPath);
console.log('Dist exists:', fs.existsSync(distPath));

if (fs.existsSync(distPath)) {
  console.log('✅ dist folder found!');
  const distFiles = fs.readdirSync(distPath);
  console.log('Contents of dist:', distFiles);
} else {
  console.log('❌ dist folder NOT found - this is the problem!');
  process.exit(1);
}

