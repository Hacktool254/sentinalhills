# Dev Rules & Build Phases — SentinalHills Agency Website

**Version:** 1.0
**Stack:** Next.js 14 (App Router) + Convex + Tailwind CSS v3 + Framer Motion
**Goal:** Production-grade AI automation agency website for Nairobi-based SentinalHills

---

## STANDING RULES (Apply to Every Phase)

These rules are non-negotiable and must be followed across every file written in every phase:

### Security
1. Never put secret keys or API keys in client components or files prefixed with `NEXT_PUBLIC_`
2. Always validate ALL user input with Zod on both client AND server (Convex mutation)
3. All admin routes must check authentication before returning any data
4. Never log PII (emails, phone numbers) to console or error tracking
5. Sanitise all string inputs — trim whitespace, escape special characters
6. Rate limit all public-facing mutations in Convex

### TypeScript
7. No `any` types — ever. Use proper types or `unknown` with type guards
8. All Convex query/mutation return types must be explicitly typed
9. All component props must have defined interfaces
10. Use strict null checks — handle `undefined` and `null` explicitly

### Next.js
11. Mark components `'use client'` only when they use hooks or browser APIs — everything else is a Server Component by default
12. Use `next/image` for ALL images — never raw `<img>` tags
13. Use `next/font` for ALL fonts — never link tags or `@import` in CSS
14. Every page must export `generateMetadata` for SEO
15. Never fetch data in client components when it can be done in a server component

### Convex
16. Never expose internal Convex function names in client error messages
17. All queries that return sensitive data must check `ctx.auth` first
18. Use Convex indexes for all filtered queries — never scan entire tables
19. Mutations must be idempotent where possible

### Code Quality
20. No `console.log` in production code — use proper error boundaries
21. All async operations must have `try/catch` with meaningful error handling
22. Components must be under 200 lines — split into smaller pieces if longer
23. No inline styles except for dynamic values that cannot be expressed in Tailwind

### Anti-Patterns — Never Accept
- `any` TypeScript type
- `<img>` instead of `<Image>`
- `@import` for fonts instead of `next/font`
- Unhandled promise rejections
- Missing loading and error states on async operations
- Convex queries without auth checks on sensitive data
- Form submissions without client AND server validation
- `dangerouslySetInnerHTML` without sanitising the input
- `eval()` or `Function()` constructor anywhere

### Commit Rules
- Commit after each phase completes successfully
- Commit message format: `feat: [what was built]` or `fix: [what was fixed]`
- Never commit with `npx tsc --noEmit` showing errors
- Never commit `.env.local`

---

## PHASE 0 — Pre-Flight Checklist

Before writing a single line of code, confirm:

- [x] Convex account created at convex.dev
- [x] Node.js 20+ installed (v24.14.1)
- [x] Git repository initialised and pushed to github.com/Hacktool254/sentinalhills
- [x] Custom domain purchased (sentinalhills.com) — confirmed
- [x] WhatsApp number confirmed: `+14193229820`
- [x] n8n instance URL — deferred to Phase 2
- [x] Resend account — deferred to Phase 2

---

## PHASE 1 — Project Initialisation (Prompt 1)

**Goal:** Bare project skeleton — no page content, only infrastructure.

### Steps
1. [x] Create a new Next.js 14 project:
   ```bash
   npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
   ```
2. [x] Install all required production dependencies:
   ```bash
   npm install convex framer-motion lucide-react zod resend clsx tailwind-merge
   ```
3. [x] Configure `tailwind.config.ts`:
   - Custom colours as CSS variable references (e.g. `var(--color-accent-primary)`)
   - Font variables: `--font-syne`, `--font-inter`, `--font-mono`
   - Extended border radius: `card: '16px'`, `btn: '8px'`
4. [x] Create `app/globals.css` with ALL CSS custom properties on `:root`:
   - Full colour system from `design.md` Section 2
   - Font family declarations
   - Base spacing/reset rules
5. [x] Configure `next.config.js`:
   - Security headers (X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP)
   - TypeScript strict mode confirmed in `tsconfig.json`
6. [x] Create `.env.example` (committed) with all required variable names — no values
7. [x] Update `.gitignore` to include `.env.local`
8. [x] Initialise Convex: `npx convex dev` (follow prompts, link to your Convex project)
9. [x] Create the full folder structure:
   ```
   app/(public)/   app/(admin)/   app/api/
   components/ui/  components/layout/  components/sections/
   components/forms/  components/admin/
   convex/   lib/   hooks/   types/   public/icons/
   ```

### Deliverable
- `npm run dev` starts without errors
- `npx tsc --noEmit` passes clean
- Folder tree matches `techstack.md` Section 2

