# clearcargo.ae website

Static website (HTML, CSS, a little JavaScript). No build step, no dependencies, no tracking. Fonts (Poppins, SIL OFL) are self-hosted.

## Publish on GitHub Pages
1. Create a new repository and upload **everything in this folder** (keep `index.html` at the repository root, and include the hidden `.nojekyll` file).
2. Repository **Settings → Pages → Build and deployment**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`. Save.
3. Your site appears at `https://<username>.github.io/<repo>/` within a minute or two.

### Use your own domain (clearcargo.ae)
1. In Settings → Pages, enter `clearcargo.ae` as the custom domain (GitHub creates a `CNAME` file for you), and tick *Enforce HTTPS* once available.
2. At your domain registrar, point DNS at GitHub Pages. See GitHub's current instructions: https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site
3. If your `.ae` registrar limits DNS records, ask them for help.

> Absolute paths are used in only a few places (`404.html`, `site.webmanifest`, and the `https://clearcargo.ae/...` canonical and social tags). They are correct when served from the domain root. If you host under `username.github.io/repo/` without a custom domain, change those to relative paths.

## Replace before going live
- **Contact details** in `index.html` (section `#contact`): phone, email and WhatsApp link (`https://wa.me/<number without +>`). The numbers shown are placeholders. Add your street address or unit number in the office line, and your trade licence number in the footer if you want it shown.
- **Forms and tracking** in `assets/js/main.js` (`CONFIG`):
  - `quoteEmail`: where requests go.
  - `formEndpoint`: paste a free [Formspree](https://formspree.io) form URL so requests are delivered directly. Left empty, the form opens the visitor's email app (`mailto:`).
  - `trackingUrl`: if you get a tracking system, put its URL with `{ref}` in it. Left empty, the tracking box tells visitors to email you.
- **Copy**: the coverage section shows UAE today, the UAE–India corridor via Vizhinjam as the next step, and GCC/global later. Update it as lanes go live. Ports, coverage list, office hours and FAQ answers are written generically. Edit them to match what you really offer. No statistics, testimonials or certifications are claimed; add real ones if you have them.
- **Legal pages**: add a privacy policy and terms before collecting customer details, and check UAE requirements (for example showing your trade licence number).

## Structure
```
index.html               single-page site
404.html                 not-found page
assets/css/styles.css    all styles (brand colours are CSS variables at the top)
assets/js/main.js        menu, forms, scroll effects, CONFIG
assets/img/              logos, icons, social-share image
assets/fonts/            Poppins (self-hosted)
favicon.svg / .ico, apple-touch-icon.png, site.webmanifest, robots.txt, sitemap.xml
```

## Brand
Deep navy `#0B2545`, cargo orange `#F28C28`, slate `#55657A`, mist `#9FB0C3`, sand `#F5F2EC`. Orange is for the cargo block and key actions, never body text on white.

Preview locally: run `python3 -m http.server` in this folder, then open http://localhost:8000.
