// Educational Worksheets Website - Main JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Educational Worksheets Website loaded');
    
    // Initialize components
    initializeNavigation();
    initializeWorksheetGallery();
    initializeSearch();
    initializeExportButtons();
    initSmoothScrolling();
    initMobileMenu();
});

function initializeNavigation() {
    // Add active class to current page
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a, .nav-link');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        if (linkPage === currentPage) {
            link.classList.add('active');
        }
    });
    
    // Update active nav link on scroll for single-page sections
    const sections = document.querySelectorAll('section[id]');
    function updateActiveNavLink() {
        let currentSectionId = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 100) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            if (link.getAttribute('href').startsWith('#')) {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Throttled scroll event listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(updateActiveNavLink);
            ticking = true;
            setTimeout(() => { ticking = false; }, 100);
        }
    });
}

function initializeWorksheetGallery() {
    // Worksheet data - this will be moved to a JSON file in future versions
    const worksheets = [
        {
            title: "Adding and Subtracting Decimals",
            grade: "7",
            subject: "Mathematics",
            difficulty: "Medium",
            topic: "Decimals",
            description: "Master decimal arithmetic with step-by-step practice problems.",
            pdfUrl: "output/PDFs/worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals.pdf",
            htmlUrl: "output/HTML/worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals.html",
            answerPdfUrl: "output/PDFs/worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals-answers.pdf",
            answerHtmlUrl: "output/HTML/worksheets/mathematics/grade-07/decimals/medium/add-subtract-decimals-answers.html"
        },
        {
            title: "Map Scale Problems",
            grade: "7",
            subject: "Mathematics", 
            difficulty: "Medium",
            topic: "Map Scale",
            description: "Apply proportional reasoning to real-world map scale problems.",
            pdfUrl: "output/PDFs/worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems.pdf",
            htmlUrl: "output/HTML/worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems.html",
            answerPdfUrl: "output/PDFs/worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems-answers.pdf",
            answerHtmlUrl: "output/HTML/worksheets/mathematics/grade-07/map-scale/medium/map-scale-problems-answers.html"
        },
        {
            title: "Ratio and Proportion Problems",
            grade: "7",
            subject: "Mathematics",
            difficulty: "Medium", 
            topic: "Ratios & Proportions",
            description: "Explore ratios and proportions through practical applications.",
            pdfUrl: "output/PDFs/worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems.pdf",
            htmlUrl: "output/HTML/worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems.html",
            answerPdfUrl: "output/PDFs/worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems-answers.pdf",
            answerHtmlUrl: "output/HTML/worksheets/mathematics/grade-07/ratios-proportions/medium/ratio-proportion-problems-answers.html"
        },
        {
            title: "Organizing and Presenting Data",
            grade: "7",
            subject: "Mathematics",
            difficulty: "Hard",
            topic: "Data & Statistics",
            description: "Advanced data analysis and presentation techniques for exam preparation.",
            pdfUrl: "output/PDFs/worksheets/mathematics/grade-07/data-presentation/hard/organizing-presenting-data.pdf",
            htmlUrl: "output/HTML/worksheets/mathematics/grade-07/data-presentation/hard/organizing-presenting-data.html",
            answerPdfUrl: "output/PDFs/worksheets/mathematics/grade-07/data-presentation/hard/organizing-presenting-data-answers.pdf",
            answerHtmlUrl: "output/HTML/worksheets/mathematics/grade-07/data-presentation/hard/organizing-presenting-data-answers.html"
        }
    ];
    
    const gallery = document.getElementById('worksheetGallery');
    if (gallery) {
        displayWorksheets(worksheets);
    }
    
    // Store worksheets globally for filtering
    window.worksheetData = worksheets;
}

function displayWorksheets(worksheets) {
    const gallery = document.getElementById('worksheetGallery');
    if (!gallery) return;
    
    gallery.innerHTML = worksheets.map(worksheet => `
        <div class="worksheet-card" data-grade="${worksheet.grade}" data-subject="${worksheet.subject}" data-difficulty="${worksheet.difficulty}" data-topic="${worksheet.topic}">
            <div class="worksheet-header">
                <h3>${worksheet.title}</h3>
                <div class="worksheet-meta">
                    <span class="grade">Grade ${worksheet.grade}</span>
                    <span class="difficulty ${worksheet.difficulty.toLowerCase()}">${worksheet.difficulty}</span>
                </div>
            </div>
            <div class="worksheet-info">
                <p class="description">${worksheet.description}</p>
                <p><strong>Subject:</strong> ${worksheet.subject}</p>
                <p><strong>Topic:</strong> ${worksheet.topic}</p>
            </div>
            <div class="worksheet-actions">
                <div class="action-group">
                    <label>Worksheet:</label>
                    <a href="${worksheet.pdfUrl}" class="btn btn-primary" target="_blank">
                        📄 PDF
                    </a>
                    <a href="${worksheet.htmlUrl}" class="btn btn-secondary" target="_blank">
                        👀 Preview
                    </a>
                </div>
                <div class="action-group">
                    <label>Answer Key:</label>
                    <a href="${worksheet.answerPdfUrl}" class="btn btn-success" target="_blank">
                        ✅ PDF
                    </a>
                    <a href="${worksheet.answerHtmlUrl}" class="btn btn-outline" target="_blank">
                        👀 Preview
                    </a>
                </div>
            </div>
        </div>
    `).join('');
    
    // Update results count
    updateResultsCount(worksheets.length);
}

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            filterWorksheets();
        });
    }
    
    // Initialize filter dropdowns
    const gradeFilter = document.getElementById('gradeFilter');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const topicFilter = document.getElementById('topicFilter');
    
    if (gradeFilter) {
        gradeFilter.addEventListener('change', filterWorksheets);
    }
    if (difficultyFilter) {
        difficultyFilter.addEventListener('change', filterWorksheets);
    }
    if (topicFilter) {
        topicFilter.addEventListener('change', filterWorksheets);
    }
}

