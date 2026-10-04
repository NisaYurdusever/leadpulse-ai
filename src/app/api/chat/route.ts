import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export async function POST(req: NextRequest) {
  try {
    const { messages, sabotage } = await req.json();

    // 1. Sabotaj Testi: Simüle Edilmiş Hata Durumları
    if (sabotage === 'rate_limit') {
      return NextResponse.json(
        { error: 'Rate limit exceeded (429): Quota exhausted. Please retry in a few seconds.' },
        { status: 429 }
      );
    }

    if (sabotage === 'server_error') {
      return NextResponse.json(
        { error: 'Internal Model Failure (503): Backend model is temporarily unavailable.' },
        { status: 503 }
      );
    }

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'Message payload cannot be empty.' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;

    // Gerçek akış veya mid-stream sabotajı
    if (sabotage === 'mid_stream') {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode("Analyzing your project requirements... Initializing budget assessment... "));
          await new Promise((r) => setTimeout(r, 600));
          // Mid-stream kasıtlı bağlantı kopması simülasyonu
          controller.error(new Error('Connection terminated mid-stream by provider.'));
        },
      });
      return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    // Normal Happy-Path Akışı (Gemini 3.8 Flash)
    const chat = ai.chats.create({
      model: 'gemini-3.8-flash',
      config: {
        systemInstruction:
          'You are LeadPulse AI, a professional client qualification assistant. You help companies assess budget, project scope, and timelines concisely.',
      },
    });

    const responseStream = await chat.sendMessageStream({ message: lastMessage });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of responseStream) {
            if (chunk.text) {
              controller.enqueue(encoder.encode(chunk.text));
            }
          }
        } catch (streamErr) {
          controller.error(streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json(
      { error: err?.message || 'Unexpected server error occurred.' },
      { status: 500 }
    );
  }
}