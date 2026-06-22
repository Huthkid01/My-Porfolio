# Odusanya Uthman - Portfolio Website

A modern personal portfolio with a **Joto-inspired** dark theme — orange accents, hero slider, services accordion, portfolio carousel, and smooth scroll animations.

## 🚀 Features

- **Hero slider** — 3 full-width slides with progress tabs (Swiper)
- **Services accordion** — Web dev, SEO, ads, and more
- **Portfolio carousel** — Selected projects with marquee text
- **About + CTA** — Bio, resume download, contact form (EmailJS)
- **Joto design system** — Black `#000`, orange `#ff7425`, Inter typography
- **Animations** — GSAP ScrollTrigger, Lenis smooth scroll, custom cursor (desktop)
- **Mobile offcanvas** navigation

## 🛠️ Stack

- HTML5, CSS3, JavaScript (ES6+)
- [Swiper](https://swiperjs.com/) — sliders
- [GSAP](https://greensock.com/gsap/) + ScrollTrigger — scroll reveals
- [Lenis](https://lenis.studiofreight.com/) — smooth scroll
- [Font Awesome 6](https://fontawesome.com/) — icons
- EmailJS — contact form

## 📁 Project Structure

```
portfolio/
├── index.html              # Homepage (Joto layout)
├── css/
│   ├── variables.css       # Design tokens
│   ├── joto-theme.css      # Main theme styles
│   └── joto-compat.css     # Joto markup compatibility
├── js/
│   └── joto.js             # Sliders, nav, animations, form
├── images/                 # Project screenshots & assets
├── styles.css              # Legacy (previous design)
├── script.js               # Legacy (previous design)
└── README.md
```

## 🏃 Run locally

```bash
# From the project folder — any static server works:
python3 -m http.server 8000
# Open http://localhost:8000
```

Or open `index.html` directly in your browser (CDN libraries require internet).

## 🎨 Design tokens

| Token | Value |
|-------|-------|
| Background | `#000000` |
| Text | `#ffffff` |
| Accent | `#ff7425` |
| Muted | `#757575` |
| Font | Inter |

## 📞 Contact

**Odusanya Uthman** — odusanyauthman2019@gmail.com

---

_Built with ❤️ by Odusanya Uthman_
