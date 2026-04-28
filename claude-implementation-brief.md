# Claude Implementation Brief

## Objective

Implement the final chosen direction for Mason Hicks' portfolio.

This direction is now locked:

- keep the sharper elegant qualities from the best mockup
- shift the palette toward cream, parchment, charcoal, warm gray, and muted olive
- keep the site modern, tech-oriented, masculine, and appropriate for a student portfolio
- preserve the standard portfolio structure
- preserve dark mode support
- ensure the design works well on desktop and mobile

Do not treat this as a broad redesign exploration. This is a focused implementation brief for one final direction.

## What To Change

### 1. Update the visual system

Revise the design system in the homepage and shared styles so the site reflects the new palette and tone.

Target outcomes:

- warm cream / ivory main backgrounds
- parchment or soft beige surfaces
- charcoal / near-black text
- warm gray muted text
- light taupe borders
- muted olive or sage as the main accent
- muted brass or tan only as a secondary accent in small amounts

Dark mode should also be updated so it feels intentionally designed:

- deep charcoal background
- dark graphite surfaces
- warm off-white text
- soft gray muted text
- dark olive-gray borders
- muted sage/olive accent that is slightly brighter than light mode

### 2. Redesign the homepage presentation

Keep the same overall homepage structure:

- hero
- about
- projects
- workflow
- experience
- contact

Do not invent a new architecture unless absolutely necessary.

Within that structure:

- make the hero feel more premium and product-forward
- keep the layout clean and typical for a portfolio
- improve section pacing and visual hierarchy
- reduce the sense that every section uses the same treatment

### 3. Replace placeholder media treatment

Replace generic placeholder gradient blocks with reusable screenshot or mockup containers.

Important:

- do not require final images yet
- create media containers that look intentional even before final screenshots are dropped in
- keep them reusable across homepage cards and any supporting project sections

Heavy Lifting should feel like the strongest featured project, but the site should not become a fitness brand.

### 4. Implement safe refined scroll animation

Create a calm, premium motion system based on the animation direction.

Include:

- section fade-in with slight upward movement
- staggered project and card reveals
- subtle hero float or parallax on desktop only
- lightweight behavior on mobile
- `prefers-reduced-motion` support

The motion should never overpower readability or performance.

## What Not To Change

- Do not rewrite the site from scratch.
- Do not change the core content structure unless required for clarity.
- Do not remove existing project content.
- Do not break or remove existing links.
- Do not turn the portfolio into a dramatic brand site or startup landing page.
- Do not use purple-heavy colors, neon AI aesthetics, or flashy motion.
- Do not require final imagery before the layout can look good.

## Content and Link Preservation

Preserve existing project content and links.

That means:

- keep the current project copy unless Mason asks for copy changes
- keep current navigation targets
- keep current project links
- if a visual treatment changes, the content should still map cleanly to the existing information

Project pages should only be touched if needed for consistency. If the homepage implementation can be done cleanly without editing project pages, prefer that.

## Likely Files To Touch

Primary files:

- [`/Users/masonhicks/Desktop/PORTFOLIO - Claude/index.html`](</Users/masonhicks/Desktop/PORTFOLIO - Claude/index.html>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Claude/css/styles.css`](</Users/masonhicks/Desktop/PORTFOLIO - Claude/css/styles.css>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Claude/css/dark-mode.css`](</Users/masonhicks/Desktop/PORTFOLIO - Claude/css/dark-mode.css>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Claude/js/animations.js`](</Users/masonhicks/Desktop/PORTFOLIO - Claude/js/animations.js>)

Secondary only if needed for consistency:

- project pages in `/projects/`

## Homepage Guidance by Section

### Hero

- Keep it recognizably portfolio-like.
- Strengthen hierarchy and polish.
- Use a premium visual area with reusable mockup or screenshot framing.
- Support both desktop and mobile layouts cleanly.
- Olive should appear in buttons, active details, or key emphasis rather than overwhelming the hero.

### About

- Keep this section clear and credible.
- Use improved spacing and surface styling, not unnecessary complexity.

### Projects

- This should become the strongest proof section.
- Heavy Lifting should read as the flagship project through hierarchy and media treatment.
- Secondary projects should still feel cohesive and credible.
- Replace generic placeholder gradients with reusable media frames.

### Workflow

- Preserve the section because it is part of Mason's differentiation.
- Present it with more polish and structure.
- Keep it readable and not overly decorative.

### Experience

- Maintain a clean professional look.
- Let typography, spacing, and surface treatment do most of the work.

### Contact

- Keep it simple, clear, and well finished.
- Do not overdesign this section.

## Design Rules

- Light mode should be the flagship visual experience.
- Dark mode must remain fully functional.
- Desktop and mobile must both feel intentional.
- Use a warm cream base instead of bright white.
- Use muted olive or sage as the primary accent.
- Use secondary brass or tan sparingly.
- Keep serif usage restrained and elegant.
- Keep the overall tone modern, masculine, calm, and premium.
- Use motion as support, not as spectacle.

## Animation Rules

Implement scroll animations safely:

- use Intersection Observer in `js/animations.js`
- reveal sections with slight upward fade
- stagger cards lightly
- allow subtle desktop-only hero motion
- disable parallax on mobile
- support `prefers-reduced-motion`
- keep interactions lightweight and readable

If any motion causes visual noise or performance issues, simplify it.

## Supporting Docs To Use

Claude should use these handoff files from the Codex design worktree:

- [`/Users/masonhicks/Desktop/PORTFOLIO - Codex/design-directions.md`](</Users/masonhicks/Desktop/PORTFOLIO - Codex/design-directions.md>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Codex/image-prompts/homepage-hero.md`](</Users/masonhicks/Desktop/PORTFOLIO - Codex/image-prompts/homepage-hero.md>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Codex/image-prompts/heavy-lifting-mockup.md`](</Users/masonhicks/Desktop/PORTFOLIO - Codex/image-prompts/heavy-lifting-mockup.md>)
- [`/Users/masonhicks/Desktop/PORTFOLIO - Codex/animation-direction.md`](</Users/masonhicks/Desktop/PORTFOLIO - Codex/animation-direction.md>)

## Final Implementation Intent

The finished site should feel like a clear upgrade in taste and polish without losing the accessibility and clarity of a typical portfolio.

It should look:

- more authored
- more premium
- more modern
- more grounded

But it should still feel like Mason Hicks' portfolio, not a totally different product or brand.
