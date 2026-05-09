import mongoose from 'mongoose';

// ── Review ────────────────────────────────────────────────────────────────────
const reviewSchema = new mongoose.Schema({
  id:           { type: String, required: true, unique: true },
  name:         String,
  email:        String,
  phone:        String,
  country:      String,
  trip:         String,
  rating:       Number,
  text:         String,
  status:       { type: String, default: 'pending' },
  adminNote:    String,
  avatarUrl:    String,
  tripPhotoUrl: String,
  createdAt:    String,
}, { collection: 'reviews' });

export const Review =
  (mongoose.models.Review as mongoose.Model<mongoose.InferSchemaType<typeof reviewSchema>>) ||
  mongoose.model('Review', reviewSchema);

// ── Generic booking (market / hotel / flight) — flexible schema ───────────────
function bookingModel(name: string, collection: string) {
  return (
    (mongoose.models[name] as mongoose.Model<Record<string, unknown>>) ||
    mongoose.model<Record<string, unknown>>(name, new mongoose.Schema({}, { strict: false, collection }))
  );
}

export const MarketBooking = bookingModel('MarketBooking', 'market_bookings');
export const HotelBooking  = bookingModel('HotelBooking',  'hotel_bookings');
export const FlightBooking = bookingModel('FlightBooking', 'flight_bookings');

// ── Package Price overrides (admin-editable prices for featured pages) ────────
const packagePriceSchema = new mongoose.Schema({
  slug:             { type: String, required: true, unique: true },
  label:            String,
  priceINR:         { type: Number, required: true },
  originalPriceINR: { type: Number },
  updatedAt:        { type: String },
}, { collection: 'package_prices' });

export const PackagePrice =
  (mongoose.models.PackagePrice as mongoose.Model<mongoose.InferSchemaType<typeof packagePriceSchema>>) ||
  mongoose.model('PackagePrice', packagePriceSchema);

// ── Trip seat tracking (confirmed bookings per date) ─────────────────────────
const tripSeatSchema = new mongoose.Schema({
  tripId:      { type: Number, required: true },
  date:        { type: String, required: true }, // YYYY-MM-DD
  seatsBooked: { type: Number, default: 0 },
}, { collection: 'trip_seats' });

tripSeatSchema.index({ tripId: 1, date: 1 }, { unique: true });

export const TripSeat =
  (mongoose.models.TripSeat as mongoose.Model<mongoose.InferSchemaType<typeof tripSeatSchema>>) ||
  mongoose.model('TripSeat', tripSeatSchema);
