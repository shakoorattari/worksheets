# 🤖 GitHub Copilot Instructions - Educational Worksheets Project

## 🎯 Project Context
You are working on an **Educational Worksheets Repository** that creates high-quality, curriculum-aligned learning materials for grades 1-12. The current focus is Grade 7 Mathematics, with a scalable structure for expansion.

## 🏗️ Codebase Understanding

### **Project Structure**
```
educational-worksheets/                    # Main working directory
├── worksheets/[subject]/grade-[XX]/[topic]/[difficulty]/
│   ├── worksheet-name.md                  # Main worksheet
│   └── worksheet-name-answers.md          # Co-located answer key
├── output/PDFs/[maintains source structure]/    # Generated PDFs
├── output/HTML/[maintains source structure]/    # Generated HTML
├── tools/converters/                      # Generation scripts
│   ├── generate-all-outputs.sh           # Master generation script
│   ├── footer.html                       # Copyright footer template
│   └── print-style.css                   # Print-optimized styling
├── docs/curriculum-standards/             # Educational alignment docs
├── templates/                             # Content creation templates
└── DIRECT-ACCESS-FILES.md               # Non-technical user guide
```

### **Key Technologies**
- **Markdown**: Content creation format
- **Pandoc**: Markdown to HTML/PDF conversion
- **Chrome Headless**: PDF generation engine
- **CSS**: Print optimization and styling
- **Bash Scripts**: Automation and workflow

## 📝 Content Creation Guidelines

### **Worksheet Structure (Always Follow This Template)**
```markdown
# Grade [X] Mathematics Worksheet
## [Topic Name]

**Name:** _________________ **Date:** _________________ **Class:** _________________

---

### Learning Objectives
By the end of this worksheet, you will be able to:
- [Specific, measurable objective 1]
- [Specific, measurable objective 2]
- [Specific, measurable objective 3]

### Instructions
- Show all your working clearly
- [Subject-specific instruction]
- [Assessment instruction]

---

## Section A: [Basic Skills] ([X] marks)
[Basic understanding questions]

## Section B: [Application] ([X] marks)
[Applied knowledge questions]

## Section C: Word Problems ([X] marks)
[Real-world applications]

## Section D: Problem Solving Challenges ([X] marks)
[Extension and critical thinking]

---

**Total: _____ / [Total] marks**

### Self-Assessment
- I can [skill]: ☐ Confident ☐ Mostly ☐ Need practice
[Repeat for each learning objective]
```

### **Answer Key Structure**
```markdown
# Answer Key: [Topic Name]

**Grade [X] Mathematics - [Difficulty] Difficulty**  
**Total Marks: [X]**

---

## Section A: [Section Name]
1. [Question] = **[Answer with working]**
[Continue systematically]

---

## Teaching Notes

### Common Mistakes to Watch For:
- [Specific misconception 1]
- [Specific misconception 2]

### Extension Activities:
- [Enrichment suggestion 1]
- [Enrichment suggestion 2]

### Assessment Criteria:
- **Excellent ([X]-[X] marks)**: [Description]
- **Good ([X]-[X] marks)**: [Description]
- **Satisfactory ([X]-[X] marks)**: [Description]
- **Needs Support (<[X] marks)**: [Description]
```

## 🛠️ Technical Patterns

### **File Naming Conventions**
- **Worksheets**: `topic-name.md` (use hyphens, lowercase)
- **Answer Keys**: `topic-name-answers.md` 
- **Directories**: `grade-07`, `medium`, `mathematics` (descriptive, lowercase)
- **Generated Files**: Maintain exact source structure in output/

### **Script Patterns**
```bash
# Always use relative paths
local md_file="$1"
local relative_path="${md_file#../../}"  # Remove base path
local output_file="../../output/PDFs/${relative_path%.md}.pdf"

# PDF generation with sheet name header and copyright footer
pandoc "$md_file" -t html5 -o "$html_file" --standalone \
    --css="print-style.css" \
    --metadata title="Educational Worksheet" \
    --include-after-body="footer.html"

# Chrome PDF generation with header/footer requirements
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
    --headless --disable-gpu \
    --print-to-pdf="$pdf_file" \
    --print-to-pdf-no-header \
    --no-pdf-header-footer \
    --disable-features=VizDisplayCompositor \
    --virtual-time-budget=5000 \
    "$html_file" 2>/dev/null
```

### **PDF Header and Footer Requirements**
```css
/* MANDATORY: Always include sheet name in header and copyright in footer */
@page {
    size: A4;
    margin: 2cm 1.5cm 3cm 1.5cm; /* Extra margin for header/footer */
    
    @top-center {
        content: "[Worksheet Name] - Grade [X] Mathematics";
        font-size: 10pt;
        font-family: 'Times New Roman', serif;
        color: #333;
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.2cm;
    }
    
    @bottom-center {
        content: "© 2024-2025 Shakoor Hussain Attari | Educational Materials";
        font-size: 10pt;
        font-family: 'Times New Roman', serif;
        color: #666;
        border-top: 1px solid #ddd;
        padding-top: 0.2cm;
    }
}
```

