// Utility functions
const animate = (element, properties, duration = 300) => {
    return new Promise(resolve => {
        element.style.transition = `all ${duration}ms ease`;
        Object.entries(properties).forEach(([key, value]) => {
            element.style[key] = value;
        });
        setTimeout(resolve, duration);
    });
};

// Theme management
class ThemeManager {
    constructor() {
        this.themeLink = document.getElementById("theme");
        this.switchButton = document.getElementById("switchMode");
        this.currentTheme = localStorage.getItem('theme') || 'light';
        this.init();
    }

    init() {
        this.themeLink.href = `${this.currentTheme}.css`;
        this.setupTransition();
        this.setupEventListeners();
    }

    setupTransition() {
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease';
        window.requestAnimationFrame(() => {
            document.body.style.opacity = '1';
        });
    }

    setupEventListeners() {
        this.switchButton.addEventListener('click', async () => {
            await animate(document.body, { opacity: '0' });
            this.currentTheme = this.themeLink.getAttribute("href").includes("dark") ? "light" : "dark";
            this.themeLink.href = `${this.currentTheme}.css`;
            localStorage.setItem('theme', this.currentTheme);
            await animate(document.body, { opacity: '1' });
        });
    }
}

// Text animation
class TextAnimator {
    constructor(element, text, options = {}) {
        this.element = element;
        this.text = text;
        this.options = {
            speed: options.speed || 100,
            delay: options.delay || 1000
        };
    }

    async animate() {
        await new Promise(resolve => setTimeout(resolve, this.options.delay));
        this.element.textContent = '';
        
        for (let char of this.text) {
            await new Promise(resolve => setTimeout(resolve, this.options.speed));
            this.element.textContent += char;
        }
    }
}

// Interactive elements
class InteractiveElements {
    constructor() {
        this.setupProjectLinks();
        this.setupProfilePhoto();
        this.setupSkillsAnimation();
        this.setupScrollAnimations();
        this.setupEasterEgg();
    }

    setupProjectLinks() {
        document.querySelectorAll('.card__portfolio-list .card__link').forEach(link => {
            link.addEventListener('mouseenter', this.handleProjectHover);
            link.addEventListener('mouseleave', this.handleProjectLeave);
        });
    }

    handleProjectHover(e) {
        const hue = Math.random() * 360;
        animate(e.target, {
            color: `hsl(${hue}, 70%, 70%)`,
            transform: 'translateX(10px)'
        });
    }

    handleProjectLeave(e) {
        animate(e.target, {
            color: '',
            transform: ''
        });
    }

    setupProfilePhoto() {
        const photo = document.querySelector('.card__photo');
        if (!photo) return;

        let isHovering = false;
        
        const handleMouseMove = (e) => {
            if (!isHovering) return;
            
            const rect = photo.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / 10;
            const y = (e.clientY - rect.top - rect.height / 2) / 10;
            
            requestAnimationFrame(() => {
                photo.style.transform = `
                    perspective(1000px) 
                    rotateY(${x}deg) 
                    rotateX(${-y}deg) 
                    scale(1.05)
                `;
            });
        };

        photo.addEventListener('mouseenter', () => isHovering = true);
        photo.addEventListener('mouseleave', () => {
            isHovering = false;
            animate(photo, {
                transform: 'perspective(1000px) rotateY(0) rotateX(0) scale(1)'
            });
        });
        photo.addEventListener('mousemove', handleMouseMove);
    }

    setupSkillsAnimation() {
        const skills = {
            'HTML5 & CSS3': 90,
            'JavaScript': 75,
            'Frameworks': 60,
            'Linux': 70
        };

        document.querySelectorAll('#html li').forEach(skill => {
            const name = skill.textContent;
            if (skills[name]) {
                this.createSkillIndicator(skill, skills[name]);
            }
        });
    }

    createSkillIndicator(element, value) {
        const indicator = document.createElement('div');
        indicator.className = 'skill-indicator';
        indicator.style.cssText = `
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            opacity: 0;
            transition: all 0.3s ease;
        `;
        
        const progress = document.createElement('div');
        progress.style.cssText = `
            width: ${value}%;
            height: 4px;
            background: var(--primary-color);
            border-radius: 2px;
        `;
        
        indicator.appendChild(progress);
        element.appendChild(indicator);
        element.style.position = 'relative';
        
        element.addEventListener('mouseenter', () => animate(indicator, { opacity: 1 }));
        element.addEventListener('mouseleave', () => animate(indicator, { opacity: 0 }));
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll('.card__block > *').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    setupEasterEgg() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let index = 0;

        document.addEventListener('keydown', (e) => {
            if (e.key === konamiCode[index]) {
                index++;
                if (index === konamiCode.length) {
                    this.triggerEasterEgg();
                    index = 0;
                }
            } else {
                index = 0;
            }
        });
    }

    triggerEasterEgg() {
        document.body.classList.add('rainbow-mode');
        setTimeout(() => document.body.classList.remove('rainbow-mode'), 5000);
    }
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const themeManager = new ThemeManager();
    const interactiveElements = new InteractiveElements();
    
    const titleSpan = document.querySelector('.title span');
    if (titleSpan) {
        const textAnimator = new TextAnimator(titleSpan, titleSpan.textContent);
        textAnimator.animate();
    }
});