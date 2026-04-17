# Tech Stack — SentinalHills Agency Website

**Version:** 1.0  
**Philosophy:** Production-grade from day one. Every choice is justified by security, performance, and maintainability — not trends.

---

## 1. Stack Overview

```
Frontend:       Next.js 14 (App Router)
Backend:        Convex (real-time backend-as-a-service)
Styling:        Tailwind CSS v3 + CSS Variables
Animation:      Framer Motion
Fonts:          next/font (Syne + Inter + JetBrains Mono)
Icons:          lucide-react
Auth:           Convex Auth (email/password for admin)
Email:          Resend (transactional emails)
Deployment:     Vercel (frontend) + Convex Cloud (backend)
Analytics:      Vercel Analytics + Speed Insights
Domain:         Custom domain via Vercel DNS
Forms:          Native React state (no external form library needed)
Rate Limiting:  Upstash Redis + @upstash/ratelimit (Phase 1: Convex rate limiting)
SEO:            Next.js Metadata API + next-sitemap
OG Images:      @vercel/og
```

---

## 2. Project Structure

```
sentinalhills/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   ├── page.tsx              # Homepage
│   │   ├── services/
│   │   │   └── page.tsx
│   │   ├── work/
│   │   │   ├── page.tsx
│   │   │   └── [slug]/
│   │   │       └── page.tsx
│   │   ├── about/
│   │   │   └── page.tsx
│   │   ├── contact/
│   │   │   └── page.tsx
│   │   └── blog/                 # Phase 2
│   │       └── page.tsx
│   ├── (admin)/                  # Protected admin route group
│   │   ├── layout.tsx            # Admin layout with auth check
│   │   └── admin/
│   │       ├── page.tsx          # Leads dashboard
│   │       └── settings/
│   │           └── page.tsx
│   ├── api/                      # API routes
│   │   └── og/
│   │       └── route.tsx         # OG image generation
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles + CSS vars
│   └── sitemap.ts                # Dynamic sitemap
│
├── components/
│   ├── ui/                       # Reusable base components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Badge.tsx
│   │   └── Modal.tsx
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppButton.tsx
│   ├── sections/                 # Homepage sections
│   │   ├── Hero.tsx
│   │   ├── TrustBar.tsx
│   │   ├── Services.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── CaseStudy.tsx
│   │   ├── Testimonials.tsx
│   │   └── CTASection.tsx
│   ├── forms/
│   │   ├── LeadForm.tsx          # Multi-step lead form
│   │   └── FormStep.tsx
│   └── admin/
│       ├── LeadsTable.tsx
│       ├── StatsCards.tsx
│       └── LeadDetail.tsx
│
├── convex/                       # Convex backend
│   ├── _generated/               # Auto-generated (do not edit)
│   ├── schema.ts                 # Database schema
│   ├── leads.ts                  # Lead mutations + queries
│   ├── auth.ts                   # Auth configuration
│   └── http.ts                   # HTTP action handlers
│
├── lib/
│   ├── constants.ts              # Site config, service list
│   ├── utils.ts                  # Shared utility functions
│   ├── validations.ts            # Zod schemas for form validation
│   └── metadata.ts               # SEO metadata helpers
│
├── hooks/
│   ├── useLeadForm.ts            # Multi-step form state
│   └── useScrolled.ts            # Navbar scroll state
│
├── types/
│   └── index.ts                  # Shared TypeScript types
│
├── public/
│   ├── favicon.ico
│   ├── og-image.png
│   └── icons/                    # Service SVG icons
│
├── middleware.ts                  # Auth middleware for /admin
├── next.config.js
├── tailwind.config.ts
├── convex.json
├── .env.local                    # Never committed
├── .env.example                  # Committed (no secrets)
└── package.json
```

---

