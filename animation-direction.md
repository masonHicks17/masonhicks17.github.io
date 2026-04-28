# Animation Direction

## Goal

Create a refined scroll animation system that feels calm, premium, and intentional across desktop and mobile.

The animation system should:

- support the portfolio without distracting from the content
- improve hierarchy and perceived polish
- remain lightweight on mobile
- respect `prefers-reduced-motion`
- avoid flashy effects, spinning, bouncing, or anything that hurts readability

## Core Motion Language

The motion style should feel:

- subtle
- smooth
- restrained
- premium
- calm
- structurally helpful

Motion should reinforce layout and sequencing, not call attention to itself.

## Main Behaviors

### Section reveal

Use a simple reveal pattern for major content blocks:

- initial state: slightly lower position with reduced opacity
- reveal state: fade in and move upward a small amount
- keep distance modest so it feels polished, not floaty

Suggested behavior:

- opacity from `0` to `1`
- translateY from `18px` to `0`
- duration around `500ms` to `700ms`
- easing should feel soft and controlled

Suggested class:

- `.reveal`

### Staggered card reveal

Use staggered reveal for project cards, game cards, workflow steps, stat cards, and contact cards.

Suggested behavior:

- same base reveal as `.reveal`
- short stagger between sibling items
- keep delays tight so the interface still feels responsive

Suggested timing:

- stagger interval around `60ms` to `100ms`

Suggested class:

- `.reveal-stagger`

### Hero floating motion

Desktop only:

- allow the hero visual to have a very subtle floating or drift effect
- this should be almost imperceptible and should never affect readability
- use only on non-text hero media

Suggested class:

- `.float-subtle`

### Soft parallax

Desktop only:

- allow a subtle parallax offset on the hero media or large decorative layer
- keep movement shallow
- disable on mobile and on reduced-motion environments

Suggested class:

- `.parallax-soft`

## Desktop Behavior

Desktop can support a bit more depth, but keep it refined.

Recommended desktop behavior:

- reveal sections as they enter the viewport
- use staggered reveals in grids
- allow very subtle hero floating
- allow very subtle parallax for hero visuals only
- keep hover transitions understated and tied to elevation, border, or shadow changes

Do not:

- animate large layout shifts
- use exaggerated transforms
- animate text in a flashy or delayed way that slows reading

## Mobile Behavior

Mobile should feel smooth and efficient.

Recommended mobile behavior:

- keep section reveal and card reveal
- reduce transform distance and overall duration slightly if needed
- disable parallax entirely
- disable continuous floating if it risks jank or visual noise
- prioritize perceived performance and readability

Mobile motion should feel nearly invisible in the best way.

## Accessibility Rules

Always support reduced motion.

When `prefers-reduced-motion: reduce` is present:

- remove parallax
- remove floating animation
- remove stagger delays if they slow comprehension
- reduce or eliminate movement transforms
- allow content to appear immediately or with minimal opacity transition only

Accessibility principles:

- motion must never hide content for too long
- motion must never make reading harder
- motion must never be required to understand page structure
- contrast and focus states matter more than animation polish

## Suggested Class Names

Use these names consistently if Claude implements the animation system:

- `.reveal`
- `.reveal-stagger`
- `.float-subtle`
- `.parallax-soft`
- `.is-visible`
- `.motion-safe`
- `.motion-reduce`

Possible pattern:

- `.reveal` for single content blocks
- `.reveal-stagger` on parent grids or grouped card containers
- `.is-visible` added by JavaScript when elements enter the viewport

## CSS Notes

Base reveal styling can follow this pattern conceptually:

- hidden state uses lower opacity and slight translateY
- visible state restores full opacity and neutral transform
- transitions should use a soft cubic-bezier curve

Keep transitions consistent across the site so motion feels authored as one system.

Suggested CSS concerns:

- avoid long delays on important content
- ensure animations do not conflict with hover states
- keep GPU-heavy effects minimal
- avoid blur-heavy animated layers on mobile

## JavaScript Notes for `js/animations.js`

Use Intersection Observer for reveals.

Recommended implementation approach:

1. Select all `.reveal` elements.
2. Observe them with Intersection Observer.
3. Add `.is-visible` when they cross the threshold.
4. For `.reveal-stagger` groups, apply incremental transition delay to child items.
5. Skip or simplify motion if reduced motion is enabled.

Recommended observer behavior:

- threshold around `0.1` to `0.2`
- root margin can reveal slightly before full entry
- unobserve elements after reveal for efficiency

For stagger groups:

- find children that should animate
- set stagger delay via inline style or CSS custom property
- keep the number of animated children manageable

For parallax:

- only bind parallax logic on desktop-width conditions
- only bind if reduced motion is not enabled
- throttle or keep calculations simple
- hero media only, never text containers

For floating:

- only apply to non-essential decorative or media elements
- use CSS keyframes rather than constant JS updates
- disable on mobile if it affects smoothness

## Implementation Safety Notes

- Motion should enhance the final portfolio, not become its identity.
- If any animation feels distracting in testing, simplify it.
- Desktop polish is welcome, but mobile smoothness matters more.
- Readability and calmness should always win over spectacle.
