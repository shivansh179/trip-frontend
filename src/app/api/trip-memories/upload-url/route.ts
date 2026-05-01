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
    // GCS not configured — caller will skip file upload and save metadata only
    return NextResponse.json({ error: 'GCS not configured' }, { status: 503 });
  }

  const folder = mediaType === 'video' ? 'trip-memories/videos' : 'trip-memories/photos';
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const objectName = `${folder}/${Date.now()}-${safeName}`;

  try {
    // Signed PUT URL — browser uploads directly with fetch PUT, no FormData needed
    const [signedUrl] = await storage
      .bucket(BUCKET)
      .file(objectName)
      .getSignedUrl({
        version: 'v4',
        action: 'write',
        expires: Date.now() + 15 * 60 * 1000, // 15 min window
        contentType,
      });

    // Public read URL (bucket must have allUsers Storage Object Viewer IAM)
    const fileUrl = `https://storage.googleapis.com/${BUCKET}/${objectName}`;

    return NextResponse.json({ signedUrl, fileUrl });
  } catch (err) {
    console.error('[upload-url]', err);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
