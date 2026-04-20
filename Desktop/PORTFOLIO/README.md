# Mason Hicks — Personal Portfolio Website

A premium, polished personal portfolio website built with vanilla HTML, CSS, and JavaScript. Designed with a luxury old-money aesthetic, featuring smooth animations, dark/light mode support, and a fully responsive layout.

## 📁 File Structure

```
PORTFOLIO/
├── index.html                 # Main homepage
├── css/
│   ├── styles.css            # Main stylesheets & design system
│   └── dark-mode.css         # Dark mode color overrides
├── js/
│   ├── main.js               # Core functionality
│   ├── theme-toggle.js       # Dark/light mode toggle logic
│   └── animations.js         # Scroll animations & section reveals
├── projects/
│   ├── personal-dashboard.html
│   ├── gym-planner.html
│   └── landing-pages.html
├── games/
│   ├── flappy-bird.html
│   ├── choose-path.html
│   └── guess-character.html
├── resume.pdf                # Your resume (add your own)
└── README.md                 # This file
```

## 🎨 Design System

### Colors
- **Primary:** `#1a3a52` (Dark blue)
- **Secondary:** `#f5a623` (Warm gold)
- **Accent:** `#ff6b35` (Energetic orange)
- **Neutrals:** `#fafaf9` to `#1c1917` (Warm grays)

### Typography
- **Display:** Playfair Display (serif) — headlines
- **Body:** Inter (sans-serif) — all text

### Spacing & Layout
All spacing follows an 8px base grid for consistency. Use CSS custom properties defined in `styles.css` for all spacing, colors, and sizing.

## 🚀 Getting Started

### Local Development
1. Clone or download this repository
2. Open `index.html` in your browser
3. Make changes to HTML, CSS, or JavaScript files
4. Refresh to see updates (no build process needed!)

### Customization Checklist

#### 1. **Personal Information**
Open `index.html` and update:
- Line 38: Change "Mason Hicks" to your name
- Line 39: Update the tagline
- Line 40-41: Update the hero description
- Line 43: Update email in contact section
- Line 261: Update contact email link
- Line 264: LinkedIn URL
- Line 270: GitHub URL

#### 2. **Project Cards**
Each project card is in the "Featured Projects" section (around line 111).
To update:
```html
<div class="project-card" data-project="project-id">
    <div class="project-image">
        <div class="placeholder-image placeholder-1"></div>
    </div>
    <div class="project-content">
        <h3>Your Project Title</h3>
        <p>Short description (2-3 sentences)</p>
        <div class="project-tags">
            <span class="tag">Tech Stack</span>
        </div>
        <div class="project-actions">
            <a href="projects/your-project.html" class="btn btn-text">Learn More →</a>
        </div>
    </div>
</div>
```

#### 3. **Project Images**
- Replace placeholder gradients with actual project images
- Images should be 320px wide × 200px tall (maintained by CSS)
- Store images in a new `assets/images/` folder if desired
- Update the `<div class="placeholder-image"></div>` to use `<img>` tags

#### 4. **Game Cards**
Similar structure to projects—update titles, descriptions, and links in the "Mini Games" section.

#### 5. **Resume**
1. Create your resume as a PDF
2. Save it as `resume.pdf` in the root directory
3. The download button on line 233 will link to it automatically

#### 6. **Color Theme** (optional)
To customize colors, edit the CSS variables at the top of `css/styles.css`:
```css
:root {
    --color-primary: #1a3a52;
    --color-secondary: #f5a623;
    --color-accent: #ff6b35;
    /* ... more variables ... */
}
```

