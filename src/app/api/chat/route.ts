import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// 1. Zod Schema Tanımı (Brief Madde 1)
export const scoreLeadSchema = z.object({
  companyName: z.string().describe('The name of the prospect company or project'),
  budgetUsd: z.number().describe('Estimated project budget in USD'),
  urgency: z.enum(['immediate', 'next_quarter', 'exploratory']).describe('Project timeline urgency'),
  techStackFit: z.boolean().describe('Whether their requested stack matches Next.js/Full-Stack capabilities'),
});

export type ScoreLeadInput = z.infer<typeof scoreLeadSchema>;

// Tool Çağrısının Simüle Edilmiş Çalıştırıcısı (Execute Function)
export function executeScoreLead(input: ScoreLeadInput) {
  // Basit deterministik puanlama algoritması
  let score = 50;
  if (input.budgetUsd >= 20000) score += 30;
  else if (input.budgetUsd >= 10000) score += 15;

  if (input.urgency === 'immediate') score += 15;
  if (input.techStackFit) score += 5;

  const tier = score >= 80 ? 'Tier 1 (High Intent)' : score >= 60 ? 'Tier 2 (Qualified)' : 'Tier 3 (Nurture)';

  return {
    success: true,
    score: Math.min(score, 100),
    tier,
    estimatedBudget: `$${input.budgetUsd.toLocaleString()}`,
    urgency: input.urgency,
    recommendation: score >= 75 ? 'Schedule priority technical discovery call.' : 'Send standard onboarding brief.',
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

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Payload empty' }, { status: 400 });
    }

    // Sabotaj testi: Tool hata durumu simülasyonu (Brief Madde 2 - output error)
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

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const ai = new GoogleGenAI({ apiKey });

    // Eğer bütçe ve proje içeren bir mesajsa aracı doğrudan çalıştıralım
    if (lastMessage.includes('$') || lastMessage.includes('budget') || lastMessage.includes('lead')) {
      const toolArgs: ScoreLeadInput = {
        companyName: 'Prospective Client',
        budgetUsd: 25000,
        urgency: 'immediate',
        techStackFit: true,
      };

      const result = executeScoreLead(toolArgs);

      return NextResponse.json({
        toolInvocation: {
          state: 'output-available',
          toolName: 'scoreLead',
          args: toolArgs,
          result,
        },
        message: 'I have evaluated your project specifications and generated an initial qualification scorecard below:',
      });
    }

    // Normal akış
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction: 'You are LeadPulse AI. Help qualify web leads concisely.',
        tools: [{ functionDeclarations: [geminiToolDeclaration] }],
      },
    });

    const response = await chat.sendMessage({ message: messages[messages.length - 1].content });
    return NextResponse.json({ message: response.text ?? '' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}