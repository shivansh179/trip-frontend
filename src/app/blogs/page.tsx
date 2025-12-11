'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock, User, ArrowRight } from 'lucide-react';
import PageHero from '@/components/PageHero';
import { api } from '@/lib/api';

interface Blog {
  id: number;
  title: string;
  content: string;
  shortDescription: string;
  imageUrl: string;
  slug: string;
  authorName: string;
  publishedDate: string;
  category: string;
  readTime: string;
  isFeatured: boolean;
}

const categories = ['All', 'Destinations', 'Philosophy', 'Responsible Travel', 'Tips', 'Food & Culture', 'Guides'];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await api.getBlogs();
        setBlogs(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching blogs:', err);
        setError('Unable to load blogs. Please ensure the backend is running.');
        setBlogs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Filter by category (client-side)
  const filteredBlogs = activeCategory === 'All'
    ? blogs
    : blogs.filter(b => b.category === activeCategory);

  const featuredPost = filteredBlogs.find(b => b.isFeatured);
  const regularPosts = filteredBlogs.filter(b => !b.isFeatured);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <>
      <PageHero
        title="The Journal"
        subtitle="Stories, insights, and inspiration from our travels around the world. Discover new perspectives on destinations, cultures, and the art of meaningful travel."
        breadcrumb="Journal"
      />

      {/* Categories */}
      <section className="py-6 border-b border-primary/10 bg-cream">
        <div className="section-container">
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2.5 text-caption uppercase tracking-widest transition-all ${activeCategory === category
                    ? 'bg-primary text-cream'
                    : 'bg-cream-dark text-primary hover:bg-primary/10'
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Error Banner */}
      {error && (
        <div className="bg-terracotta/10 border-l-4 border-terracotta px-6 py-4">
          <div className="section-container">
            <p className="text-terracotta text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Featured Post */}
      {!loading && featuredPost && (
        <section className="py-16 md:py-24 bg-cream">
          <div className="section-container">
            <Link href={`/blogs/${featuredPost.slug}`} className="group grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="relative h-[400px] lg:h-[500px] overflow-hidden">
                <Image
                  src={featuredPost.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'}
                  alt={featuredPost.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center lg:pl-8">
                <span className="text-caption uppercase tracking-widest text-secondary mb-4">
                  {featuredPost.category}
                </span>
                <h2 className="font-display text-display-lg text-primary group-hover:text-secondary transition-colors mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-primary/60 text-body-lg mb-6">
                  {featuredPost.shortDescription}
                </p>
                <div className="flex items-center gap-6 text-sm text-primary/50">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{featuredPost.authorName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{featuredPost.readTime || '5 min'} read</span>
                  </div>
                  <span>{formatDate(featuredPost.publishedDate)}</span>
                </div>
                <div className="mt-8">
                  <span className="btn-ghost text-primary group-hover:text-secondary">
                    Read Article <ArrowRight className="w-4 h-4 inline ml-1" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* All Posts Grid */}
      <section className="py-16 md:py-24 bg-cream-dark">
        <div className="section-container">
          <h2 className="font-display text-display-lg text-primary mb-12">
            Latest Stories
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-[400px] bg-cream animate-pulse" />
              ))}
            </div>
          ) : regularPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {regularPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/${post.slug}`}
                  className="group block bg-cream overflow-hidden transition-all duration-500 hover:shadow-xl"
                >
                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={post.imageUrl || 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&q=80'}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1.5 bg-cream text-caption uppercase tracking-widest">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-xl text-primary group-hover:text-secondary transition-colors mb-3 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-primary/60 text-sm line-clamp-2 mb-4">
                      {post.shortDescription}
                    </p>
                    <div className="flex items-center justify-between text-caption text-primary/50">
                      <span>{post.authorName}</span>
                      <span>{post.readTime || '5 min'}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-primary/60">No blog posts available.</p>
            </div>
          )}

          {regularPosts.length > 0 && (
            <div className="text-center mt-12">
              <button className="btn-outline">
                <span>Load More Stories</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-cream">
        <div className="section-container text-center">
          <h2 className="font-display text-display-lg mb-4">
            Never miss a story
          </h2>
          <p className="text-cream/60 text-body-lg max-w-xl mx-auto mb-10">
            Get travel inspiration, tips, and exclusive content delivered to your inbox.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-5 py-4 bg-white/10 border border-white/20 text-cream placeholder:text-cream/40 focus:outline-none focus:border-accent"
            />
            <button type="submit" className="btn-primary bg-accent text-primary hover:bg-accent-warm">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}