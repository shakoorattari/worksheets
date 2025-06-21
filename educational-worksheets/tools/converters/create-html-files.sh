#!/bin/bash

# Convert worksheets to HTML for web viewing and printing
# Updated for new educational-worksheets structure

echo "🔄 Converting worksheets to HTML for web viewing..."

# Set base directory
BASE_DIR="/Users/shakoorhussain/git/worksheets/educational-worksheets"
HTML_OUTPUT_DIR="$BASE_DIR/output/html"

# Create HTML output directory
mkdir -p "$HTML_OUTPUT_DIR"

# Function to convert a markdown file to HTML
convert_to_html() {
    local md_file="$1"
    local relative_path="${md_file#$BASE_DIR/}"
    local html_file="$HTML_OUTPUT_DIR/${relative_path%.md}.html"
    local html_dir=$(dirname "$html_file")
    
    # Create directory structure
    mkdir -p "$html_dir"
    
    echo "📄 Converting: $relative_path"
    
    # Convert to HTML with CSS styling
    pandoc "$md_file" -t html5 -o "$html_file" \
        --standalone \
        --css="../../../tools/converters/scripts/print-style.css" \
        --metadata title="Educational Worksheet"
    
    if [ -f "$html_file" ]; then
        echo "   ✅ Created $(basename "$html_file")"
    else
        echo "   ❌ Failed to create $(basename "$html_file")"
    fi
}

# Find and convert all markdown worksheets
echo "🔍 Scanning for worksheets..."
converted_count=0

while IFS= read -r -d '' worksheet; do
    if [[ "$worksheet" == *"/worksheets/"* ]] || [[ "$worksheet" == *"/answer-keys/"* ]]; then
        convert_to_html "$worksheet"
        ((converted_count++))
    fi
done < <(find "$BASE_DIR" -name "*.md" -type f -print0)

# Copy CSS file to HTML output directory for proper styling
mkdir -p "$HTML_OUTPUT_DIR/css"
cp "$BASE_DIR/tools/converters/scripts/print-style.css" "$HTML_OUTPUT_DIR/css/"

echo ""
echo "📊 HTML Conversion Summary"
echo "========================="
echo "   📚 Files converted: $converted_count"
echo "   📁 HTML directory: $HTML_OUTPUT_DIR"
echo ""

if [ $converted_count -gt 0 ]; then
    echo "✅ All worksheets converted to HTML!"
    echo ""
    echo "📋 Generated HTML Files:"
    find "$HTML_OUTPUT_DIR" -name "*.html" -exec basename {} \; | sort | sed 's/^/   🌐 /'
    echo ""
    echo "🌐 To view: Open any HTML file in your web browser"
    echo "🖨️  To print: Open HTML file and use Cmd+P (or Ctrl+P)"
else
    echo "⚠️  No worksheets found to convert"
fi