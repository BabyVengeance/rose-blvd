# Tech stack: Rose Blvd demo

## Architecture
- Static site in the project root: hand-written HTML, one stylesheet (`assets/css/site.css`), three vanilla JS files. No build step, no framework, no third-party JS. Deploys as-is to cPanel `public_html/` or Cloudflare Pages.
- Pages: `index`, `treatments` (full menu + appointment planner), `reviews`, `team`, `contact` (3 maps + 3-step WhatsApp enquiry), `faq`, `privacy-policy`, `terms-of-service`, `paia-manual`, `404`.
- The HTML was generated once from the Fresha data captured on 2026-11-17, then the generator was discarded. Edit the HTML directly. If prices change, update both the menu rows in `treatments.html` and the `#planner-data` JSON block on the same page.

## Scripts
- `assets/js/site.js`: header state, mobile drawer (focus trap, Escape), booking dialog (`[data-book]` opens the salon chooser, falls back to `contact.html#salons`), open-now status in Africa/Johannesburg time, rating bar reveal, review and branch filters, category scroll-spy.
- `assets/js/planner.js`: appointment planner. Reads `#planner-data`, applies fill and student prices, uses the "with a new treatment" removal rate and shows the saving, builds the Fresha link and a prefilled WhatsApp message per salon.
- `assets/js/enquiry.js`: 3-step enquiry form with validation, honeypot and a 3-second velocity check; hands off to `wa.me/<salon>` with the message. Stores nothing.

## Design tokens
- Porcelain `#FFFBF9`, Blush `#FBE0D7`, Blush soft `#F6EAE4`, Velvet `#C6A199`, Rose gold `#9C7461` (large text and decoration only, 4.02:1), Bronze `#5D4739` (buttons, links, 8.42:1), Bronze ink `#7A5A49` (muted text, 6.03:1), Espresso `#2A1E1B` (text, footer, 15.71:1).
- Type: Bodoni Moda (display, opsz 28 on headings so the hairline 4 stays legible) and Jost (body, prices and large numerals). Both OFL, self-hosted woff2 in `assets/fonts/`.
- Radii 10 / 18 / 28 px. Nav height 84px desktop, 72px mobile.

## Logo
- `assets/logos/logo-header.svg` and `logo-footer.svg`: web lockup. The Rb swash is vector-traced from the official Instagram avatar (150px source); the wordmark is reset in Jost 400 at a larger size for navbar legibility. `logo-mark.svg` is the swash alone (used as a CSS mask for the hero animation and the CTA watermark).
- PNG bundle: `logo_header.png`, `logo_footer.png`, `logo_mark.png`, `favicon.png`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`.
- Replace with the client's master vector file when received.

## Deploy
- Cloudflare Pages: `_headers` sets CSP (self only, Google Maps frames, one hashed inline script), HSTS, nosniff, Referrer-Policy, Permissions-Policy, frame-ancestors none, and long caching for images and fonts.
- cPanel: upload the whole project folder to `public_html/`. `.htaccess` mirrors the headers, sets `ErrorDocument 404` and returns 404 for `/context`, `AGENTS.md` and `.gitignore`.
- Cloudflare Pages ignores `.htaccess`: deploy from Git (where `.gitignore` already keeps `context/raw/` out) or upload with `context/`, `AGENTS.md` and `.gitignore` left out, so project notes are not published.
- Before launch: set the canonical domain, add `<link rel="canonical">`, absolute URLs in JSON-LD and og:image, and a `sitemap.xml`.
