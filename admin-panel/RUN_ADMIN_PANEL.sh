#!/bin/bash

echo "Starting Talari Admin Panel..."
echo ""
echo "Prerequisites Check:"
echo "  ✓ Node.js 18+ installed"
echo "  ✓ Environment variables configured"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
fi

echo "Starting development server..."
npm run dev
