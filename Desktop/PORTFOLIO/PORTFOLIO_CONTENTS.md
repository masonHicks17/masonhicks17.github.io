# Portfolio Contents & Customization Checklist

## ✅ What's Included

### Core Files (Ready to Use)
- ✅ `index.html` — Main portfolio page with all sections
- ✅ `css/styles.css` — Complete design system with variables
- ✅ `css/dark-mode.css` — Dark mode theme (automatic)
- ✅ `js/main.js` — Core navigation and interactions
- ✅ `js/theme-toggle.js` — Dark/light mode toggle logic
- ✅ `js/animations.js` — Scroll animations and section reveals
- ✅ `.gitignore` — Git ignore rules for deployment

### Documentation (Guides)
- ✅ `README.md` — Complete documentation
- ✅ `QUICK_START.md` — Get up and running in 10 minutes
- ✅ `PORTFOLIO_CONTENTS.md` — This file
- ✅ `projects/PROJECT_TEMPLATE.html` — Template for new projects

### Example Content (Fully Functional)

**Featured Projects:**
- ✅ `projects/personal-dashboard.html` — Example project page
- ✅ `projects/gym-planner.html` — Example project page
- ✅ `projects/landing-pages.html` — Example project page

**Mini Games:**
- ✅ `games/flappy-bird.html` — Playable game with canvas
- ✅ `games/choose-path.html` — Interactive narrative game
- ✅ `games/guess-character.html` — Logic-based guessing game

### Design Features
- ✅ Responsive grid layout (mobile, tablet, desktop)
- ✅ Dark/light mode with system preference detection
- ✅ Smooth scroll animations and section reveals
- ✅ Hover effects and micro-interactions
- ✅ Premium gradient placeholders
- ✅ Semantic HTML structure
- ✅ Accessibility features (focus states, ARIA labels)

---

## 📝 Customization Checklist

### Priority 1: Make It Yours (REQUIRED)

- [ ] **Update name** — Line 38 in `index.html`
  - Change "Mason Hicks" to your name

- [ ] **Update tagline** — Line 39
  - Change to your own tagline (one compelling sentence)

- [ ] **Update hero description** — Lines 40-41
  - Replace with your own story (2-3 sentences)

- [ ] **Update contact email** — Lines 261, 263
  - Change `mason@example.com` to your actual email
  - Also update the email link href

- [ ] **Update LinkedIn URL** — Line 264
  - Change to your LinkedIn profile URL

- [ ] **Update GitHub URL** — Line 270
  - Change to your GitHub profile URL

- [ ] **Add your resume** — Create `resume.pdf`
  - Export your resume as PDF
  - Save in root directory as `resume.pdf`
  - The download button links automatically

### Priority 2: Update Project Content (HIGHLY RECOMMENDED)

For each of the 3 featured projects, do the following:

- [ ] **Update project #1 (Personal Dashboard)**
  - [ ] Replace title (line ~113)
  - [ ] Replace description (line ~114)
  - [ ] Update tags (lines ~116-118)
  - [ ] Update project link (line ~122)
  - [ ] Create `projects/personal-dashboard.html` with real content
    OR copy from template and customize

- [ ] **Update project #2 (Gym Planner)**
  - [ ] Replace title, description, tags, link
  - [ ] Create or update detail page

- [ ] **Update project #3 (Landing Pages)**
  - [ ] Replace title, description, tags, link
  - [ ] Create or update detail page

### Priority 3: Update Experience Section (RECOMMENDED)

Around lines 189-221 in `index.html`:

- [ ] **Update Technical Skills** (lines 197-209)
  - [ ] Frontend technologies you actually use
  - [ ] Backend technologies
  - [ ] Design/tools
  - [ ] AI integration experience

- [ ] **Update Experience Highlights** (lines 210-221)
  - [ ] Your actual background
  - [ ] Key accomplishments
  - [ ] Unique perspective or approach

### Priority 4: Add Project Images (OPTIONAL BUT RECOMMENDED)

For more polish:

- [ ] Create `assets/images/` folder
- [ ] Add project screenshots/mockups (320x200px ideal)
- [ ] Replace placeholder divs with `<img>` tags
- [ ] Example:
  ```html
  <img src="../assets/images/project-name.jpg" 
       alt="Project Name"
       style="width: 100%; height: 200px; object-fit: cover;">
  ```

### Priority 5: Customize Games (OPTIONAL)

If you have your own games:

- [ ] Update game #1 title, description, link
- [ ] Update game #2 title, description, link
- [ ] Update game #3 title, description, link
- [ ] Create custom game pages or link to live games

### Priority 6: Fine-Tuning (OPTIONAL)

- [ ] **Change accent colors** (edit `css/styles.css` :root variables)
- [ ] **Change fonts** (edit font imports in `index.html` line 7-8)
- [ ] **Adjust spacing** (edit `--spacing-*` variables in CSS)
- [ ] **Add or remove sections** (edit HTML structure)
- [ ] **Customize About stats** (lines ~96-108)

---

## 🎨 Color Customization

Edit `css/styles.css` lines 5-7 to change the color scheme:

