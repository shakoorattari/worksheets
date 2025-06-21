/**
 * Educational Worksheets - Filtering and Search
 * Handles worksheet filtering, search functionality, and dynamic content display
 */

document.addEventListener('DOMContentLoaded', function() {
    initFilters();
    initSearch();
    console.log('Filtering system initialized');
});

/**
 * Initialize worksheet filtering system
 */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const worksheetCards = document.querySelectorAll('.worksheet-card[data-category]');
    
    if (!filterButtons.length || !worksheetCards.length) {
        console.log('No filter elements found');
        return;
    }
    
    // Add click event listeners to filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter worksheets
            filterWorksheets(filter, worksheetCards);
            
            // Update results count
            updateResultsCount(filter, worksheetCards);
            
            // Track filter usage
            console.log(`Filter applied: ${filter}`);
        });
    });
    
    // Initialize with 'all' filter
    filterWorksheets('all', worksheetCards);
    updateResultsCount('all', worksheetCards);
}

/**
 * Filter worksheets based on selected criteria
 */
function filterWorksheets(filter, worksheetCards) {
    let visibleCount = 0;
    
    worksheetCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        const shouldShow = filter === 'all' || categories.includes(filter);
        
        if (shouldShow) {
            showCard(card);
            visibleCount++;
        } else {
            hideCard(card);
        }
    });
    
    // Show/hide no results message
    handleNoResults(visibleCount);
    
    return visibleCount;
}

/**
 * Show worksheet card with animation
 */
function showCard(card) {
    card.style.display = 'block';
    
    // Trigger reflow for animation
    card.offsetHeight;
    
    // Add animation class
    card.classList.add('animate-fade-in-up');
    card.style.opacity = '1';
    card.style.transform = 'translateY(0)';
    
    // Remove animation class after animation completes
    setTimeout(() => {
        card.classList.remove('animate-fade-in-up');
    }, 600);
}

/**
 * Hide worksheet card with animation
 */
function hideCard(card) {
    card.style.opacity = '0';
    card.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        card.style.display = 'none';
    }, 300);
}

/**
 * Update results count display
 */
function updateResultsCount(filter, worksheetCards) {
    let existingCounter = document.querySelector('.results-counter');
    
    // Remove existing counter
    if (existingCounter) {
        existingCounter.remove();
    }
    
    // Count visible worksheets
    const visibleCards = Array.from(worksheetCards).filter(card => {
        const categories = card.getAttribute('data-category').split(' ');
        return filter === 'all' || categories.includes(filter);
    });
    
    // Create and insert counter
    const counter = document.createElement('div');
    counter.className = 'results-counter';
    counter.innerHTML = `
        <p class="text-center" style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: var(--space-6);">
            ${visibleCards.length} worksheet${visibleCards.length !== 1 ? 's' : ''} found
            ${filter !== 'all' ? `for "${formatFilterName(filter)}"` : ''}
        </p>
    `;
    
    // Insert after filters
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        filtersContainer.insertAdjacentElement('afterend', counter);
    }
}

/**
 * Format filter name for display
 */
function formatFilterName(filter) {
    const filterNames = {
        'mathematics': 'Mathematics',
        'grade-07': 'Grade 7',
        'grade-08': 'Grade 8',
        'easy': 'Easy Level',
        'medium': 'Medium Level',
        'hard': 'Hard Level',
        'science': 'Science',
        'english': 'English'
    };
    
    return filterNames[filter] || filter;
}

/**
 * Handle no results state
 */
