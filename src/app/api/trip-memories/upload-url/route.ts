import { NextRequest, NextResponse } from 'next/server';
import { Storage } from '@google-cloud/storage';

const BUCKET = process.env.GCS_BUCKET_NAME || '';

function getStorage(): Storage | null {
  try {
    const raw = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || '';
    if (!raw || !BUCKET) return null;
    const credentials = JSON.parse(raw);
    return new Storage({ credentials, projectId: credentials.project_id });
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const { mediaType, fileName, contentType } = await req.json() as {
    mediaType: 'photo' | 'video';
    fileName: string;
    contentType: string;
  };

  if (!mediaType || !fileName || !contentType) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const storage = getStorage();
  if (!storage) {
    return NextResponse.json({ error: 'GCS not configured' }, { status: 503 });
  }

  // Separate folders: trip-memories/photos/ and trip-memories/videos/
  const folder = mediaType === 'video' ? 'trip-memories/videos' : 'trip-memories/photos';
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectName = `${folder}/${Date.now()}-${safeName}`;

  try {
    const [signedUrl] = await storage
      .bucket(BUCKET)
      .file(objectName)
      .generateSignedPostPolicyV4({
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
        conditions: [
          ['content-length-range', 0, 150 * 1024 * 1024], // up to 150 MB
          ['starts-with', '$Content-Type', mediaType === 'video' ? 'video/' : 'image/'],
        ],
        fields: { 'Content-Type': contentType },
      });

    const fileUrl = `https://storage.googleapis.com/${BUCKET}/${objectName}`;
    return NextResponse.json({ url: signedUrl.url, fields: signedUrl.fields, fileUrl });
  } catch (err) {
    console.error('[upload-url]', err);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
