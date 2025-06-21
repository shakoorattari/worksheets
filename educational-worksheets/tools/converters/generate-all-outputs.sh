#!/bin/bash

# Generate all PDF and HTML outputs from the new worksheet structure
# This script finds all markdown files and converts them to PDF and HTML

echo "🔄 Generating all PDF and HTML outputs from worksheets..."

# Create output directories
mkdir -p ../../output/PDFs
mkdir -p ../../output/HTML

# Copy CSS file to HTML output directory
cp "./print-style.css" "../../output/HTML/"

# Function to convert markdown to both PDF and HTML
convert_worksheet() {
    local md_file="$1"
    local relative_path="${md_file#../../}"  # Remove leading ../../
    local dir_path=$(dirname "$relative_path")
    local base_name=$(basename "$md_file" .md)
    
    # Create subdirectories in output to match source structure
    mkdir -p "../../output/PDFs/$dir_path"
    mkdir -p "../../output/HTML/$dir_path"
    
    local html_file="../../output/HTML/${relative_path%.md}.html"
    local pdf_file="../../output/PDFs/${relative_path%.md}.pdf"
    
    echo "📄 Converting $md_file..."
    
    # Convert markdown to HTML with custom footer and correct CSS path
    # Calculate relative path to CSS file from the HTML file location
    local depth=$(echo "$relative_path" | tr -cd '/' | wc -c)
    local css_path=""
    for ((i=0; i<depth; i++)); do
        css_path="../$css_path"
    done
    css_path="${css_path}print-style.css"
    
    pandoc "$md_file" -t html5 -o "$html_file" --standalone \
        --css="$css_path" \
        --metadata title="Educational Worksheet"
    
    # Convert HTML to PDF using Chrome with enhanced footer suppression
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless \
        --disable-gpu \
        --print-to-pdf="$pdf_file" \
        --print-to-pdf-no-header \
        --no-pdf-header-footer \
        --disable-features=VizDisplayCompositor \
        --run-all-compositor-stages-before-draw \
        --virtual-time-budget=5000 \
        "$html_file" 2>/dev/null
    
    # Get file sizes for confirmation
    if [[ -f "$pdf_file" ]]; then
        local pdf_size=$(stat -f%z "$pdf_file" 2>/dev/null || echo "0")
        echo "   ✅ PDF: ${pdf_file} (${pdf_size} bytes)"
    fi
    
    if [[ -f "$html_file" ]]; then
        local html_size=$(stat -f%z "$html_file" 2>/dev/null || echo "0")
        echo "   ✅ HTML: ${html_file} (${html_size} bytes)"
    fi
}

# Find and convert all markdown files in the educational-worksheets structure
echo "🔍 Finding markdown files..."

# Convert worksheets (from the correct path)
if [[ -d "../../worksheets" ]]; then
    find ../../worksheets -name "*.md" -type f | while read -r file; do
        convert_worksheet "$file"
    done
fi

# Convert documentation (from the correct path)
if [[ -d "../../docs" ]]; then
    find ../../docs -name "*.md" -type f | while read -r file; do
        convert_worksheet "$file"
    done
fi

# Convert templates (from the correct path)
if [[ -d "../../templates" ]]; then
    find ../../templates -name "*.md" -type f | while read -r file; do
        convert_worksheet "$file"
    done
fi

echo ""
echo "🎉 All outputs generated successfully!"
echo "📁 Check the output/ folder for:"
echo "   📄 PDF files (ready to print)"
echo "   🌐 HTML files (web-friendly)"
echo ""
echo "📊 Summary:"
find ../../output -name "*.pdf" | wc -l | xargs echo "   PDFs created:"
find ../../output -name "*.html" | wc -l | xargs echo "   HTML files created:"
echo ""
echo "🖨️  Ready to use! PDFs are print-ready, HTML files work in any browser"
