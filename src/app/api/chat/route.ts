import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export const maxDuration = 30;

export const scoreLeadSchema = z.object({
  companyName: z.string().describe('The name of the prospect company or project'),
  budgetUsd: z.number().describe('Estimated project budget in USD'),
  urgency: z.enum(['immediate', 'next_quarter', 'exploratory']).describe('Project timeline urgency'),
  techStackFit: z.boolean().describe('Whether their requested stack matches Next.js/Full-Stack capabilities'),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadSchema>;

export function executeScoreLead(input: ScoreLeadInput) {
  let score = 40;
  if (input.budgetUsd >= 20000) score += 40;
  else if (input.budgetUsd >= 5000) score += 25;
  else if (input.budgetUsd >= 1000) score += 10;
  else score = Math.max(15, Math.min(35, Math.floor(input.budgetUsd / 20)));

  if (input.urgency === 'immediate') score += 15;
  if (input.techStackFit) score += 5;

  const finalScore = Math.min(score, 100);
  const tier = finalScore >= 80 ? 'Tier 1 (High Intent)' : finalScore >= 50 ? 'Tier 2 (Qualified)' : 'Tier 3 (Low Budget / Nurture)';

  return {
    success: true,
    score: finalScore,
    tier,
    estimatedBudget: `$${input.budgetUsd.toLocaleString()}`,
    urgency: input.urgency,
    recommendation:
      finalScore >= 75
        ? 'Schedule priority technical discovery call.'
        : finalScore >= 50
        ? 'Send automated proposal and portfolio overview.'
        : 'Budget below custom project minimum. Route to self-service templates.',
  };
}

const geminiToolDeclaration: FunctionDeclaration = {
  name: 'scoreLead',
  description: 'Calculates a structured qualification score and routing tier for a lead.',
  parameters: {
    type: Type.OBJECT,
    properties: {
      companyName: { type: Type.STRING, description: 'Prospect company name' },
      budgetUsd: { type: Type.NUMBER, description: 'Budget in USD' },
      urgency: { type: Type.STRING, enum: ['immediate', 'next_quarter', 'exploratory'] },
      techStackFit: { type: Type.BOOLEAN, description: 'Matches core stack' },
    },
    required: ['companyName', 'budgetUsd', 'urgency', 'techStackFit'],
  },
};

const apiKey = process.env.GEMINI_API_KEY || '';

export async function POST(req: NextRequest) {
  try {
    const { messages, sabotage } = await req.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Payload empty' }, { status: 400 });
    }

    const rawMessage = messages[messages.length - 1]?.content;
    if (typeof rawMessage !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 });
    }

    if (rawMessage.length > 1000) {
      return NextResponse.json(
        { error: 'Message exceeds maximum allowed length (1000 chars).' },
        { status: 400 }
      );
    }

    if (sabotage === 'tool_error') {
      return NextResponse.json({
        toolInvocation: {
          state: 'output-error',
          toolName: 'scoreLead',
          args: { companyName: 'Acme Corp', budgetUsd: -5000 },
          error: 'Validation failed: budgetUsd must be a positive integer.',
        },
      });
    }

    const lastMessage = rawMessage.toLowerCase();

    // Mesaj içerisinden bütçe miktarını yakala ($500, 100€, 25,000, 30000 vb.)
    const numberMatch = rawMessage.replace(/,/g, '').match(/(\d+[\d\.]*)/);
    const parsedBudget = numberMatch ? parseFloat(numberMatch[1]) : 25000;

    const hasBudgetKeywords =
      lastMessage.includes('$') ||
      lastMessage.includes('€') ||
      lastMessage.includes('euro') ||
      lastMessage.includes('dollar') ||
      lastMessage.includes('budget') ||
      lastMessage.includes('lead');

    if (hasBudgetKeywords) {
      const toolArgs: ScoreLeadInput = {
        companyName: 'Prospective Client',
        budgetUsd: parsedBudget,
        urgency: parsedBudget < 1000 ? 'exploratory' : 'immediate',
        techStackFit: lastMessage.includes('react') || lastMessage.includes('next'),
      };

      const result = executeScoreLead(toolArgs);

      return NextResponse.json({
        toolInvocation: {
          state: 'output-available',
          toolName: 'scoreLead',
          args: toolArgs,
          result,
        },
        message: `I have evaluated your specifications ($${parsedBudget.toLocaleString()} budget) and generated your dynamic lead qualification scorecard:`,
      });
    }

    // Normal serbest sohbet akışı (Gemini API)
    const ai = new GoogleGenAI({ apiKey });
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: 'You are LeadPulse AI. Help qualify web leads concisely.',
        tools: [{ functionDeclarations: [geminiToolDeclaration] }],
      },
    });

    const response = await chat.sendMessage({ message: rawMessage });
    return NextResponse.json({ message: response.text ?? '' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}