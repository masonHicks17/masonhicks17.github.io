// Scroll Animations & Section Reveals

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('slide-up');
            // Optional: unobserve after animation
            // observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observe all cards and sections
document.addEventListener('DOMContentLoaded', () => {
    const elementsToObserve = document.querySelectorAll(
        '.project-card, .game-card, .workflow-card, .about-text, .contact-card, .stat-card, .experience-column, .content-lab-card'
    );

    elementsToObserve.forEach(element => {
        observer.observe(element);
    });
});

// Smooth hover effects on cards
const cards = document.querySelectorAll('.project-card, .game-card, .workflow-card, .stat-card, .contact-card');

cards.forEach(card => {
    card.addEventListener('mouseenter', (e) => {
        // Optional: add glow effect on hover
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        // Can be extended with pointer tracking for advanced effects
    });
});

// Parallax effect on hero section
const heroSection = document.getElementById('hero');

if (heroSection) {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = heroSection.querySelectorAll('.gradient-orb');
        parallaxElements.forEach(element => {
            element.style.transform = `translateY(calc(-50% + ${scrolled * 0.3}px))`;
        });
    });
}

// Add subtle stagger animation to grid items
const staggerGrids = document.querySelectorAll('.projects-grid, .games-grid, .workflow-grid');

staggerGrids.forEach(grid => {
    const items = grid.querySelectorAll('.project-card, .game-card, .workflow-card');
    items.forEach((item, index) => {
        item.style.animationDelay = `${index * 50}ms`;
    });
});
