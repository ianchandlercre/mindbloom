#!/bin/bash
# MindBloom Deployment Script
# ===========================
# This script installs dependencies, builds, and starts the app.
# Run on any machine with Node.js 18+ installed.

set -e

echo "🌱 MindBloom - Setting up..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the app
echo "🔨 Building production version..."
npm run build

# Start the server
echo "🚀 Starting MindBloom on http://localhost:3000"
npm start
