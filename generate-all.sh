#!/bin/bash

# Master script to generate all educational materials
# This script ensures all PDFs and HTML files are generated in the correct location for GitHub Pages

echo "🎓 Educational Worksheets - Master Generation Script"
echo "=================================================="
echo ""

# Change to the educational-worksheets directory
cd educational-worksheets/tools/converters

echo "🔄 Starting generation process..."
echo ""

# Run the main generation script
./generate-all-outputs.sh

echo ""
echo "✅ Generation complete!"
echo ""
echo "📁 All files are now in /docs/output/ and ready for GitHub Pages deployment"
echo "🌐 Website files will be served correctly when deployed"
echo ""
echo "🚀 Next steps:"
echo "   1. Commit and push changes to GitHub"
echo "   2. Enable GitHub Pages in repository settings"
echo "   3. Your website will be live at: https://[username].github.io/worksheets"
echo ""
