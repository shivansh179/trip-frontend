import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Story from '@/models/Story';

// GET /api/stories/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await connectDB();
    const story = await Story.findById(id).lean();
    if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ story });
  } catch (err) {
    console.error('[GET /api/stories/:id]', err);
    return NextResponse.json({ error: 'Failed to fetch story' }, { status: 500 });
  }
}

// POST /api/stories/:id/like — toggle like
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }
    const url = new URL(req.url);
    if (!url.pathname.endsWith('/like')) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const { id } = await params;
    await connectDB();
    const email = session.user.email;
    const story = await Story.findById(id);
    if (!story) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const alreadyLiked = story.likedBy.includes(email);
    if (alreadyLiked) {
      story.likedBy = story.likedBy.filter((e: string) => e !== email);
      story.likes = Math.max(0, story.likes - 1);
    } else {
      story.likedBy.push(email);
      story.likes += 1;
    }
    await story.save();

    return NextResponse.json({ likes: story.likes, liked: !alreadyLiked });
  } catch (err) {
    console.error('[POST /api/stories/:id]', err);
    return NextResponse.json({ error: 'Failed to like story' }, { status: 500 });
  }
}
