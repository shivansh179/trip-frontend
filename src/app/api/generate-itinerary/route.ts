import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { title, destination, duration, highlights, description } = await req.json();
    if (!title && !destination) {
      return NextResponse.json({ error: 'Missing trip info' }, { status: 400 });
    }

    // Infer number of days from duration string (e.g. "4D/3N" → 4)
    const dayMatch = (duration || '').match(/(\d+)\s*[Dd]/);
    const numDays = dayMatch ? parseInt(dayMatch[1]) : 4;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content: 'You are a travel itinerary expert for Indian destinations. Respond ONLY with valid raw JSON — no markdown, no code fences, no explanation.',
        },
        {
          role: 'user',
          content: `Generate a ${numDays}-day itinerary for this trip:
Trip: "${title || destination}"
Destination: ${destination || 'India'}
${description ? `Overview: ${description}` : ''}
${Array.isArray(highlights) && highlights.length ? `Highlights: ${highlights.join(', ')}` : ''}

Return this exact JSON array (${numDays} items):
[
  {
    "dayNumber": 1,
    "dayTitle": "Short exciting title for the day",
    "description": "2-3 sentence engaging overview of the day",
    "activities": ["Specific activity 1", "Specific activity 2", "Specific activity 3"]
  }
]

Make each day exciting and specific to ${destination || title}. Incorporate the highlights above if provided. Max 4 activities per day.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1200,
    });

    const raw = completion.choices[0]?.message?.content?.trim() ?? '';
    const json = raw.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '');
    const itinerary = JSON.parse(json);

    if (!Array.isArray(itinerary)) throw new Error('Invalid response format');
    return NextResponse.json({ itinerary });
  } catch (err) {
    console.error('Itinerary generation error:', err);
    return NextResponse.json({ error: 'Failed to generate itinerary' }, { status: 500 });
  }
}
