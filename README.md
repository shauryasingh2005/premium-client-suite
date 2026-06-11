# 🏋️‍♂️ ANYWHERE FITNESS — Premium Client Suite

[![Deploy Status](https://img.shields.io/badge/Status-Live_Preview-success?style=for-the-badge&logo=vercel)](https://premium-client-suite.vercel.app/)
[![Built With](https://img.shields.io/badge/Built_With-TanStack_Start-FF4154?style=for-the-badge&logo=react)](https://tanstack.com/router)
[![Database](https://img.shields.io/badge/Database-Supabase-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com)
[![Styling](https://img.shields.io/badge/Styling-Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

**ANYWHERE FITNESS** is a state-of-the-art, AI-powered personal training, nutrition, and recovery platform built for Indian kitchens and modern routines. No generic plans here — our AI engine rewrites programs weekly based on actual biometric progress, sleep patterns, RPE, and meal compliance.

🌐 **Live Demo:** [premium-client-suite.vercel.app](https://premium-client-suite.vercel.app/)

---

## ✨ Key Features

- **🧠 Adaptive AI Coaching Engine:** Sunday recalibration analyzing workout adherence, sleep, and rate of perceived exertion (RPE) to dynamically scale volume/reps.
- **🥗 Integrated Nutrition Suite:** Syncs training output with local Indian ingredient macros, macro-locked meal swaps, and custom grocery list generators.
- **⚡ Supercharged Tech Stack:** Built on **TanStack Start** for lightning-fast server rendering, instant page transitions, and optimal performance even on standard 4G connections.
- **🔐 Enterprise-grade Security:** Powered by Supabase with Row Level Security (RLS) policies protecting user profiles, nutrition plans, and workout schedules.

---

## 🛠️ Tech Stack & Architecture

### Frontend
- **Framework:** [TanStack Start](https://tanstack.com/router) (file-based routing, server functions)
- **UI Engine:** [React 19](https://react.dev/)
- **Styles:** [Tailwind CSS v4](https://tailwindcss.com) + [Radix UI primitives](https://www.radix-ui.com/)
- **Charts:** [Recharts](https://recharts.org/) for beautiful biometric and workload analytics
- **Theme:** Sleek dark-mode aesthetic utilizing rich `oklch` gradients and micro-animations

### Backend & Database
- **Provider:** [Supabase](https://supabase.com/)
- **Schema:** PostgreSQL containing relational profiles, custom workouts, and personalized nutrition tables
- **Security:** Strict Row Level Security (RLS) policies, separating and securing user data

---

## 📂 Project Structure

```bash
├── supabase/
│   └── schema.sql       # Database schema (profiles, workouts, nutrition tables, triggers)
├── src/
│   ├── routes/          # File-based routing folder (TanStack Router convention)
│   │   ├── index.tsx    # Landing / Home Page
│   │   ├── ai-coach.tsx # AI Recalibration view
│   │   ├── auth.tsx     # Sign-up & Login
│   │   ├── pricing.tsx  # Tier configurations
│   │   └── workouts.tsx # Workout generator
│   ├── components/      # Shared components & UI wrappers
│   ├── hooks/           # App-specific custom state and DB connections
│   └── styles.css       # Core design tokens and custom CSS utilities
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.sh) (recommended) or `Node.js` installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/shauryasingh2005/premium-client-suite.git
   cd premium-client-suite
   ```

2. **Install dependencies:**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env` file in the root directory and add your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run development server:**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

5. **Build for production:**
   ```bash
   bun run build
   # or
   npm run build
   ```

---

## 🤝 Contributing & License

Contributions are welcome! Please feel free to open a Pull Request or file an issue.
Distributed under the MIT License. See `LICENSE` for more information.

---
*Built with ❤️ for athletes everywhere.*
