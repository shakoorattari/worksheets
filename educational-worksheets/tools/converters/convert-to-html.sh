#!/bin/bash

# Convert worksheets to HTML for easy printing
# This is a backup method if the VS Code extension doesn't work

echo "🔄 Converting worksheets to HTML for printing..."

# Create HTML directory
mkdir -p HTML

# Convert each worksheet to HTML
echo "📄 Converting decimals worksheet..."
pandoc worksheets/decimals-worksheet.md -o HTML/decimals-worksheet.html --standalone --css=style.css

echo "📄 Converting map scale worksheet..."
pandoc worksheets/map-scale-worksheet.md -o HTML/map-scale-worksheet.html --standalone --css=style.css

echo "📄 Converting ratio proportion worksheet..."
pandoc worksheets/ratio-proportion-worksheet.md -o HTML/ratio-proportion-worksheet.html --standalone --css=style.css

echo "📄 Converting answer keys..."
pandoc worksheets/answer-keys.md -o HTML/answer-keys.html --standalone --css=style.css

# Create a simple CSS file for better printing
cat > HTML/style.css << 'EOF'
@media print {
    body { 
        font-family: Arial, sans-serif; 
        font-size: 12pt; 
        line-height: 1.4;
        margin: 1cm;
    }
    h1, h2 { 
        color: black; 
        page-break-after: avoid;
    }
    .page-break { 
        page-break-before: always; 
    }
}

body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    line-height: 1.6;
}

h1 { color: #2c3e50; border-bottom: 3px solid #3498db; }
h2 { color: #34495e; border-bottom: 1px solid #bdc3c7; }
h3 { color: #7f8c8d; }

table { border-collapse: collapse; width: 100%; }
th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
th { background-color: #f2f2f2; }

code { background-color: #f8f9fa; padding: 2px 4px; border-radius: 3px; }
EOF

echo "✅ All worksheets converted to HTML!"
echo "📁 Check the HTML folder for your files"
echo ""
echo "🖨️  To print:"
echo "   1. Open HTML files in your web browser"
echo "   2. Use Cmd+P to print"
echo "   3. The files are styled for optimal printing"
echo ""
echo "🌐 You can also double-click any HTML file to open it"
