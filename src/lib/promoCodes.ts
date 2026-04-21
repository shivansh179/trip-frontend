// Promo code validation and data live server-side in /api/promos/validate and /api/promos/list.
// Only the display type is kept here for component props.

export interface PromoCode {
  code: string;
  title: string;
  desc: string;
  type: 'percent' | 'flat';
  value: number;
  minOrder: number;
  validTill: string;
}
