/**
 * WhatsApp Bot Webhook — Twilio inbound messages
 *
 * Setup:
 * 1. Create a Twilio account → https://twilio.com
 * 2. Activate WhatsApp Sandbox (or buy a number with WhatsApp capability)
 * 3. Set webhook URL in Twilio console:
 *    https://yourdomain.com/api/whatsapp/webhook
 * 4. Add env vars: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM
 *
 * How it works:
 * Customer → WhatsApp → Twilio → this webhook → Claude AI → TwiML reply → Customer
 */

import { NextRequest, NextResponse } from 'next/server';
import { WHATSAPP_SYSTEM_PROMPT } from '@/lib/ai-knowledge';

// Simple in-memory conversation history (per phone number)
// For production, use Redis or a database
const conversationHistory = new Map<string, Array<{ role: 'user' | 'assistant'; content: string }>>();
const MAX_HISTORY = 10; // last 10 messages

async function getAIReply(from: string, userMessage: string): Promise<string> {
  // Get or init conversation history
  if (!conversationHistory.has(from)) {
    conversationHistory.set(from, []);
  }
  const history = conversationHistory.get(from)!;

  // Add user message
  history.push({ role: 'user', content: userMessage });

  // Keep only last MAX_HISTORY messages
  if (history.length > MAX_HISTORY) history.splice(0, history.length - MAX_HISTORY);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001', // fast + cheap for chat
        max_tokens: 300,
        system: WHATSAPP_SYSTEM_PROMPT,
        messages: history,
      }),
    });

    if (!res.ok) throw new Error(`Anthropic error: ${res.status}`);

    const data = await res.json();
    const reply: string = data.content?.[0]?.text || "Hi! I'll connect you with our team shortly. You can also reach us on WhatsApp at +91 84278 31127.";

    // Save assistant reply to history
    history.push({ role: 'assistant', content: reply });

    return reply;
  } catch (err) {
    console.error('AI reply error:', err);
    return "Thanks for reaching out to YlooTrips! 🌏 Our team will reply within 1 hour. You can also WhatsApp us directly at +91 84278 31127.";
  }
}

// Twilio sends form-encoded POST
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);

    const from = params.get('From') || ''; // e.g. whatsapp:+919876543210
    const messageBody = params.get('Body') || '';
    const profileName = params.get('ProfileName') || '';

    if (!messageBody.trim()) {
      // Empty message — just acknowledge
      return new NextResponse('<Response></Response>', {
        headers: { 'Content-Type': 'text/xml' },
      });
    }

    // Personalise greeting if we have the name
    const userInput = profileName
      ? `[Customer name: ${profileName}]\n${messageBody}`
      : messageBody;

    const reply = await getAIReply(from, userInput);

    // TwiML response — Twilio sends this back to the customer via WhatsApp
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>${reply.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Message>
</Response>`;

    return new NextResponse(twiml, {
      headers: { 'Content-Type': 'text/xml' },
    });
  } catch (err) {
    console.error('WhatsApp webhook error:', err);
    return new NextResponse(
      `<?xml version="1.0" encoding="UTF-8"?><Response><Message>Hi! Our team will reply shortly. WhatsApp: +91 84278 31127</Message></Response>`,
      { headers: { 'Content-Type': 'text/xml' } }
    );
  }
}

// GET for health check / Twilio webhook verification
export async function GET() {
  return NextResponse.json({ status: 'WhatsApp webhook active', bot: 'Yloo AI — YlooTrips' });
}
