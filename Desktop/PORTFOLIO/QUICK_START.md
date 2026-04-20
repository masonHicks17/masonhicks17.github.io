# Quick Start Guide

Get your portfolio live in minutes. Follow these steps in order.

## 1. Update Personal Information (5 min)

Open `index.html` and find these lines. Update them with your info:

**Line 38** — Your Name (Hero Section)
```html
<h1 class="hero-title">Mason Hicks</h1>
```
Change to:
```html
<h1 class="hero-title">Your Name</h1>
```

**Line 39** — Tagline (Hero Section)
```html
<p class="hero-tagline">AI-Assisted Builder exploring practical ideas into memorable experiences</p>
```
Update to your own tagline.

**Line 40-41** — Hero Description
Update the paragraph to reflect your own story.

**Line 261** — Contact Email
```html
<a href="mailto:mason@example.com" class="contact-card">
```
Change to your email address.

**Line 264** — LinkedIn URL
```html
<a href="https://linkedin.com/in/masonhicks" class="contact-card">
```

**Line 270** — GitHub URL
```html
<a href="https://github.com/masonhicks" class="contact-card">
```

## 2. Update Project Cards (10 min)

For each project card around line 111, update:
- Title (line ~113)
- Description (line ~114)
- Tags (line ~116-118)
- Link href (line ~122)

**Example:**
```html
<div class="project-card" data-project="my-project">
    <div class="project-image">
        <div class="placeholder-image placeholder-1"></div>
    </div>
    <div class="project-content">
        <h3>My Cool Project</h3>
        <p>A short description of what it does and why it matters.</p>
        <div class="project-tags">
            <span class="tag">React</span>
            <span class="tag">Design</span>
            <span class="tag">Personal</span>
        </div>
        <div class="project-actions">
            <a href="projects/my-project.html" class="btn btn-text">Learn More →</a>
        </div>
    </div>
</div>
```

**To add a project image:**
1. Save your image as `project-name.jpg` in an `assets/images/` folder
2. Replace the placeholder div with:
```html
<img src="../assets/images/project-name.jpg" alt="Project Name" style="width: 100%; height: 200px; object-fit: cover;">
```

## 3. Add Project Detail Pages (15 min each)

For each project, you need a detail page:

1. Copy `projects/PROJECT_TEMPLATE.html`
2. Rename to `projects/your-project-name.html`
3. Fill in all [PLACEHOLDER] sections
4. Save and test locally

## 4. Update Experience Section (5 min)

Around line 189-217, update:
- Your skills (lines 197-209)
- Your experience highlights (lines 210-221)

## 5. Add Your Resume (2 min)

1. Export your resume as a PDF
2. Save as `resume.pdf` in the root folder
3. The download button will automatically link to it

## 6. Test Everything Locally (5 min)

1. Open `index.html` in your browser
2. Click through all sections
3. Test the dark mode toggle (sun/moon icon)
4. Test all navigation links
5. Verify images load correctly
6. Check on mobile (use browser dev tools)

## 7. Deploy to GitHub Pages (5 min)

### Step A: Create a GitHub Repository
1. Go to [github.com/new](https://github.com/new)
2. Name it: `<your-username>.github.io` (replace with your actual GitHub username)
3. Make it Public
4. Create the repository

### Step B: Push Your Portfolio
Open Terminal/Command Prompt in your portfolio folder and run:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git remote add origin https://github.com/YOUR_USERNAME/YOUR_USERNAME.github.io.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` with your actual GitHub username.

### Step C: Verify Deployment
1. Wait 1-2 minutes
2. Visit `https://<your-username>.github.io`
3. Your portfolio is live! 🎉

## Optional: Use a Custom Domain

If you have a custom domain:
1. Go to repository Settings → Pages
2. Under "Custom domain," enter your domain
3. Follow GitHub's DNS setup instructions
4. Your portfolio will be at `https://yourdomain.com`

## Tips & Best Practices

### Before You Deploy:
- [ ] Tested on mobile (use Chrome DevTools)
- [ ] All links work and point to correct pages
- [ ] Images load properly
- [ ] No placeholder text remaining
- [ ] Contact information is accurate
- [ ] Resume PDF is linked correctly

### After You Deploy:
- [ ] Share the link with friends/mentors
- [ ] Get feedback on content and design
- [ ] Update regularly as you ship new projects
- [ ] Monitor GitHub for any issues

### Common Issues:

**Images not showing?**
- Verify file paths are correct
- Images should be in `assets/images/` folder
- Check that the `src` path matches exactly

**Links broken?**
- Make sure project detail pages exist
- Verify href paths are correct
- Test locally first before deploying

**Dark mode not working?**
- Clear browser cache
- Reload the page
- Check browser console for errors

**GitHub Pages not updating?**
- Wait 1-2 minutes after pushing
- Clear your browser cache
- Check that commits were actually pushed (run `git log`)

## Next Steps

1. **Add more projects** — Copy the template and create detail pages
2. **Add more games** — Same process as projects
3. **Customize colors** — Edit CSS variables in `css/styles.css`
4. **Connect analytics** — Add Google Analytics tracking (optional)
5. **Set up a contact form** — Use Formspree or Basin for email submissions

## Helpful Resources

- [GitHub Pages Documentation](https://pages.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [HTML/CSS Reference](https://developer.mozilla.org/en-US/)
- [Markdown Guide](https://www.markdownguide.org/)

## Support

Stuck? Check:
1. `README.md` for full documentation
2. Code comments in HTML files
3. Example files (`personal-dashboard.html`, etc.)
4. `PROJECT_TEMPLATE.html` for structure

---

**You've got this!** Your portfolio is now ready to show the world what you can build. Update it regularly as you ship new projects, and keep the content honest and personal.
