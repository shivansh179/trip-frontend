import { db } from '@/lib/firestore';
import { PACKAGE_DEFAULTS } from '@/lib/packageDefaults';

export async function getPackagePrice(slug: string): Promise<{ priceINR: number; originalPriceINR: number }> {
  const defaults = PACKAGE_DEFAULTS[slug];
  if (!defaults) return { priceINR: 0, originalPriceINR: 0 };

  try {
    const snap = await db().collection('package_prices').doc(slug).get();
    const override = snap.data();
    return {
      priceINR: (override?.priceINR as number) ?? defaults.priceINR,
      originalPriceINR: (override?.originalPriceINR as number) ?? defaults.originalPriceINR,
    };
  } catch {
    return { priceINR: defaults.priceINR, originalPriceINR: defaults.originalPriceINR };
  }
}
