# Coding Agent Prompts — SentinalHills Agency Website

**Purpose:** These prompts guide a coding agent (Cursor, Windsurf, Claude Code, or similar) to build the SentinalHills website safely, securely, and to production standard. Read the entire file before starting. Use each prompt in order.

---

## MASTER CONTEXT PROMPT
> Use this at the start of every new session with your coding agent

```
You are a senior full-stack engineer building the SentinalHills agency website — a production-grade marketing and lead generation site for an AI automation agency based in Nairobi, Kenya.

Tech stack:
- Next.js 14 with App Router (TypeScript, strict mode)
- Convex as the backend (real-time database + serverless functions)
- Tailwind CSS for styling
- Framer Motion for animations
- Zod for input validation

Core rules you must follow on every file you write:

SECURITY:
1. Never put secret keys or API keys in client components or any file prefixed with NEXT_PUBLIC_
2. Always validate ALL user input with Zod on both client AND server (Convex mutation)
3. All admin routes must check authentication before returning any data
4. Never log PII (emails, phone numbers) to console or error tracking
5. Sanitise all string inputs — trim whitespace, escape special characters
6. Rate limit all public-facing mutations in Convex

TYPESCRIPT:
7. No `any` types — ever. Use proper types or `unknown` with type guards
8. All Convex query/mutation return types must be explicitly typed
9. All component props must have defined interfaces
10. Use strict null checks — handle undefined and null explicitly

NEXT.JS:
11. Mark components 'use client' only when they use hooks or browser APIs. Everything else is a Server Component by default
12. Use next/image for ALL images — never raw <img> tags
13. Use next/font for ALL fonts — never link tags or @import in CSS
14. Every page must export generateMetadata for SEO
15. Never fetch data in client components when it can be done in a server component

CONVEX:
16. Never expose internal Convex function names in client error messages
17. All queries that return sensitive data must check ctx.auth first
18. Use Convex indexes for all filtered queries — never scan entire tables
19. Mutations must be idempotent where possible

CODE QUALITY:
20. No console.log in production code — use proper error boundaries
21. All async operations must have try/catch with meaningful error handling
22. Components must be under 200 lines — split into smaller pieces if longer
23. No inline styles except for dynamic values that cannot be expressed in Tailwind

When you are unsure about a security decision, choose the more restrictive option and explain why.
```

---

## PROMPT 1 — Project Initialisation

```
Initialise the SentinalHills Next.js project with this exact setup:

1. Create a new Next.js 14 project with TypeScript, App Router, Tailwind CSS, and ESLint:
   npx create-next-app@latest sentinalhills --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"

2. Install all required dependencies:
   npm install convex framer-motion lucide-react zod resend clsx tailwind-merge

3. Configure tailwind.config.ts with:
   - Custom colours matching our design system (all defined as CSS variables, referenced in Tailwind as 'var(--color-name)')
   - Custom font variables: --font-syne, --font-inter, --font-mono
   - Extended border radius: 'card': '16px', 'btn': '8px'

4. Create globals.css with ALL CSS custom properties defined on :root (colours, fonts, spacing)

5. Set up next.config.js with:
   - Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy)
   - Image domains: empty array (we use local images only for now)
   - TypeScript strict mode confirmed in tsconfig.json

6. Create .env.example with all required variables (no actual values)
   Create .gitignore ensuring .env.local is listed

7. Initialise Convex: npx convex dev (follow the prompts to create a new project)

8. Create the full folder structure as specified in the techstack document

Do NOT create any page content yet. Only project scaffolding. Show me the final folder tree when done.
```

---

## PROMPT 2 — Convex Schema & Backend

