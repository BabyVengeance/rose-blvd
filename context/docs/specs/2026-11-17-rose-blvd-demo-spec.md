# Spec: Rose Blvd Beauty Bar, multi-page demo website

## 1. Job
- Client and niche: Rose Blvd Beauty Bar, premium nail bar with three Cape Town salons (Main Road Sea Point, Regent Road Sea Point, Vineyard Road Claremont). Regent Road also offers Korean skincare facials, microneedling, laser hair removal, brows, waxing and massage.
- Audience and main task: women in the Atlantic Seaboard and Southern Suburbs (plus students and parents booking for children under 14) who want to see the price, pick a salon and book.
- Primary job: get a visitor from "what does it cost" to a booked Fresha slot or a WhatsApp message to the right branch.
- Success measure: clicks to Fresha booking and WhatsApp per branch.

## 2. Scope
- `index.html`: proof (4.9 from 8,930 reviews), branch picker, most-booked treatments with prices, review preview, policies, student club, FAQ preview.
- `treatments.html`: complete menu (119 nail services shared by all branches, Regent Road extras), category navigation, branch filter, and the appointment builder (interactive tool).
- `reviews.html`: aggregate across 8,930 reviews, real star distribution per branch, 18 verbatim dated reviews filterable by branch, links to every Fresha review page.
- `team.html`: brand story and 27 technicians by branch with their own portraits.
- `contact.html`: three branches with Google Maps, hours, phones, WhatsApp, and a 3-step enquiry form that hands off to the chosen branch's WhatsApp.
- `faq.html`: policies and practical questions with FAQPage schema.
- Legal: `privacy-policy.html`, `terms-of-service.html` (includes salon policies), `paia-manual.html`, plus `404.html`.
- Out of scope: online payment, own booking engine (Fresha stays the booking system), CMS.

## 3. Inputs
- Have: logo (Instagram avatar, 150px), 24 salon photos and 26 team portraits from Fresha, full menu and prices, hours, phones, addresses, coordinates, review totals and distributions, 18 recent reviews, salon policies (5-day gel guarantee, 21-day fills, no foreign fills, consultation fee, removal pricing), Instagram bio and follower count (7,228, verified).
- Missing (blocking for launch, not for the demo): original vector logo; registered company name and number; Information Officer name; business email; laser device licence details; Google Business Profile CIDs; cancellation and no-show policy wording.
- Missing (non-blocking, fallback): enquiry email inbox (fallback: form hands off to WhatsApp, nothing stored); founder story and founding year (fallback: Fresha description "where it all began").

## 4. Design plan
- Palette (brand-derived):
  - Porcelain `#FFFBF9`: salon counters and walls, Sea Point photo sample (255,251,249).
  - Blush `#FBE0D7`: Sea Point wall paint sample (251,224,215).
  - Velvet `#C6A199`: pedicure-throne upholstery sample (198,161,153).
  - Rose gold `#9C7461`: logo gradient midpoint.
  - Bronze `#5D4739`: darkest logo tone, used for buttons and links.
  - Espresso `#2A1E1B`: logo bronze deepened, used for body text and the footer.
- Type: Bodoni Moda (display, fashion-editorial contrast that suits the gold signage) and Jost (geometric sans that matches the logotype). Both OFL, self-hosted.
- Layout: editorial and asymmetric. Price lists set like a printed salon menu with leaders, branches as one large plus two stacked panels, reviews as a ledger with real distribution bars. No uniform icon-card grids.
- One memorable element: the Rb signature swash from their logo writes itself across the hero photo on load (mask reveal), once.
- Reference principles (from known high-end nail studios such as Olive & June, Paintbox and Townhouse): price visible before booking; treatment names in the salon's own words; booking one tap from every page.

## 5. Build plan
- Stack: static HTML, hand-written CSS, vanilla JS. No framework: six content pages plus legal, one interactive tool, deploys as-is to cPanel `public_html` and Cloudflare Pages.
- Library: contact-form pattern adapted (consent gating, honeypot, velocity check) with WhatsApp hand-off as the delivery tier.
- Skills: quick-demo, web-architect rules, apex-ui-vault principles, humanizer pass on copy.

## 6. Compliance and security
- No statutory council for nail technicians. Laser hair removal devices fall under Department of Health radiation control licensing (Hazardous Substances Act 15 of 1973): flag for confirmation. Microneedling and dermaplaning carry contraindication disclaimers.
- POPIA: enquiry form collects name, phone, branch, date preference and message; purpose is to answer the enquiry; consent checkbox; nothing stored on our servers; sent via the visitor's own WhatsApp. Children under 14 are booked by a parent or guardian.
- CPA s17 advance-booking cancellation rights referenced; ECTA s43 supplier information listed with the confirmed-by-client flags.
- Security: CSP and headers via `_headers` (Cloudflare) and `.htaccess` (cPanel); no third-party scripts except the Google Maps embed.

## 7. Assumptions
- Prices and menus as published on Fresha on 2026-11-17, including VAT where applicable.
- The original logo is rebuilt as vector from the Instagram avatar: the Rb swash is traced from their file and the wordmark reset in Jost. Replace with the client's master file when received.
- The web lockup enlarges the wordmark relative to the monogram so "ROSE BLVD" is legible at navbar height.
- Fresha venue pages are the booking destination for each branch.
- Approval gate: the user asked for a fully built site in one pass, so the build runs to completion and the items below are presented with the handoff.

## 8. Questions for the client
1. Registered company name, registration number and Information Officer.
2. Business email for enquiries and POPIA requests.
3. Master logo file (SVG/AI/PDF).
4. Cancellation and late-arrival policy wording used on Fresha.
5. Laser device make and radiation control licence number.
6. Founding year and founder name for the story section (optional).
