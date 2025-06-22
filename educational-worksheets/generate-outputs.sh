#!/bin/bash

# Generate PDFs and HTML for all markdown files
# Run this from educational-worksheets directory
# Outputs directly to /docs/output/ for GitHub Pages deployment

echo "🔄 Generating all outputs..."

# Create output directories in the correct location for GitHub Pages
mkdir -p ../docs/output/PDFs ../docs/output/HTML

# Function to convert a markdown file
convert_file() {
    local md_file="$1"
    local rel_path="${md_file#./}"  # Remove leading ./
    local dir_path=$(dirname "$rel_path")
    local base_name=$(basename "$md_file" .md)
    
    # Create output subdirectories in the correct location
    mkdir -p "../docs/output/PDFs/$dir_path"
    mkdir -p "../docs/output/HTML/$dir_path"
    
    local pdf_file="../docs/output/PDFs/${rel_path%.md}.pdf"
    local html_file="../docs/output/HTML/${rel_path%.md}.html"
    
    echo "📄 Converting $md_file..."
    
    # Convert to HTML with custom footer
    pandoc "$md_file" -t html5 -o "$html_file" --standalone \
        --css="tools/converters/print-style.css" \
        --metadata title="Educational Material" \
        --include-after-body="tools/converters/footer.html"
    
    # Convert to PDF via Chrome with enhanced footer suppression
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless --disable-gpu \
        --print-to-pdf="$pdf_file" \
        --print-to-pdf-no-header \
        --no-pdf-header-footer \
        --disable-features=VizDisplayCompositor \
        --run-all-compositor-stages-before-draw \
        --virtual-time-budget=5000 \
        "$html_file" 2>/dev/null
    
    if [[ -f "$pdf_file" ]]; then
        local size=$(stat -f%z "$pdf_file" 2>/dev/null || echo "0")
        echo "   ✅ PDF: $pdf_file (${size} bytes)"
    fi
}

# Convert all markdown files
find . -name "*.md" -type f | while read -r file; do
    convert_file "$file"
done

echo ""
echo "🎉 Generation complete!"
echo "📊 Summary:"
find output -name "*.pdf" | wc -l | xargs echo "   PDFs created:"
find output -name "*.html" | wc -l | xargs echo "   HTML files created:"