```
Create the complete Convex backend for SentinalHills. Follow these rules strictly:

FILE: convex/schema.ts
- Define the schema exactly as specified in the techstack document
- leads table with all fields, correct types, and all three indexes
- adminUsers table
- rateLimits table
- Use v.union with v.literal for all enum-style fields — never v.string() for constrained values

FILE: convex/leads.ts
Create these functions:

1. submitLead (mutation) — PUBLIC
   - Accept all lead form fields as arguments
   - Validate every field with Zod INSIDE the mutation before touching the database
   - Check rate limit: max 3 submissions per IP per hour using the rateLimits table
   - If rate limit exceeded: throw new ConvexError("Too many submissions. Please try again later.")
   - Sanitise all strings: trim whitespace, max length enforcement (name: 100, description: 2000, businessName: 200)
   - Validate email format with Zod email()
   - Validate WhatsApp number: must be numeric, 10-15 digits
   - Save to leads table with status: "new"
   - After saving, schedule a Convex action to send notification (do not block the mutation)
   - Return: { success: true, leadId: string }

2. getLeads (query) — ADMIN ONLY
   - First line: const identity = await ctx.auth.getUserIdentity(); if (!identity) throw new ConvexError("Unauthorized");
   - Accept optional filters: status, serviceType, dateFrom, dateTo
   - Use the appropriate index for filtering
   - Return leads sorted by _creationTime descending
   - Return: array of lead objects (include all fields)

3. updateLeadStatus (mutation) — ADMIN ONLY
   - Auth check first (same pattern as above)
   - Accept: leadId, status, optional notes
   - Validate status is one of the allowed literals
   - Update the lead record
   - Return: { success: true }

4. getLeadById (query) — ADMIN ONLY
   - Auth check
   - Accept leadId
   - Return full lead object or null

FILE: convex/http.ts
- Create an HTTP action that Convex calls after a lead is saved
- This calls the n8n webhook URL (from environment variable) with the lead data
- Include the webhook secret in the x-webhook-secret header
- Handle errors gracefully — if webhook fails, log to Convex (do not surface to user)
- Never put the webhook URL or secret in client-accessible code

Show me each file with complete, production-ready code. No placeholders.
```

---

## PROMPT 3 — Middleware & Authentication

```
Create the authentication and middleware system for SentinalHills admin.

FILE: middleware.ts (root level)
- Protect all routes under /admin/* 
- Check for an 'admin-session' HTTP-only cookie
- If cookie missing or invalid on admin route: redirect to /admin/login
- Public routes: pass through without any checks
- The matcher should cover /admin and all sub-paths
- Do NOT import Convex client in middleware — keep it lightweight (Edge runtime compatible)

FILE: convex/auth.ts
Create these functions:

1. adminLogin (action) — PUBLIC (but rate limited)
   - Accept email and password
   - Rate limit: max 5 failed attempts per IP per 15 minutes
   - Find admin user by email using the by_email index
   - Compare password using bcrypt (use the 'bcryptjs' package — add it to dependencies)
   - If invalid: throw new ConvexError("Invalid credentials") — same message for wrong email OR wrong password (do not reveal which)
   - If valid: generate a secure session token (crypto.randomUUID() + timestamp + secret)
   - Store session token hash in the adminUsers record (not the token itself)
   - Return the raw session token to be set as HTTP-only cookie by the API route
   - Update lastLoginAt timestamp

2. validateSession (query) — PUBLIC
   - Accept session token
   - Hash it and compare against stored hash
   - Return: { valid: boolean }

3. adminLogout (mutation)
   - Clear the session token from the adminUsers record
   - Return: { success: true }

FILE: app/api/admin/login/route.ts
- POST handler
- Calls the adminLogin Convex action
- On success: set 'admin-session' cookie with these attributes:
  httpOnly: true
  secure: true (production) / false (development)
  sameSite: 'lax'
  maxAge: 60 * 60 * 24 * 7 (7 days)
  path: '/'
- Return JSON { success: true } — no sensitive data in response body

FILE: app/api/admin/logout/route.ts
- POST handler
- Calls adminLogout Convex mutation
- Clear the admin-session cookie
- Redirect to /admin/login

FILE: app/(admin)/layout.tsx
- Server component
- Read the admin-session cookie from request headers
- Validate session via Convex
- If invalid: redirect('/admin/login')
- If valid: render children with admin layout (sidebar + main)

Ensure absolutely no admin data is accessible without a valid session. Test every edge case.
```

