/**
 * Run: node scripts/get-google-refresh-token.mjs
 * Generates a fresh Google OAuth refresh token for Sheets access.
 */

import { createServer } from 'http';
import { google } from 'googleapis';

const CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI  = 'http://localhost:4242/oauth/callback';

if (!CLIENT_ID || !CLIENT_SECRET) {
  console.error('\n❌  Missing env vars. Run like this:\n');
  console.error('  GOOGLE_CLIENT_ID=xxx GOOGLE_CLIENT_SECRET=yyy node scripts/get-google-refresh-token.mjs\n');
  process.exit(1);
}

const oauth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

const authUrl = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  prompt: 'consent',          // force consent so a refresh_token is always returned
  scope: [
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/drive.file',
  ],
});

console.log('\n🔗  Open this URL in your browser:\n');
console.log(authUrl);
console.log('\n⏳  Waiting for Google to redirect to localhost:4242 ...\n');

// Spin up a tiny local server to capture the auth code
const server = createServer(async (req, res) => {
  if (!req.url?.startsWith('/oauth/callback')) return;

  const url   = new URL(req.url, 'http://localhost:4242');
  const code  = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    res.end(`<h2>❌ Error: ${error}</h2>`);
    console.error('\n❌  OAuth error:', error);
    server.close();
    return;
  }

  if (!code) {
    res.end('<h2>❌ No code in redirect</h2>');
    server.close();
    return;
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    res.end('<h2>✅ Success! Check your terminal for the refresh token.</h2>');

    console.log('\n✅  SUCCESS — copy these values to Vercel:\n');
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}`);
    if (tokens.access_token) {
      console.log(`\n(access_token — not needed on Vercel, just for reference)\n${tokens.access_token}`);
    }
    console.log('\n👉  Update on Vercel:\n');
    console.log('  npx vercel env rm GOOGLE_REFRESH_TOKEN production --yes');
    console.log('  npx vercel env add GOOGLE_REFRESH_TOKEN production');
    console.log('\n  Then redeploy: npx vercel --prod\n');
  } catch (err) {
    res.end(`<h2>❌ Token exchange failed: ${err.message}</h2>`);
    console.error('\n❌  Token exchange failed:', err.message);
  }

  server.close();
});

server.listen(4242, () => {});
