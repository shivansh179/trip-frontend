import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStory extends Document {
  title: string;
  author: {
    name: string;
    email: string;
    image?: string;
  };
  destination: string;
  duration: string;      // e.g. "5 days"
  coverImage: string;    // Cloudinary URL
  excerpt: string;       // auto-generated from content
  content: string;       // TipTap HTML
  tags: string[];
  likes: number;
  likedBy: string[];     // array of emails
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StorySchema = new Schema<IStory>(
  {
    title: { type: String, required: true, trim: true },
    author: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      image: String,
    },
    destination: { type: String, required: true, trim: true },
    duration: { type: String, default: '' },
    coverImage: { type: String, default: '' },
    excerpt: { type: String, default: '' },
    content: { type: String, required: true },
    tags: [{ type: String }],
    likes: { type: Number, default: 0 },
    likedBy: [{ type: String }],
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

StorySchema.index({ destination: 1 });
StorySchema.index({ createdAt: -1 });
StorySchema.index({ likes: -1 });

const Story: Model<IStory> =
  mongoose.models.Story ?? mongoose.model<IStory>('Story', StorySchema);

export default Story;
