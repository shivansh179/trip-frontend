/**
 * One-time setup: Creates / updates the Yloo AI assistant in Vapi
 *
 * Run once after adding VAPI_API_KEY to env:
 *   GET /api/calls/setup-assistant
 *
 * Copy the returned assistantId to .env.local as VAPI_ASSISTANT_ID
 */

import { NextResponse } from 'next/server';
import { VAPI_ASSISTANT_CONFIG } from '@/lib/ai-knowledge';

export async function GET() {
  const vapiKey = process.env.VAPI_API_KEY;
  if (!vapiKey) {
    return NextResponse.json({ error: 'VAPI_API_KEY not set in environment' }, { status: 400 });
  }

  try {
    // Check if assistant already exists
    const existingId = process.env.VAPI_ASSISTANT_ID;
    const url = existingId
      ? `https://api.vapi.ai/assistant/${existingId}`
      : 'https://api.vapi.ai/assistant';
    const method = existingId ? 'PATCH' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${vapiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(VAPI_ASSISTANT_CONFIG),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json({ error: err }, { status: res.status });
    }

    const assistant = await res.json();

    return NextResponse.json({
      success: true,
      action: existingId ? 'updated' : 'created',
      assistantId: assistant.id,
      name: assistant.name,
      instruction: existingId
        ? 'Assistant updated successfully.'
        : `✅ Assistant created! Add this to .env.local:\nVAPI_ASSISTANT_ID=${assistant.id}`,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
