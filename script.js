document.addEventListener('DOMContentLoaded', () => {
    
    // === 1. PRELOADER LOGIC ===
    const preloader = document.getElementById('preloader');
    const fill = document.querySelector('.loader-bar-fill');
    
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                preloader.style.opacity = '0';
                preloader.style.pointerEvents = 'none';
                // Trigger scroll reveals after preloader dies
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 300);
        }
        fill.style.width = `${progress}%`;
    }, 80);


    // === 2. CUSTOM CURSOR & HOVER FOLLOWER ===
    const cursor = document.getElementById('custom-cursor');
    const follower = document.getElementById('custom-cursor-follower');
    
    let mouseX = 0, mouseY = 0; // Mouse positions
    let followerX = 0, followerY = 0; // Follower positions
    
    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Immediate position for cursor dot
        cursor.style.left = `${mouseX}px`;
        cursor.style.top = `${mouseY}px`;
    });
    
    // Smooth lag animation using linear interpolation (LERP)
    function animateCursor() {
        // Calculate distance between mouse and follower, then move a fraction of it
        const ease = 0.15;
        followerX += (mouseX - followerX) * ease;
        followerY += (mouseY - followerY) * ease;
        
        follower.style.left = `${followerX}px`;
        follower.style.top = `${followerY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    animateCursor();
    
    // Hover scale effects on interactive elements
    const hoverTargets = 'a, button, input, textarea, select, .project-card, .sandbox-tab, .filter-btn, .term-prompt';
    
    function addCursorHoverListeners() {
        document.querySelectorAll(hoverTargets).forEach(el => {
            el.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            el.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }
    addCursorHoverListeners();
    
    // Re-bind hover listeners when dynamic elements are added (like terminal lines)
    const observer = new MutationObserver(addCursorHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });


    // === 3. AUTO-TYPEWRITER HERO EFFECT ===
    const typewriter = document.getElementById('typewriter');
    const strings = [
        "analyze complex datasets.",
        "build predictive ML models.",
        "design interactive KPI dashboards.",
        "code in Python, SQL, and R."
    ];
    
    let stringIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typeSpeed = 80;
    
    function typeLoop() {
        const currentString = strings[stringIdx];
        
        if (isDeleting) {
            typewriter.textContent = currentString.substring(0, charIdx - 1);
            charIdx--;
            typeSpeed = 40; // delete faster
        } else {
            typewriter.textContent = currentString.substring(0, charIdx + 1);
            charIdx++;
            typeSpeed = 80;
        }
        
        if (!isDeleting && charIdx === currentString.length) {
            isDeleting = true;
            typeSpeed = 2000; // pause at the end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            stringIdx = (stringIdx + 1) % strings.length;
            typeSpeed = 500; // pause before typing next word
        }
        
        setTimeout(typeLoop, typeSpeed);
    }
    
    setTimeout(typeLoop, 1000); // Start typing loop


    // === 4. NAVBAR SCROLL HIGHLIGHTS ===
    const nav = document.querySelector('nav');
    const scrollProgress = document.querySelector('.scroll-progress');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        
        // Scroll progress bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        if (totalHeight > 0) {
            const progressVal = (window.scrollY / totalHeight) * 100;
            scrollProgress.style.width = `${progressVal}%`;
        }
        
        highlightNavLink();
    });

    const navLinks = document.querySelectorAll('nav .nav-links a');
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNavLink() {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }


    // === 5. SCROLL REVEAL OBSERVER ===
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));


    // === 6. INTERACTIVE CANVAS NETWORKS ===
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });
    
    const particles = [];
    const maxParticles = width < 768 ? 35 : 85;
    const connectionDist = 110;
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.radius = Math.random() * 2 + 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 211, 255, 0.35)';
            ctx.fill();
        }
    }
    
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }
    
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    
    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
    
    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.1;
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDist + 20) {
                    const alpha = (1 - dist / (connectionDist + 20)) * 0.15;
                    ctx.strokeStyle = `rgba(0, 211, 255, ${alpha})`;
                    ctx.lineWidth = 1.1;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();


    // === 7. INTERACTIVE DATA SANDBOX ===
    const sandboxTabs = document.querySelectorAll('.sandbox-tab');
    const codeArea = document.getElementById('sandbox-code-display');
    const vizStats = document.getElementById('sandbox-viz-stats');
    const chartArea = document.getElementById('sandbox-chart-area');
    
    const datasets = {
        fitness: {
            code: `<span class="keyword">import</span> pandas <span class="keyword">as</span> pd
<span class="keyword">import</span> matplotlib.pyplot <span class="keyword">as</span> plt

<span class="comment"># Load fitness tracking dataset</span>
df = pd.read_csv(<span class="string">"fitness_data.csv"</span>)

<span class="comment"># Calculate summary statistics</span>
avg_steps = df[<span class="string">'steps'</span>].mean()
calories_corr = df[<span class="string">'steps'</span>].corr(df[<span class="string">'calories'</span>])
active_minutes = df[<span class="string">'active_mins'</span>].sum()

print(<span class="string">f"Average Steps: {avg_steps:.0f}"</span>)
print(<span class="string">f"Steps-Calories Corr: {calories_corr:.2f}"</span>)

<span class="comment"># Build activity trend visualization</span>
df.groupby(<span class="string">'day_of_week'</span>)[<span class="string">'steps'</span>].mean().plot(kind=<span class="string">'bar'</span>)
plt.show()`,
            stats: [
                { val: '8,432', label: 'Avg Daily Steps' },
                { val: '0.84', label: 'Steps-Calorie Corr' },
                { val: '320m', label: 'Avg Active Mins' }
            ],
            chart: [
                { label: 'Mon', val: '6,200', pct: 62 },
                { label: 'Tue', val: '7,800', pct: 78 },
                { label: 'Wed', val: '8,500', pct: 85 },
                { label: 'Thu', val: '9,100', pct: 91 },
                { label: 'Fri', val: '10,400', pct: 100 },
                { label: 'Sat', val: '9,500', pct: 95 },
                { label: 'Sun', val: '7,500', pct: 75 }
            ]
        },
        netflix: {
            code: `<span class="keyword">import</span> pandas <span class="keyword">as</span> pd

<span class="comment"># Load Netflix content catalog</span>
netflix_df = pd.read_csv(<span class="string">"netflix_titles.csv"</span>)

<span class="comment"># Analyze movie vs TV Show distribution</span>
content_types = netflix_df[<span class="string">'type'</span>].value_counts()
pct_movies = (content_types[<span class="string">'Movie'</span>] / len(netflix_df)) * 100

<span class="comment"># Extract top genres</span>
genres = netflix_df[<span class="string">'listed_in'</span>].str.split(<span class="string">', '</span>).explode()
top_genre = genres.value_counts().idxmax()

print(<span class="string">f"Total Content: {len(netflix_df)}"</span>)
print(<span class="string">f"Movie Share: {pct_movies:.1f}%"</span>)
print(<span class="string">f"Top Genre: {top_genre}"</span>)`,
            stats: [
                { val: '8,807', label: 'Total Show Count' },
                { val: '69.6%', label: 'Movies Percentage' },
                { val: 'Dramas', label: 'Top Genre' }
            ],
            chart: [
                { label: 'Dramas', val: '2,427', pct: 100 },
                { label: 'Comedies', val: '1,674', pct: 69 },
                { label: 'Action', val: '857', pct: 35 },
                { label: 'Docs', val: '831', pct: 34 },
                { label: 'Horror', val: '357', pct: 15 },
                { label: 'Sci-Fi', val: '272', pct: 11 },
                { label: 'Kids', val: '220', pct: 9 }
            ]
        }
    };
    
    function renderSandbox(key) {
        const data = datasets[key];
        codeArea.innerHTML = data.code;
        
        vizStats.innerHTML = '';
        data.stats.forEach(s => {
            vizStats.innerHTML += `
                <div class="viz-stat-box">
                    <div class="viz-stat-val">${s.val}</div>
                    <div class="viz-stat-lbl">${s.label}</div>
                </div>
            `;
        });
        
        chartArea.innerHTML = '';
        data.chart.forEach(c => {
            const barWrapper = document.createElement('div');
            barWrapper.className = 'chart-bar-wrapper';
            
            const tooltip = document.createElement('div');
            tooltip.className = 'chart-value-tooltip';
            tooltip.textContent = c.val;
            
            const bar = document.createElement('div');
            bar.className = 'chart-bar';
            
            const label = document.createElement('div');
            label.className = 'chart-label';
            label.textContent = c.label;
            
            barWrapper.appendChild(tooltip);
            barWrapper.appendChild(bar);
            barWrapper.appendChild(label);
            chartArea.appendChild(barWrapper);
            
            setTimeout(() => {
                bar.style.height = `${c.pct}%`;
            }, 60);
        });
    }
    
    sandboxTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            sandboxTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderSandbox(tab.dataset.target);
        });
    });
    
    renderSandbox('fitness');


    // === 8. PROJECTS FILTER & DETAIL MODALS ===
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    
    const projectDetails = {
        fitness: {
            title: "Fitness Tracker Data Analysis",
            desc: "A comprehensive project involving extracting and cleaning personal fitness tracker datasets (steps, sleep, calories, active heart rate) from CSV and SQL. The data was run through statistical summaries, discovering trends (e.g. correlation between sleep cycles and next-day steps), and built into an interactive multi-view Streamlit dashboard with custom charts.",
            tech: ["Python", "Pandas", "Streamlit", "Matplotlib", "Seaborn", "SQL"],
            keyPoints: [
                "Discovered a strong positive correlation (+0.84) between step counts and sleep efficiency.",
                "Engineered daily step velocity features to identify workout intervals automatically.",
                "Built automated ETL scripts in python to ingest daily CSV outputs and update DB tables."
            ]
        },
        dashboard: {
            title: "Data Analysis Dashboard",
            desc: "Designed and implemented business dashboards that aggregate multiple relational dataset sources. Wrote complex SQL queries, optimized indexing parameters to improve report query speeds by 35%, and deployed data dashboards with clear KPIs to help users track monthly growth and conversion rates.",
            tech: ["SQL", "Power BI", "Excel", "Data Modeling", "ETL"],
            keyPoints: [
                "Integrated multi-source datasets into a coherent star schema model.",
                "Wrote optimized DAX and SQL procedures to automate monthly metrics.",
                "Reduced layout clutter, resulting in an interface rated highly for user experience."
            ]
        },
        gemini: {
            title: "Gemini Agent Cloud Deployment",
            desc: "Designed and configured a customized conversational AI assistant within Google AI Studio using detailed system instructions and prompt engineering parameters. Deployed the completed model containerized to Google Cloud Platform (GCP) Cloud Run to create a highly accessible and secure AI microservice.",
            tech: ["Google AI Studio", "GCP Cloud Run", "Gemini API", "Docker", "Prompt Engineering"],
            keyPoints: [
                "Formulated robust system instructions to guide model behaviors and outputs.",
                "Configured container registries and build triggers to automate Cloud Run hosting.",
                "Implemented secure access gateways and rate-limiting using GCP wrappers."
            ]
        }
    };
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filterValue = btn.dataset.filter;
            projectCards.forEach(card => {
                if (filterValue === 'all' || card.dataset.category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    const modalOverlay = document.getElementById('project-modal');
    const modalContent = modalOverlay.querySelector('.modal-body');
    const modalClose = modalOverlay.querySelector('.modal-close');
    
    // Bind click to the study case link inside the card
    projectCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Check if clicking action buttons or links to prevent overlay opening twice
            if (e.target.closest('.project-action-btn')) {
                return; // Let actions links do their thing
            }
            
            const projectKey = card.dataset.project;
            const data = projectDetails[projectKey];
            
            if (data) {
                let techTags = data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('');
                let keyPointsHTML = data.keyPoints.map(p => `<li>${p}</li>`).join('');
                
                modalContent.innerHTML = `
                    <div class="modal-visual-placeholder">
                        <i class="fa-solid ${projectKey === 'fitness' ? 'fa-heart-pulse' : 'fa-chart-line'}"></i>
                    </div>
                    <h3>${data.title}</h3>
                    <div class="modal-tech">${techTags}</div>
                    
                    <div class="modal-section-title">Overview</div>
                    <p>${data.desc}</p>
                    
                    <div class="modal-section-title">Key Accomplishments</div>
                    <ul style="padding-left: 20px; color: var(--text-secondary); margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px;">
                        ${keyPointsHTML}
                    </ul>
                `;
                
                modalOverlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    function closeModal() {
        modalOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });


    // === 9. DEVELOPER COMMAND CLI TERMINAL ===
    const terminalOutput = document.getElementById('terminal-output');
    const terminalInput = document.getElementById('terminal-input');
    
    const terminalCommands = {
        help: 'Available commands:\n  <span class="color-accent">about</span>      - Quick overview of Vinayak\n  <span class="color-accent">skills</span>     - List technical skills\n  <span class="color-accent">projects</span>   - View description of major projects\n  <span class="color-accent">run-ml</span>     - Run a mock Machine Learning model training simulation\n  <span class="color-accent">clear</span>      - Clear the terminal screen\n  <span class="color-accent">contact</span>    - Show contact details',
        about: 'Vinayak Somnath Bodke\nB.Tech CSE (Artificial Intelligence & Data Science Student) at Pimpri Chinchwad University (2023-2027)\nLocation: Pune, India\nFocus: Data Analysis, ML Models, Business Intelligence Dashboards.',
        skills: 'Technical Skills Matrix:\n  - Languages  : Python, SQL, R\n  - Analysis   : EDA, Data Preprocessing, Feature Engineering, Statistics\n  - Libraries  : Pandas, NumPy, Scikit-Learn, Matplotlib, Seaborn, Streamlit\n  - Toolchains : Jupyter Notebook, Git, GitHub, VS Code',
        projects: '1. Fitness Tracker Data Analysis\n   EDA and custom Streamlit metrics dashboard analyzing step-sleep correlation.\n2. Data Analysis Dashboard\n   Business metrics dashboard with star-schema modeling and SQL optimization.',
        contact: 'Email    : vinayakbodke82@gmail.com\nPhone    : +91 7498833735\nLinkedIn : linkedin.com/in/vinayakbodke (Mock)\nGitHub   : github.com/vinayakbodke82'
    };
    
    function appendTerminalLine(text, isInput = false) {
        const line = document.createElement('div');
        if (isInput) {
            line.innerHTML = `<span class="term-prompt">visitor@vinayak:~$</span> <span style="color:#fff">${text}</span>`;
        } else {
            line.innerHTML = text;
        }
        terminalOutput.appendChild(line);
        
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const rawCommand = terminalInput.value.trim();
            const cmd = rawCommand.toLowerCase();
            
            appendTerminalLine(rawCommand, true);
            terminalInput.value = '';
            
            if (cmd === '') return;
            
            if (cmd === 'clear') {
                terminalOutput.innerHTML = '';
            } else if (cmd === 'run-ml') {
                runMockMLSimulation();
            } else if (terminalCommands[cmd]) {
                appendTerminalLine(terminalCommands[cmd]);
            } else {
                appendTerminalLine(`Command not found: "${rawCommand}". Type <span class="color-accent">help</span> for a list of commands.`);
            }
        }
    });
    
    function runMockMLSimulation() {
        terminalInput.disabled = true;
        appendTerminalLine('<span class="keyword">Initializing Machine Learning Model Training Sequence...</span>');
        
        let epoch = 1;
        const maxEpochs = 5;
        let accuracy = 0.52;
        let loss = 0.98;
        
        const timer = setInterval(() => {
            if (epoch <= maxEpochs) {
                loss -= Math.random() * 0.15 + 0.02;
                accuracy += Math.random() * 0.08 + 0.01;
                if (loss < 0.1) loss = 0.08;
                if (accuracy > 0.98) accuracy = 0.98;
                
                appendTerminalLine(`Epoch ${epoch}/${maxEpochs} - loss: <span style="color:#ef4444">${loss.toFixed(4)}</span> - accuracy: <span style="color:#10b981">${accuracy.toFixed(4)}</span>`);
                epoch++;
            } else {
                clearInterval(timer);
                appendTerminalLine('<span style="color:#10b981; font-weight: bold;">[SUCCESS] Model training completed successfully!</span>');
                appendTerminalLine(`Final Model Accuracy: ${(accuracy * 100).toFixed(2)}% - Saved as model_v1.pkl`);
                terminalInput.disabled = false;
                terminalInput.focus();
            }
            const terminalBody = document.querySelector('.terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }, 800);
    }
    
    appendTerminalLine('Welcome to Vinayak\'s Interactive Shell v1.0.0\nType <span style="color:#00d3ff; font-weight:bold">help</span> to view available terminal commands.');


    // === 10. FLYING PAPER-PLANE FORM SUBMISSION ===
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const toast = document.getElementById('toast');
    
    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const msg = document.getElementById('message').value;
            
            if (name && email && msg) {
                // Morph submit button
                submitBtn.classList.add('sending');
                submitBtn.disabled = true;
                
                // Submit to FormSubmit.co AJAX endpoint using Vinayak's email
                fetch('https://formsubmit.co/ajax/vinayakbodke82@gmail.com', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: name,
                        email: email,
                        message: msg
                    })
                })
                .then(async (response) => {
                    let json = await response.json();
                    if (response.status === 200 || json.success === "true" || json.success === true) {
                        // Trigger plane flight after response
                        submitBtn.classList.add('sent');
                        setTimeout(() => {
                            toast.classList.add('show');
                            contactForm.reset();
                            submitBtn.classList.remove('sending', 'sent');
                            submitBtn.disabled = false;
                            setTimeout(() => {
                                toast.classList.remove('show');
                            }, 4000);
                        }, 1000);
                    } else {
                        console.error(json);
                        alert("Submission error: " + json.message);
                        submitBtn.classList.remove('sending');
                        submitBtn.disabled = false;
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert("Network error: Form submission failed.");
                    submitBtn.classList.remove('sending');
                    submitBtn.disabled = false;
                });
            }
        });
    }
});
