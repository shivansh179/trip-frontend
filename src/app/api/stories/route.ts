import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/mongodb';
import Story from '@/models/Story';

function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200);
}

// GET /api/stories?sort=latest|likes&destination=&page=1&limit=12
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const sort = searchParams.get('sort') ?? 'latest';
    const destination = searchParams.get('destination') ?? '';
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(24, Number(searchParams.get('limit') ?? 12));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = { published: true };
    if (destination) filter.destination = { $regex: destination, $options: 'i' };

    const sortOrder = sort === 'likes' ? { likes: -1 } : { createdAt: -1 };

    const [stories, total] = await Promise.all([
      Story.find(filter)
        .sort(sortOrder as never)
        .skip(skip)
        .limit(limit)
        .select('-content -likedBy')
        .lean(),
      Story.countDocuments(filter),
    ]);

    return NextResponse.json({ stories, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    console.error('[GET /api/stories]', err);
    return NextResponse.json({ error: 'Failed to fetch stories' }, { status: 500 });
  }
}

// POST /api/stories — requires auth
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Login required' }, { status: 401 });
    }

    const body = await req.json();
    const { title, destination, duration, coverImage, content, tags } = body;

    if (!title || !destination || !content) {
      return NextResponse.json({ error: 'title, destination, and content are required' }, { status: 400 });
    }

    await connectDB();

    const story = await Story.create({
      title: title.trim(),
      author: {
        name: session.user.name ?? 'Traveller',
        email: session.user.email,
        image: session.user.image ?? '',
      },
      destination: destination.trim(),
      duration: duration ?? '',
      coverImage: coverImage ?? '',
      excerpt: stripHtml(content),
      content,
      tags: Array.isArray(tags) ? tags : [],
    });

    return NextResponse.json({ story }, { status: 201 });
  } catch (err) {
    console.error('[POST /api/stories]', err);
    return NextResponse.json({ error: 'Failed to create story' }, { status: 500 });
  }
}
