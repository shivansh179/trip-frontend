import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firestore';
import { PACKAGE_DEFAULTS } from '@/lib/packageDefaults';

export async function GET() {
  try {
    const snap = await db().collection('package_prices').get();
    const docsMap: Record<string, Record<string, unknown>> = {};
    snap.docs.forEach(d => { docsMap[d.id] = d.data(); });

    const result = Object.entries(PACKAGE_DEFAULTS).map(([slug, defaults]) => {
      const override = docsMap[slug];
      return {
        slug,
        label: defaults.label,
        priceINR: (override?.priceINR as number) ?? defaults.priceINR,
        originalPriceINR: (override?.originalPriceINR as number) ?? defaults.originalPriceINR,
        defaultPriceINR: defaults.priceINR,
        defaultOriginalPriceINR: defaults.originalPriceINR,
        updatedAt: override?.updatedAt ?? null,
      };
    });

    return NextResponse.json({ data: result });
  } catch (err) {
    console.error('package-prices GET error:', err);
    const result = Object.entries(PACKAGE_DEFAULTS).map(([slug, defaults]) => ({
      slug, label: defaults.label,
      priceINR: defaults.priceINR, originalPriceINR: defaults.originalPriceINR,
      defaultPriceINR: defaults.priceINR, defaultOriginalPriceINR: defaults.originalPriceINR,
      updatedAt: null,
    }));
    return NextResponse.json({ data: result });
  }
}

export async function PUT(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { slug, priceINR, originalPriceINR } = await req.json();

  if (!slug || !PACKAGE_DEFAULTS[slug]) return NextResponse.json({ error: 'Invalid package slug' }, { status: 400 });
  if (!priceINR || Number(priceINR) <= 0) return NextResponse.json({ error: 'Invalid price' }, { status: 400 });

  try {
    await db().collection('package_prices').doc(slug).set({
      slug,
      label: PACKAGE_DEFAULTS[slug].label,
      priceINR: Number(priceINR),
      originalPriceINR: originalPriceINR ? Number(originalPriceINR) : null,
      updatedAt: new Date().toISOString(),
    }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('package-prices PUT error:', err);
    return NextResponse.json({ error: 'Failed to update price' }, { status: 500 });
  }
}