---

## PROMPT 4 — Lead Form Component

```
Build the multi-step lead capture form for SentinalHills. This is the most critical user-facing component.

FILE: lib/validations.ts
Define Zod schemas for each form step:

const step1Schema = z.object({
  serviceType: z.enum(['lead-generation', 'website', 'app', 'saas', 'unsure'])
})

const step2Schema = z.object({
  businessName: z.string().min(2).max(200).trim(),
  industry: z.string().min(1),
  website: z.string().url().optional().or(z.literal(''))
})

const step3Schema = z.object({
  description: z.string().min(20, 'Please describe your project in at least 20 characters').max(2000).trim(),
  budgetRange: z.string().min(1)
})

const step4Schema = z.object({
  fullName: z.string().min(2).max(100).trim(),
  email: z.string().email('Please enter a valid email address'),
  whatsappNumber: z.string().regex(/^\+?[\d\s\-]{10,15}$/, 'Please enter a valid WhatsApp number'),
  preferredContact: z.enum(['whatsapp', 'email', 'call']),
  referralSource: z.string().optional()
})

export const fullLeadSchema = step1Schema.merge(step2Schema).merge(step3Schema).merge(step4Schema)
export type LeadFormData = z.infer<typeof fullLeadSchema>

FILE: hooks/useLeadForm.ts
Custom hook managing:
- currentStep (1-4)
- formData (accumulated across steps)
- errors (per field)
- isSubmitting boolean
- isSuccess boolean

Functions:
- nextStep(stepData): validates current step with Zod, advances if valid
- prevStep(): goes back one step
- submitForm(stepData): validates full form, calls Convex mutation
- Reset state on unmount

FILE: components/forms/LeadForm.tsx
'use client' — this component needs hooks

- Renders correct step based on currentStep
- Shows progress bar (step X of 4)
- Step 1: Large radio-button-style choices for service type (full width, styled as cards)
- Step 2: Business name input, industry dropdown, website input (optional)
- Step 3: Description textarea with character count, budget dropdown
- Step 4: Name, email, WhatsApp number, contact preference, referral source
- Success screen: "We'll be in touch within 4 hours" with WhatsApp button
- Error screen: user-friendly message, retry button

Animations:
- Use Framer Motion AnimatePresence for step transitions (slide left/right)
- Progress bar animates smoothly between steps

Accessibility requirements:
- Every input has a visible <label> with htmlFor matching input id
- Error messages use role="alert" and are associated with the input via aria-describedby
- Step progression announced via aria-live="polite" region
- Keyboard navigation works correctly through all steps

Security:
- Never show raw error messages from Convex to users
- Map ConvexError messages to user-friendly strings:
  "Too many submissions..." → "You've submitted too many requests. Please wait an hour and try again."
  Any other error → "Something went wrong. Please try again or contact us on WhatsApp."
- Input maxLength attributes match server-side validation limits

Do not use any form library (React Hook Form, Formik). Native React state + Zod only.
```

---

## PROMPT 5 — Homepage