## 3. Convex Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  leads: defineTable({
    // Service interest
    serviceType: v.union(
      v.literal("lead-generation"),
      v.literal("website"),
      v.literal("app"),
      v.literal("saas"),
      v.literal("unsure")
    ),
    // Business info
    businessName: v.string(),
    industry: v.string(),
    website: v.optional(v.string()),
    // Project details
    description: v.string(),
    budgetRange: v.string(),
    // Contact
    fullName: v.string(),
    email: v.string(),
    whatsappNumber: v.string(),
    preferredContact: v.union(
      v.literal("whatsapp"),
      v.literal("email"),
      v.literal("call")
    ),
    referralSource: v.optional(v.string()),
    // Internal tracking
    status: v.union(
      v.literal("new"),
      v.literal("contacted"),
      v.literal("qualified"),
      v.literal("closed-won"),
      v.literal("closed-lost")
    ),
    notes: v.optional(v.string()),
    ipAddress: v.optional(v.string()),
    userAgent: v.optional(v.string()),
    // Timestamps auto-added by Convex (_creationTime)
  })
    .index("by_status", ["status"])
    .index("by_service", ["serviceType"])
    .index("by_email", ["email"]),

  // Admin users (single record for now)
  adminUsers: defineTable({
    email: v.string(),
    passwordHash: v.string(),
    lastLoginAt: v.optional(v.number()),
  }).index("by_email", ["email"]),

  // Rate limiting tracker
  rateLimits: defineTable({
    identifier: v.string(),   // IP or email
    action: v.string(),        // e.g. "submit_lead"
    attempts: v.number(),
    windowStart: v.number(),   // Unix timestamp
  }).index("by_identifier_action", ["identifier", "action"]),
});
```

---

## 4. Environment Variables

### `.env.example` (commit this)
```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud

# Site
NEXT_PUBLIC_SITE_URL=https://sentinalhills.com
NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000

# Admin (set in Convex dashboard, not here)
# ADMIN_EMAIL and ADMIN_PASSWORD_HASH are stored in Convex DB

# Notifications (server-side only — never NEXT_PUBLIC_)
RESEND_API_KEY=
NOTIFICATION_EMAIL=hello@sentinalhills.com
N8N_WEBHOOK_SECRET=
N8N_WEBHOOK_URL=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=   # Optional
```

### `.env.local` (never commit — add to .gitignore)
```bash
NEXT_PUBLIC_CONVEX_URL=https://actual-deployment.convex.cloud
RESEND_API_KEY=re_actual_key_here
N8N_WEBHOOK_SECRET=random_256bit_secret
N8N_WEBHOOK_URL=https://your-n8n.railway.app/webhook/leads
NEXT_PUBLIC_WHATSAPP_NUMBER=254700000000
NEXT_PUBLIC_SITE_URL=https://sentinalhills.com
```

**Rule:** Any variable accessed in client components MUST be prefixed `NEXT_PUBLIC_`. Any variable that is a secret (API keys, webhook secrets) must NEVER have `NEXT_PUBLIC_` prefix — it stays server-side only.

---

## 5. Key Dependencies

### Production
```json
{
  "next": "14.2.x",
  "react": "18.x",
  "react-dom": "18.x",
  "convex": "^1.12.x",
  "framer-motion": "^11.x",
  "lucide-react": "^0.383.x",
  "zod": "^3.22.x",
  "resend": "^3.x",
  "clsx": "^2.x",
  "tailwind-merge": "^2.x"
}
```

### Development
```json
{
  "typescript": "^5.x",
  "tailwindcss": "^3.x",
  "autoprefixer": "^10.x",
  "postcss": "^8.x",
  "@types/react": "^18.x",
  "@types/node": "^20.x",
  "eslint": "^8.x",
  "eslint-config-next": "14.x"
}
```

### Why these choices
| Package | Reason |
|---------|--------|
| `zod` | Runtime input validation — catch bad data before it hits the database |
| `clsx` + `tailwind-merge` | Safely compose Tailwind classes without conflicts |
| `framer-motion` | Best-in-class animation library, works with Next.js App Router |
| `resend` | Modern email API, better deliverability than SendGrid for cold starts |
| No Redux / Zustand | Convex provides real-time state. React state handles UI state. No extra store needed. |
| No Prisma | Convex replaces the database + ORM layer entirely |

---

## 6. Security Architecture

### 6.1 Input Validation (Two layers)
```
Layer 1 — Client: Zod schema validation before submission
Layer 2 — Server: Convex mutation re-validates with same Zod schema
Never trust client-side validation alone.
```

### 6.2 Rate Limiting
```
Lead form: max 3 submissions per IP per hour
Admin login: max 5 attempts per IP per 15 minutes
Implemented in Convex HTTP actions using rateLimits table
```

### 6.3 Admin Route Protection
```typescript
// middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const adminToken = request.cookies.get('admin-session')?.value
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminRoute && !adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

