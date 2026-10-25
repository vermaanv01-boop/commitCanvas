// CommitCanvas - GitHub REST API integration
// Fetches public profile, repositories, aggregates languages and stars.

document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('githubSearchForm');
    const usernameInput = document.getElementById('githubUsername');
    const statusRegion = document.getElementById('searchStatus');
    
    const profileSection = document.getElementById('profileSection');
    const analyticsSection = document.getElementById('analyticsSection');
    const languageSection = document.getElementById('languageSection');
    const leaderboardSection = document.getElementById('leaderboardSection');
    
    const profileAvatar = document.getElementById('profileAvatar');
    const profileName = document.getElementById('profileName');
    const profileLogin = document.getElementById('profileLogin');
    const profileBio = document.getElementById('profileBio');
    const profileLocation = document.getElementById('profileLocation');
    
    const statRepos = document.getElementById('stat-repos-title');
    const statStars = document.getElementById('stat-stars-title');
    const statFollowers = document.getElementById('stat-followers-title');
    const statFollowing = document.getElementById('stat-following-title');
    
    const languageList = document.getElementById('languageList');
    const leaderboardBody = document.getElementById('leaderboardBody');
    
    function clearStatus() {
        if (statusRegion) {
            statusRegion.innerHTML = '';
        }
    }
    
    function showStatus(message, type) {
        clearStatus();
        if (!statusRegion) return;
        const msg = document.createElement('div');
        msg.style.fontSize = '0.875rem';
        if (type === 'error') {
            msg.style.color = 'var(--accent)';
        } else if (type === 'loading') {
            msg.style.color = 'var(--accent-secondary)';
        } else {
            msg.style.color = 'var(--text)';
        }
        msg.textContent = message;
        statusRegion.appendChild(msg);
    }
    
    function hideAllSections() {
        if (profileSection) profileSection.style.display = 'none';
        if (analyticsSection) analyticsSection.style.display = 'none';
        if (languageSection) languageSection.style.display = 'none';
        if (leaderboardSection) leaderboardSection.style.display = 'none';
    }
    
    function resetDisplays() {
        if (profileAvatar) profileAvatar.src = '';
        if (profileAvatar) profileAvatar.alt = 'User avatar';
        if (profileName) profileName.textContent = '';
        if (profileLogin) profileLogin.textContent = '';
        if (profileBio) profileBio.textContent = '';
        if (profileLocation) profileLocation.textContent = '';
        
        if (statRepos) statRepos.textContent = '—';
        if (statStars) statStars.textContent = '—';
        if (statFollowers) statFollowers.textContent = '—';
        if (statFollowing) statFollowing.textContent = '—';
        
        if (languageList) languageList.innerHTML = '';
        if (leaderboardBody) leaderboardBody.innerHTML = '';
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = usernameInput.value.trim();
            clearStatus();
            hideAllSections();
            resetDisplays();
            
            // Validation
            if (!username) {
                showStatus('Please enter a GitHub username.', 'error');
                if (usernameInput) usernameInput.focus();
                return;
            }
            
            const usernameRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/;
            if (!usernameRegex.test(username)) {
                showStatus('Please enter a valid GitHub username.', 'error');
                if (usernameInput) usernameInput.focus();
                return;
            }
            
            showStatus(`Loading profile and repositories for ${username}…`, 'loading');
            
            try {
                // Fetch user profile
                const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (userResponse.status === 404) {
                    showStatus('User not found. Please check the username and try again.', 'error');
                    return;
                }
                
                if (userResponse.status === 403) {
                    // Check rate limit
                    const reset = userResponse.headers.get('X-RateLimit-Reset');
                    if (reset) {
                        const resetDate = new Date(parseInt(reset) * 1000);
                        showStatus(`API rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}.`, 'error');
                    } else {
                        showStatus('API rate limit exceeded. Please try again later.', 'error');
                    }
                    return;
                }
                
                if (!userResponse.ok) {
                    showStatus(`Error fetching profile: ${userResponse.status}.`, 'error');
                    return;
                }
                
                const userData = await userResponse.json();
                
                // Fetch repositories
                const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
                    headers: {
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (reposResponse.status === 403) {
                    const reset = reposResponse.headers.get('X-RateLimit-Reset');
                    if (reset) {
                        const resetDate = new Date(parseInt(reset) * 1000);
                        showStatus(`API rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}.`, 'error');
                    } else {
                        showStatus('API rate limit exceeded. Please try again later.', 'error');
                    }
                    return;
                }
                
                if (!reposResponse.ok) {
                    showStatus(`Error fetching repositories: ${reposResponse.status}.`, 'error');
                    return;
                }
                
                const repos = await reposResponse.json();
                
                // Calculate totals
                let totalStars = 0;
                let totalForks = 0;
                const languageCounts = {};
                
                for (let i = 0; i < repos.length; i++) {
                    const repo = repos[i];
                    totalStars += repo.stargazers_count || 0;
                    totalForks += repo.forks_count || 0;
                    if (repo.language) {
                        languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
                    }
                }
                
                // Populate profile
                if (profileSection) profileSection.style.display = 'block';
                if (profileAvatar) {
                    profileAvatar.src = userData.avatar_url || '';
                    profileAvatar.alt = `${userData.login} avatar`;
                }
                if (profileName) {
                    profileName.textContent = userData.name || userData.login || '';
                }
                if (profileLogin) {
                    profileLogin.textContent = userData.login ? `@${userData.login}` : '';
                }
                if (profileBio) {
                    if (userData.bio) {
                        profileBio.textContent = userData.bio;
                        profileBio.style.display = 'block';
                    } else {
                        profileBio.textContent = 'No bio available.';
                        profileBio.style.display = 'block';
                    }
                }
                if (profileLocation) {
                    if (userData.location) {
                        profileLocation.textContent = `📍 ${userData.location}`;
                        profileLocation.style.display = 'inline';
                    } else {
                        profileLocation.textContent = 'Location: not specified';
                        profileLocation.style.display = 'inline';
                    }
                }
                
                // Populate stats
                if (analyticsSection) analyticsSection.style.display = 'block';
                if (statRepos) statRepos.textContent = (userData.public_repos !== undefined && userData.public_repos !== null) ? userData.public_repos.toLocaleString() : '—';
                if (statStars) statStars.textContent = totalStars.toLocaleString();
                if (statFollowers) statFollowers.textContent = (userData.followers !== undefined && userData.followers !== null) ? userData.followers.toLocaleString() : '—';
                if (statFollowing) statFollowing.textContent = (userData.following !== undefined && userData.following !== null) ? userData.following.toLocaleString() : '—';
                
                // Populate languages
                if (languageSection) {
                    if (Object.keys(languageCounts).length > 0) {
                        languageSection.style.display = 'block';
                        if (languageList) {
                            languageList.innerHTML = '';
                            const sortedLangs = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
                            for (let i = 0; i < sortedLangs.length; i++) {
                                const [lang, count] = sortedLangs[i];
                                const item = document.createElement('div');
                                item.className = 'language-item';
                                const nameSpan = document.createElement('span');
                                nameSpan.className = 'language-name';
                                nameSpan.textContent = lang;
                                const countSpan = document.createElement('span');
                                countSpan.className = 'language-count';
                                countSpan.textContent = count + (count === 1 ? ' repo' : ' repos');
                                item.appendChild(nameSpan);
                                item.appendChild(countSpan);
                                languageList.appendChild(item);
                            }
                        }
                    } else {
                        languageSection.style.display = 'block';
                        if (languageList) {
                            languageList.innerHTML = '';
                            const msg = document.createElement('div');
                            msg.style.color = 'var(--accent-secondary)';
                            msg.style.fontSize = '0.875rem';
                            msg.textContent = 'No primary languages recorded across repositories.';
                            languageList.appendChild(msg);
                        }
                    }
                }
                
                // Populate leaderboard
                if (leaderboardSection) {
                    leaderboardSection.style.display = 'block';
                    if (leaderboardBody) {
                        leaderboardBody.innerHTML = '';
                        const sortedRepos = repos.slice().sort((a, b) => {
                            const starsDiff = (b.stargazers_count || 0) - (a.stargazers_count || 0);
                            if (starsDiff !== 0) return starsDiff;
                            return (b.forks_count || 0) - (a.forks_count || 0);
                        });
                        
                        if (sortedRepos.length === 0) {
                            const tr = document.createElement('tr');
                            const td = document.createElement('td');
                            td.colSpan = 5;
                            td.style.textAlign = 'center';
                            td.style.color = 'var(--accent-secondary)';
                            td.style.padding = '1.5rem';
                            td.textContent = 'No public repositories found.';
                            tr.appendChild(td);
                            leaderboardBody.appendChild(tr);
                        } else {
                            for (let i = 0; i < sortedRepos.length && i < 100; i++) {
                                const repo = sortedRepos[i];
                                const tr = document.createElement('tr');
                                
                                const tdName = document.createElement('td');
                                const nameDiv = document.createElement('div');
                                nameDiv.className = 'repo-name';
                                const link = document.createElement('a');
                                link.href = repo.html_url;
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                link.textContent = repo.name;
                                link.style.color = 'var(--text)';
                                link.style.textDecoration = 'none';
                                link.addEventListener('mouseenter', function() { this.style.textDecoration = 'underline'; });
                                link.addEventListener('mouseleave', function() { this.style.textDecoration = 'none'; });
                                nameDiv.appendChild(link);
                                tdName.appendChild(nameDiv);
                                
                                const tdDesc = document.createElement('td');
                                const descDiv = document.createElement('div');
                                descDiv.className = 'repo-desc';
                                descDiv.textContent = repo.description || '—';
                                tdDesc.appendChild(descDiv);
                                
                                const tdLang = document.createElement('td');
                                tdLang.textContent = repo.language || '—';
                                
                                const tdStars = document.createElement('td');
                                tdStars.className = 'numeric';
                                tdStars.textContent = (repo.stargazers_count || 0).toLocaleString();
                                
                                const tdForks = document.createElement('td');
                                tdForks.className = 'numeric';
                                tdForks.textContent = (repo.forks_count || 0).toLocaleString();
                                
                                tr.appendChild(tdName);
                                tr.appendChild(tdDesc);
                                tr.appendChild(tdLang);
                                tr.appendChild(tdStars);
                                tr.appendChild(tdForks);
                                leaderboardBody.appendChild(tr);
                            }
                        }
                    }
                }
                
                clearStatus();
                const successMsg = document.createElement('div');
                successMsg.style.color = 'var(--accent-secondary)';
                successMsg.style.fontSize = '0.875rem';
                successMsg.textContent = `Loaded data for ${userData.login}.`;
                if (statusRegion) {
                    statusRegion.appendChild(successMsg);
                }
                
            } catch (error) {
                showStatus('Network error. Please check your connection and try again.', 'error');
            }
        });
    }
    
    // Focus styles handled by CSS
});
