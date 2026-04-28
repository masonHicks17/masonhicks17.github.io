// Main Application Logic

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Close mobile menu if open
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    });
});

// Active nav link indicator
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;

        if (window.pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add active class styling (CSS should define it)
const style = document.createElement('style');
style.textContent = `
    .nav-link.active {
        color: var(--color-primary) !important;
    }

    .nav-link.active::after {
        width: 100% !important;
    }
`;
document.head.appendChild(style);

// Project card click handler (for future detail pages)
document.querySelectorAll('.project-card, .game-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (e.target.closest('a, button')) {
            return;
        }

        const learnMoreBtn = this.querySelector('a.btn-text[href]');
        if (learnMoreBtn) {
            learnMoreBtn.click();
        }
    });

    // Prevent card click if clicking on button
    const buttons = card.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});

// Prefetch navigation links for faster loading
document.querySelectorAll('a[href*=".html"]').forEach(link => {
    const url = link.getAttribute('href');
    if (url && !url.startsWith('http')) {
        const link_element = document.createElement('link');
        link_element.rel = 'prefetch';
        link_element.href = url;
        document.head.appendChild(link_element);
    }
});

// Form validation helper (if contact form is added)
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Utility function to get theme
const getCurrentTheme = () => {
    return document.body.classList.contains('dark-mode') ? 'dark' : 'light';
};

// Log portfolio loaded
console.log('%cMason Hicks Portfolio', 'font-size: 20px; font-weight: bold; color: #315f8d;');
console.log('%cBuilt with HTML, CSS, and JavaScript', 'font-size: 12px; color: #666;');
console.log('%cTheme: ' + getCurrentTheme(), 'font-size: 12px; color: #999;');
