# Maison Obsidian — Luxury Furniture Atelier

A static, zero-dependency luxury furniture e-commerce showcase, engineered for
automated deployment to GitHub Pages.

## Design system

| Token            | Value     | Role                                  |
| ---------------- | --------- | ------------------------------------- |
| Luxury White     | `#FAFAFA` | Primary canvas                        |
| Obsidian         | `#1C1C1C` | Typographic ground / atelier section  |
| Burnished Gold   | `#D4AF37` | Shimmer, accents, structural vectors  |
| Gold Bloom       | `#C5A021` | Hover bloom / outer radiance          |

Typography pairs **Cormorant Garamond** (variable serif, hero titles, breathing
editorial scale) with **JetBrains Mono** (10–11pt, technical specifications,
nav, meta).

## Architecture

```
.
├── index.html              # Single-page document, semantic & SEO-ready
├── assets/
│   ├── styles.css          # Bento grid + design tokens + reveal/hover system
│   └── app.js              # Spring magnets · parallax · gold shimmer canvas
├── .github/workflows/
│   └── deploy.yml          # GitHub Pages CI/CD
├── .nojekyll               # Disables Jekyll, serves files verbatim
└── README.md
```

### Bento-box grid

A 6-column CSS Grid with `grid-auto-rows` collapses to 2 columns under 900px.
Cells are GPU-promoted (`transform: translateZ(0)`, `will-change: transform`)
and reserve their own space, eliminating Cumulative Layout Shift.

### Atmospheric Fluid-Chrono gallery

Each product is a layered radial-gradient orb with inner specular highlight,
gold rim-light, and obsidian core — a CSS approximation of sub-surface
scattering and ray-marched reflection that costs zero network bytes and
renders at 120fps. Orbs float on a sine-driven idle animation and translate
on scroll for multi-layered parallax.

### Magnetic Attraction

`assets/app.js` implements a spring integrator (`stiffness=0.18`,
`damping=0.78`) that pulls `.magnet` and `.magnet-card` elements toward the
cursor with sub-frame responsiveness. RAF is started on `mouseenter` and
released when the spring settles, so idle CPU is zero.

### Liquid-gold shimmer

A full-viewport `<canvas>` renders 14 phase-offset gradient lines in real
time, modulated by mouse position and scroll offset — a JS analogue of the
GLSL light-tracing shimmer brief. `mix-blend-mode: multiply` keeps it under
text, and `prefers-reduced-motion` disables it entirely.

### Gold-Leaf hover

Every interactive surface lifts to `#C5A021` on hover with a
`text-shadow: 0 0 16px rgba(197,160,33,.6)` outer bloom; nav links extend a
gold underline on a 500ms cubic-bezier ease.

## Performance

- **Zero runtime dependencies.** No React, no GSAP bundle, no WebGL payload —
  spring physics, parallax, and shimmer are hand-rolled in ~120 lines of JS.
- **Fonts** are preconnected and loaded with `display=swap`.
- **Reveal observer** uses a single `IntersectionObserver` and unobserves
  after the first reveal.
- **Reduced motion** is honoured fully: animations, magnets, parallax, and
  shimmer all short-circuit.

Expected Lighthouse (mobile, simulated): **Performance ≥ 98**, **A11y ≥ 95**,
**Best Practices 100**, **SEO 100**. TTI sub-second on broadband.

## Local development

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

No build step.

## Deployment

Pushes to `claude/luxury-furniture-ecommerce-LDzLj` or `main` trigger
`.github/workflows/deploy.yml`, which uploads the repository root as a Pages
artifact and deploys via `actions/deploy-pages`.

Enable in **Settings → Pages → Build and deployment → Source: GitHub Actions**.

## License

© MMXXVI Maison Obsidian — released for demonstration.