function handleNoResults(visibleCount) {
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCount === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <div style="text-align: center; padding: var(--space-12) var(--space-4); color: var(--gray-500);">
                    <i class="fas fa-search" style="font-size: 3rem; margin-bottom: var(--space-4); opacity: 0.5;"></i>
                    <h3 style="margin-bottom: var(--space-2); color: var(--gray-600);">No Worksheets Found</h3>
                    <p>Try selecting a different filter or check back soon for new content.</p>
                    <button class="btn btn-outline" onclick="resetFilters()" style="margin-top: var(--space-4);">
                        <i class="fas fa-undo"></i> Show All Worksheets
                    </button>
                </div>
            `;
            
            const worksheetsGrid = document.querySelector('.worksheets-grid');
            if (worksheetsGrid) {
                worksheetsGrid.insertAdjacentElement('afterend', noResultsMessage);
            }
        }
        noResultsMessage.style.display = 'block';
    } else {
        if (noResultsMessage) {
            noResultsMessage.style.display = 'none';
        }
    }
}

/**
 * Reset all filters to show all worksheets
 */
function resetFilters() {
    const allFilterButton = document.querySelector('.filter-btn[data-filter="all"]');
    if (allFilterButton) {
        allFilterButton.click();
    }
}

/**
 * Initialize search functionality
 */
function initSearch() {
    // Create search input if it doesn't exist
    let searchInput = document.querySelector('.search-input');
    
    if (!searchInput) {
        searchInput = createSearchInput();
    }
    
    if (searchInput) {
        setupSearchFunctionality(searchInput);
    }
}

/**
 * Create search input element
 */
function createSearchInput() {
    const filtersContainer = document.querySelector('.filters');
    if (!filtersContainer) return null;
    
    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <div style="position: relative; max-width: 400px; margin: 0 auto var(--space-6);">
            <input 
                type="text" 
                class="search-input" 
                placeholder="Search worksheets..." 
                style="
                    width: 100%;
                    padding: var(--space-3) var(--space-5) var(--space-3) var(--space-10);
                    border: 1px solid var(--gray-300);
                    border-radius: var(--radius-lg);
                    font-size: 0.875rem;
                    background-color: var(--white);
                    transition: all var(--transition-fast);
                "
            >
            <i class="fas fa-search" style="
                position: absolute;
                left: var(--space-3);
                top: 50%;
                transform: translateY(-50%);
                color: var(--gray-400);
                font-size: 0.875rem;
            "></i>
            <button 
                class="clear-search" 
                type="button"
                style="
                    position: absolute;
                    right: var(--space-3);
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    color: var(--gray-400);
                    cursor: pointer;
                    padding: var(--space-1);
                    display: none;
                "
            >
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    filtersContainer.insertAdjacentElement('beforebegin', searchContainer);
    return searchContainer.querySelector('.search-input');
}

/**
 * Setup search functionality
 */
function setupSearchFunctionality(searchInput) {
    const clearButton = document.querySelector('.clear-search');
    let searchTimeout;
    
    // Search input event listener
    searchInput.addEventListener('input', function() {
        const query = this.value.trim().toLowerCase();
        
        // Show/hide clear button
        if (clearButton) {
            clearButton.style.display = query ? 'block' : 'none';
        }
        
        // Debounce search
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    // Clear search functionality
    if (clearButton) {
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            this.style.display = 'none';
            performSearch('');
            searchInput.focus();
        });
    }
    
    // Search input focus styles
    searchInput.addEventListener('focus', function() {
        this.style.borderColor = 'var(--primary-color)';
        this.style.boxShadow = '0 0 0 3px rgba(37, 99, 235, 0.1)';
    });
    
    searchInput.addEventListener('blur', function() {
        this.style.borderColor = 'var(--gray-300)';
        this.style.boxShadow = 'none';
    });
    
    // Enter key support
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch(this.value.trim().toLowerCase());
        }
    });
}

/**
 * Perform search across worksheets
 */
function performSearch(query) {
    const worksheetCards = document.querySelectorAll('.worksheet-card[data-category]');
    let visibleCount = 0;
    
    if (!query) {
        // If no search query, show all cards that match current filter
        const activeFilter = document.querySelector('.filter-btn.active');
        const currentFilter = activeFilter ? activeFilter.getAttribute('data-filter') : 'all';
        visibleCount = filterWorksheets(currentFilter, worksheetCards);
        updateSearchResults('', visibleCount);
        return;
    }
    
    worksheetCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const description = card.querySelector('p').textContent.toLowerCase();
        const subject = card.querySelector('.subject').textContent.toLowerCase();
        const grade = card.querySelector('.grade').textContent.toLowerCase();
        const difficulty = card.querySelector('.difficulty').textContent.toLowerCase();
        
        const searchableContent = `${title} ${description} ${subject} ${grade} ${difficulty}`;
        const matches = searchableContent.includes(query);
        
        if (matches) {
            showCard(card);
            highlightSearchTerms(card, query);
            visibleCount++;
        } else {
            hideCard(card);
        }
    });
    
    updateSearchResults(query, visibleCount);
    handleNoResults(visibleCount);
}

/**
 * Highlight search terms in visible cards
 */
function highlightSearchTerms(card, query) {
    // Remove existing highlights
    const existingHighlights = card.querySelectorAll('.search-highlight');
    existingHighlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
    
    if (!query) return;
    
    // Add new highlights
    const elementsToHighlight = card.querySelectorAll('h3, p');
    elementsToHighlight.forEach(element => {
        highlightTextInElement(element, query);
    });
}

/**
 * Highlight text within an element
 */
function highlightTextInElement(element, query) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        const lowerText = text.toLowerCase();
        const lowerQuery = query.toLowerCase();
        
        if (lowerText.includes(lowerQuery)) {
            const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
            const highlightedHTML = text.replace(regex, '<span class="search-highlight" style="background-color: #fef3c7; padding: 1px 2px; border-radius: 2px; font-weight: 600;">$1</span>');
            
            const wrapper = document.createElement('div');
            wrapper.innerHTML = highlightedHTML;
            
            while (wrapper.firstChild) {
                textNode.parentNode.insertBefore(wrapper.firstChild, textNode);
            }
            textNode.parentNode.removeChild(textNode);
        }
    });
}

/**
 * Escape special regex characters
 */
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Update search results display
 */
function updateSearchResults(query, visibleCount) {
    let existingCounter = document.querySelector('.results-counter');
    
    if (existingCounter) {
        existingCounter.remove();
    }
    
    if (query) {
        const counter = document.createElement('div');
        counter.className = 'results-counter';
        counter.innerHTML = `
            <p class="text-center" style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: var(--space-6);">
                ${visibleCount} result${visibleCount !== 1 ? 's' : ''} found for 
                <strong>"${query}"</strong>
            </p>
        `;
        
        const searchContainer = document.querySelector('.search-container');
        if (searchContainer) {
            searchContainer.insertAdjacentElement('afterend', counter);
        }
    }
}

/**
 * Advanced filtering combinations
 */
function initAdvancedFilters() {
    // This could be expanded for multiple filter combinations
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Allow multiple filter selection with Ctrl/Cmd key
    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                
                // Toggle this filter
                this.classList.toggle('active');
                
                // Apply combined filters
                const activeFilters = Array.from(document.querySelectorAll('.filter-btn.active'))
                    .map(btn => btn.getAttribute('data-filter'))
                    .filter(filter => filter !== 'all');
                
                applyCombinedFilters(activeFilters);
            }
        });
    });
}

/**
 * Apply multiple filters simultaneously
 */
function applyCombinedFilters(filters) {
    const worksheetCards = document.querySelectorAll('.worksheet-card[data-category]');
    let visibleCount = 0;
    
    if (filters.length === 0) {
        // No filters selected, show all
        filterWorksheets('all', worksheetCards);
        return;
    }
    
    worksheetCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        const matchesAll = filters.every(filter => categories.includes(filter));
        
        if (matchesAll) {
            showCard(card);
            visibleCount++;
        } else {
            hideCard(card);
        }
    });
    
    handleNoResults(visibleCount);
    
    // Update counter for combined filters
    let existingCounter = document.querySelector('.results-counter');
    if (existingCounter) {
        existingCounter.remove();
    }
    
    const counter = document.createElement('div');
    counter.className = 'results-counter';
    counter.innerHTML = `
        <p class="text-center" style="color: var(--gray-600); font-size: 0.875rem; margin-bottom: var(--space-6);">
            ${visibleCount} worksheet${visibleCount !== 1 ? 's' : ''} found for 
            <strong>${filters.map(formatFilterName).join(' + ')}</strong>
        </p>
    `;
    
    const filtersContainer = document.querySelector('.filters');
    if (filtersContainer) {
        filtersContainer.insertAdjacentElement('afterend', counter);
    }
}

// Export functions for global use
window.EduWorksheets = window.EduWorksheets || {};
Object.assign(window.EduWorksheets, {
    resetFilters,
    performSearch,
    filterWorksheets,
    initAdvancedFilters
});
