# 🎨 Art Quiz

A web-based quiz game where you guess either the **artist** or the **title** of a painting.  
Paintings are fetched in real-time from open museum collections:

- The Met Museum
- Art Institute of Chicago (AIC)
- Cleveland Museum of Art

No API keys required.  
Designed to be lightweight, fast, and replayable.

---

## ✨ Features

- Two game modes:
  - **Guess the Painter**
  - **Guess the Title**
- **Smart Answer Checking**:
  - Surname-only counts if correct
  - Wrong first name does **not** count
  - East Asian names handled correctly
  - Title comparison ignores articles (`the`, `a`, `an`)
- Scoring and streak tracking
- Responsive, minimal UI
- Random artwork each round

---

## 🧱 Tech Stack

- Next.js (App Router + Edge Runtime)
- TailwindCSS
- Public Museum APIs + IIIF Image Delivery

---

## 🚀 Getting Started

### Install Dependencies
```bash
npm install
```
### Run Locally
``` bash
npm run dev
```

## Deployment

- Deploy easily to Vercel (recommended).
- No environment variables or API keys needed.

## Data Source Licensing

- All artworks are sourced from open access public domain museum collections.
- This project displays only images approved for open reuse.