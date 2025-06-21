#!/bin/bash

# Master script to generate PDFs from worksheets
# Run this from the project root directory

echo "🔄 Generating PDFs from worksheets..."
echo "📂 Project: Grade 7 Mathematics Worksheets"
echo ""

# Change to scripts directory and run PDF generation
cd scripts && ./create-pdfs.sh

echo ""
echo "✨ PDF generation complete!"
echo "📁 PDFs are ready in the PDFs/ directory"