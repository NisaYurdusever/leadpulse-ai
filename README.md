## Tool Contract: `scoreLead`

- **Name:** `scoreLead`
- **Description:** Evaluates client intent, budget threshold, and technical compatibility to produce a structured qualification scorecard.
- **Input Schema (`zod`):**
  - `companyName` (string): Prospect organization or project name.
  - `budgetUsd` (number): Estimated development budget in USD (must be > 0).
  - `urgency` (enum: `'immediate' | 'next_quarter' | 'exploratory'`): Timeline requirements.
  - `techStackFit` (boolean): Stack compatibility against Next.js / TypeScript.
- **Return Shape:**
  - `success` (boolean): Operation status.
  - `score` (number, 0-100): Calculated qualification index.
  - `tier` (string): Routing tier (e.g., `'Tier 1 (High Intent)'`).
  - `estimatedBudget` (string): Formatted currency value.
  - `urgency` (string): Echoed timeline tier.
  - `recommendation` (string): Strategic follow-up action.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
