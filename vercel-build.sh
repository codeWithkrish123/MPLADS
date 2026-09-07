#!/bin/bash
# Build the project
npm run build

# Copy dist to parent directory so Vercel can find it
cp -r dist ../dist

echo "Build completed and dist copied to root!"
