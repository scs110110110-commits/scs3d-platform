# SCS3D Platform

Client-side 3D printing quote and CAD design estimation platform for [scs3d.com](https://scs3d.com).

## Features

- **Instant 3D Quote** — Upload `.stl`, `.obj`, or `.3mf` files for client-side volume analysis and live CAD pricing
- **Photo-to-Print CAD** — Upload reference images with dimensions for smart design time and price estimates
- **WhatsApp Integration** — One-click order confirmation with clipboard copy and pre-filled message

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Configuration

Edit `src/lib/config.ts`:

- `WHATSAPP_NUMBER` — Your Canadian WhatsApp number (e.g. `15195551234`)
- Material prices, infill options, and setup fee

## Deploy (Zero Server Cost)

Static export — deploy the `out/` folder to any free host:

```bash
npm run build
```

Compatible with: Vercel (free tier), Netlify, GitHub Pages, Cloudflare Pages.

## Tech Stack

- Next.js 16 (App Router, static export)
- React 19
- Tailwind CSS 4
- fflate (3MF zip parsing)

All calculations run 100% in the browser — no database or API required.
