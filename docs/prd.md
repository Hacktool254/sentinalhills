# Product Requirements Document — SentinalHills Agency Website

**Version:** 1.0  
**Date:** April 2026  
**Owner:** SentinalHills  
**Stack:** Next.js 14 (App Router) + Convex Backend  
**Status:** Ready for development

---

## 1. Executive Summary

SentinalHills is a Nairobi-based technology agency offering AI automation, lead generation systems, website development with AI integration, mobile app development, and custom SaaS solutions. This document defines every requirement for the agency's marketing and lead-generation website — the primary tool for converting visitors into paying clients locally (Kenya) and globally (USD clients via Upwork and direct outreach).

The website must do three jobs exceptionally well:
1. Establish immediate trust and authority with mid-to-high budget clients
2. Capture and qualify leads automatically via an AI-powered contact flow
3. Demonstrate the agency's capability through its own design and technology choices

---

## 2. Business Goals

| Goal | Metric | Timeline |
|------|--------|----------|
| Generate 10+ qualified leads/month | Form submissions + WhatsApp initiations | Month 1 |
| Convert 30% of leads to discovery calls | CRM tracking via Convex | Month 2 |
| Rank for "AI automation Nairobi" on Google | SEO performance | Month 3 |
| Support $3K–$10K/month pipeline | Revenue tracked in dashboard | Month 3 |

---

## 3. Target Users

### Primary — Kenyan Corporate & SME Decision Makers
- Business owners, marketing managers, operations leads at mid-size Nairobi companies
- Industries: real estate, insurance, SACCO, logistics, healthcare, schools
- Budget: KES 50K–300K for a project
- Pain: manual processes, slow lead response, outdated websites, no automation
- Discovery: Google search, LinkedIn, WhatsApp referrals

### Secondary — Global Clients (USD)
- Startup founders and SME owners in US, UK, UAE
- Budget: $500–$5,000 per project
- Pain: need affordable, high-quality tech with fast turnaround
- Discovery: Upwork profile link, LinkedIn, cold outreach directing to website

---

## 4. Service Offerings (Pages & Content)

### 4.1 Lead Generation Automations
- WhatsApp bot funnels that qualify and capture leads 24/7
- CRM integration (auto-push leads to HubSpot, Pipedrive, Google Sheets)
- Facebook/Instagram lead ad automation
- M-Pesa payment trigger flows
- Pricing anchor: KES 60K–150K setup + KES 15K–30K/month retainer

### 4.2 Website Development + AI Integration
- Modern, fast websites built on Next.js
- AI chatbot integration (Claude API)
- WhatsApp live chat widget
- SEO-optimised, mobile-first
- Pricing anchor: KES 40K–120K

### 4.3 App Development
- Web apps and PWAs
- Mobile apps (React Native)
- MVP builds for startups
- Pricing anchor: KES 100K–400K

### 4.4 Custom SaaS Development
- End-to-end SaaS products built on Next.js + Convex
- Multi-tenant architecture
- M-Pesa billing integration
- Stripe for global payments
- Pricing anchor: KES 200K–600K+

---

## 5. Page Structure & Requirements

### 5.1 Homepage `/`
**Purpose:** Convert first-time visitors into leads within 60 seconds

**Sections (in order):**
1. **Hero** — Bold headline, subheadline, two CTAs ("Get a Free Audit" + "See Our Work"), animated background element
2. **Social proof bar** — Logos or stats ("10+ automations built", "KES 2M+ saved for clients")
3. **Services overview** — 4 service cards with icons, one-line description, "Learn more" link
4. **How it works** — 3-step process (Audit → Build → Launch → Grow)
5. **Featured case study** — One before/after result (e.g. "Real estate agency went from 40% lead loss to 0% with WhatsApp automation")
6. **Testimonials** — 2–3 client quotes with name, company, photo placeholder
7. **CTA section** — "Ready to automate your business?" with contact form
8. **Footer** — Links, social, WhatsApp button, Nairobi location

**Requirements:**
- Page must load in under 2 seconds (Lighthouse score 90+)
- Hero CTA visible above the fold on all screen sizes
- WhatsApp floating button visible on all pages
- Metadata: title, description, OG image for social sharing

### 5.2 Services Page `/services`
- Dedicated section per service with full description
- Benefits list (bullet points)
- Pricing range (not exact — "Starting from KES 60,000")
- "Get a quote" CTA per service
- FAQ accordion per service

### 5.3 Work/Portfolio Page `/work`
- Case study cards with: client industry, problem, solution, result
- Filter by service type
- No real client names required initially — use "Nairobi Real Estate Agency", "Kenyan Insurance Broker" etc.
- Each card links to a full case study page `/work/[slug]`

### 5.4 About Page `/about`
- Agency story (founding, mission, values)
- Team section (founder profile, future team slots)
- Tech stack showcase (logos: Next.js, Convex, Claude AI, n8n, WhatsApp API)
- Kenya-based, globally minded positioning
- Trust signals: eCitizen registration, Wise payments accepted, remote-friendly

