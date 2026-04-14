# 🌍 3D Portfolio — Space Planet Experience

A cinematic, immersive 3D portfolio where your work lives on a rotating sci-fi planet in deep space.

---

## ✨ Features

- **3D Rotating Planet** — procedurally generated sci-fi Earth with glowing continent borders
- **8 Territory Sections** — each section is a "country" on the planet surface
- **Hover-Rise Effect** — sections emerge from the surface on hover
- **3 Camera Animations:**
  - 🔵 **DIVE** — fly into planet when clicking a section
  - 🔴 **EMERGE** — rocket away back to orbit  
  - ⚡ **WARP** — hyperspace travel between sections
- **Living Space Background** — stars, nebula, 6 mini-planets — all react to mouse
- **Mouse Parallax** — entire scene responds to cursor movement
- **Post-Processing** — Bloom, Chromatic Aberration, Vignette via R3F
- **Custom Cursor** — cyan dot + lagging ring
- **Animated Loading Screen** — orbital ring spinner with progress
- **Fully Responsive** — works on all screen sizes

---

## 🗂 Project Structure

```
src/
├── components/
│   ├── planet/
│   │   ├── Planet.jsx           # 3D planet, continents, section markers
│   │   ├── SpaceBackground.jsx  # Stars, nebula, mini-planets
│   │   ├── CameraController.jsx # GSAP dive/emerge/warp animations
│   │   └── Scene.jsx            # R3F Canvas + post-processing
│   ├── layout/
│   │   └── Navbar.jsx           # Responsive nav with warp links
│   ├── ui/
│   │   └── UI.jsx               # Cursor, Loader, Overlay, HUD
│   ├── sections/
│   │   ├── AboutSection.jsx
│   │   ├── ProjectsSection.jsx
│   │   ├── SkillsSection.jsx
│   │   ├── ExperienceSection.jsx
│   │   ├── EducationSection.jsx
│   │   ├── CertificatesSection.jsx
│   │   ├── AchievementsSection.jsx
│   │   └── ContactSection.jsx
│   └── SectionRenderer.jsx      # Routes between sections
├── hooks/
│   └── useBootstrap.js          # Data loader
├── services/
│   └── api.js                   # All backend API calls
├── store/
│   └── store.js                 # Zustand global state
├── styles/
│   └── global.css               # Full design system
├── App.jsx
└── main.jsx
```

---

## 🚀 Setup

### Prerequisites
- Node.js 18+
- Your backend running at `http://localhost:3000`

### Install & Run

```bash
# Navigate to this folder
cd portfolio-3d

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **http://localhost:5173** in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🔌 Backend Connection

The frontend connects to your backend at `http://localhost:3000/api`.

Make sure your backend `.env` includes:
```
MONGO_URI=mongodb://127.0.0.1:27017/portfolio
JWT_SECRET=your_secret_here
PORT=3000
```

And CORS allows `http://localhost:5173` (already configured in your `app.js`).

---

## 🎨 Customization

### Change Planet Colors
Edit CSS variables in `src/styles/global.css`:
```css
--cyan:  #00d4ff;   /* Primary accent */
--teal:  #00ffcc;   /* Secondary accent */
--gold:  #f5c842;   /* Gold highlights */
```

### Add/Remove Sections
Edit the `SECTIONS` array in `src/components/planet/Planet.jsx`:
```js
{ id:'about', label:'ABOUT', icon:'◈', color:'#00d4ff', lat:22, lon:10 }
```
`lat/lon` controls where on the globe the section marker appears.

### Change Section Order in Navbar
Reorder items in the `SECTIONS` array — navbar follows the same order.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `@react-three/fiber` | React renderer for Three.js |
| `@react-three/drei` | R3F helpers (Billboard, Text) |
| `@react-three/postprocessing` | Bloom, ChromaticAberration, Vignette |
| `three` | 3D engine |
| `gsap` | Camera animations (dive/emerge/warp) |
| `framer-motion` | UI transitions and section animations |
| `zustand` | Global state management |
| `axios` | API calls |

---

## 🧠 How Navigation Works

```
Planet view  ──[click section]──▶  DIVE animation  ──▶  Section page
Section page ──[back button]────▶  EMERGE animation ──▶  Planet view
Section page ──[navbar click]───▶  WARP animation   ──▶  Other section
```

All three transitions are GSAP-powered camera movements in the 3D scene,
combined with DOM overlay effects for the flash/bloom visuals.
