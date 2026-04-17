# Design Architecture — SentinalHills Agency Website

**Version:** 1.0  
**Stack:** Next.js 14 App Router + Convex + Tailwind CSS  
**Design Philosophy:** Dark, premium, tech-forward — authority without arrogance

---

## 1. Design Identity

### 1.1 Brand Positioning
SentinalHills sits at the intersection of elite technology and African business pragmatism. The design must say: *"We are world-class, and we understand your market."* It should feel like a high-end global agency, not a typical Nairobi freelancer page.

### 1.2 Visual Personality
- **Dark & premium** — dark backgrounds with accent colours. Inspires trust and signals technical sophistication.
- **Precise & clean** — generous whitespace, tight typography, no clutter
- **Alive** — subtle animations and micro-interactions that demonstrate the agency's technical skill
- **Confident** — bold headlines, direct copy, no corporate waffle

---

## 2. Colour System

### Primary Palette
```
--color-bg-base:        #0A0A0F    /* Near-black page background */
--color-bg-surface:     #111118    /* Card and section backgrounds */
--color-bg-elevated:    #1A1A24    /* Hover states, modals */
--color-bg-border:      #2A2A3A    /* Subtle borders */

--color-accent-primary: #6C63FF    /* Electric violet — primary CTA, links */
--color-accent-hover:   #8B85FF    /* Lighter violet on hover */
--color-accent-glow:    #6C63FF33  /* Violet glow for effects */

--color-kenya-green:    #1D9E75    /* Kenyan green — trust, success, secondary CTA */
--color-kenya-hover:    #22B585

--color-text-primary:   #F0F0FF    /* Near-white body text */
--color-text-secondary: #9999BB    /* Muted paragraphs */
--color-text-tertiary:  #5A5A7A    /* Labels, captions */

--color-success:        #22C55E
--color-warning:        #F59E0B
--color-error:          #EF4444
```

