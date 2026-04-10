import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `You are Yloo, an expert Indian domestic travel planner for YlooTrips (ylootrips.com). You specialise exclusively in India destinations.

Respond ONLY with a valid raw JSON object — no markdown, no code fences, no explanation. Use this exact structure:
{
  "destination": "City, State",
  "duration": "N Days / N Nights",
  "travelStyle": "Adventure / Beach / Cultural / Leisure",
  "estimatedBudget": "₹X per person",
  "highlights": ["Place 1", "Place 2", "Place 3"],
  "days": [
    {
      "day": 1,
      "title": "Arrival & First Impressions",
      "theme": "Arrival",
      "activities": [
        {
          "time": "Morning",
          "activity": "Activity name",
          "details": "2-3 sentence description with specific names, places, and context.",
          "tip": "One practical tip for this activity."
        }
      ]
    }
  ],
  "packingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "bestTimeToVisit": "Month range",
  "localInsights": "One authentic cultural or practical insight about the destination."
}

Rules:
- Raw JSON only — absolutely nothing before or after
- 3–4 activities per day spread across Morning, Afternoon, Evening
- Budget in Indian Rupees (₹), realistic for the travel style
- Include specific restaurant names, local dishes, hidden gems
- Make assumptions if details are missing`;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: message },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });

    const text = completion.choices[0]?.message?.content ?? '';

    let itinerary;
    try {
      itinerary = JSON.parse(text);
    } catch {
      return NextResponse.json({ error: 'Failed to parse itinerary', raw: text }, { status: 500 });
    }

    return NextResponse.json({ itinerary });
  } catch (err: unknown) {
    console.error('Trip planner error:', err);
    const msg = err instanceof Error ? err.message : String(err);
    if (msg.includes('429') || msg.includes('rate_limit')) {
      return NextResponse.json({ error: 'Too many requests. Please wait a moment and try again.' }, { status: 429 });
    }
    if (msg.includes('401') || msg.includes('invalid_api_key')) {
      return NextResponse.json({ error: 'Invalid API key. Please check configuration.' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Failed to generate itinerary. Please try again.' }, { status: 500 });
  }
}