#### 7. **Fonts** (optional)
Fonts are imported from Google Fonts (line 7-8 in index.html). To change:
1. Visit [Google Fonts](https://fonts.google.com)
2. Replace the font link in `<head>`
3. Update the font family names in CSS variables

## 📄 Adding New Projects

### Create a New Project Page
1. Create a new file: `projects/your-project-name.html`
2. Copy the structure from `projects/personal-dashboard.html`
3. Update:
   - `<title>` tag
   - All content (title, description, sections)
   - Project images and details
   - Link back to home (should stay as `/#projects`)
4. Link to it from index.html in the projects grid

### Example:
```html
<div class="project-card" data-project="your-project">
    <div class="project-image">
        <img src="../assets/images/your-project.jpg" alt="Your Project">
    </div>
    <div class="project-content">
        <h3>Your Project Name</h3>
        <p>Description here...</p>
        <div class="project-tags">
            <span class="tag">React</span>
            <span class="tag">Design</span>
        </div>
        <div class="project-actions">
            <a href="projects/your-project.html" class="btn btn-text">Learn More →</a>
        </div>
    </div>
</div>
```

## 🎮 Adding New Games

Follow the same pattern as projects:
1. Create `games/your-game-name.html`
2. Use `games/flappy-bird.html` as a template
3. Include game functionality (canvas-based, interactive elements, etc.)
4. Link from index.html in the "Mini Games" section

## 🌙 Dark Mode

Dark mode is built-in and automatically uses the user's system preference. Users can toggle manually with the sun/moon icon in the navbar.

**How it works:**
- `js/theme-toggle.js` handles the toggle and localStorage
- `css/dark-mode.css` contains dark mode color overrides
- Light mode is the default (change in `theme-toggle.js` line 10 if desired)

## ✨ Features

✅ **Fully Responsive** — Mobile, tablet, desktop
✅ **Dark/Light Mode** — System preference + manual toggle
✅ **Smooth Animations** — Scroll reveals, hover effects, transitions
✅ **Accessibility** — Semantic HTML, focus states, ARIA labels
✅ **No Dependencies** — Pure HTML, CSS, JavaScript
✅ **Easy to Customize** — Clear code structure, extensive comments
✅ **SEO Ready** — Semantic markup, Open Graph ready

## 🚢 Deployment

### GitHub Pages (Free & Easy)

1. **Create a GitHub repository** named `<your-username>.github.io`
2. **Push your portfolio** to the `main` branch
3. **Visit** `https://<your-username>.github.io` — done!

```bash
# Initialize git (one time)
git init
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git branch -M main
git push -u origin main
```

### Other Options

- **Vercel** (free tier): Connect your GitHub repo, auto-deploys
- **Netlify** (free tier): Drag & drop to deploy
- **Personal Domain**: Point your domain's DNS to GitHub Pages or Vercel

## 📝 Content Editing Tips

### For Maximum Impact:
- **Be specific** — "Explored AI-powered interfaces" is better than "Built an app"
- **Show personality** — The tone should sound like you, not a template
- **Include metrics** — "25+ projects shipped" is more credible than "Many projects"
- **Use action words** — "Shipped," "Explored," "Engineered," "Designed"
- **Keep it tight** — Long paragraphs lose readers; aim for 2-3 sentences max

### Project Descriptions Should Cover:
1. What it is (one sentence)
2. Why you built it (the problem)
3. What's unique about your approach
4. Technical stack
5. Key learning or takeaway

## 🎯 Performance & Best Practices

- **No external dependencies** — reduces load time
- **Optimized images** — use compressed JPGs or WebP where possible
- **Minify before deploy** — optional CSS/JS minification
- **Prefetch links** — implemented in `js/main.js` for faster page transitions

## 🔧 Customization Examples

### Change the hero visual
The gradient orb in the hero section is animated. To disable or modify:
- Find `.gradient-orb` in `css/styles.css`
- Modify the animation or visibility

### Add a resume preview
You can embed a PDF preview using an iframe or link to an online viewer.

### Add a contact form
To add a real contact form:
1. Use a service like Formspree or Basin
2. Create an HTML form pointing to their endpoint
3. Replace the static contact section

### Change the default theme
In `js/theme-toggle.js`, line 10:
```javascript
let isDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
// Change to: let isDarkMode = true; // for dark mode default
```

## 💡 Tips for Success

1. **Update regularly** — Add new projects as you ship them
2. **Tell the story** — Don't just list features; explain your thinking
3. **Show code snippets** — Link to GitHub repos for proof
4. **Use real images** — Replace placeholder gradients with actual screenshots
5. **Keep it honest** — Highlight real learnings, not perfection
6. **Get feedback** — Share with mentors or peers

## 📞 Support

For questions or improvements:
- Check the code comments in `css/styles.css` and `js/main.js`
- Review example project pages for structure
- Reference the design system tokens at the top of `styles.css`

---

**Built with curiosity and care.** This portfolio is a living document—update it often as you grow and ship new projects.