### Usage Rules
- Page background: always `--color-bg-base`
- Cards/sections: `--color-bg-surface`
- Primary CTAs: `--color-accent-primary` background, white text
- Secondary CTAs: transparent with `--color-kenya-green` border, `--color-kenya-green` text
- Never use pure black (#000) or pure white (#fff) — use the palette values

---

## 3. Typography

### Font Stack
```css
/* Headlines */
font-family: 'Syne', sans-serif;
/* Weight: 700 (hero), 600 (section heads), 500 (card titles) */

/* Body & UI */
font-family: 'Inter', sans-serif;
/* Weight: 400 (body), 500 (labels), 600 (buttons) */

/* Code snippets (tech stack display) */
font-family: 'JetBrains Mono', monospace;
```

Load via `next/font` for performance. No external font CDN requests.

### Type Scale
```
Hero headline:      clamp(2.5rem, 5vw, 4.5rem)   font: Syne 700
Section headline:   clamp(1.75rem, 3vw, 2.75rem)  font: Syne 600
Card title:         1.25rem                         font: Syne 500
Body large:         1.125rem   line-height: 1.75   font: Inter 400
Body:               1rem       line-height: 1.7    font: Inter 400
Small/Label:        0.875rem   line-height: 1.5    font: Inter 500
Caption:            0.75rem                         font: Inter 400
```

### Copy Tone
- Headlines: direct, outcome-focused ("We build automations that print money while you sleep")
- Body: confident but human, no buzzwords
- CTAs: action verbs ("Get your free audit", "See how it works", "Start building")
- Never: "We are passionate about...", "leverage synergies", "world-class solutions"

---

## 4. Component Library

### 4.1 Buttons

**Primary Button**
```
Background: #6C63FF
Text: #FFFFFF  font: Inter 600  size: 0.9375rem
Padding: 0.75rem 1.75rem
Border-radius: 8px
Hover: background #8B85FF, translateY(-1px), box-shadow 0 8px 25px #6C63FF40
Active: translateY(0)
Transition: all 0.2s ease
```

**Secondary Button**
```
Background: transparent
Border: 1.5px solid #1D9E75
Text: #1D9E75  font: Inter 600
Padding: 0.75rem 1.75rem
Border-radius: 8px
Hover: background #1D9E7515, text #22B585
```

**Ghost Button**
```
Background: transparent
Border: 1px solid #2A2A3A
Text: #9999BB
Hover: border-color #5A5A7A, text #F0F0FF
```

### 4.2 Cards

**Service Card**
```
Background: #111118
Border: 1px solid #2A2A3A
Border-radius: 16px
Padding: 2rem
Hover: border-color #6C63FF60, box-shadow 0 0 40px #6C63FF10
Transition: all 0.3s ease

Structure:
- Icon area: 48x48px, accent-colored background (#6C63FF15), border-radius 12px
- Title: Syne 500 1.25rem #F0F0FF, margin-top 1.25rem
- Description: Inter 400 1rem #9999BB, margin-top 0.5rem
- CTA link: Inter 500 0.875rem #6C63FF, arrow icon, margin-top 1.5rem
```

**Testimonial Card**
```
Background: #111118
Border: 1px solid #2A2A3A
Border-radius: 16px
Padding: 1.75rem
Quote mark: Syne 700 4rem #6C63FF20, absolute positioned top-left
```

**Case Study Card (Work page)**
```
Background: #111118
Border-radius: 16px
Overflow: hidden
Image area: 240px tall, object-fit cover, slight dark overlay
Tags: small pills, #6C63FF15 bg, #6C63FF text, border-radius 999px
Result badge: bottom-left overlay, #22C55E text on dark bg
```

### 4.3 Form Elements

**Text Input**
```
Background: #111118
Border: 1px solid #2A2A3A
Border-radius: 8px
Padding: 0.875rem 1rem
Text: #F0F0FF  placeholder: #5A5A7A
Focus: border-color #6C63FF, box-shadow 0 0 0 3px #6C63FF20
Font: Inter 400 1rem
Height: 48px (inputs), auto (textarea min-height 120px)
```

**Select / Dropdown**
```
Same as text input
Custom arrow icon (SVG), #9999BB colour
```

**Radio / Choice buttons (Step 1 of form)**
```
Full-width button-style options
Background: #111118
Border: 1px solid #2A2A3A
Border-radius: 10px
Padding: 1rem 1.25rem
Checked state: border-color #6C63FF, background #6C63FF10
Transition: all 0.15s ease
```

**Progress Bar (multi-step form)**
```
Track: #2A2A3A, height 3px, border-radius 999px
Fill: #6C63FF, animated with CSS transition
Step indicators: small circles, filled for completed steps
```

### 4.4 Navigation

**Desktop Nav**
```
Background: #0A0A0F with backdrop-blur on scroll (rgba(10,10,15,0.85))
Height: 72px
Logo: left-aligned, Syne 700
Links: Inter 500 0.9375rem #9999BB, hover #F0F0FF
Active: #F0F0FF with small underline dot
CTA button: Primary button style, right-aligned
Border-bottom on scroll: 1px solid #2A2A3A
```

**Mobile Nav**
```
Hamburger: animated to X on open
Drawer: full-screen overlay, #0A0A0F background, slide from right
Links: large text, Syne 600 1.5rem
WhatsApp CTA: sticky at bottom of drawer
```

---

## 5. Page Layouts

### 5.1 Homepage Layout

```
┌─────────────────────────────────────────┐
│  NAV (sticky, 72px)                     │
├─────────────────────────────────────────┤
│  HERO                                   │
│  ┌─────────────────┐  ┌───────────────┐ │
│  │ Headline        │  │ Animation /   │ │
│  │ Subheadline     │  │ Code visual   │ │
│  │ CTA buttons     │  │               │ │
│  └─────────────────┘  └───────────────┘ │
│  min-height: 90vh, centered content     │
├─────────────────────────────────────────┤
│  TRUST BAR — scrolling logos / stats   │
│  border-top + border-bottom: #2A2A3A   │
├─────────────────────────────────────────┤
│  SERVICES (section bg: #0A0A0F)        │
│  Headline centred                       │
│  2x2 card grid (desktop), 1 col mobile │
├─────────────────────────────────────────┤
│  HOW IT WORKS (bg: #111118)            │
│  3-step horizontal layout              │
│  Connected with dashed line            │
├─────────────────────────────────────────┤
│  FEATURED CASE STUDY                   │
│  Split: left text, right result card   │
├─────────────────────────────────────────┤
│  TESTIMONIALS (bg: #111118)            │
│  3-col grid desktop, swipeable mobile  │
├─────────────────────────────────────────┤
│  CTA SECTION                           │
│  Centered, violet glow bg effect       │
│  Headline + form inline or button      │
├─────────────────────────────────────────┤
│  FOOTER                                │
│  4-col grid: Logo+desc / Services /    │
│  Links / Contact                       │
│  WhatsApp button bottom-right fixed    │
└─────────────────────────────────────────┘
```

### 5.2 Section Spacing System
```
Section padding:    py-24 (6rem) desktop, py-16 (4rem) mobile
Container max-width: 1200px, mx-auto, px-6
Content max-width:  760px for centred text sections
Grid gaps:          gap-8 (2rem) cards, gap-6 (1.5rem) form fields
```

---

## 6. Animation & Motion

### 6.1 Principles
- All animations serve purpose — they reveal information or signal state
- Duration: 200ms (micro), 350ms (transitions), 600ms (entrance)
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` for entrances, `ease` for hovers
- Respect `prefers-reduced-motion: reduce` — disable all non-essential animations

### 6.2 Entrance Animations
Use `Framer Motion` with `viewport` trigger (animate when element enters viewport):
```
Cards: fade up (y: 20 → 0, opacity: 0 → 1), staggered 0.1s delay
Section headlines: fade up, 0.6s duration
Hero: fade in on load, no scroll trigger
```

### 6.3 Hero Animation
Animated code/terminal visual (right side of hero):
- Dark terminal window component
- Typewriter effect cycling through automation examples:
  - "WhatsApp bot captured 47 leads today..."
  - "M-Pesa payment confirmed → Invoice sent..."
  - "Lead qualified → Sales team notified..."
- Use `useEffect` + `setTimeout` for typewriter, not a heavy library

### 6.4 Hover States
```
Cards: border glow (violet), subtle scale(1.01)
Buttons: translateY(-1px), shadow intensification
Nav links: colour transition 0.15s
```

### 6.5 Form Step Transitions
```
Between steps: slide left/fade out → slide right/fade in
Progress bar: smooth width transition 0.4s
```

---

## 7. Responsive Breakpoints

```
Mobile:   < 640px   (1 column layouts, full-width elements)
Tablet:   640–1024px (2 column grids)
Desktop:  > 1024px  (full layouts as designed)
Wide:     > 1280px  (container capped at 1200px, centered)
```

Tailwind config:
```js
screens: {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
}
```

---

## 8. Icon System

Use `lucide-react` for all UI icons (consistent, tree-shakeable, MIT license).

Service icons — use custom SVG illustrations (simple, 2-colour, 48x48):
- Lead generation: funnel with arrow
- Website: browser window with spark
- App: phone with circuit
- SaaS: cloud with gears

WhatsApp button: official WhatsApp SVG icon (green #25D366)

---

## 9. Image Strategy

- Hero: no photography — code/terminal animation instead (no licensing issues)
- Case study cards: abstract gradient placeholder images (CSS-generated, no external)
- Team photos: placeholder avatar with initials (add real photos later)
- OG image: generated via `@vercel/og` — dynamic, branded
- All images: next/image with proper width/height, loading="lazy" (except above fold)
- Format: WebP with JPEG fallback

---

## 10. Admin Dashboard Design

### Layout
```
┌─────────────┬─────────────────────────────┐
│  SIDEBAR    │  MAIN CONTENT               │
│  72px wide  │                             │
│  (desktop)  │  ┌─────┐ ┌─────┐ ┌─────┐  │
│             │  │Stat │ │Stat │ │Stat │  │
│  - Leads    │  └─────┘ └─────┘ └─────┘  │
│  - Analytics│                             │
│  - Settings │  ┌───────────────────────┐  │
│             │  │  LEADS TABLE          │  │
│  Logo top   │  │  sortable, filterable │  │
│  Logout bot │  └───────────────────────┘  │
└─────────────┴─────────────────────────────┘
```

### Admin Colour Override
Admin uses a lighter theme:
```
Background: #F8F8FC
Surface: #FFFFFF
Text: #1A1A2E
Border: #E5E5F0
Accent: #6C63FF (same)
```

This makes the admin feel distinct from the public site and reduces eye strain during long use.

---

## 11. WhatsApp Floating Button

```
Position: fixed bottom-right (bottom: 24px, right: 24px)
Size: 60px diameter circle
Background: #25D366 (WhatsApp green)
Icon: WhatsApp SVG, 28px, white
Box-shadow: 0 4px 20px #25D36640
Hover: scale(1.08), shadow intensify
Pulse animation: subtle ring expanding outward (attention-grabbing but not annoying)
z-index: 9999
Hidden on: /admin routes
```

---

## 12. Accessibility Checklist

- [ ] All colour contrast ratios meet WCAG AA (4.5:1 for body text)
- [ ] All interactive elements reachable and operable via keyboard
- [ ] Focus styles visible (violet outline: `focus-visible:ring-2 ring-accent-primary`)
- [ ] All images have descriptive `alt` attributes
- [ ] Form inputs have associated `<label>` elements
- [ ] Error messages programmatically associated with form fields
- [ ] Skip-to-content link at top of page
- [ ] ARIA roles on nav, main, aside
- [ ] Screen reader tested with VoiceOver (macOS) and NVDA (Windows)
