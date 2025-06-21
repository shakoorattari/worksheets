#!/bin/bash

# Create HTML files for all markdown worksheets in the correct structure
cd /Users/shakoorhussain/git/worksheets/educational-worksheets

# Create output directories
mkdir -p output/HTML/worksheets/mathematics/grade-07/decimals/medium
mkdir -p output/HTML/worksheets/mathematics/grade-07/ratios-proportions/medium  
mkdir -p output/HTML/worksheets/mathematics/grade-07/map-scale/medium
mkdir -p output/HTML/answer-keys/mathematics/grade-07
mkdir -p output/HTML/docs/curriculum-standards
mkdir -p output/HTML/templates

# Convert worksheets
echo "Generating HTML files..."

# Decimals worksheet
pandoc worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals.md \
    -t html5 -o output/HTML/worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals.html \
    --standalone --css="../../../../../../../tools/converters/print-style.css" \
    --metadata title="Decimals Worksheet"

# Ratios & Proportions worksheet  
pandoc worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems.md \
    -t html5 -o output/HTML/worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems.html \
    --standalone --css="../../../../../../../tools/converters/print-style.css" \
    --metadata title="Ratios & Proportions Worksheet"

# Map Scale worksheet
pandoc worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems.md \
    -t html5 -o output/HTML/worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems.html \
    --standalone --css="../../../../../../../tools/converters/print-style.css" \
    --metadata title="Map Scale Worksheet"

# Answer keys
pandoc answer-keys/mathematics/grade-07/answer-keys.md \
    -t html5 -o output/HTML/answer-keys/mathematics/grade-07/answer-keys.html \
    --standalone --css="../../../../tools/converters/print-style.css" \
    --metadata title="Answer Keys"

# Documentation
pandoc docs/curriculum-standards/mathematics-alignment.md \
    -t html5 -o output/HTML/docs/curriculum-standards/mathematics-alignment.html \
    --standalone --css="../../../tools/converters/print-style.css" \
    --metadata title="Curriculum Alignment"

# Templates
pandoc templates/mathematics-worksheet-template.md \
    -t html5 -o output/HTML/templates/mathematics-worksheet-template.html \
    --standalone --css="../tools/converters/print-style.css" \
    --metadata title="Worksheet Template"

echo "✅ HTML files generated successfully!"
find output/HTML -name "*.html" | wc -l | xargs echo "HTML files created:"
