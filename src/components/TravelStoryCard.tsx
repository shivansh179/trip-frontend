'use client';

import { Heart, MapPin, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signIn } from 'next-auth/react';

export interface StoryMeta {
  _id: string;
  title: string;
  author: { name: string; email: string; image?: string };
  destination: string;
  duration: string;
  coverImage: string;
  excerpt: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

interface Props {
  story: StoryMeta;
}

const FALLBACK =
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80';

export default function TravelStoryCard({ story }: Props) {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(story.likes);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  const date = new Date(story.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    if (!session) { signIn('google'); return; }
    if (loading) return;
    setLoading(true);
    const res = await fetch(`/api/stories/${story._id}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    }
    setLoading(false);
  }

  return (
    <Link href={`/stories/${story._id}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-sand/50">
        {/* Cover */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={story.coverImage || FALLBACK}
            alt={story.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Like button */}
          <button
            onClick={handleLike}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-3 py-2 text-xs font-semibold transition-all hover:scale-110 min-h-[36px]"
          >
            <Heart
              size={13}
              className={liked ? 'fill-red-500 text-red-500' : 'text-secondary'}
            />
            <span className={liked ? 'text-red-500' : 'text-secondary'}>{likes}</span>
          </button>

          {/* Tags */}
          {story.tags.length > 0 && (
            <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
              {story.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="bg-accent/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4">
          {/* Author */}
          <div className="flex items-center gap-2 mb-3">
            {story.author.image ? (
              <Image
                src={story.author.image}
                alt={story.author.name}
                width={28}
                height={28}
                className="rounded-full"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                {story.author.name[0]}
              </div>
            )}
            <span className="text-xs text-secondary font-medium">{story.author.name}</span>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-secondary/60">
              <Calendar size={11} />
              {date}
            </span>
          </div>

          <h3 className="font-display text-lg text-primary leading-snug mb-1.5 group-hover:text-accent transition-colors line-clamp-2">
            {story.title}
          </h3>
          <p className="text-sm text-secondary line-clamp-2 mb-3">{story.excerpt}</p>

          <div className="flex items-center gap-3 text-[11px] text-secondary/70">
            <span className="flex items-center gap-1">
              <MapPin size={11} />
              {story.destination}
            </span>
            {story.duration && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {story.duration}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
