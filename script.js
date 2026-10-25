// CommitCanvas - Animated background with grid, particles, geometric outlines

document.addEventListener('DOMContentLoaded', function() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
    }
    
    const searchForm = document.getElementById('githubSearchForm');
    const usernameInput = document.getElementById('githubUsername');
    const statusRegion = document.getElementById('searchStatus');
    const searchButton = document.querySelector('.search-button');
    
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
    
    // Animated background
    const bgCanvas = document.getElementById('bgCanvas');
    let ctx = null;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let particles = [];
    let outlines = [];
    let animationId = null;
    let pointer = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let isVisible = document.visibilityState === 'visible';
    
    function initBackground() {
        if (!bgCanvas) return;
        ctx = bgCanvas.getContext('2d');
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resizeBackground();
        createParticles();
        createOutlines();
        if (!prefersReducedMotion) {
            startAnimation();
        }
    }
    
    function resizeBackground() {
        if (!bgCanvas) return;
        bgCanvas.width = Math.floor(window.innerWidth * dpr);
        bgCanvas.height = Math.floor(window.innerHeight * dpr);
        bgCanvas.style.width = window.innerWidth + 'px';
        bgCanvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    
    function createParticles() {
        particles = [];
        const count = 35 + Math.floor(Math.random() * 21); // 35-55
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.25,
                vy: (Math.random() - 0.5) * 0.25,
                r: Math.random() * 1.4 + 0.6,
                accent: Math.random() < 0.18,
                phase: Math.random() * Math.PI * 2
            });
        }
    }
    
    function createOutlines() {
        outlines = [];
        for (let i = 0; i < 3; i++) {
            outlines.push({
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                vx: (Math.random() - 0.5) * 0.12,
                vy: (Math.random() - 0.5) * 0.12,
                rot: Math.random() * Math.PI,
                rotSpeed: (Math.random() - 0.5) * 0.0008,
                size: 80 + Math.random() * 60
            });
        }
    }
    
    function drawBackground() {
        if (!ctx || prefersReducedMotion || !isVisible) return;
        
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        
        // Grid
        ctx.save();
        ctx.strokeStyle = 'rgba(218, 215, 208, 0.4)';
        ctx.lineWidth = 0.5;
        const gridSize = 40;
        for (let x = 0; x < window.innerWidth; x += gridSize) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, window.innerHeight);
            ctx.stroke();
        }
        for (let y = 0; y < window.innerHeight; y += gridSize) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(window.innerWidth, y);
            ctx.stroke();
        }
        ctx.restore();
        
        // Outlines
        ctx.save();
        ctx.strokeStyle = 'rgba(133, 134, 91, 0.25)';
        ctx.lineWidth = 1;
        for (let i = 0; i < outlines.length; i++) {
            const o = outlines[i];
            o.x += o.vx;
            o.y += o.vy;
            o.rot += o.rotSpeed;
            if (o.x < -50) o.x = window.innerWidth + 50;
            if (o.x > window.innerWidth + 50) o.x = -50;
            if (o.y < -50) o.y = window.innerHeight + 50;
            if (o.y > window.innerHeight + 50) o.y = -50;
            ctx.save();
            ctx.translate(o.x, o.y);
            ctx.rotate(o.rot);
            ctx.strokeRect(-o.size / 2, -o.size / 2, o.size, o.size);
            ctx.restore();
        }
        ctx.restore();
        
        // Particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = window.innerWidth;
            if (p.x > window.innerWidth) p.x = 0;
            if (p.y < 0) p.y = window.innerHeight;
            if (p.y > window.innerHeight) p.y = 0;
            
            if (!isTouch) {
                const dx = p.x - pointer.x;
                const dy = p.y - pointer.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 140) {
                    p.vx += (dx / dist) * 0.008;
                    p.vy += (dy / dist) * 0.008;
                }
            }
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            if (p.accent) {
                ctx.fillStyle = 'rgba(198, 93, 59, 0.5)';
            } else {
                ctx.fillStyle = 'rgba(133, 134, 91, 0.45)';
            }
            ctx.fill();
        }
        
        // Connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 110) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(198, 93, 59, ${0.1 * (1 - dist / 110)})`;
                    ctx.lineWidth = 0.4;
                    ctx.stroke();
                }
            }
        }
        
        animationId = requestAnimationFrame(drawBackground);
    }
    
    function startAnimation() {
        if (animationId) cancelAnimationFrame(animationId);
        animationId = requestAnimationFrame(drawBackground);
    }
    
    function stopAnimation() {
        if (animationId) {
            cancelAnimationFrame(animationId);
            animationId = null;
        }
    }
    
    function triggerBackgroundRipple() {
        if (prefersReducedMotion) return;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const dx = p.x - pointer.x;
            const dy = p.y - pointer.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 220) {
                p.vx += (Math.random() - 0.5) * 0.6;
                p.vy += (Math.random() - 0.5) * 0.6;
            }
        }
    }
    
    if (!isTouch) {
        window.addEventListener('mousemove', function(e) {
            pointer.x = e.clientX;
            pointer.y = e.clientY;
        });
    }
    
    window.addEventListener('resize', function() {
        dpr = Math.min(window.devicePixelRatio || 1, 2);
        resizeBackground();
        createParticles();
        createOutlines();
    });
    
    document.addEventListener('visibilitychange', function() {
        isVisible = document.visibilityState === 'visible';
        if (isVisible && !prefersReducedMotion && !animationId) {
            startAnimation();
        } else if (!isVisible) {
            stopAnimation();
        }
    });
    
    initBackground();
    
    // Cinematic intro
    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
        const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
        tl.from('[data-anim="nav"]', { y: -20, opacity: 0, duration: 0.6 })
          .from('.kicker-text', { y: 20, opacity: 0, duration: 0.5 }, '-=0.3')
          .from('.headline-line', { y: '100%', opacity: 0, duration: 0.8, stagger: 0.15 }, '-=0.2')
          .from('[data-anim="subtitle"]', { y: 30, opacity: 0, duration: 0.7 }, '-=0.3')
          .from('[data-anim="search"]', { y: 40, opacity: 0, duration: 0.7 }, '-=0.3')
          .from('.hero-geo', { scale: 0.8, opacity: 0, duration: 0.8 }, '-=0.5');
    }
    
    if (searchButton && !isTouch && !prefersReducedMotion) {
        searchButton.addEventListener('mousemove', function(e) {
            const rect = searchButton.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            gsap.to(searchButton, { x: x * 0.3, y: y * 0.3, duration: 0.3, ease: 'power2.out' });
        });
        searchButton.addEventListener('mouseleave', function() {
            gsap.to(searchButton, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
        });
    }
    
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
        gsap.utils.toArray('[data-anim="stats"], [data-anim="langs"], [data-anim="repos"], [data-anim="story"]').forEach(section => {
            gsap.from(section, {
                y: 60,
                opacity: 0,
                duration: 0.8,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: section,
                    start: 'top 80%'
                }
            });
        });
    }
    
    function clearStatus() {
        if (statusRegion) statusRegion.innerHTML = '';
    }
    
    function showStatus(message, type) {
        clearStatus();
        if (!statusRegion) return;
        const msg = document.createElement('div');
        msg.style.fontSize = '0.875rem';
        if (type === 'error') msg.style.color = 'var(--accent)';
        else if (type === 'loading') msg.style.color = 'var(--accent-secondary)';
        else msg.style.color = 'var(--text)';
        msg.textContent = message;
        statusRegion.appendChild(msg);
        if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
            gsap.from(msg, { y: 10, opacity: 0, duration: 0.4 });
        }
    }
    
    function hideAllSections() {
        if (profileSection) profileSection.style.display = 'none';
        if (analyticsSection) analyticsSection.style.display = 'none';
        if (languageSection) languageSection.style.display = 'none';
        if (leaderboardSection) leaderboardSection.style.display = 'none';
    }
    
    function resetDisplays() {
        if (profileAvatar) { profileAvatar.src = ''; profileAvatar.alt = 'User avatar'; }
        if (profileName) profileName.textContent = '';
        if (profileLogin) profileLogin.textContent = '';
        if (profileBio) profileBio.textContent = '';
        if (profileLocation) profileLocation.textContent = '';
        if (statRepos) { statRepos.textContent = '—'; statRepos.dataset.counter = '0'; }
        if (statStars) { statStars.textContent = '—'; statStars.dataset.counter = '0'; }
        if (statFollowers) { statFollowers.textContent = '—'; statFollowers.dataset.counter = '0'; }
        if (statFollowing) { statFollowing.textContent = '—'; statFollowing.dataset.counter = '0'; }
        if (languageList) languageList.innerHTML = '';
        if (leaderboardBody) leaderboardBody.innerHTML = '';
    }
    
    function animateCounter(element, target) {
        if (!element || prefersReducedMotion) {
            if (element) element.textContent = target.toLocaleString();
            return;
        }
        if (typeof gsap === 'undefined') {
            element.textContent = target.toLocaleString();
            return;
        }
        const obj = { val: 0 };
        gsap.to(obj, {
            val: target,
            duration: 1.2,
            ease: 'power2.out',
            onUpdate: function() { element.textContent = Math.floor(obj.val).toLocaleString(); },
            onComplete: function() { element.textContent = target.toLocaleString(); }
        });
    }
    
    if (searchForm) {
        searchForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = usernameInput.value.trim();
            clearStatus();
            hideAllSections();
            resetDisplays();
            
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
            triggerBackgroundRipple();
            if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                gsap.fromTo(statusRegion, { scale: 0.98 }, { scale: 1, duration: 0.3 });
            }
            
            try {
                const userResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
                    headers: { 'Accept': 'application/vnd.github.v3+json' }
                });
                if (userResponse.status === 404) {
                    showStatus('User not found. Please check the username and try again.', 'error');
                    return;
                }
                if (userResponse.status === 403) {
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
                
                const reposResponse = await fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
                    headers: { 'Accept': 'application/vnd.github.v3+json' }
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
                
                if (profileSection) {
                    profileSection.style.display = 'block';
                    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                        gsap.fromTo(profileSection, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out' });
                        if (profileAvatar) gsap.from(profileAvatar, { scale: 0.8, opacity: 0, duration: 0.6, delay: 0.1 });
                        if (profileName) gsap.from(profileName, { y: 20, opacity: 0, duration: 0.5, delay: 0.15 });
                        if (profileLogin) gsap.from(profileLogin, { y: 20, opacity: 0, duration: 0.5, delay: 0.2 });
                        if (profileBio) gsap.from(profileBio, { y: 20, opacity: 0, duration: 0.5, delay: 0.25 });
                        if (profileLocation) gsap.from(profileLocation, { y: 20, opacity: 0, duration: 0.5, delay: 0.3 });
                    }
                }
                
                if (profileAvatar) { profileAvatar.src = userData.avatar_url || ''; profileAvatar.alt = `${userData.login} avatar`; }
                if (profileName) profileName.textContent = userData.name || userData.login || '';
                if (profileLogin) profileLogin.textContent = userData.login ? `@${userData.login}` : '';
                if (profileBio) {
                    if (userData.bio) { profileBio.textContent = userData.bio; profileBio.style.display = 'block'; }
                    else { profileBio.textContent = 'No bio available.'; profileBio.style.display = 'block'; }
                }
                if (profileLocation) {
                    if (userData.location) { profileLocation.textContent = `📍 ${userData.location}`; profileLocation.style.display = 'inline'; }
                    else { profileLocation.textContent = 'Location: not specified'; profileLocation.style.display = 'inline'; }
                }
                
                if (analyticsSection) {
                    analyticsSection.style.display = 'block';
                    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                        gsap.from(analyticsSection, { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' });
                        gsap.from('.stat-card', { y: 30, opacity: 0, duration: 0.6, stagger: 0.1, delay: 0.1 });
                    }
                }
                
                const repoCount = (userData.public_repos !== undefined && userData.public_repos !== null) ? userData.public_repos : 0;
                const followersCount = (userData.followers !== undefined && userData.followers !== null) ? userData.followers : 0;
                const followingCount = (userData.following !== undefined && userData.following !== null) ? userData.following : 0;
                
                if (statRepos) { statRepos.dataset.counter = repoCount; animateCounter(statRepos, repoCount); }
                if (statStars) { statStars.dataset.counter = totalStars; animateCounter(statStars, totalStars); }
                if (statFollowers) { statFollowers.dataset.counter = followersCount; animateCounter(statFollowers, followersCount); }
                if (statFollowing) { statFollowing.dataset.counter = followingCount; animateCounter(statFollowing, followingCount); }
                
                if (languageSection) {
                    languageSection.style.display = 'block';
                    if (languageList) {
                        languageList.innerHTML = '';
                        if (Object.keys(languageCounts).length > 0) {
                            const sortedLangs = Object.entries(languageCounts).sort((a, b) => b[1] - a[1]);
                            for (let i = 0; i < sortedLangs.length; i++) {
                                const [lang, count] = sortedLangs[i];
                                const item = document.createElement('div');
                                item.className = 'language-item';
                                item.style.opacity = '0';
                                item.style.transform = 'translateX(-20px)';
                                const nameSpan = document.createElement('span');
                                nameSpan.className = 'language-name';
                                nameSpan.textContent = lang;
                                const countSpan = document.createElement('span');
                                countSpan.className = 'language-count';
                                countSpan.textContent = count + (count === 1 ? ' repo' : ' repos');
                                item.appendChild(nameSpan);
                                item.appendChild(countSpan);
                                languageList.appendChild(item);
                                if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                                    gsap.to(item, { x: 0, opacity: 1, duration: 0.5, delay: 0.1 + i * 0.05, ease: 'power2.out' });
                                } else {
                                    item.style.opacity = '1';
                                    item.style.transform = 'translateX(0)';
                                }
                            }
                        } else {
                            const msg = document.createElement('div');
                            msg.style.color = 'var(--accent-secondary)';
                            msg.style.fontSize = '0.875rem';
                            msg.textContent = 'No primary languages recorded across repositories.';
                            languageList.appendChild(msg);
                            if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                                gsap.from(msg, { y: 10, opacity: 0, duration: 0.4 });
                            }
                        }
                    }
                    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                        gsap.from(languageSection, { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' });
                    }
                }
                
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
                            if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                                gsap.from(tr, { y: 10, opacity: 0, duration: 0.4 });
                            }
                        } else {
                            for (let i = 0; i < sortedRepos.length && i < 100; i++) {
                                const repo = sortedRepos[i];
                                const tr = document.createElement('tr');
                                tr.style.opacity = '0';
                                tr.style.transform = 'translateY(20px)';
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
                                if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                                    gsap.to(tr, { y: 0, opacity: 1, duration: 0.5, delay: 0.05 + i * 0.03, ease: 'power2.out' });
                                } else {
                                    tr.style.opacity = '1';
                                    tr.style.transform = 'translateY(0)';
                                }
                            }
                        }
                    }
                    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                        gsap.from(leaderboardSection, { y: 40, opacity: 0, duration: 0.7, ease: 'power2.out' });
                    }
                }
                
                clearStatus();
                const successMsg = document.createElement('div');
                successMsg.style.color = 'var(--accent-secondary)';
                successMsg.style.fontSize = '0.875rem';
                successMsg.textContent = `Loaded data for ${userData.login}.`;
                if (statusRegion) {
                    statusRegion.appendChild(successMsg);
                    if (typeof gsap !== 'undefined' && !prefersReducedMotion) {
                        gsap.from(successMsg, { y: 10, opacity: 0, duration: 0.4 });
                    }
                }
            } catch (error) {
                showStatus('Network error. Please check your connection and try again.', 'error');
            }
        });
    }
    
    window.addEventListener('beforeunload', function() {
        stopAnimation();
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.getAll().forEach(st => st.kill());
        }
    });
});
