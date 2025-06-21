#!/bin/bash

# Convert all markdown worksheets to PDF for printing
# Run this script after installing pandoc: brew install pandoc

echo "🔄 Converting worksheets to PDF..."

# Create a PDFs directory
mkdir -p PDFs

# Convert each worksheet
echo "📄 Converting decimals worksheet..."
pandoc decimals-worksheet.md -o PDFs/decimals-worksheet.pdf --pdf-engine=wkhtmltopdf

echo "📄 Converting map scale worksheet..."
pandoc map-scale-worksheet.md -o PDFs/map-scale-worksheet.pdf --pdf-engine=wkhtmltopdf

echo "📄 Converting ratio proportion worksheet..."
pandoc ratio-proportion-worksheet.md -o PDFs/ratio-proportion-worksheet.pdf --pdf-engine=wkhtmltopdf

echo "📄 Converting answer keys..."
pandoc answer-keys.md -o PDFs/answer-keys.pdf --pdf-engine=wkhtmltopdf

echo "✅ All worksheets converted to PDF!"
echo "📁 Check the PDFs folder for your printable files"
echo ""
echo "🖨️  To print:"
echo "   - Open the PDF files in Preview or Adobe Reader"
echo "   - Use Cmd+P to print"
echo "   - Select appropriate paper size (A4 recommended)"