```
Build the SentinalHills homepage at app/(public)/page.tsx.

This is a Server Component. Only make individual sections 'use client' if they absolutely need client-side interactivity.

SECTION 1 — Hero (components/sections/Hero.tsx) — 'use client' for animation
- Left column: 
  - Small label above headline: "AI Automation Agency · Nairobi, Kenya"
  - Headline: "We automate the work that's costing your business money" (use clamp font size)
  - Subheadline: "Lead generation systems, intelligent websites, apps and SaaS — built with AI and delivered fast."
  - Two CTAs: Primary ("Get a free audit") → /contact, Secondary ("See our work") → /work
  - Small trust line below CTAs: "Response within 4 hours · WhatsApp friendly · Remote-ready"
- Right column:
  - Terminal/code animation component (TerminalAnimation.tsx — separate file)
  - Dark terminal window, typewriter cycling through 3 automation examples
  - Frame: rounded-2xl, dark bg, green terminal dots top-left
- Background: subtle radial gradient from accent colour at very low opacity (5%) centered behind hero, created with pure CSS — no image

SECTION 2 — Trust Bar (Server Component)
- Stats only (no external logos in Phase 1): "10+ Automations Built", "KES 2M+ Saved for Clients", "24hr Turnaround", "M-Pesa Integrated"
- Horizontal scrolling on mobile, static on desktop
- Thin top and bottom borders

SECTION 3 — Services (Server Component)
- Section headline: "What we build for you"
- 2x2 grid of ServiceCard components
- Each card: icon, title, one-line description, "Learn more →" link
- Cards defined in lib/constants.ts as an array — not hardcoded in JSX
- Hover animation: border glow (Framer Motion whileHover)

SECTION 4 — How It Works (Server Component)
- Section headline: "From conversation to live system"
- 3 steps: 1. Free Audit Call → 2. We Build It → 3. You Grow
- Desktop: horizontal with connecting dashed line
- Mobile: vertical stack
- Step numbers: large, accent-colored, Syne font

SECTION 5 — Case Study Teaser (Server Component)
- Left: text (problem, solution, result stat)
- Right: result card with metric (e.g. "0% lead loss rate" in large text)
- Background: slightly different surface color to break up the page

SECTION 6 — Testimonials ('use client' for mobile swipe)
- 3 testimonial cards
- Desktop: 3-column grid
- Mobile: horizontal scroll snap (no JS library — pure CSS scroll-snap)
- Testimonials defined in lib/constants.ts

SECTION 7 — CTA Section (Server Component)
- Headline: "Ready to stop losing leads?"
- Subheadline: "Book a free 30-minute audit. No commitment, no pitch deck."
- Primary CTA button → /contact
- WhatsApp CTA → wa.me link

All sections must:
- Have proper semantic HTML (section, h2, p — not all divs)
- Export generateMetadata from page.tsx with title, description, OG image
- Have smooth entrance animations triggered by viewport scroll (Framer Motion useInView)
- Be fully responsive at all breakpoints
- Have no hardcoded strings that appear in multiple places — use constants.ts
```

---

## PROMPT 6 — Navbar & Footer

```
Build the site-wide navigation and footer.

FILE: components/layout/Navbar.tsx — 'use client'
Desktop:
- Sticky top, height 72px
- Logo left: "SentinalHills" in Syne 700, with small green dot as bullet
- Nav links centre: Services, Work, About, Blog (Phase 2 — hidden for now)
- CTA right: Primary button "Get a free audit" → /contact
- On scroll (useScrolled hook, threshold 10px): add backdrop-blur and bottom border
- Active link detection: use Next.js usePathname()

Mobile:
- Hamburger button (lucide-react Menu/X icon, animated)
- Mobile menu: full-screen overlay, slide from right
  - Use Framer Motion AnimatePresence for enter/exit
  - Large nav links (Syne 600 1.5rem)
  - WhatsApp CTA at bottom: "Chat with us on WhatsApp" with WhatsApp icon
  - Close on route change (useEffect watching pathname)
  - Close on Escape key press
  - Trap focus inside open menu (accessibility requirement)
  - Add aria-expanded, aria-controls attributes to hamburger button

FILE: components/layout/Footer.tsx — Server Component
- 4-column grid desktop, 2-column tablet, 1-column mobile
- Column 1: Logo, tagline, social icons (LinkedIn, X/Twitter, GitHub)
- Column 2: Services links
- Column 3: Company (About, Work, Contact, Blog)
- Column 4: Contact (Email, WhatsApp number, "Nairobi, Kenya")
- Bottom bar: "© 2026 SentinalHills. Built with Next.js and AI."
- All links use next/link
- External links (social) have target="_blank" rel="noopener noreferrer"

FILE: components/layout/WhatsAppButton.tsx — 'use client'
- Fixed bottom-right (bottom: 24px, right: 24px) 
- 60px circle, WhatsApp green (#25D366)
- WhatsApp SVG icon (inline, not external CDN)
- Pulse animation: expanding ring using CSS @keyframes, NOT JavaScript
- Tooltip on hover: "Chat with us" (hidden on mobile)
- href: `https://wa.me/${NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Hi SentinalHills, I found your website and I'm interested in your services`
- Hide on /admin routes: check pathname with usePathname
- Opens in new tab: target="_blank" rel="noopener noreferrer"
- Aria label: "Chat with us on WhatsApp"

