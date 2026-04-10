'use client';

import { useState, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import {
  Bold, Italic, List, ListOrdered, Heading2,
  ImageIcon, Upload, X, Loader2, ArrowLeft,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function ToolbarButton({
  onClick, active, children,
}: {
  onClick: () => void;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`p-2.5 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center ${
        active ? 'bg-primary text-white' : 'text-secondary hover:bg-sand/60'
      }`}
    >
      {children}
    </button>
  );
}

export default function WriteStory() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [destination, setDestination] = useState('');
  const [duration, setDuration] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverPreview, setCoverPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Tell your story… Share the sights, smells, people, and moments that made this trip unforgettable.',
      }),
    ],
    editorProps: {
      attributes: {
        class:
          'prose prose-sm max-w-none min-h-[200px] md:min-h-[320px] focus:outline-none text-primary leading-relaxed',
      },
    },
  });

  const handleCoverUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      setUploading(true);
      const objectUrl = URL.createObjectURL(file);
      setCoverPreview((prev) => { if (prev) URL.revokeObjectURL(prev); return objectUrl; });

      const fd = new FormData();
      fd.append('file', file);
      const res = await fetch('/api/stories/upload', { method: 'POST', body: fd });
      if (res.ok) {
        const { url } = await res.json();
        setCoverImage(url);
      } else {
        setError('Cover upload failed. Check Cloudinary config.');
        setCoverPreview('');
      }
      setUploading(false);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const content = editor?.getHTML() ?? '';
    if (!title.trim() || !destination.trim() || !content || content === '<p></p>') {
      setError('Title, destination, and story content are required.');
      return;
    }
    setSubmitting(true);

    const res = await fetch('/api/stories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        destination,
        duration,
        coverImage,
        content,
        tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      }),
    });

    if (res.ok) {
      const { story } = await res.json();
      router.push(`/stories/${story._id}`);
    } else {
      const data = await res.json();
      setError(data.error ?? 'Failed to publish story.');
      setSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-cream-light flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={32} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-cream-light flex flex-col items-center justify-center gap-5 px-4 text-center">
        <p className="text-5xl">✍️</p>
        <h2 className="font-display text-3xl text-primary">Share your story</h2>
        <p className="text-secondary max-w-sm">
          Sign in with Google to publish your travelogue and inspire the community.
        </p>
        <button
          onClick={() => signIn('google')}
          className="bg-accent text-primary font-semibold px-8 py-3 rounded-full hover:bg-accent/90 transition-colors"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-light pb-16">
      {/* Top bar */}
      <header className="bg-white border-b border-sand/50 py-4 px-4 sticky top-0 z-30">
        <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
          <Link href="/stories" className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Stories</span>
          </Link>
          <span className="font-display text-lg text-primary">Write a Story</span>
          <button
            onClick={handleSubmit}
            disabled={submitting || uploading}
            className="bg-accent text-primary text-sm font-semibold px-5 py-2 rounded-full hover:bg-accent/90 transition-colors disabled:opacity-60 flex items-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {submitting ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-8 space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        {/* Cover image */}
        <div>
          {coverPreview ? (
            <div className="relative rounded-2xl overflow-hidden h-56 group">
              <Image src={coverPreview} alt="cover" fill className="object-cover" />
              {uploading && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Loader2 className="animate-spin text-white" size={32} />
                </div>
              )}
              <button
                type="button"
                onClick={() => { setCoverPreview(''); setCoverImage(''); }}
                className="absolute top-3 right-3 bg-white/90 rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center gap-3 h-44 rounded-2xl border-2 border-dashed border-sand/80 bg-white cursor-pointer hover:bg-cream-light transition-colors">
              <ImageIcon size={28} className="text-secondary/40" />
              <span className="text-sm text-secondary">Add a cover photo</span>
              <span className="flex items-center gap-1.5 text-xs font-semibold text-accent">
                <Upload size={12} />
                Upload image
              </span>
              <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
            </label>
          )}
        </div>

        {/* Meta fields */}
        <div className="bg-white rounded-2xl p-5 space-y-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Story title…"
            className="w-full font-display text-2xl text-primary placeholder:text-secondary/40 outline-none border-b border-sand/60 pb-3"
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                Destination *
              </label>
              <input
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="e.g. Spiti Valley, Himachal"
                className="w-full text-sm text-primary bg-cream-light rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
                Duration
              </label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 7 days"
                className="w-full text-sm text-primary bg-cream-light rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-secondary uppercase tracking-wider mb-1 block">
              Tags (comma separated)
            </label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Adventure, Mountains, Solo Travel"
              className="w-full text-sm text-primary bg-cream-light rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="bg-white rounded-2xl overflow-hidden">
          {/* Toolbar */}
          <div className="flex items-center gap-0.5 px-3 py-2 border-b border-sand/50 flex-wrap">
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBold().run()}
              active={editor?.isActive('bold')}
            >
              <Bold size={15} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              active={editor?.isActive('italic')}
            >
              <Italic size={15} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              active={editor?.isActive('heading', { level: 2 })}
            >
              <Heading2 size={15} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              active={editor?.isActive('bulletList')}
            >
              <List size={15} />
            </ToolbarButton>
            <ToolbarButton
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              active={editor?.isActive('orderedList')}
            >
              <ListOrdered size={15} />
            </ToolbarButton>
          </div>

          {/* Editor area */}
          <div className="p-5">
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center gap-3 text-sm text-secondary">
          {session.user?.image && (
            <Image
              src={session.user.image}
              alt={session.user.name ?? ''}
              width={32}
              height={32}
              className="rounded-full"
            />
          )}
          <span>
            Publishing as <strong className="text-primary">{session.user?.name}</strong>
          </span>
        </div>
      </main>
    </div>
  );
}
