// CommitCanvas - Initial interface logic
// GitHub API integration not implemented yet. This file prepares
// the form and UI for future data loading with proper states.

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('githubSearchForm');
    const usernameInput = document.getElementById('githubUsername');
    const statusRegion = document.getElementById('searchStatus');
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            
            // Clear previous status
            statusRegion.innerHTML = '';
            
            // Basic validation
            if (!username) {
                const errorMsg = document.createElement('div');
                errorMsg.style.color = 'var(--accent)';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.textContent = 'Please enter a GitHub username.';
                statusRegion.appendChild(errorMsg);
                usernameInput.focus();
                return;
            }
            
            // Validate username format (GitHub username rules - simplified)
            const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
            if (!usernameRegex.test(username)) {
                const errorMsg = document.createElement('div');
                errorMsg.style.color = 'var(--accent)';
                errorMsg.style.fontSize = '0.875rem';
                errorMsg.textContent = 'Please enter a valid GitHub username.';
                statusRegion.appendChild(errorMsg);
                usernameInput.focus();
                return;
            }
            
            // Show loading state (placeholder for API integration)
            const loadingMsg = document.createElement('div');
            loadingMsg.style.color = 'var(--accent-secondary)';
            loadingMsg.style.fontSize = '0.875rem';
            loadingMsg.textContent = `Preparing analysis for ${username}… (API integration not implemented yet)`;
            statusRegion.appendChild(loadingMsg);
            
            // Note: No actual API call - this is just UI state preparation
            // Future implementation will fetch user data, repos, languages, contributions
        });
    }
    
    // Ensure all interactive elements have proper focus states
    const interactiveElements = document.querySelectorAll('button, input, [tabindex]:not([tabindex="-1"])');
    interactiveElements.forEach(el => {
        el.addEventListener('focus', function() {
            // Focus styles are handled via CSS :focus
        });
    });
});
