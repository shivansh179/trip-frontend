import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import { PackagePrice } from '@/lib/db/models';
import { PACKAGE_DEFAULTS } from '@/lib/packageDefaults';

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