function filterWorksheets() {
    const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';
    const gradeFilter = document.getElementById('gradeFilter')?.value || '';
    const difficultyFilter = document.getElementById('difficultyFilter')?.value || '';
    const topicFilter = document.getElementById('topicFilter')?.value || '';
    
    const worksheetCards = document.querySelectorAll('.worksheet-card');
    let visibleCount = 0;
    
    worksheetCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('.description')?.textContent.toLowerCase() || '';
        const topic = card.dataset.topic.toLowerCase();
        const subject = card.dataset.subject.toLowerCase();
        const grade = card.dataset.grade;
        const difficulty = card.dataset.difficulty;
        
        const matchesSearch = !searchTerm || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) ||
            topic.includes(searchTerm) || 
            subject.includes(searchTerm);
            
        const matchesGrade = !gradeFilter || grade === gradeFilter;
        const matchesDifficulty = !difficultyFilter || difficulty.toLowerCase() === difficultyFilter.toLowerCase();
        const matchesTopic = !topicFilter || topic.includes(topicFilter.toLowerCase());
        
        if (matchesSearch && matchesGrade && matchesDifficulty && matchesTopic) {
            card.style.display = 'block';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });
    
    updateResultsCount(visibleCount);
}

function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `${count} worksheet${count !== 1 ? 's' : ''} found`;
    }
}

function initializeExportButtons() {
    // Add export all functionality
    const exportAllBtn = document.getElementById('exportAllBtn');
    if (exportAllBtn) {
        exportAllBtn.addEventListener('click', function() {
            if (window.worksheetData) {
                exportAllWorksheets();
            }
        });
    }
}

function exportAllWorksheets() {
    const worksheets = window.worksheetData || [];
    
    // Create a summary page with all download links
    let summaryContent = `
        <h1>All Educational Worksheets - Grade 7 Mathematics</h1>
        <p>Click the links below to download individual worksheets and answer keys:</p>
        <ul>
    `;
    
    worksheets.forEach(worksheet => {
        summaryContent += `
            <li>
                <h3>${worksheet.title}</h3>
                <p>Difficulty: ${worksheet.difficulty} | Topic: ${worksheet.topic}</p>
                <ul>
                    <li><a href="${worksheet.pdfUrl}" target="_blank">Worksheet PDF</a></li>
                    <li><a href="${worksheet.answerPdfUrl}" target="_blank">Answer Key PDF</a></li>
                </ul>
            </li>
        `;
    });
    
    summaryContent += '</ul>';
    
    // Open in new window
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
        <html>
            <head>
                <title>Educational Worksheets - All Downloads</title>
                <style>
                    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                    h1 { color: #2c3e50; }
                    h3 { color: #34495e; margin-top: 20px; }
                    ul { list-style-type: none; padding-left: 0; }
                    li { margin-bottom: 15px; padding: 10px; border-left: 3px solid #3498db; }
                    a { color: #3498db; text-decoration: none; }
                    a:hover { text-decoration: underline; }
                </style>
            </head>
            <body>
                ${summaryContent}
                <p><em>Generated by Educational Worksheets Platform</em></p>
            </body>
        </html>
    `);
}

/**
 * Smooth scrolling for anchor links
 */
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Skip if it's just a hash
            if (href === '#') {
                e.preventDefault();
                return;
            }
            
            const targetId = href.substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                e.preventDefault();
                
                // Close mobile menu if open
                closeMobileMenu();
                
                // Smooth scroll to target
                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 70;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, href);
            }
        });
    });
}

/**
 * Mobile menu functionality
 */
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Handle both nav toggle patterns
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // Close menu when clicking nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });
}

function closeMobileMenu() {
    const navMenu = document.querySelector('.nav-menu');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navMenu) navMenu.classList.remove('active');
    if (navToggle) navToggle.classList.remove('active');
    if (navLinks) navLinks.classList.remove('active');
}

// Add download tracking
document.addEventListener('click', function(e) {
    const link = e.target.closest('a');
    if (link && (link.href.includes('.pdf') || link.href.includes('.html'))) {
        const filename = link.href.split('/').pop();
        const type = link.href.includes('.pdf') ? 'PDF' : 'HTML';
        console.log(`Download tracked: ${filename} (${type})`);
    }
});

// Export functions for global use
window.EduWorksheets = {
    filterWorksheets,
    exportAllWorksheets,
    closeMobileMenu
};