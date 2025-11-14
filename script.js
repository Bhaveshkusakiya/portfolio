// Particle System
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particleCanvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.resize();
        this.init();
        this.animate();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        for (let i = 0; i < 50; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(99, 102, 241, 0.3)';
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.animate());
    }
}

// AI Chat System
const aiResponses = {
    skills: "Bhavesh is expert in Python, TensorFlow, PyTorch, Tableau, Power BI, and has achieved 89% model accuracy in ML projects!",
    projects: "His top projects include Loan Risk Analyzer (89% accuracy), Customer Churn Prediction (85% accuracy), and Twitter Sentiment Analysis with 10K+ tweets processed.",
    experience: "He has 3+ years of experience as Data Scientist, Analytics Consultant, and has delivered 20% improvement in data-driven decisions.",
    education: "MSc Mathematics from Mithibai College, certified in Data Science from StarAgile, and multiple IBM certifications in ML and Python.",
    default: "I can tell you about Bhavesh's skills, projects, experience, or education. What interests you most?"
};

function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    if (!input || !messages) return;
    
    const userMessage = input.value.trim();
    if (!userMessage) return;

    messages.innerHTML += `<div class="message user">${userMessage}</div>`;
    
    let response = aiResponses.default;
    const lowerMessage = userMessage.toLowerCase();
    
    for (const [key, value] of Object.entries(aiResponses)) {
        if (lowerMessage.includes(key)) {
            response = value;
            break;
        }
    }
    
    setTimeout(() => {
        messages.innerHTML += `<div class="message bot">${response}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 500);
    
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
}

function startAIDemo() {
    const modal = document.getElementById('aiDemoModal');
    if (modal) modal.style.display = 'block';
}

function showProjectDemo(project) {
    const content = {
        loan: `<h2>🏦 Loan Risk Analyzer Demo</h2>
               <div class="demo-stats">
                   <div class="demo-stat"><span>89%</span> Accuracy</div>
                   <div class="demo-stat"><span>0.91</span> AUC Score</div>
                   <div class="demo-stat"><span>10K+</span> Records</div>
               </div>
               <p>Interactive ML model that predicts loan default risk using advanced feature engineering and XGBoost algorithm.</p>`,
        churn: `<h2>👥 Customer Churn Prediction Demo</h2>
                <div class="demo-stats">
                    <div class="demo-stat"><span>85%</span> Accuracy</div>
                    <div class="demo-stat"><span>15K+</span> Customers</div>
                    <div class="demo-stat"><span>92%</span> Precision</div>
                </div>
                <p>Advanced churn prediction model with Tableau visualization for actionable customer retention insights.</p>`,
        sentiment: `<h2>🐦 Twitter Sentiment Analysis Demo</h2>
                   <div class="demo-stats">
                       <div class="demo-stat"><span>10K+</span> Tweets</div>
                       <div class="demo-stat"><span>87%</span> Accuracy</div>
                       <div class="demo-stat"><span>NLP</span> Powered</div>
                   </div>
                   <p>Real-time sentiment analysis using advanced NLP techniques with Logistic Regression and Naive Bayes classification.</p>`,
        forecasting: `<h2>📈 Daily Dashboard Demo</h2>
                      <div class="demo-stats">
                          <div class="demo-stat"><span>Interactive</span> JS</div>
                          <div class="demo-stat"><span>HTML</span> Forecasting</div>
                          <div class="demo-stat"><span>UI</span> Enhanced</div>
                      </div>
                      <p>Daily Dashboard work for balancing Daily Life, and Track Daily record.</p>`,
        health: `<h2>🎥 Smart Health Tracker Demo</h2>
                 <div class="demo-stats">
                     <div class="demo-stat"><span>Dashboard</span> UI</div>
                     <div class="demo-stat"><span>Real-time</span> Tracking</div>
                     <div class="demo-stat"><span>Analytics</span> Powered</div>
                 </div>
                 <p>Interactive health dashboard with comprehensive tracking and visualization of health metrics and trends.</p>`
    };
    
    const projectContent = document.getElementById('projectContent');
    const projectModal = document.getElementById('projectModal');
    if (projectContent && projectModal) {
        projectContent.innerHTML = content[project];
        projectModal.style.display = 'block';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
}

function downloadResume() {
    const link = document.createElement('a');
    link.href = './resume/BhaveshKusakiya_CV.pdf';
    link.download = 'BhaveshKusakiya_CV.pdf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Mobile menu functions removed - using bottom navigation instead

function sharePortfolio() {
    if (navigator.share) {
        navigator.share({
            title: 'Bhavesh Kusakiya - AI/ML Portfolio',
            url: window.location.href
        });
    } else {
        alert('📤 Portfolio link copied!');
    }
}

function updateViewCount() {
    const count = document.getElementById('viewCount');
    if (count) {
        let current = parseInt(count.textContent);
        count.textContent = current + Math.floor(Math.random() * 3) + 1;
    }
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 20);
}

function animateSkills() {
    document.querySelectorAll('.skill-progress').forEach(bar => {
        const width = bar.getAttribute('data-width');
        bar.style.width = width + '%';
    });
}

function startScreensaver() {
    const matrixMode = document.getElementById('matrixMode');
    if (matrixMode) {
        matrixMode.style.display = 'block';
        initMatrix();
    }
}

function stopScreensaver() {
    const matrixMode = document.getElementById('matrixMode');
    if (matrixMode) matrixMode.style.display = 'none';
}

function initMatrix() {
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    const drops = [];

    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }

    function draw() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#0F0';
        ctx.font = fontSize + 'px arial';

        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    const matrixInterval = setInterval(() => {
        const matrixMode = document.getElementById('matrixMode');
        if (!matrixMode || matrixMode.style.display === 'none') {
            clearInterval(matrixInterval);
        } else {
            draw();
        }
    }, 35);
}

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function toggleMobileDropdown() {
    const dropdown = document.getElementById('mobileDropdown');
    const moreButton = document.querySelector('.mobile-nav-more');
    
    if (dropdown.style.opacity === '1' || dropdown.style.visibility === 'visible') {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
    } else {
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
    }
}

function handleScroll() {
    const scrollBtn = document.getElementById('scrollToTop');
    if (scrollBtn) {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    }
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    setTimeout(() => {
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('fade-out');
            setTimeout(() => loadingScreen.style.display = 'none', 300);
        }
    }, 800);
    
    new ParticleSystem();
    
    // Scroll to top button
    window.addEventListener('scroll', handleScroll);
    
    // Animate counters
    document.querySelectorAll('.stat-number').forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        if (target) animateCounter(stat, target);
    });

    // Animate skills after delay
    setTimeout(animateSkills, 1000);
    
    // Update view count periodically
    setInterval(updateViewCount, 30000);
    
    // Chat input enter key
    const chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    }

    // Achievement badge interactions
    document.querySelectorAll('.achievement-badge').forEach(badge => {
        badge.addEventListener('click', () => {
            badge.classList.add('badge-clicked');
            setTimeout(() => badge.classList.remove('badge-clicked'), 1000);
        });
    });

    // Mobile menu click handlers removed
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});