---

## PHASE 2 — Convex Schema & Backend (Prompt 2)

**Goal:** Full Convex backend — schema, mutations, queries, webhook handler.

### Files to Create

#### `convex/schema.ts`
- `leads` table — all fields with `v.union`/`v.literal` for enum fields, three indexes
- `adminUsers` table
- `rateLimits` table

#### `convex/leads.ts`
Four functions:
1. `submitLead` (public mutation) — validate with Zod, rate-limit check, sanitise, save, schedule notification
2. `getLeads` (admin-only query) — auth check, optional filters, indexed queries, sorted by `_creationTime` desc
3. `updateLeadStatus` (admin-only mutation) — auth check, validate status literal, update record
4. `getLeadById` (admin-only query) — auth check, return full lead or null

#### `convex/http.ts`
- HTTP action called after lead save
- Forwards lead data to n8n webhook URL (from env var)
- Includes `x-webhook-secret` header
- Handles webhook failure gracefully — does not surface to user

### Deliverable
- Convex dev server running alongside Next.js with no schema errors
- `submitLead` mutation reachable from Convex dashboard test runner
- All admin queries return 401 when called without auth

---

## PHASE 3 — Middleware & Authentication (Prompt 3)

**Goal:** Secure admin session system — no unauthenticated access to `/admin`.

### Files to Create

#### `middleware.ts` (root)
- Protect `/admin/*` routes via `admin-session` HTTP-only cookie check
- Edge runtime compatible — no Convex client import

#### `convex/auth.ts`
Three functions:
1. `adminLogin` (public action) — rate-limited, bcrypt password compare, return session token
2. `validateSession` (public query) — hash comparison, return `{ valid: boolean }`
3. `adminLogout` (mutation) — clear session from DB

#### `app/api/admin/login/route.ts`
- POST handler, set HTTP-only cookie on success (httpOnly, secure, sameSite: lax, 7-day maxAge)

#### `app/api/admin/logout/route.ts`
- POST handler, clear cookie, redirect to `/admin/login`

#### `app/(admin)/layout.tsx`
- Server component, read cookie, validate session, redirect if invalid

#### `app/(admin)/admin/login/page.tsx`
- Client component, simple login form, calls POST `/api/admin/login`

### Deliverable
- Navigating to `/admin` without a session redirects to `/admin/login`
- Correct credentials → session set → admin visible
- Wrong credentials → same generic error message for both wrong email and wrong password

---

## PHASE 4 — Lead Form Component (Prompt 4)

**Goal:** Multi-step, accessible, validated lead capture form — the most critical UI element.

### Files to Create

#### `lib/validations.ts`
- `step1Schema`, `step2Schema`, `step3Schema`, `step4Schema` (Zod)
- `fullLeadSchema` — merged combination
- `LeadFormData` — exported type

#### `hooks/useLeadForm.ts`
- `currentStep` state (1–4)
- `formData` accumulated across steps
- `errors` per field
- `isSubmitting`, `isSuccess` booleans
- `nextStep(stepData)` — validates current step, advances
- `prevStep()` — goes back
- `submitForm(stepData)` — validates full form, calls Convex mutation

#### `components/forms/LeadForm.tsx` (`'use client'`)
- Progress bar (step X of 4) with smooth animation
- Step 1: Full-width card-style radio buttons for service type
- Step 2: Business name, industry dropdown, website (optional)
- Step 3: Description textarea with character count, budget dropdown
- Step 4: Name, email, WhatsApp, contact preference, referral source
- Success screen with WhatsApp button
- Error screen with retry button
- Framer Motion `AnimatePresence` for step slide transitions
- Full accessibility: labels, `role="alert"`, `aria-describedby`, `aria-live`
- Input `maxLength` matching server-side Zod limits
- User-friendly error mapping for Convex errors

### Deliverable
- All 4 steps navigate correctly with Zod validation blocking advancement on invalid data
- Submission creates a record visible in Convex dashboard
- Success screen renders after submission
- No `any` types, no form library (pure React state + Zod)

---

## PHASE 5 — Homepage (Prompt 5)

**Goal:** High-converting homepage with all 7 sections, fully responsive, animated.

### Files to Create/Update

#### `app/(public)/page.tsx` (Server Component)
- Imports all section components
- Exports `generateMetadata` with title, description, OG image

#### `components/sections/Hero.tsx` (`'use client'`)
- Left: label, headline (clamp font-size), subheadline, 2 CTAs, trust line
- Right: `TerminalAnimation.tsx` typewriter component
- Background: pure CSS radial gradient at 5% opacity

