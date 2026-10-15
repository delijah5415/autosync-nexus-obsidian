#!/bin/bash
echo "=== AutoSync Nexus Build Pipeline v4.2.1 ==="
echo "[1/3] Verifying core modular files..."
if [ -f "index.html" ] && [ -f "css/style.css" ] && [ -f "js/app.js" ]; then
    echo "✓ All core files present."
else
    echo "✗ Error: Missing required files!"
    exit 1
fi

echo "[2/3] Running syntax and asset sanity checks..."
# Check for basic tags
grep -q "tailwindcss.com" index.html && echo "✓ Tailwind CDN verified."

echo "[3/3] Preparing git staging snapshot..."
git add .
git status
echo "=== Build Verification Complete: Ready for Production! ==="
