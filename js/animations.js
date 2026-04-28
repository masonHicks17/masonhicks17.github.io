// Scroll animations with reduced-motion support

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktopQuery = window.matchMedia('(min-width: 769px)');

const setVisibleImmediately = () => {
    document.querySelectorAll('.reveal, .reveal-stagger > *').forEach((element) => {
        element.classList.add('is-visible');
        element.style.transitionDelay = '0ms';
    });
};

const applyStaggerDelays = () => {
    document.querySelectorAll('.reveal-stagger').forEach((group) => {
        Array.from(group.children).forEach((child, index) => {
            child.style.transitionDelay = prefersReducedMotion.matches ? '0ms' : `${index * 80}ms`;
        });
    });
};

const initRevealObserver = () => {
    if (prefersReducedMotion.matches) {
        setVisibleImmediately();
        return null;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -8% 0px'
    });

    document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
    document.querySelectorAll('.reveal-stagger > *').forEach((element) => observer.observe(element));

    return observer;
};

const initParallax = () => {
    const parallaxElements = document.querySelectorAll('.parallax-soft');

    if (!parallaxElements.length) {
        return;
    }

    if (prefersReducedMotion.matches || !desktopQuery.matches) {
        parallaxElements.forEach((element) => {
            element.style.transform = '';
        });
        return;
    }

    const onScroll = () => {
        const offset = Math.min(window.scrollY * 0.08, 24);

        parallaxElements.forEach((element) => {
            element.style.transform = `translateY(${offset}px)`;
        });
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
};

const initBackToTop = () => {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const onScroll = () => {
        if (window.scrollY > 300) {
            btn.classList.add('is-visible');
        } else {
            btn.classList.remove('is-visible');
        }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
};

document.addEventListener('DOMContentLoaded', () => {
    applyStaggerDelays();
    initRevealObserver();
    initParallax();
    initBackToTop();
});

prefersReducedMotion.addEventListener('change', () => {
    applyStaggerDelays();
    if (prefersReducedMotion.matches) {
        setVisibleImmediately();
    }
});