### 6.4 Content Security Policy
Set in `next.config.js` headers:
```javascript
{
  key: 'Content-Security-Policy',
  value: [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline'",  // Required for Next.js
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "img-src 'self' data: blob:",
    "connect-src 'self' https://*.convex.cloud wss://*.convex.cloud",
    "frame-src 'none'",
    "object-src 'none'",
  ].join('; ')
}
```

### 6.5 Security Headers
```javascript
// next.config.js
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]
```

### 6.6 Webhook Verification (n8n integration)
```typescript
// When receiving webhook calls from n8n, verify the secret header:
const secret = request.headers.get('x-webhook-secret')
if (secret !== process.env.N8N_WEBHOOK_SECRET) {
  return new Response('Unauthorized', { status: 401 })
}
```

### 6.7 Sensitive Data Rules
- Phone numbers and emails in Convex: accessible only to authenticated admin
- Never log PII (email, phone) to Vercel logs
- Admin password: bcrypt hashed before storage (never stored plain)
- Session tokens: HTTP-only cookies (not accessible via JavaScript)

---

## 7. Convex Deployment

### Setup
```bash
# Install Convex CLI
npm install -g convex

# Initialise in project
npx convex dev

# Deploy to production
npx convex deploy
```

### Convex Functions Architecture
```
convex/
├── leads.ts
│   ├── submitLead (mutation)          — validates, saves, triggers notifications
│   ├── getLeads (query, auth-gated)   — returns all leads for admin
│   ├── updateLeadStatus (mutation)    — updates status, auth-gated
│   └── getLeadById (query)            — single lead detail, auth-gated
│
├── auth.ts
│   ├── adminLogin (action)            — validates credentials, returns session token
│   └── validateSession (query)        — checks if admin session is valid
│
└── http.ts
    └── notifyWebhook (httpAction)     — called by Convex after lead saved,
                                         forwards to n8n
```

---

## 8. Deployment Pipeline

```
Developer → Git push → GitHub
                         ↓
                    Vercel CI/CD
                         ↓
               Automatic preview deploy (PR)
                         ↓
               Manual promote to production
                         ↓
              sentinalhills.com live
```

### Vercel Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"]
}
```

Region `fra1` (Frankfurt) is closest to Nairobi with best latency for East Africa.

---

## 9. Performance Strategy

### Images
```typescript
// Always use next/image
import Image from 'next/image'
<Image
  src="/path/to/image.webp"
  alt="Descriptive alt text"
  width={800}
  height={600}
  loading="lazy"        // above fold: loading="eager" priority
  placeholder="blur"    // blurDataURL for smooth loading
/>
```

### Fonts
```typescript
// app/layout.tsx — load once, used everywhere
import { Syne, Inter, JetBrains_Mono } from 'next/font/google'

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})
```

### Bundle Splitting
- Every major section is a separate component file — Next.js auto code-splits
- Framer Motion: imported per-component, not globally
- Admin components: in `(admin)` route group — never bundled into public pages

---

## 10. Development Commands

```bash
# Install dependencies
npm install

# Run development (Next.js + Convex simultaneously)
npx convex dev &
npm run dev

# Type checking
npm run type-check

# Linting
npm run lint

# Build (production)
npm run build

# Deploy Convex backend
npx convex deploy

# Deploy frontend (automatic via Vercel on git push)
git push origin main
```

---

## 11. Domain & DNS Setup

```
Domain:       sentinalhills.com (purchase via Namecheap or GoDaddy)
DNS:          Point to Vercel nameservers
SSL:          Automatic via Vercel (Let's Encrypt)
www redirect: www.sentinalhills.com → sentinalhills.com (Vercel handles)
Email:        hello@sentinalhills.com via Resend domain verification
```

---

## 12. Monitoring & Observability

| Tool | Purpose | Cost |
|------|---------|------|
| Vercel Analytics | Page views, Core Web Vitals | Free |
| Vercel Speed Insights | Real user performance data | Free |
| Convex Dashboard | Query performance, error logs | Free |
| Google Search Console | SEO ranking, crawl errors | Free |
| Uptime Robot | Ping every 5 min, SMS alert if down | Free |