FILE: hooks/useScrolled.ts
- Returns boolean: whether window.scrollY > threshold
- Uses useEffect and scroll event listener
- Removes event listener on unmount (cleanup function)
- Returns false during SSR (typeof window === 'undefined' guard)
```

---

## PROMPT 7 — Admin Dashboard

```
Build the admin dashboard for viewing and managing leads.

FILE: app/(admin)/admin/page.tsx — Server Component (auth checked by layout)
- Fetches leads from Convex server-side
- Renders StatsCards + LeadsTable

FILE: components/admin/StatsCards.tsx
- 4 metric cards:
  1. Total leads (all time)
  2. New leads (this month)
  3. Qualified leads (status = 'qualified')
  4. Closed won (status = 'closed-won')
- Each card: label, large number, small trend text
- Light theme (admin uses light colours — see design doc)

FILE: components/admin/LeadsTable.tsx — 'use client'
Columns: Date | Name | Business | Service | Budget | Status | Actions

Features:
- Filter by status (dropdown)
- Filter by service type (dropdown)
- Click row to expand lead detail
- Inline status update (dropdown per row)
- Phone number click-to-WhatsApp
- Email click-to-email
- Responsive: on mobile, show only Name + Status + Actions, rest in expandable row

Status badge colours:
  new → blue
  contacted → amber
  qualified → purple
  closed-won → green
  closed-lost → red

Security requirements:
- All data fetched server-side via Convex with auth
- No raw IDs exposed in URL params
- Confirm dialog before any destructive action
- Admin actions log to Convex (who changed what, when)

FILE: app/(admin)/admin/login/page.tsx — 'use client'
- Simple centred login form
- Email + password inputs
- Calls POST /api/admin/login
- On success: router.push('/admin')
- On error: show error message (generic — do not reveal if email exists)
- Rate limit feedback: if 429 response, show "Too many attempts. Try again in 15 minutes."
- No "forgot password" (add in Phase 2)
```

---

## PROMPT 8 — SEO & Performance

```
Implement SEO and performance optimisations for SentinalHills.

FILE: lib/metadata.ts
Create a helper function that generates Next.js Metadata objects:

