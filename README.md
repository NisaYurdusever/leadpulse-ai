# LeadPulse AI — Autonomous Lead Qualification & Generative UI

LeadPulse AI is an autonomous inbound lead qualification engine built on the Next.js 15 App Router, TypeScript, and the Gemini API. It qualifies B2B leads in real-time, executes structured scoring functions via Tool Calling, and dynamically renders native **Generative UI** scorecards.

---

## 🚀 Live Production Application
- **Production URL:** [https://leadpulse-ai-chi.vercel.app](https://leadpulse-ai-chi.vercel.app)
- **Generative UI Chat:** [https://leadpulse-ai-chi.vercel.app/chat](https://leadpulse-ai-chi.vercel.app/chat)
- **Button Motion Playground:** [https://leadpulse-ai-chi.vercel.app/button-demo](https://leadpulse-ai-chi.vercel.app/button-demo)
- **3D Analytics Globe:** [https://leadpulse-ai-chi.vercel.app/3d-demo](https://leadpulse-ai-chi.vercel.app/3d-demo)

---

## 🛠️ Local Development & Setup Guide

Anyone can clone and run this project locally by following these steps:

```bash
# 1. Clone the repository
git clone [https://github.com/NisaYurdusever/leadpulse-ai.git](https://github.com/NisaYurdusever/leadpulse-ai.git)
cd leadpulse-ai

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure Environment Variables
# Create a .env.local file in the root directory:
cp .env.example .env.local

# Add your Gemini API Key to .env.local:
# GEMINI_API_KEY=your_gemini_api_key_here

# 4. Start the development server
npm run dev

Open http://localhost:3000 in your browser.🔑 Environment Variables TableVariableRequiredDescriptionGEMINI_API_KEYYesAPI key for Google Gemini AI models used for lead scoring and generative chat.NEXT_PUBLIC_APP_URLOptionalCanonical URL of the production deployment.🛡️ Production Hygiene & Abuse ProtectionTo protect API credits and prevent trivial abuse in production:Input Character Caps: Chat route enforces a hard limit of 1000 characters per user query.Serverless Timeout (maxDuration): Streaming handlers are capped at 30s to prevent hanging serverless instances.Resilient Error Boundaries: Prevents UI crashes on HTTP 429 rate limits or empty responses, rendering inline accessible error cards (aria-live="polite").🏗️ Architecture Overview & Data FlowPlaintext[User Input] ➔ [Next.js App Router Interface]
                       │
                       ▼
          [API Route: /api/chat] (Input Cap & Timeout Hygiene)
                       │
             (Gemini API Tool Calling)
                       │
                       ▼
            [scoreLead Tool Schema]
                       │
                       ▼
    [Generative UI Card Engine (A11y ARIA Live)]
🤖 Transparency & AI Collaboration StatementBuilt with AI Assistance: I developed this project using Claude / ChatGPT as an AI pair programmer for rapid UI component scaffolding, Tailwind CSS layout structuring, and WebGL fragment shader generation.What I built & verified myself:Authored and verified all Zod schemas for structured tool calling.Implemented accessible aria-live status regions and error boundary retry logic.Conducted cross-browser pass (Chrome, Firefox, Safari, Mobile Safari) and Lighthouse audit (100 A11y, 95 Perf).Configured Vercel production deployment and environment hygiene parameters.