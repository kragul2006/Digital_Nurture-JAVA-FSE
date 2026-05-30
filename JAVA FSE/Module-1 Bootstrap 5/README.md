# Bootstrap5 Community Event Portal

A complete, professional, fully-responsive community event website built with **Bootstrap 5**, **Bootstrap Icons**, and vanilla JavaScript. This project demonstrates every major Bootstrap 5 feature in a single cohesive, deployment-ready application.

---

## 🚀 Live Demo

Deploy to any of the platforms below in minutes (see [Deployment](#-deployment)).

---

## 📁 Project Structure

```
Bootstrap5-Community-Portal/
│
├── index.html          ← Main application page (all sections)
├── css/
│   └── style.css       ← Custom styles, CSS variables, animations
├── js/
│   └── script.js       ← Bootstrap plugins, form validation, utilities
├── images/             ← Add your own images here
└── README.md           ← You are here
```

---

## ✨ Features & Bootstrap 5 Concepts Covered

| # | Feature | Bootstrap 5 Classes/Plugins Used |
|---|---------|-----------------------------------|
| 1 | **Responsive Navbar** | `navbar`, `navbar-expand-lg`, `navbar-toggler`, `fixed-top` |
| 2 | **Hero Section** | `display-1`, `lead`, `btn-warning`, `btn-outline-light` |
| 3 | **Event Grid** | `col-lg-4`, `col-md-6`, `col-12`, `container`, `row`, `g-4` |
| 4 | **Sidebar Layout** | `col-md-3`, `col-md-9`, `order-md-1`, `order-md-2` |
| 5 | **Flexbox Utilities** | `d-flex`, `flex-column`, `flex-md-row`, `gap-4` |
| 6 | **Alignment & Order** | `justify-content-center`, `align-items-center` |
| 7 | **Typography** | `display-1`, `display-4`, `lead`, `fw-bold`, `text-muted`, `text-uppercase` |
| 8 | **Registration Form** | `form-control`, `form-check`, `input-group`, `form-floating`, validation |
| 9 | **Buttons Showcase** | All `btn-*`, `btn-outline-*`, button groups |
| 10 | **Nav Components** | `nav`, `nav-tabs`, `nav-pills`, `tab-content`, `tab-pane` |
| 11 | **Cards** | `card`, `card-body`, `card-footer`, `card-img-wrapper` |
| 12 | **Spacing Utilities** | `m-3`, `mt-4`, `p-2`, `py-5`, `gap-*` |
| 13 | **Colors & Backgrounds** | `bg-primary`, `bg-success`, `bg-warning`, `bg-danger`, `bg-dark`, `bg-gradient` |
| 14 | **Display & Visibility** | `d-none`, `d-md-block`, `d-lg-flex` |
| 15 | **Borders, Shadows, Rounded** | `border-primary`, `border-3`, `rounded-circle`, `rounded-pill`, `shadow-lg` |
| 16 | **Positioning** | `position-relative`, `position-absolute`, `position-fixed` |
| 17 | **Bootstrap Icons** | Facebook, Instagram, LinkedIn, Twitter/X icons throughout |
| 18 | **Modal Plugin** | Registration success modal |
| 19 | **Accordion Plugin** | FAQ section with smooth collapse |
| 20 | **Carousel Plugin** | Event gallery slider with auto-play |
| 21 | **Collapse Plugin** | Expandable event details in list |
| 22 | **Toast Notifications** | Programmatic toasts via JS |
| 23 | **Scrollspy** | `data-bs-spy="scroll"` on body |

---

## 🛠️ Tech Stack

- **HTML5** — Semantic markup, accessibility attributes
- **CSS3** — Custom properties, animations, media queries
- **Bootstrap 5.3.3** — CDN
- **Bootstrap Icons 1.11.3** — CDN
- **Bootstrap Bundle JS 5.3.3** — Includes Popper.js
- **Google Fonts** — Playfair Display + DM Sans
- **Vanilla JavaScript (ES6+)** — No additional dependencies

---

## 📦 Installation

### Option A — Open Locally (no build tools needed)

```bash
git clone https://github.com/YOUR_USERNAME/Bootstrap5-Community-Portal.git
cd Bootstrap5-Community-Portal
# Open index.html in your browser
open index.html
# or
start index.html    # Windows
```

### Option B — Live Server (VS Code)

1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. Browser opens at `http://localhost:5500`

---

## ☁️ Deployment

This project is a static site — no build step required.

### GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/Bootstrap5-Community-Portal.git
git branch -M main
git push -u origin main
```

Then in GitHub → **Settings → Pages → Source → main branch → / (root)** → Save.

Your site will be live at: `https://YOUR_USERNAME.github.io/Bootstrap5-Community-Portal/`

---

### Netlify

**Drag & Drop:**
1. Zip the project folder
2. Go to [netlify.com](https://netlify.com) → **Add new site → Deploy manually**
3. Drag and drop the ZIP file

**CLI:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=.
```

---

### Vercel

```bash
npm install -g vercel
vercel --prod
```

Or connect via the Vercel dashboard → Import Git Repository.

---

### Any Static Host (cPanel, S3, etc.)

Upload all files via FTP / file manager. Ensure `index.html` is in the root directory.

---

## 🎨 Customisation

### Change Brand Colours

Edit CSS variables in `css/style.css`:

```css
:root {
  --cp-yellow:     #ffc107;   /* Accent colour */
  --cp-dark:       #1a1a2e;   /* Dark background */
  --cp-charcoal:   #212529;   /* Body text */
}
```

### Change Fonts

Replace the Google Fonts link in `index.html` and update the font variables:

```css
:root {
  --font-display: 'Your Display Font', serif;
  --font-body:    'Your Body Font', sans-serif;
}
```

### Add Real Images

Place images in the `/images/` folder and replace the placeholder `div` elements in `index.html`:

```html
<!-- Replace this -->
<div class="card-img-placeholder bg-primary ...">
  <i class="bi bi-music-note-beamed ..."></i>
</div>

<!-- With this -->
<img src="images/your-event-photo.jpg" class="card-img-top" alt="Event Name" />
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| `xs` (default) | < 576px | 1 column, stacked flex |
| `sm` | ≥ 576px | 2 column grids begin |
| `md` | ≥ 768px | Sidebar + main layout |
| `lg` | ≥ 992px | 3-column event grid |
| `xl` | ≥ 1200px | Full desktop layout |

---

## ♿ Accessibility

- Semantic HTML5 landmarks (`<nav>`, `<main>`, `<aside>`, `<footer>`)
- `aria-label` on all icon-only buttons
- `aria-expanded` on all toggles
- `role="alert"` on toasts
- `role="tablist"` / `role="tab"` on tab components
- Keyboard navigation on carousel (←→ arrow keys)
- Focus ring via `:focus-visible`
- `prefers-reduced-motion` media query support

---

## 🧪 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 14+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Opera   | 76+     | ✅ Full |

---

## 📝 Sections Overview

1. **Navigation** — Fixed top navbar with search, hamburger menu
2. **Hero** — Full-viewport banner with stats counter
3. **Events Grid** — 6 event cards (responsive 3/2/1 layout)
4. **Sidebar Layout** — Filters, tags, profile card + tabbed content
5. **Why Choose Us** — Flexbox feature boxes (col→row responsive)
6. **Typography** — Display headings + colour palette demo
7. **Gallery** — Auto-play carousel with keyboard support
8. **Buttons** — Complete button showcase + button groups + border/shadow demos
9. **Alignment Demo** — justify/align + order reordering
10. **Registration Form** — Full-featured with floating labels & validation
11. **FAQ Accordion** — 5 questions with smooth collapse
12. **Contact** — Address, phone, email cards
13. **Newsletter Strip** — Subscription with email validation
14. **Footer** — Links, social icons, newsletter, copyright

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

```bash
# Fork → Clone → Branch → Commit → Push → PR
git checkout -b feature/your-feature-name
git commit -m "feat: describe your feature"
git push origin feature/your-feature-name
```

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

## 🙏 Credits

- [Bootstrap 5](https://getbootstrap.com/)
- [Bootstrap Icons](https://icons.getbootstrap.com/)
- [Google Fonts — Playfair Display & DM Sans](https://fonts.google.com/)
- [UI Avatars](https://ui-avatars.com/) — Profile avatar API

---

> Built with ❤️ as a comprehensive Bootstrap 5 reference project.  
> Every Bootstrap 5 concept — one clean, professional codebase.
