document.addEventListener('DOMContentLoaded', () => {
    // ==========================================
    // 1. PRELOADER & FADE ANIMATION
    // ==========================================
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        });
        
        // Backup timeout in case load event already fired or delayed
        setTimeout(() => {
            if (preloader.style.display !== 'none') {
                preloader.style.opacity = '0';
                setTimeout(() => preloader.style.display = 'none', 500);
            }
        }, 2500);
    }

    // ==========================================
    // 2. THEME TOGGLER (DARK / LIGHT MODE)
    // ==========================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        if (theme === 'dark') {
            themeIcon.className = 'fas fa-sun';
        } else {
            themeIcon.className = 'fas fa-moon';
        }
    }

    // ==========================================
    // 3. RESPONSIVE NAVIGATION MENU (HAMBURGER)
    // ==========================================
    const hamburger = document.getElementById('hamburger');
    const navLinksContainer = document.getElementById('nav-links');
    
    if (hamburger && navLinksContainer) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            navLinksContainer.classList.toggle('open');
        });

        // Close menu when link is clicked
        const navLinks = navLinksContainer.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                hamburger.classList.remove('open');
                navLinksContainer.classList.remove('open');
            });
        });

        // Close menu when clicking outside header
        document.addEventListener('click', (e) => {
            const header = document.querySelector('header');
            if (header && !header.contains(e.target) && navLinksContainer.classList.contains('open')) {
                hamburger.classList.remove('open');
                navLinksContainer.classList.remove('open');
            }
        });
    }

    // Set active page menu styling
    const currentPath = window.location.pathname.split('/').pop();
    const navItems = document.querySelectorAll('.nav-links a');
    navItems.forEach(item => {
        const itemPath = item.getAttribute('href');
        if (currentPath === itemPath || (currentPath === '' && itemPath === 'index.html')) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });

    // ==========================================
    // 4. SCROLL PROGRESS & SCROLL TO TOP BUTTON
    // ==========================================
    const scrollProgressBar = document.getElementById('scroll-progress-bar');
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        // Calculate scroll percentage
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        
        if (scrollProgressBar) {
            scrollProgressBar.style.width = `${scrollPercent}%`;
        }

        // Show/hide scroll-to-top button
        if (scrollToTopBtn) {
            if (scrollTop > 300) {
                scrollToTopBtn.classList.add('show');
            } else {
                scrollToTopBtn.classList.remove('show');
            }
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ==========================================
    // 5. ANIMATED TYPING EFFECT (HERO)
    // ==========================================
    const typeTarget = document.getElementById('typewriter-text');
    if (typeTarget) {
        const phrases = [
            "Hi, I'm Deepika Ravichandiran",
            "B.Tech Information Technology Graduate",
            "Passionate about Web Development, Software Engineering, AI, and Problem Solving."
        ];
        
        let phraseIdx = 0;
        let charIdx = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            const currentPhrase = phrases[phraseIdx];
            
            if (isDeleting) {
                typeTarget.textContent = currentPhrase.substring(0, charIdx - 1);
                charIdx--;
                typingSpeed = 50; // faster deletion
            } else {
                typeTarget.textContent = currentPhrase.substring(0, charIdx + 1);
                charIdx++;
                typingSpeed = 100; // regular typing
            }

            // If text typed fully, wait and delete
            if (!isDeleting && charIdx === currentPhrase.length) {
                isDeleting = true;
                typingSpeed = 2000; // pause before deleting
            } else if (isDeleting && charIdx === 0) {
                isDeleting = false;
                phraseIdx = (phraseIdx + 1) % phrases.length;
                typingSpeed = 500; // pause before typing next line
            }

            setTimeout(type, typingSpeed);
        }
        
        // Start effect
        setTimeout(type, 1000);
    }

    // ==========================================
    // 6. STATISTICS COUNTER ANIMATION
    // ==========================================
    const statsSection = document.querySelector('.stats');
    const statCounters = document.querySelectorAll('.stat-number');
    
    if (statsSection && statCounters.length > 0) {
        let countTriggered = false;

        const countUp = (counter) => {
            const target = parseInt(counter.getAttribute('data-target'), 10);
            const countTo = isNaN(target) ? 0 : target;
            let current = 0;
            const duration = 2000; // ms
            const stepTime = Math.max(Math.floor(duration / countTo), 15);
            
            const timer = setInterval(() => {
                current += 1;
                counter.textContent = current + '+';
                if (current >= countTo) {
                    counter.textContent = countTo + '+';
                    clearInterval(timer);
                }
            }, stepTime);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countTriggered) {
                    statCounters.forEach(counter => countUp(counter));
                    countTriggered = true;
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        observer.observe(statsSection);
    }

    // ==========================================
    // 7. SKILL BARS & PROGRESS METERS ANIMATION
    // ==========================================
    const linearSkillFills = document.querySelectorAll('.skill-bar-fill');
    const circularSkills = document.querySelectorAll('.circular-skill-item');

    if (linearSkillFills.length > 0) {
        const skillBarObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const fill = entry.target;
                    const percent = fill.getAttribute('data-percent');
                    fill.style.width = `${percent}%`;
                    skillBarObserver.unobserve(fill);
                }
            });
        }, { threshold: 0.1 });

        linearSkillFills.forEach(fill => skillBarObserver.observe(fill));
    }

    if (circularSkills.length > 0) {
        const circularSkillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const wrapper = entry.target;
                    const circle = wrapper.querySelector('.circular-progress-bar');
                    const percent = parseInt(wrapper.getAttribute('data-percent'), 10);
                    
                    if (circle && !isNaN(percent)) {
                        // Formula: Circumference = 282.7. Offset = Circumference - (Circumference * Percent / 100)
                        const circumference = 282.7;
                        const offset = circumference - (circumference * percent / 100);
                        circle.style.strokeDashoffset = offset;
                    }
                    circularSkillObserver.unobserve(wrapper);
                }
            });
        }, { threshold: 0.2 });

        circularSkills.forEach(skill => circularSkillObserver.observe(skill));
    }

    // ==========================================
    // 8. CONTACT FORM HANDLING
    // ==========================================
    const contactForm = document.getElementById('portfolioContactForm');
    const formStatus = document.getElementById('form-status');

    if (contactForm && formStatus) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate form input values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const subject = document.getElementById('subject').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                formStatus.className = 'form-status error';
                formStatus.textContent = 'Please fill out all required fields (Name, Email, Message).';
                return;
            }

            // Simulate form submission
            formStatus.className = 'form-status success';
            formStatus.textContent = 'Thank you! Your message has been sent successfully.';
            contactForm.reset();
            
            console.log('Form Submitted:', { name, email, phone, subject, message });

            // Hide status message after 5 seconds
            setTimeout(() => {
                formStatus.style.display = 'none';
            }, 5000);
        });
    }

    // ==========================================
    // 9. DYNAMIC FLOATING AI CHATBOT SYSTEM
    // ==========================================
    injectChatbot();

    function injectChatbot() {
        // Create chatbot container elements programmatically
        const chatbotMarkup = `
            <button id="chatbot-toggle-btn" aria-label="Toggle Chatbot">
                <i class="fas fa-comment-dots"></i>
            </button>
            <div id="chatbot-window" class="glass-card">
                <div class="chatbot-header">
                    <div class="chatbot-header-info">
                        <div class="chatbot-avatar">
                            <i class="fas fa-robot"></i>
                        </div>
                        <div class="chatbot-status">
                            <h4>Deepika AI Assistant</h4>
                            <span>Online</span>
                        </div>
                    </div>
                    <button class="chatbot-close-btn" id="chatbot-close-btn"><i class="fas fa-times"></i></button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages"></div>
                <div class="chatbot-suggestions" id="chatbot-suggestions"></div>
                <div class="chatbot-input-area">
                    <input type="text" id="chatbot-input" class="chatbot-input" placeholder="Ask a question..." autocomplete="off">
                    <button id="chatbot-send-btn" class="chatbot-send-btn"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        `;
        
        const botDiv = document.createElement('div');
        botDiv.id = 'chatbot-container';
        botDiv.innerHTML = chatbotMarkup;
        document.body.appendChild(botDiv);

        // Setup Event Listeners & Elements
        const botContainer = document.getElementById('chatbot-container');
        const toggleBtn = document.getElementById('chatbot-toggle-btn');
        const closeBtn = document.getElementById('chatbot-close-btn');
        const chatbotWindow = document.getElementById('chatbot-window');
        const msgsArea = document.getElementById('chatbot-messages');
        const suggestionsArea = document.getElementById('chatbot-suggestions');
        const chatInput = document.getElementById('chatbot-input');
        const sendBtn = document.getElementById('chatbot-send-btn');

        // Chatbot Knowledge Base
        const chatbotKnowledge = {
            intro: "Hello! I'm Deepika's AI Assistant. Ask me about her skills, projects, education, and career interests.",
            suggestions: [
                "Tell me about Deepika.",
                "What skills does she have?",
                "Show her projects.",
                "How can I contact her?",
                "What technologies does she know?"
            ],
            replies: {
                about: "<strong>Deepika Ravichandiran</strong> is a B.Tech Information Technology Graduate. She is passionate about Web Development, Software Engineering, AI, and Problem Solving. She is eager to learn and adapt to new technologies to build modern solutions.",
                skills: "Deepika has knowledge in the following domains:<br><br><strong>• Programming:</strong> Java, Python, C, JavaScript<br><strong>• Web Technologies:</strong> HTML, CSS, Bootstrap, React, Node.js<br><strong>• Databases:</strong> MySQL, MongoDB<br><strong>• Tools:</strong> Git, GitHub, VS Code<br><strong>• Soft Skills:</strong> Communication, Teamwork, Leadership, Problem Solving",
                projects: "Deepika has worked on several key projects:<br><br><strong>1. Student Management System:</strong> A web-based application for managing student academic records.<br><strong>2. Online Portfolio:</strong> A responsive website highlighting her qualifications and projects (the site you are viewing!).<br><strong>3. E-Commerce Website:</strong> An online shopping portal with checkout capabilities.<br><strong>4. AI Chatbot Assistant:</strong> A floating helper widget built using CSS and Javascript. (That's me!)",
                contact: "You can reach Deepika directly through these details:<br><br><strong>• Phone:</strong> 6384305908<br><strong>• Email:</strong> <a href='mailto:deepu199dmh@gmail.com'>deepu199dmh@gmail.com</a><br><strong>• Profiles:</strong> LinkedIn and GitHub links are on the Contact page!",
                career: "Deepika is looking for software engineering roles in: <strong>Software Development, Web Development, Full Stack Engineering, and AI technologies</strong>. She is dedicated to joining progressive teams to develop high-quality applications."
            }
        };

        // Open/Close Actions
        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        function toggleChat() {
            botContainer.classList.toggle('open');
            if (botContainer.classList.contains('open')) {
                // Initialize default message if empty
                if (msgsArea.children.length === 0) {
                    addBotMessage(chatbotKnowledge.intro);
                    loadSuggestions();
                }
                setTimeout(() => chatInput.focus(), 300);
            }
        }

        // Suggestions loading
        function loadSuggestions() {
            suggestionsArea.innerHTML = '';
            chatbotKnowledge.suggestions.forEach(q => {
                const button = document.createElement('button');
                button.className = 'suggest-btn';
                button.textContent = q;
                button.addEventListener('click', () => {
                    handleUserMsg(q);
                });
                suggestionsArea.appendChild(button);
            });
        }

        // Msg output helpers
        function addBotMessage(text) {
            const msgNode = document.createElement('div');
            msgNode.className = 'chat-msg bot';
            msgNode.innerHTML = text;
            msgsArea.appendChild(msgNode);
            scrollToBottom();
        }

        function addUserMessage(text) {
            const msgNode = document.createElement('div');
            msgNode.className = 'chat-msg user';
            msgNode.textContent = text;
            msgsArea.appendChild(msgNode);
            scrollToBottom();
        }

        function showTypingIndicator() {
            const indicator = document.createElement('div');
            indicator.className = 'chat-msg bot typing-indicator-wrapper';
            indicator.id = 'typing-indicator-node';
            indicator.innerHTML = `
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            `;
            msgsArea.appendChild(indicator);
            scrollToBottom();
        }

        function removeTypingIndicator() {
            const node = document.getElementById('typing-indicator-node');
            if (node) node.remove();
        }

        function scrollToBottom() {
            msgsArea.scrollTop = msgsArea.scrollHeight;
        }

        // Action handles
        function handleUserMsg(text) {
            addUserMessage(text);
            showTypingIndicator();
            
            // Generate bot reply after short delay
            setTimeout(() => {
                removeTypingIndicator();
                const reply = processQuery(text);
                addBotMessage(reply);
            }, 1000);
        }

        function processQuery(query) {
            const lower = query.toLowerCase();
            
            // Match cases
            if (lower.includes('deepika') || lower.includes('about') || lower.includes('profile') || lower.includes('who is she')) {
                return chatbotKnowledge.replies.about;
            } else if (lower.includes('projects') || lower.includes('portfolio') || lower.includes('work') || lower.includes('system') || lower.includes('e-commerce') || lower.includes('chatbot')) {
                return chatbotKnowledge.replies.projects;
            } else if (lower.includes('contact') || lower.includes('phone') || lower.includes('email') || lower.includes('reach') || lower.includes('call') || lower.includes('address')) {
                return chatbotKnowledge.replies.contact;
            } else if (lower.includes('skills') || lower.includes('languages') || lower.includes('technologies') || lower.includes('java') || lower.includes('python') || lower.includes('html') || lower.includes('css') || lower.includes('react') || lower.includes('mysql') || lower.includes('git')) {
                return chatbotKnowledge.replies.skills;
            } else if (lower.includes('career') || lower.includes('interest') || lower.includes('jobs') || lower.includes('aspire') || lower.includes('goal')) {
                return chatbotKnowledge.replies.career;
            } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
                return "Hello! Hope you're doing well. Ask me anything about Deepika's education, skills, projects, contact info, or career goals!";
            } else {
                return "I'm not sure I understand that query. You can ask me about Deepika's skills, projects, contact details, or career goals. Or simply select one of the quick suggestions below!";
            }
        }

        // Keyboard & Mouse Submit handlers
        sendBtn.addEventListener('click', () => {
            const query = chatInput.value.trim();
            if (query) {
                handleUserMsg(query);
                chatInput.value = '';
            }
        });

        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = chatInput.value.trim();
                if (query) {
                    handleUserMsg(query);
                    chatInput.value = '';
                }
            }
        });
    }
});
