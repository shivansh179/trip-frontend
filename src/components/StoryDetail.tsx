'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Heart, MapPin, Clock, Calendar, ArrowLeft, Share2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface StoryFull {
  _id: string;
  title: string;
  author: { name: string; email: string; image?: string };
  destination: string;
  duration: string;
  coverImage: string;
  content: string;
  tags: string[];
  likes: number;
  createdAt: string;
}

const FALLBACK = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80';

export default function StoryDetail({ id }: { id: string }) {
  const { data: session } = useSession();
  const [story, setStory] = useState<StoryFull | null>(null);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch(`/api/stories/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setStory(data.story);
        setLikes(data.story.likes);
        setLoading(false);
      });
  }, [id]);

  async function handleLike() {
    if (!session) { signIn('google'); return; }
    if (liking) return;
    setLiking(true);
    const res = await fetch(`/api/stories/${id}/like`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    }
    setLiking(false);
  }

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: story?.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream-light animate-pulse">
        <div className="h-72 bg-sand/60" />
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-4">
          <div className="h-8 bg-sand/60 rounded w-3/4" />
          <div className="h-4 bg-sand/60 rounded w-1/2" />
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-4 bg-sand/60 rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">🏕️</p>
        <p className="font-display text-2xl text-primary">Story not found</p>
        <Link href="/stories" className="text-accent text-sm font-semibold hover:underline">
          ← Back to stories
        </Link>
      </div>
    );
  }

  const date = new Date(story.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-cream-light pb-16">
      {/* Cover */}
      <div className="relative h-72 md:h-96">
        <Image
          src={story.coverImage || FALLBACK}
          alt={story.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60" />

        {/* Back */}
        <Link
          href="/stories"
          className="absolute top-5 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-semibold text-primary hover:bg-white transition-colors"
        >
          <ArrowLeft size={15} />
          Stories
        </Link>

        {/* Actions */}
        <div className="absolute top-5 right-4 flex gap-2">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-semibold transition-all hover:scale-105 min-h-[44px]"
          >
            <Heart size={14} className={liked ? 'fill-red-500 text-red-500' : 'text-secondary'} />
            <span className={liked ? 'text-red-500' : 'text-secondary'}>{likes}</span>
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2.5 text-sm font-semibold text-secondary hover:bg-white transition-colors min-h-[44px]"
          >
            <Share2 size={14} />
            {copied ? 'Copied!' : 'Share'}
          </button>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-6">
          <div className="max-w-2xl mx-auto">
            {story.tags.length > 0 && (
              <div className="flex gap-1.5 mb-3 flex-wrap">
                {story.tags.map((tag) => (
                  <span key={tag} className="bg-accent/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            )}
            <h1 className="font-display text-2xl md:text-4xl text-white leading-tight">
              {story.title}
            </h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pt-8">
        {/* Author & meta */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-sand/60">
          {story.author.image ? (
            <Image
              src={story.author.image}
              alt={story.author.name}
              width={44}
              height={44}
              className="rounded-full"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
              {story.author.name[0]}
            </div>
          )}
          <div>
            <p className="font-semibold text-primary text-sm">{story.author.name}</p>
            <div className="flex items-center gap-3 text-xs text-secondary/70 mt-0.5">
              <span className="flex items-center gap-1"><Calendar size={11} />{date}</span>
              <span className="flex items-center gap-1"><MapPin size={11} />{story.destination}</span>
              {story.duration && (
                <span className="flex items-center gap-1"><Clock size={11} />{story.duration}</span>
              )}
            </div>
          </div>
        </div>

        {/* Story body */}
        <div
          className="prose prose-sm max-w-none text-primary leading-relaxed prose-headings:font-display prose-headings:text-primary prose-a:text-accent"
          dangerouslySetInnerHTML={{ __html: story.content }}
        />

        {/* CTA */}
        <div className="mt-12 bg-primary rounded-2xl p-6 text-center">
          <p className="font-display text-xl text-white mb-2">Inspired by this story?</p>
          <p className="text-white/70 text-sm mb-5">
            Let YlooTrips plan your own adventure to {story.destination}.
          </p>
          <Link
            href={`/trip-planner?q=${encodeURIComponent(story.destination)}`}
            className="inline-block bg-accent text-primary font-semibold px-6 py-3 rounded-full hover:bg-accent/90 transition-colors"
          >
            Plan my trip to {story.destination}
          </Link>
        </div>
      </div>
    </div>
  );
}