### 5.5 Contact Page `/contact`
- Multi-step lead qualification form (see section 6)
- WhatsApp direct link (wa.me link)
- Email
- Calendly embed for discovery call booking
- Response time promise: "We respond within 4 hours"

### 5.6 Blog `/blog` (Phase 2)
- SEO content targeting: "AI automation Kenya", "WhatsApp bot Nairobi", "M-Pesa integration developer"
- MDX-powered posts
- Defer to Phase 2

---

## 6. Lead Capture System (Core Feature)

### 6.1 Multi-Step Contact Form
The contact form is the most important UI element on the site. It must qualify leads before they reach the owner.

**Step 1 — What do you need?** (radio select)
- Lead generation automation
- Website with AI integration
- App development
- Custom SaaS
- I'm not sure yet

**Step 2 — About your business**
- Business name
- Industry (dropdown)
- Website (optional)

**Step 3 — Project details**
- Describe what you want to achieve (textarea)
- Budget range (dropdown): Under KES 50K / KES 50K–150K / KES 150K–400K / KES 400K+ / Global USD project

**Step 4 — Contact info**
- Full name
- Email
- WhatsApp number
- Preferred contact method (WhatsApp / Email / Call)
- How did you hear about us?

**On submit:**
- Save lead to Convex `leads` table
- Send confirmation WhatsApp message to lead (via n8n webhook)
- Send Slack/email notification to agency owner
- Show success screen with next steps

### 6.2 WhatsApp Floating Button
- Fixed bottom-right on all pages
- Opens wa.me link with pre-filled message: "Hi SentinalHills, I found your website and I'm interested in [service]"
- Mobile: opens WhatsApp app directly
- Desktop: opens WhatsApp Web

### 6.3 Exit Intent Popup (Phase 2)
- Triggered when user moves cursor toward browser chrome on desktop
- Offer: "Get a free 15-minute automation audit"
- Simple email capture only

---

## 7. Admin Dashboard `/admin` (Internal, Auth-Protected)

### 7.1 Leads Table
- View all form submissions
- Status: New / Contacted / Qualified / Closed Won / Closed Lost
- Filter by service, budget, date
- Click lead to see full details
- Update status inline

### 7.2 Basic Analytics
- Total leads this month
- Leads by service type (chart)
- Conversion rate (leads → contacted → qualified)

### 7.3 Authentication
- Single admin user (founder)
- Convex Auth with email + password
- No public registration — admin account created via seed script

---

## 8. SEO Requirements

- Every page has unique `<title>`, `<meta description>`, OG tags
- Structured data: `LocalBusiness` schema with Nairobi address
- Sitemap auto-generated at `/sitemap.xml`
- robots.txt blocking `/admin`
- Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms
- Target keywords: "AI automation agency Nairobi", "WhatsApp bot Kenya", "Next.js developer Kenya", "M-Pesa integration developer"

---

## 9. Performance Requirements

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 90+ |
| Lighthouse SEO | 95+ |
| Lighthouse Accessibility | 90+ |
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 3s |
| Mobile score | 85+ |

---

## 10. Non-Functional Requirements

- **Security:** All form inputs sanitised. Rate limiting on form submission endpoint. No sensitive keys in client bundle. Admin routes protected by auth middleware.
- **Accessibility:** WCAG 2.1 AA. All images have alt text. Form fields have labels. Keyboard navigable.
- **Internationalisation:** English only (Phase 1). Swahili option in Phase 2.
- **Analytics:** Vercel Analytics + optional Google Analytics 4
- **Error handling:** All API errors handled gracefully. Form shows user-friendly error messages. Convex mutations have try/catch.
- **Uptime:** Deployed on Vercel. 99.9% uptime SLA via Vercel Pro (upgrade when revenue allows).

---

## 11. Phase Roadmap

### Phase 1 — Launch (Weeks 1–3)
- Homepage, Services, Contact, About
- Lead form + Convex storage
- WhatsApp button
- Admin dashboard (leads table)
- Deploy to Vercel with custom domain

### Phase 2 — Growth (Month 2–3)
- Portfolio/Work page with case studies
- Blog with MDX
- Exit intent popup
- Calendly integration
- Email automation (Resend)
- Swahili language toggle

### Phase 3 — Scale (Month 4+)
- Client portal (project status tracking)
- Invoice + M-Pesa payment via website
- Referral tracking system
- Advanced analytics dashboard

---

## 12. Success Criteria

The website is considered successfully launched when:
- [ ] All Phase 1 pages live on custom domain with SSL
- [ ] Lead form submits correctly and owner receives notification
- [ ] Lighthouse scores meet targets
- [ ] WhatsApp button functional on mobile and desktop
- [ ] Admin dashboard accessible and showing leads
- [ ] Google Search Console connected
- [ ] At least one real lead received within 7 days of launch
