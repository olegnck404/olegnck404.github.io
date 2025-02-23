class ProjectCards {
    cards;

    constructor() {
        this.cards = document.querySelectorAll('.project-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.addEventListener('mouseleave', () => this.handleMouseLeave(card));
            this.addTiltAnimation(card);
        });
    }

    handleMouseMove(e, card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const deltaX = (x - centerX) / centerX;
        const deltaY = (y - centerY) / centerY;

        const tiltX = deltaY * 10;
        const tiltY = -deltaX * 10;

        card.style.transform = `
            perspective(1000px)
            rotateX(${tiltX}deg)
            rotateY(${tiltY}deg)
            scale3d(1.02, 1.02, 1.02)
        `;

        this.updateGlare(card, x, y);
    }

    handleMouseLeave(card) {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        const glare = card.querySelector('.card-glare');
        if (glare) glare.style.opacity = '0';
    }

    addTiltAnimation(card) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        glare.style.cssText = `
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            background: radial-gradient(circle at 50% 50%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%);
            opacity: 0;
            transition: opacity 0.3s ease, transform 0.3s ease;
            pointer-events: none;
        `;
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glare);
    }

    updateGlare(card, mouseX, mouseY) {
        const glare = card.querySelector('.card-glare');
        if (!glare) return;

        const rect = card.getBoundingClientRect();
        const x = ((mouseX / rect.width) * 100).toFixed(2);
        const y = ((mouseY / rect.height) * 100).toFixed(2);

        glare.style.opacity = '0.15';
        glare.style.background = `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 80%)`;
    }

    destroy() {
        this.cards.forEach(card => {
            card.removeEventListener('mousemove', (e) => this.handleMouseMove(e, card));
            card.removeEventListener('mouseleave', () => this.handleMouseLeave(card));
        });
    }
}

export default ProjectCards;
