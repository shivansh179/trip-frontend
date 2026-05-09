import { connectDB } from '@/lib/mongodb';
import { PackagePrice } from '@/lib/db/models';
import { PACKAGE_DEFAULTS } from '@/lib/packageDefaults';

export async function getPackagePrice(slug: string): Promise<{ priceINR: number; originalPriceINR: number }> {
  const defaults = PACKAGE_DEFAULTS[slug];
  if (!defaults) return { priceINR: 0, originalPriceINR: 0 };

  try {
    await connectDB();
    const override = await PackagePrice.findOne({ slug }).lean();
    return {
      priceINR: override?.priceINR ?? defaults.priceINR,
      originalPriceINR: override?.originalPriceINR ?? defaults.originalPriceINR,
    };
  } catch {
    return { priceINR: defaults.priceINR, originalPriceINR: defaults.originalPriceINR };
  }
}
