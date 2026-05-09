import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PackagePrice } from '@/lib/db/models';

// Default prices for all featured package pages
export const PACKAGE_DEFAULTS: Record<string, { label: string; priceINR: number; originalPriceINR: number }> = {
  'thailand-budget-trip':          { label: 'Thailand Budget Trip (5N)',          priceINR: 49499, originalPriceINR: 61999 },
  'bali-honeymoon-package':        { label: 'Bali Honeymoon Package (6N)',        priceINR: 52499, originalPriceINR: 65999 },
  'dubai-tour-package-from-delhi': { label: 'Dubai Tour Package from Delhi (5N)', priceINR: 36499, originalPriceINR: 46999 },
  'singapore-tour-package':        { label: 'Singapore Tour Package (4N)',        priceINR: 44999, originalPriceINR: 42999 },
  'maldives-luxury-package':       { label: 'Maldives Luxury Package (4N)',       priceINR: 89999, originalPriceINR: 115000 },
  'goa-tour-package':              { label: 'Goa Tour Package (3N)',              priceINR: 9999,  originalPriceINR: 13999 },
  'kashmir-tour-package':          { label: 'Kashmir Tour Package (5N)',          priceINR: 18999, originalPriceINR: 24999 },
  'kerala-tour-package':           { label: 'Kerala Tour Package (5N)',           priceINR: 15999, originalPriceINR: 21999 },
  'manali-tour-package':           { label: 'Manali Tour Package (4N)',           priceINR: 6999,  originalPriceINR: 9999 },
};

export async function GET() {
  await connectDB();
  const docs = await PackagePrice.find({}).lean();
  const docsMap = Object.fromEntries(docs.map(d => [d.slug, d]));

  const result = Object.entries(PACKAGE_DEFAULTS).map(([slug, defaults]) => {
    const override = docsMap[slug];
    return {
      slug,
      label: defaults.label,
      priceINR: override?.priceINR ?? defaults.priceINR,
      originalPriceINR: override?.originalPriceINR ?? defaults.originalPriceINR,
      defaultPriceINR: defaults.priceINR,
      defaultOriginalPriceINR: defaults.originalPriceINR,
      updatedAt: override?.updatedAt ?? null,
    };
  });

  return NextResponse.json({ data: result });
}

export async function PUT(req: NextRequest) {
  const adminToken = req.headers.get('x-admin-token');
  if (!adminToken) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { slug, priceINR, originalPriceINR } = body;

  if (!slug || !PACKAGE_DEFAULTS[slug]) {
    return NextResponse.json({ error: 'Invalid package slug' }, { status: 400 });
  }
  if (!priceINR || Number(priceINR) <= 0) {
    return NextResponse.json({ error: 'Invalid price' }, { status: 400 });
  }

  await connectDB();
  await PackagePrice.findOneAndUpdate(
    { slug },
    {
      slug,
      label: PACKAGE_DEFAULTS[slug].label,
      priceINR: Math.round(Number(priceINR)),
      originalPriceINR: originalPriceINR ? Math.round(Number(originalPriceINR)) : undefined,
      updatedAt: new Date().toISOString(),
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true });
}
