# 📋 Code Review Instructions - Educational Worksheets Project

## 🎯 Project Overview
This is a comprehensive educational worksheets repository designed for grades 1-12, currently focused on Grade 7 Mathematics. The project emphasizes scalability, professional presentation, and accessibility for non-technical users.

## 🏗️ Architecture & Structure

### **Directory Structure Standards**
```
educational-worksheets/
├── worksheets/[subject]/grade-[XX]/[topic]/[difficulty]/
├── output/PDFs/        # Generated PDF files (committed for direct access)
├── output/HTML/        # Generated HTML files (committed for direct access)
├── tools/converters/   # PDF/HTML generation scripts
├── docs/              # Documentation and curriculum alignment
└── templates/         # Content creation templates
```

### **Key Design Principles**
- **Scalability**: Structure supports all grades (1-12) and subjects
- **Co-location**: Answer keys are placed alongside their corresponding worksheets
- **Direct Access**: Generated files are committed to GitHub for non-technical users
- **Professional Output**: PDFs include proper copyright footers, no workspace paths

## 🔍 Code Review Checklist

### **📁 File Organization**
- [ ] Files follow the `[subject]/grade-[XX]/[topic]/[difficulty]/` pattern
- [ ] Answer keys are co-located: `worksheet.md` + `worksheet-answers.md`
- [ ] Templates use consistent naming conventions
- [ ] No legacy directories or duplicate files remain

### **📄 Worksheet Content Standards**
- [ ] **Markdown Structure**: Proper heading hierarchy (H1 → H2 → H3)
- [ ] **Educational Quality**: Clear learning objectives, varied difficulty levels
- [ ] **Formatting**: Consistent student info section, answer blanks, self-assessment
- [ ] **Curriculum Alignment**: Matches stated grade level and standards
- [ ] **Answer Keys**: Complete solutions with step-by-step explanations

### **🛠️ Generation Scripts**
- [ ] **PDF Generation**: Uses Chrome headless with proper flags
- [ ] **Copyright Footer**: Shows "© 2024-2025 Shakoor Hussain Attari | Educational Materials"
- [ ] **Path Independence**: No hardcoded absolute paths in scripts
- [ ] **Error Handling**: Scripts handle missing files gracefully
- [ ] **Output Structure**: Maintains source directory structure in output/

### **🎨 Styling & Presentation**
- [ ] **Print CSS**: Optimized for A4 paper, proper margins, print-friendly fonts
- [ ] **Footer Implementation**: Consistent across PDF and HTML outputs
- [ ] **Responsive Design**: HTML files work on mobile, tablet, desktop
- [ ] **Professional Appearance**: Clean layout, proper typography, aligned elements

### **📚 Documentation**
- [ ] **README Updates**: Reflects current structure and usage
- [ ] **Direct Access Files**: Links are valid and point to correct locations
- [ ] **Curriculum Alignment**: Documentation matches actual content
- [ ] **Code Comments**: Scripts are well-documented with clear explanations

## 🚨 Common Issues to Watch For

### **❌ Avoid These Mistakes**
- **File Path Issues**: Hardcoded paths that break on different systems
- **Missing Outputs**: Generated files not committed (breaks direct access)
- **Inconsistent Naming**: Mixing underscore/hyphen conventions
- **Legacy References**: Old directory names in scripts or documentation
- **Missing Dependencies**: Scripts that assume specific software installations

### **✅ Best Practices**
- **Relative Paths**: Use relative paths in all scripts and references
- **Consistent Structure**: Follow established directory patterns exactly
- **Complete Generations**: Always regenerate both PDF and HTML when content changes
- **Test All Outputs**: Verify PDFs print correctly and HTML displays properly
- **Update Documentation**: Keep DIRECT-ACCESS-FILES.md current with any changes

## 🔧 Development Workflow

### **Adding New Content**
1. **Create Markdown**: Follow template structure exactly
2. **Place Correctly**: Use proper directory hierarchy
3. **Generate Outputs**: Run `./generate-all-outputs.sh`
4. **Update Links**: Modify DIRECT-ACCESS-FILES.md if needed
5. **Test Thoroughly**: Check PDF printing and HTML display

### **Modifying Existing Content**
1. **Edit Source**: Modify .md files, never generated outputs directly
2. **Regenerate All**: Run generation scripts after any content changes
3. **Verify Footer**: Ensure copyright notice appears correctly
4. **Check Links**: Confirm all references still work

### **Script Modifications**
1. **Test Locally**: Verify scripts work on different systems
2. **Maintain Structure**: Don't break existing output organization
3. **Update Both**: Modify both main and converter scripts if needed
4. **Document Changes**: Update comments and README if behavior changes

## 📋 Review Questions

### **For New Worksheets**
- Does the content match the stated grade level and difficulty?
- Are learning objectives clear and achievable?
- Is the answer key complete with explanations?
- Does the self-assessment section encourage reflection?

### **For Technical Changes**
- Do the scripts work without hardcoded paths?
- Are generated files properly organized?
- Does the copyright footer appear correctly?
- Are both PDF and HTML outputs functional?

### **For Documentation**
- Are the instructions clear for non-technical users?
- Do all links in DIRECT-ACCESS-FILES.md work?
- Is the curriculum alignment accurate?
- Are code comments helpful and current?

## 🎯 Success Criteria

A successful code review ensures:
- ✅ **Educational Quality**: Content is pedagogically sound and grade-appropriate
- ✅ **Technical Excellence**: Scripts are robust and maintainable
- ✅ **User Experience**: Non-technical users can access materials easily
- ✅ **Professional Presentation**: Outputs look polished and print correctly
- ✅ **Scalability**: Changes don't break the expandable structure

## 🔗 Related Documentation
- [Copilot Instructions](copilot-instructions.md)
- [Code Generation Instructions](../.copilot-codeGeneration-instructions.md)
- [Main README](../README.md)
- [Direct Access Files](../DIRECT-ACCESS-FILES.md)

---
*This project prioritizes educational impact and user accessibility. Review with both technical excellence and pedagogical value in mind.*