#### `components/sections/TerminalAnimation.tsx` (`'use client'`)
- Dark terminal window
- Typewriter cycling: 3 automation examples
- `useEffect` + `setTimeout` only — no heavy animation library

#### `components/sections/TrustBar.tsx` (Server Component)
- 4 stats: "10+ Automations Built", "KES 2M+ Saved for Clients", "24hr Turnaround", "M-Pesa Integrated"
- Horizontal scroll on mobile, static desktop

#### `components/sections/Services.tsx` (Server Component)
- 2×2 grid of `ServiceCard` components
- Data pulled from `lib/constants.ts`

#### `components/sections/HowItWorks.tsx` (Server Component)
- 3 steps: Free Audit → We Build It → You Grow
- Desktop: horizontal with dashed connector line
- Mobile: vertical stack

#### `components/sections/CaseStudy.tsx` (Server Component)
- Left: problem/solution/result text
- Right: result metric card

#### `components/sections/Testimonials.tsx` (`'use client'`)
- 3 cards: desktop 3-column grid, mobile CSS scroll-snap (no JS library)
- Data from `lib/constants.ts`

#### `components/sections/CTASection.tsx` (Server Component)
- Headline, subheadline, primary CTA + WhatsApp CTA

#### `lib/constants.ts`
- Services array (icon, title, description, link)
- Testimonials array (quote, name, company)
- Site config (name, tagline, WhatsApp number, etc.)

### Deliverable
- Homepage renders all 7 sections without errors
- Lighthouse Performance 90+ on local build
- Fully responsive at 375px, 768px, 1280px viewports

---

## PHASE 6 — Navbar & Footer (Prompt 6)

**Goal:** Site-wide navigation and footer, accessible and responsive.

### Files to Create

#### `components/layout/Navbar.tsx` (`'use client'`)
- Sticky, 72px height
- Desktop: logo left, nav links centre, primary CTA right
- Scroll state: backdrop-blur + border-bottom after 10px scroll
- Active link detection via `usePathname`
- Mobile: hamburger → full-screen overlay, Framer Motion AnimatePresence
- Mobile menu: closes on route change, Escape key, focus-trapped
- Proper ARIA: `aria-expanded`, `aria-controls`

#### `components/layout/Footer.tsx` (Server Component)
- 4-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Columns: Logo+desc+socials / Services / Company links / Contact
- External links: `target="_blank" rel="noopener noreferrer"`
- Copyright line

#### `components/layout/WhatsAppButton.tsx` (`'use client'`)
- Fixed bottom-right, 60px circle, WhatsApp green `#25D366`
- Inline WhatsApp SVG icon (no CDN)
- Pulse ring via CSS `@keyframes` only — no JS
- Hover tooltip: "Chat with us"
- Pre-filled message in href
- Hidden on `/admin` routes via `usePathname`
- `aria-label="Chat with us on WhatsApp"`

#### `hooks/useScrolled.ts`
- Returns boolean whether `scrollY > threshold`
- Cleans up event listener on unmount
- Returns `false` during SSR

### Deliverable
- Nav renders correctly on all breakpoints
- Mobile menu opens/closes, focus trapping works
- WhatsApp button absent on `/admin` routes
- Footer links all resolve correctly

---

## PHASE 7 — Admin Dashboard (Prompt 7)

**Goal:** Internal lead management interface — auth-protected, data-rich.

### Files to Create

#### `app/(admin)/admin/page.tsx` (Server Component)
- Fetches leads server-side from Convex
- Renders `StatsCards` + `LeadsTable`

#### `components/admin/StatsCards.tsx`
- 4 metric cards: Total leads / New this month / Qualified / Closed Won
- Light admin colour theme from `design.md` Section 10

#### `components/admin/LeadsTable.tsx` (`'use client'`)
- Columns: Date / Name / Business / Service / Budget / Status / Actions
- Filter by status and service type
- Click row to expand full lead details
- Inline status update dropdown
- Phone → click-to-WhatsApp, Email → click-to-email
- Mobile: condensed view with expandable row
- Status badges: New (blue), Contacted (amber), Qualified (purple), Closed Won (green), Closed Lost (red)
- Confirm dialog before destructive actions

#### `components/admin/LeadDetail.tsx`
- Full detail view for a single lead
- All fields displayed, status update form

### Deliverable
- Admin dashboard only accessible with a valid session cookie
- All leads from Convex visible in the table
- Status updates save and reflect immediately

---

## PHASE 8 — SEO & Performance (Prompt 8)

**Goal:** Optimised for search engines and Core Web Vitals targets.

### Files to Create/Update

#### `lib/metadata.ts`
- `generatePageMetadata({ title, description, path })` helper
- Returns full Next.js `Metadata` object with OG, Twitter, canonical

