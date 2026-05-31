import { NextRequest, NextResponse } from 'next/server';
import { createSign, createHash } from 'node:crypto';

const BUCKET = process.env.GCS_BUCKET_NAME || '';

function generateV4SignedUrl(
  privateKeyPem: string,
  serviceAccount: string,
  bucket: string,
  objectName: string,
  contentType: string,
  expiresSeconds = 900
): string {
  const now = new Date();
  const datetime = now.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
  const date = datetime.slice(0, 8);

  const credentialScope = `${date}/auto/storage/goog4_request`;
  const credential = `${serviceAccount}/${credentialScope}`;

  const queryParams: [string, string][] = [
    ['X-Goog-Algorithm', 'GOOG4-RSA-SHA256'],
    ['X-Goog-Credential', credential],
    ['X-Goog-Date', datetime],
    ['X-Goog-Expires', String(expiresSeconds)],
    ['X-Goog-SignedHeaders', 'content-type;host'],
  ];
  const canonicalQueryString = queryParams
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join('&');

  const canonicalHeaders = `content-type:${contentType}\nhost:storage.googleapis.com\n`;
  const signedHeaders = 'content-type;host';

  const encodedObject = objectName.split('/').map(encodeURIComponent).join('/');
  const canonicalUri = `/${bucket}/${encodedObject}`;

  const canonicalRequest = [
    'PUT', canonicalUri, canonicalQueryString,
    canonicalHeaders, signedHeaders, 'UNSIGNED-PAYLOAD',
  ].join('\n');

  const requestHash = createHash('sha256').update(canonicalRequest, 'utf8').digest('hex');
  const stringToSign = ['GOOG4-RSA-SHA256', datetime, credentialScope, requestHash].join('\n');

  const signer = createSign('RSA-SHA256');
  signer.update(stringToSign, 'utf8');
  const signature = signer.sign(privateKeyPem, 'hex');

  return `https://storage.googleapis.com${canonicalUri}?${canonicalQueryString}&X-Goog-Signature=${signature}`;
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

  const raw = process.env.GOOGLE_CLOUD_CREDENTIALS_JSON || '';
  if (!raw || !BUCKET) {
    return NextResponse.json({ error: 'GCS not configured' }, { status: 503 });
  }

  try {
    const creds = JSON.parse(raw);
    const folder = mediaType === 'video' ? 'trip-memories/videos' : 'trip-memories/photos';
    const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const objectName = `${folder}/${Date.now()}-${safeName}`;

    const signedUrl = generateV4SignedUrl(
      creds.private_key, creds.client_email, BUCKET, objectName, contentType
    );
    const fileUrl = `https://storage.googleapis.com/${BUCKET}/${objectName}`;

    return NextResponse.json({ signedUrl, fileUrl });
  } catch (err) {
    console.error('[upload-url]', err);
    return NextResponse.json({ error: 'Failed to generate upload URL' }, { status: 500 });
  }
}
