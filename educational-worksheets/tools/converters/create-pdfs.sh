#!/bin/bash

# Create PDFs from markdown worksheets using Chrome headless
# This script converts markdown to HTML then to PDF for optimal printing quality

echo "🔄 Creating PDFs from markdown worksheets..."

# Create PDFs directory if it doesn't exist
mkdir -p PDFs

# Function to convert markdown to PDF
convert_to_pdf() {
    local md_file="$1"
    local base_name=$(basename "$md_file" .md)
    local html_file="PDFs/${base_name}.html"
    local pdf_file="PDFs/${base_name}.pdf"
    
    echo "📄 Converting $md_file..."
    
    # Convert markdown to HTML with print styles
    pandoc "$md_file" -t html5 -o "$html_file" --standalone --css=print-style.css
    
    # Convert HTML to PDF using Chrome
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless \
        --disable-gpu \
        --print-to-pdf="$pdf_file" \
        --print-to-pdf-no-header \
        --print-to-pdf-no-footer \
        "$html_file"
    
    # Get file size for confirmation
    local size=$(stat -f%z "$pdf_file" 2>/dev/null || echo "0")
    echo "   ✅ Created $pdf_file (${size} bytes)"
}

# Convert all worksheets
convert_to_pdf "worksheets/decimals-worksheet.md"
convert_to_pdf "worksheets/map-scale-worksheet.md" 
convert_to_pdf "worksheets/ratio-proportion-worksheet.md"
convert_to_pdf "worksheets/answer-keys.md"

echo ""
echo "🎉 All PDFs created successfully!"
echo "📁 Check the PDFs/ folder for your printable worksheets"
echo ""
echo "📋 Files created:"
ls -la PDFs/*.pdf | awk '{print "   📄 " $9 " (" $5 " bytes)"}'
echo ""
echo "🖨️  Ready to print! Just open any PDF and use Cmd+P"
