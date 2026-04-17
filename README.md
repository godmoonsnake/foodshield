# 🛡️ FoodShield AI Platform

> Real-time food safety intelligence platform powered by Google Gemini Vision AI.

## ✨ Features

- **AI Food Inspector** — Upload any food image for instant contamination analysis using Gemini Vision AI
- **Pathogen Detection** — Identifies 25+ foodborne pathogens (Salmonella, E. coli, Listeria, etc.)
- **Spoilage Prediction** — Q10 temperature coefficient model predicts safe consumption windows
- **Environmental Awareness** — Adjusts risk based on temperature and humidity conditions
- **Interactive Dashboard** — Real-time threat mapping with risk heatmaps
- **Analytics Engine** — Outbreak propagation trends with animated SVG charts
- **Restaurant Safety Portal** — Search and analyze restaurant food safety scores
- **Audit Reports** — Comprehensive food safety audit tracking

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 15, React 19, TypeScript |
| **Styling** | Tailwind CSS v4, Framer Motion |
| **3D Graphics** | Three.js, React Three Fiber |
| **AI Engine** | Google Gemini 1.5 Flash (Vision API) |
| **Backend** | Next.js API Routes |
| **Food Science** | Q10 temperature coefficient model, USDA shelf-life database |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Google Gemini API Key (free at [ai.google.dev](https://ai.google.dev))

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/foodshield-ai.git
cd foodshield-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the platform.

### Environment Variables

Create a `.env` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📁 Project Structure

```
├── app/                      # Next.js App Router pages
│   ├── api/inspect-food/     # AI inspection API endpoint
│   ├── analytics/            # Analytics dashboard
│   ├── dashboard/            # Main dashboard with threat mapping
│   ├── inspect/              # AI Food Inspector (upload + scan)
│   ├── reports/              # Audit intelligence reports
│   ├── restaurant/           # Restaurant safety portal
│   ├── globals.css           # Design system (glassmorphism, animations)
│   ├── layout.tsx            # Root layout with fonts
│   └── page.tsx              # Landing page with 3D hero
├── components/               # Reusable UI components
│   ├── AnimatedCounter.tsx   # Scroll-triggered number animation
│   ├── AppNavbar.tsx         # Navigation with sliding pill indicator
│   ├── AppFooter.tsx         # Footer component
│   ├── FoodParticles.tsx     # Canvas-based food emoji particles
│   ├── HeroScene.tsx         # Three.js 3D arc reactor scene
│   ├── MagneticButton.tsx    # Mouse-following magnetic button
│   ├── PageTransition.tsx    # Per-route animated transitions
│   └── TiltCard.tsx          # 3D tilt effect on hover
├── services/                 # Backend AI services
│   └── foodInspection.js     # Gemini Vision analysis + shelf-life engine
├── test/                     # Tests
│   └── testInspection.js     # Backend service test
└── server.js                 # Legacy Express server (optional)
```

## 🧪 Testing

```bash
# Run the backend food inspection test
npm test
```

## 🏗️ Build for Production

```bash
npm run build
npm start
```

## 👥 Team — ForgeX | CMR Institute of Technology

Built for the Meta AI Hackathon 2026.

## 📄 License

MIT License — © 2026 FoodShield Intelligence