export function generatePageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!
  return {
    title: `${title} | SentinalHills`,
    description,
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: `${title} | SentinalHills`,
      description,
      url: `${siteUrl}${path}`,
      siteName: 'SentinalHills',
      images: [{ url: '/og-image.png', width: 1200, height: 630 }],
      locale: 'en_KE',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | SentinalHills`,
      description,
      images: ['/og-image.png'],
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `${siteUrl}${path}` },
  }
}

Add generateMetadata export to EVERY page with unique title and description.

FILE: app/sitemap.ts
- Include all public pages with correct URLs
- Exclude /admin from sitemap
- Set lastModified, changeFrequency, priority per page

FILE: public/robots.txt
User-agent: *
Allow: /
Disallow: /admin
Sitemap: https://sentinalhills.com/sitemap.xml

FILE: app/api/og/route.tsx
- Dynamic OG image using @vercel/og
- Accept title query param
- Render branded image: dark background, SentinalHills logo text, page title, tagline
- Return ImageResponse with correct headers

STRUCTURED DATA — add to root layout:
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "SentinalHills",
      "description": "AI automation agency in Nairobi, Kenya",
      "url": "https://sentinalhills.com",
      "telephone": "+254700000000",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Nairobi",
        "addressCountry": "KE"
      },
      "priceRange": "KES 40,000 - 600,000",
      "openingHours": "Mo-Fr 08:00-18:00"
    })
  }}
/>

PERFORMANCE:
- Add <link rel="preconnect"> for fonts in root layout
- Verify all images use next/image with proper sizes prop
- Audit and remove any unused Tailwind classes by ensuring content array in tailwind.config.ts covers all file paths
- Add loading="eager" and priority to above-fold images only
```

---

## PROMPT 9 — Testing & Launch Checklist

```
Perform a complete pre-launch audit of SentinalHills and fix any issues found.

Run through this checklist and report the result of each item:

SECURITY AUDIT:
□ Grep codebase for any hardcoded API keys, secrets, or passwords: grep -r "sk_" . && grep -r "re_" . && grep -r "password" . --include="*.ts" --include="*.tsx" (excluding node_modules, .env files)
□ Confirm no .env.local is committed: git ls-files | grep ".env.local" (should return nothing)
□ Confirm all admin Convex queries check ctx.auth before returning data
□ Confirm middleware.ts correctly protects /admin routes
□ Confirm rate limiting is active on submitLead mutation
□ Confirm all form inputs have server-side Zod validation

FUNCTIONALITY:
□ Lead form completes all 4 steps without errors
□ Form submission creates a record in Convex dashboard
□ Success screen shows after submission
□ WhatsApp button opens correct number with pre-filled message
□ Admin login works with correct credentials
□ Admin login fails with wrong credentials (same error message for both wrong email and wrong password)
□ Leads table shows all submissions
□ Status update saves correctly

PERFORMANCE:
□ Run Lighthouse on homepage — all scores 90+
□ Check Core Web Vitals in Vercel dashboard after deployment
□ Confirm no console errors in browser dev tools
□ Confirm no TypeScript errors: npx tsc --noEmit

SEO:
□ Each page has unique title and meta description
□ OG image loads correctly when URL shared on WhatsApp
□ Sitemap accessible at /sitemap.xml
□ robots.txt accessible and correct at /robots.txt
□ Google Search Console: submit sitemap

ACCESSIBILITY:
□ Tab through entire homepage using only keyboard — all interactive elements reachable
□ All images have descriptive alt attributes: grep -r "alt=\"\"" . --include="*.tsx"
□ All form inputs have associated labels
□ Colour contrast: verify with browser DevTools accessibility panel

MOBILE:
□ Homepage looks correct on iPhone SE (375px)
□ Homepage looks correct on standard Android (390px)
□ Lead form is usable on mobile keyboard open
□ WhatsApp button doesn't overlap any content
□ Nav mobile menu opens and closes correctly

After completing the audit, fix every failing item. Do not mark the project as ready for launch until every checkbox is green.
```

---

## GENERAL RULES FOR ALL PROMPTS

When working with the coding agent, apply these rules to every interaction:

**Never accept these anti-patterns:**
- `any` TypeScript type
- `<img>` instead of `<Image>`
- `@import` for fonts instead of `next/font`
- Unhandled promise rejections
- Missing loading and error states on async operations
- Convex queries without auth checks on sensitive data
- Form submissions without client AND server validation

**Always ask the agent to:**
- Show you the complete file, not just the changed section
- Explain any security decision it makes
- Run `npx tsc --noEmit` after every major change
- Tell you if it is unsure about anything rather than guessing

**Red flags — if the agent does any of these, stop and correct it:**
- Puts an API key in a component file
- Uses `dangerouslySetInnerHTML` without sanitising the input
- Creates a Convex query that returns all records without pagination on a large dataset
- Skips error handling with "we can add this later"
- Uses `eval()` or `Function()` constructor anywhere
- Installs a package without explaining what it does

**Commit strategy:**
- Commit after each prompt completes successfully
- Commit message format: `feat: [what was built]` or `fix: [what was fixed]`
- Never commit with `npx tsc --noEmit` showing errors
- Never commit `.env.local`