#### Add `generateMetadata` to ALL pages
- Homepage, Services, About, Contact, Work, Admin Login

#### `app/sitemap.ts`
- All public pages with `lastModified`, `changeFrequency`, `priority`
- Excludes `/admin`

#### `public/robots.txt`
- Allow `/`, Disallow `/admin`, Sitemap reference

#### `app/api/og/route.tsx`
- Dynamic OG image via `@vercel/og`
- Accepts `?title=` query param
- Branded dark background with SentinalHills logo text

#### Root Layout Updates
- `LocalBusiness` JSON-LD structured data
- `<link rel="preconnect">` for fonts
- Syne + Inter + JetBrains Mono via `next/font`

### Deliverable
- Every page has unique `<title>` and `<meta description>`
- `/sitemap.xml` returns valid XML
- `/robots.txt` blocks `/admin`
- OG image renders correctly (test via opengraph.xyz)

---

## PHASE 9 — Pre-Launch Audit (Prompt 9)

**Goal:** All checks green before deploying to production.

### Security Audit
- [ ] Grep for hardcoded secrets: no `sk_`, `re_`, plaintext passwords in source
- [ ] `.env.local` not committed: `git ls-files | grep ".env.local"` returns nothing
- [ ] All admin Convex queries check `ctx.auth` before returning data
- [ ] `middleware.ts` correctly blocks `/admin` without a valid session
- [ ] Rate limiting active on `submitLead` mutation
- [ ] All form inputs have server-side Zod validation

### Functionality
- [ ] Lead form completes all 4 steps without errors
- [ ] Form submission creates record in Convex dashboard
- [ ] Success screen shows after submission
- [ ] WhatsApp button opens correct number with pre-filled message
- [ ] Admin login works with correct credentials
- [ ] Admin login fails with same error message for wrong email OR wrong password
- [ ] Leads table shows all submissions
- [ ] Status update saves correctly

### Performance
- [ ] Lighthouse homepage score: Performance 90+, SEO 95+, Accessibility 90+
- [ ] No console errors in browser DevTools
- [ ] `npx tsc --noEmit` — zero errors

### SEO
- [ ] Each page: unique title + meta description
- [ ] OG image loads correctly when URL shared on WhatsApp
- [ ] `/sitemap.xml` accessible and valid
- [ ] `/robots.txt` accessible and correct
- [ ] Google Search Console connected and sitemap submitted

### Accessibility
- [ ] Tab through entire homepage — all interactive elements reachable
- [ ] All images have descriptive `alt` attributes
- [ ] All form inputs have associated `<label>` elements
- [ ] Colour contrast passes WCAG AA (4.5:1 for body text)

### Mobile
- [ ] Homepage correct at 375px (iPhone SE)
- [ ] Homepage correct at 390px (standard Android)
- [ ] Lead form usable with mobile keyboard open
- [ ] WhatsApp button doesn't overlap content
- [ ] Mobile nav opens and closes correctly

---

## PHASE 10 — Deployment (Phase 1 Launch)

**Goal:** Live on a custom domain with SSL.

### Steps
1. Push repo to GitHub (confirm `.env.local` is NOT committed)
2. Connect Vercel to GitHub repo — framework: Next.js, region: `fra1`
3. Set all production environment variables in Vercel dashboard
4. Deploy Convex to production: `npx convex deploy`
5. Set `NEXT_PUBLIC_CONVEX_URL` in Vercel to production Convex URL
6. Add custom domain in Vercel → update DNS to Vercel nameservers → wait for SSL
7. Verify: `https://sentinalhills.com` loads, form submits, admin works
8. Connect Google Search Console → submit sitemap

### Go-Live Checklist
- [ ] All Phase 1 pages live on custom domain with SSL
- [ ] Lead form submits correctly and owner receives notification
- [ ] Lighthouse scores meet targets
- [ ] WhatsApp button functional on mobile and desktop
- [ ] Admin dashboard accessible and showing leads
- [ ] Google Search Console connected
- [ ] At least one real lead received within 7 days of launch

---

## PHASE 2 ROADMAP (Post-Launch — Month 2–3)

Deferred features — do not build until Phase 1 is live:
- Portfolio/Work page with case studies (`/work` and `/work/[slug]`)
- Blog with MDX (`/blog`)
- Exit intent popup (email capture)
- Calendly iframe embed on Contact page
- Email automation via Resend
- Swahili language toggle

## PHASE 3 ROADMAP (Scale — Month 4+)

- Client portal (project status tracking)
- Invoice + M-Pesa payment via website
- Referral tracking system
- Advanced analytics dashboard