### **CSS Styling Principles**
```css
/* Always prioritize print formatting with header and footer */
@media print {
    /* A4 paper optimization with space for header/footer */
    @page {
        size: A4;
        margin: 3cm 1.5cm 3cm 1.5cm; /* Extra margins for header/footer */
        
        /* MANDATORY: Sheet name in header */
        @top-center {
            content: "[Worksheet Name] - Grade [X] Mathematics";
            font-size: 10pt;
            font-family: 'Times New Roman', serif;
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 0.2cm;
        }
        
        /* MANDATORY: Copyright in footer */
        @bottom-center {
            content: "© 2024-2025 Shakoor Hussain Attari | Educational Materials";
            font-size: 10pt;
            font-family: 'Times New Roman', serif;
            color: #666;
            border-top: 1px solid #ddd;
            padding-top: 0.2cm;
        }
    }
    
    /* Professional typography */
    body {
        font-family: 'Times New Roman', serif;
        font-size: 12pt;
        line-height: 1.5;
    }
    
    /* Header and footer spacing */
    .worksheet-header {
        margin-top: 1cm; /* Space for printed header */
    }
    
    .worksheet-footer {
        margin-bottom: 1cm; /* Space for printed footer */
    }
}
```

## 🎯 When Helping with This Project

### **Content Creation**
- **Grade-Appropriate**: Ensure mathematical complexity matches stated grade level
- **Curriculum-Aligned**: Reference mathematics standards (Common Core, Cambridge, etc.)
- **Progressive Difficulty**: Structure questions from basic to advanced
- **Real-World Context**: Include practical applications and word problems
- **Complete Solutions**: Provide step-by-step working in answer keys

### **Technical Implementation**
- **Maintain Structure**: Never break the established directory hierarchy
- **Generate Outputs**: Always regenerate PDF/HTML after content changes
- **Test Thoroughly**: Verify PDFs print correctly and HTML displays properly
- **Update Documentation**: Keep DIRECT-ACCESS-FILES.md current
- **Copyright Compliance**: Ensure "© 2024-2025 Shakoor Hussain Attari | Educational Materials" appears

### **Script Modifications**
- **Relative Paths Only**: Never use hardcoded absolute paths
- **Error Handling**: Scripts should handle missing files gracefully
- **Cross-Platform**: Consider different operating systems
- **Consistent Output**: Maintain directory structure in generated files
- **Documentation**: Comment complex logic clearly

## 🚨 Critical Requirements

### **Must Always Include**
- ✅ **Learning Objectives**: Clear, measurable goals
- ✅ **Student Info Section**: Name, Date, Class fields
- ✅ **Self-Assessment**: Confidence checkboxes for each skill
- ✅ **Sheet Name Header**: Worksheet title in PDF header
- ✅ **Copyright Footer**: "© 2024-2025 Shakoor Hussain Attari | Educational Materials" in PDF footer
- ✅ **Answer Keys**: Complete solutions with explanations
- ✅ **Curriculum References**: Grade level and difficulty clearly stated

### **Must Never Do**
- ❌ **Break Directory Structure**: Don't create new organizational patterns
- ❌ **Hardcode Paths**: Scripts must work on different systems
- ❌ **Skip Generation**: Content changes require output regeneration
- ❌ **Edit Generated Files**: Always modify source .md files
- ❌ **Remove Answer Keys**: Every worksheet needs complete solutions

## 🎓 Educational Context

### **Grade 7 Mathematics Topics (Current Focus)**
- **Number**: Decimals, fractions, percentages, negative numbers
- **Algebra**: Simple equations, expressions, patterns
- **Geometry**: Angles, shapes, area, perimeter, scale
- **Statistics**: Data collection, graphs, averages
- **Ratio & Proportion**: Scaling, unit rates, direct proportion

### **Difficulty Levels**
- **Easy**: Single-step problems, basic skill practice
- **Medium**: Multi-step problems, real-world applications
- **Hard**: Complex problem-solving, extension work

### **Assessment Philosophy**
- **Formative**: Self-assessment and reflection built into worksheets
- **Inclusive**: Multiple ways to demonstrate understanding
- **Standards-Based**: Aligned with major curriculum frameworks
- **Growth-Oriented**: Focus on learning progression, not just grades

## 🔗 Key Files to Reference

### **Templates and Examples**
- `templates/mathematics-worksheet-template.md` - Standard worksheet format
- `worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals.md` - Example worksheet
- `worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals-answers.md` - Example answer key

### **Generation and Styling**
- `tools/converters/generate-all-outputs.sh` - Master generation script
- `tools/converters/print-style.css` - Print optimization styles
- `tools/converters/footer.html` - Copyright footer template

### **Documentation**
- `README.md` - Project overview and quick start
- `DIRECT-ACCESS-FILES.md` - Non-technical user guide
- `docs/curriculum-standards/mathematics-alignment.md` - Educational standards

## 💡 Best Practices When Assisting

1. **Educational First**: Always prioritize learning objectives and pedagogical value
2. **Accessibility**: Keep non-technical users in mind (teachers, parents, students)
3. **Quality Standards**: Maintain professional presentation and accuracy
4. **Scalability**: Ensure changes support future expansion to other grades/subjects
5. **Testing**: Verify that generated outputs work correctly
6. **Documentation**: Update relevant documentation when making changes

## 🎯 Success Metrics
- **Educational Impact**: Content helps students learn effectively
- **User Experience**: Materials are easy to access and use
- **Technical Quality**: Scripts are reliable and maintainable
- **Professional Presentation**: Outputs look polished and print correctly
- **Curriculum Alignment**: Content matches educational standards

---
*Remember: This project serves educators and students. Every suggestion should enhance learning and accessibility.*
