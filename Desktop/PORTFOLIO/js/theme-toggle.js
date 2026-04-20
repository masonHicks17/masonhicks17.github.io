// Dark Mode Toggle Functionality

const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;
const bodyElement = document.body;

// Check for saved preference or system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');

// Determine initial theme
let isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;

// Apply initial theme
const applyTheme = (isDark) => {
    if (isDark) {
        bodyElement.classList.add('dark-mode');
        htmlElement.setAttribute('data-theme', 'dark');
    } else {
        bodyElement.classList.remove('dark-mode');
        htmlElement.setAttribute('data-theme', 'light');
    }
};

// Initialize theme
applyTheme(isDarkMode);

// Theme toggle handler
themeToggle.addEventListener('click', () => {
    isDarkMode = !isDarkMode;
    applyTheme(isDarkMode);
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');

    // Trigger animation
    themeToggle.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        themeToggle.style.transform = 'rotate(0deg)';
    }, 300);
});

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!savedTheme) {
        isDarkMode = e.matches;
        applyTheme(isDarkMode);
    }
});
