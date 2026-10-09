# LeadPulse AI — Autonomous Lead Qualification & Interactive 3D Workspaces

LeadPulse AI is an autonomous inbound lead qualification platform built with Next.js 15, TypeScript, and the Gemini API. It qualifies incoming leads in real-time, executes structured scoring functions via Tool Calling, dynamically renders native **Generative UI** scorecards, and showcases interactive 3D WebGL product environments.

---

## 🚀 Live Demos & Interactive Showcases
- **Live Application:** [https://leadpulse-ai-chi.vercel.app](https://leadpulse-ai-chi.vercel.app)
- **Generative UI Chat:** [https://leadpulse-ai-chi.vercel.app/chat](https://leadpulse-ai-chi.vercel.app/chat)
- **Button Motion Playground:** [https://leadpulse-ai-chi.vercel.app/button-demo](https://leadpulse-ai-chi.vercel.app/button-demo)
- **Interactive 3D Desk Showroom:** [https://desk-showroom.vercel.app](https://desk-showroom.vercel.app)

---

## 🎨 Interactive 3D Experience (Desk Showroom)
Built with **React Three Fiber**, **Three.js**, and **Drei**:
- **Cozy Room & Product Inspector:** An interactive 3D room featuring desktop hardware (laptop, phone, headphones) that users can click to inspect, rotate, and zoom.
- **Configurator Panel:** Real-time color and material swapping for items.
- **Interactive Features:** Procedural animations, cursor-following reactive elements, and lazy-loaded WebGL canvas for performance optimization.

---

## 📑 What It Does & For Whom
Designed for sales engineering teams and B2B SaaS platforms, LeadPulse AI replaces static contact forms with an adaptive AI assistant.
- Evaluates lead budget, timeline, and project requirements.
- Automatically invokes `scoreLead()` tool calls to determine lead tiers.
- Handles rate limits (429), API failures, and empty inputs gracefully without white-screen crashes.

---

## 🛠️ Reproducible Setup Guide

Follow these steps to run the application locally:

```bash
# 1. Clone the repository
git clone [https://github.com/NisaYurdusever/leadpulse-ai.git](https://github.com/NisaYurdusever/leadpulse-ai.git)
cd leadpulse-ai

# 2. Install dependencies (using legacy peer deps for compatibility)
npm install --legacy-peer-deps

# 3. Configure environment variables
# Create a .env.local file in the root directory and add:
GEMINI_API_KEY=your_gemini_api_key_here

# 4. Start the development server
npm run dev

Open http://localhost:3000 in your browser.

📊 V2 Evaluation & Test Results
Lighthouse Mobile Performance: 95 / 100

Lighthouse Mobile Accessibility: 100 / 100

WAVE Accessibility Errors: 0 Errors

Unit & Integration Tests: 6 passing test suites (Vitest & Testing Library) for error boundary triggers and component rendering.

🛑 Known Limitations
Currency Support: Evaluates budget in base USD (parsedBudget). Real-time foreign exchange currency conversion is currently out of scope.

Context Persistence: Currently processes the latest user query context. Multi-turn chat session memory over 10+ turns is planned for future iterations.

🤖 Transparency & AI Collaboration Statement
Built with AI Assistance: I developed this project using Claude / ChatGPT as an AI pair programmer for rapid UI scaffolding and shader generation. I independently audited, tested, and validated all Zod schemas, error boundaries, A11y ARIA-live implementations, and deployment pipelines.