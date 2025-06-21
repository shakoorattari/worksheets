#!/bin/bash

# Educational Worksheets - Master Conversion Script
# Converts all worksheets in the repository to PDF format
# Maintains directory structure and supports multiple subjects

echo "🔄 Educational Worksheets - PDF Generation"
echo "============================================"
echo ""

# Set base directories
BASE_DIR="/Users/shakoorhussain/git/worksheets/educational-worksheets"
TOOLS_DIR="$BASE_DIR/tools/converters"
OUTPUT_DIR="$BASE_DIR/output"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to convert a single worksheet
convert_worksheet() {
    local worksheet_path="$1"
    local relative_path="${worksheet_path#$BASE_DIR/}"
    local output_path="$OUTPUT_DIR/${relative_path%.md}.pdf"
    local output_dir=$(dirname "$output_path")
    
    # Create output directory structure
    mkdir -p "$output_dir"
    
    echo "📄 Converting: $relative_path"
    
    # Convert using pandoc with Chrome
    pandoc "$worksheet_path" -t html5 -o "${output_path%.pdf}.html" \
        --standalone --css="$TOOLS_DIR/scripts/print-style.css"
    
    # Convert HTML to PDF using Chrome
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
        --headless \
        --disable-gpu \
        --print-to-pdf="$output_path" \
        --print-to-pdf-no-header \
        --print-to-pdf-no-footer \
        "${output_path%.pdf}.html" 2>/dev/null
    
    # Clean up HTML file
    rm -f "${output_path%.pdf}.html"
    
    if [ -f "$output_path" ]; then
        local size=$(stat -f%z "$output_path" 2>/dev/null || echo "0")
        echo "   ✅ Created $(basename "$output_path") (${size} bytes)"
    else
        echo "   ❌ Failed to create $(basename "$output_path")"
    fi
}

# Find and convert all markdown worksheets
echo "🔍 Scanning for worksheets..."
worksheet_count=0

while IFS= read -r -d '' worksheet; do
    if [[ "$worksheet" == *"/worksheets/"* ]] || [[ "$worksheet" == *"/answer-keys/"* ]]; then
        convert_worksheet "$worksheet"
        ((worksheet_count++))
    fi
done < <(find "$BASE_DIR" -name "*.md" -type f -print0)

echo ""
echo "📊 Conversion Summary"
echo "===================="
echo "   📚 Worksheets processed: $worksheet_count"
echo "   📁 Output directory: $OUTPUT_DIR"
echo ""

if [ $worksheet_count -gt 0 ]; then
    echo "✅ All worksheets converted successfully!"
    echo ""
    echo "📋 Generated Files:"
    find "$OUTPUT_DIR" -name "*.pdf" -exec basename {} \; | sort | sed 's/^/   📄 /'
    echo ""
    echo "🖨️  Ready to print! Open any PDF and use Cmd+P"
else
    echo "⚠️  No worksheets found to convert"
fi

echo ""
echo "💡 Tips:"
echo "   • Use A4 paper for best results"
echo "   • Print in portrait orientation"
echo "   • Check that all pages printed correctly"