import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;
const ReviewSchema = new mongoose.Schema({ name: String, email: String, country: String, trip: String, rating: Number, text: String, avatarUrl: String, tripPhotoUrl: String, platform: String, status: String }, { timestamps: true });
const Review = mongoose.models.Review ?? mongoose.model('Review', ReviewSchema);

await mongoose.connect(MONGODB_URI);
const r = await Review.findByIdAndUpdate('69dc8fdcf597a09c7f3c2f64', { name: 'Avnish and Shivani' });
console.log('Updated name from:', r.name, '→ Avnish and Shivani');
await mongoose.disconnect();