```css
--color-primary: #1a3a52;    /* Main blue — change this */
--color-secondary: #f5a623;  /* Gold accent — change this */
--color-accent: #ff6b35;     /* Orange accent — change this */
```

All other colors in the design system automatically adjust based on these three primary colors.

---

## 📱 What's Already Responsive

✅ All sections automatically stack on mobile
✅ Images scale proportionally
✅ Navigation collapses on small screens
✅ Card grids adapt to screen size
✅ Touch-friendly buttons and links

**Test on mobile:** Use Chrome DevTools (F12 → Device Toolbar)

---

## 🌙 Dark Mode

**Already Built In:**
- Detects system preference (light/dark)
- Manual toggle in navbar (sun/moon icon)
- Saves user preference to localStorage
- Smooth transition between modes

**No customization needed** — it works out of the box!

---

## 🚀 Deployment Checklist

Before you deploy:

- [ ] All personal information updated
- [ ] All placeholder text replaced
- [ ] All links work and point to correct pages
- [ ] Images load properly
- [ ] Tested on mobile
- [ ] Dark mode toggled and works
- [ ] Resume PDF added and linked

Deploy to GitHub Pages:
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git branch -M main
git push -u origin main
```

Then visit: `https://YOUR_USERNAME.github.io`

---

## 📊 File Structure Summary

```
PORTFOLIO/
├── index.html                    # Main page — START HERE
├── README.md                     # Full documentation
├── QUICK_START.md               # 10-minute setup guide
├── PORTFOLIO_CONTENTS.md        # This file
├── .gitignore                   # Git ignore rules
├── resume.pdf                   # YOUR resume (add this)
│
├── css/
│   ├── styles.css               # Main styles (don't need to edit)
│   └── dark-mode.css           # Dark mode (don't need to edit)
│
├── js/
│   ├── main.js                 # Navigation logic (don't need to edit)
│   ├── theme-toggle.js         # Theme switching (don't need to edit)
│   └── animations.js           # Scroll effects (don't need to edit)
│
├── projects/
│   ├── PROJECT_TEMPLATE.html   # Copy this for new projects
│   ├── personal-dashboard.html # Example — customize this
│   ├── gym-planner.html        # Example — customize this
│   └── landing-pages.html      # Example — customize this
│
├── games/
│   ├── flappy-bird.html        # Playable game
│   ├── choose-path.html        # Interactive game
│   └── guess-character.html    # Logic game
│
└── assets/ (CREATE IF USING IMAGES)
    └── images/
        ├── project-1.jpg
        ├── project-2.jpg
        └── ...
```

---

## 🎯 Content Writing Tips

### Project Descriptions
✅ **DO:**
- Be specific ("Shipped 25+ features")
- Show personality
- Explain the why, not just the what
- Include a measurable outcome

❌ **DON'T:**
- Use generic phrases ("Built a thing")
- Sound robotic or corporate
- List every single feature
- Make unsupported claims

### About Section
✅ **DO:**
- Tell your story
- Highlight what's unique about you
- Show your values and approach
- Be authentic

❌ **DON'T:**
- Sound like a job posting
- Exaggerate experience
- Use buzzwords without substance

### Experience Section
✅ **DO:**
- List actual skills you use
- Show your growth trajectory
- Include specific technologies
- Highlight unique projects

❌ **DON'T:**
- List languages you don't actually use
- Include irrelevant experience
- Make things up

---

## ✨ Quick Wins

To make your portfolio feel even more premium:

1. **Add real project images** (instead of gradient placeholders)
2. **Write compelling project descriptions** (3-4 sentences each)
3. **Link to actual GitHub repos** (proves your work)
4. **Include live demo links** (let people try your work)
5. **Update regularly** (add projects as you ship them)

---

## 🔧 Common Customizations

### Change Default Theme (Dark Instead of Light)
In `js/theme-toggle.js`, line 10:
```javascript
let isDarkMode = true; // Change from: savedTheme ? savedTheme === 'dark' : prefersDark;
```

### Add More Project Cards
Copy this template in the projects-grid section:
```html
<div class="project-card" data-project="id">
    <div class="project-image">
        <img src="../assets/images/project.jpg" alt="Title">
    </div>
    <div class="project-content">
        <h3>Project Title</h3>
        <p>Description...</p>
        <div class="project-tags">
            <span class="tag">Tech</span>
        </div>
        <div class="project-actions">
            <a href="projects/page.html" class="btn btn-text">Learn More →</a>
        </div>
    </div>
</div>
```

### Remove a Section
Simply delete the entire `<section>` block and its closing tag. Update the nav links accordingly.

---

## ✅ You're Ready!

This portfolio is:
- ✅ **Fully functional** — Works right now
- ✅ **Customizable** — Easy to make it yours
- ✅ **Responsive** — Looks great everywhere
- ✅ **Professional** — Premium design quality
- ✅ **Deployable** — One `git push` to go live

**Next Step:** Open `QUICK_START.md` and follow the steps!

---

**Built with curiosity and care.** Update it often. Make it personal. Make it true.
