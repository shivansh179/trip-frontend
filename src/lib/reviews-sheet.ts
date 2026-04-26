/**
 * Google Sheets storage for reviews.
 * Tab: "Reviews" in the same spreadsheet as Leads.
 * Columns: id | createdAt | name | email | phone | country | trip | rating | text | status | adminNote
 */

import { google } from 'googleapis';

const SHEET_ID   = '1GkBPp4YNjZYeTRRZN0ugVTZUNTaVAH2Mmfti9jr1PmE';
const SHEET_NAME = 'Reviews';

// Column indices (0-based)
const COL = {
  id:        0,
  createdAt: 1,
  name:      2,
  email:     3,
  phone:     4,
  country:   5,
  trip:      6,
  rating:    7,
  text:      8,
  status:    9,
  adminNote: 10,
};
const TOTAL_COLS = 11;

export interface SheetReview {
  _id: string; // same as id — keeps admin page interface compatible
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  trip: string;
  rating: number;
  text: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNote: string;
}

let _client: ReturnType<typeof google.sheets> | null = null;

function getClient() {
  if (_client) return _client;
  const clientId     = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Missing Google OAuth env vars (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REFRESH_TOKEN)');
  }
  const auth = new google.auth.OAuth2(clientId, clientSecret);
  auth.setCredentials({ refresh_token: refreshToken });
  _client = google.sheets({ version: 'v4', auth });
  return _client;
}

function rowToReview(row: string[]): SheetReview {
  const id = row[COL.id] ?? '';
  return {
    _id:       id,
    id,
    createdAt: row[COL.createdAt] ?? '',
    name:      row[COL.name]      ?? '',
    email:     row[COL.email]     ?? '',
    phone:     row[COL.phone]     ?? '',
    country:   row[COL.country]   ?? '',
    trip:      row[COL.trip]      ?? '',
    rating:    Number(row[COL.rating] ?? 5),
    text:      row[COL.text]      ?? '',
    status:    (row[COL.status]   ?? 'pending') as SheetReview['status'],
    adminNote: row[COL.adminNote] ?? '',
  };
}

/** Fetch all rows (optionally filtered by status). */
export async function getReviews(status?: string): Promise<SheetReview[]> {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A2:K`,
  });
  const rows = (res.data.values ?? []) as string[][];
  const reviews = rows.map(rowToReview);
  if (!status || status === 'all') return reviews.reverse(); // newest first
  return reviews.filter((r) => r.status === status).reverse();
}

/** Append a new review row. */
export async function appendReview(review: Omit<SheetReview, '_id'>): Promise<void> {
  const sheets = getClient();
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:K`,
    valueInputOption: 'USER_ENTERED',
    requestBody: {
      values: [[
        review.id,
        review.createdAt,
        review.name,
        review.email,
        review.phone,
        review.country,
        review.trip,
        review.rating,
        review.text,
        review.status,
        review.adminNote ?? '',
      ]],
    },
  });
}

/** Find 1-based row index for a given id (returns -1 if not found). */
async function findRowIndex(id: string): Promise<number> {
  const sheets = getClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:A`,
  });
  const rows = (res.data.values ?? []) as string[][];
  const idx = rows.findIndex((r) => r[0] === id);
  return idx === -1 ? -1 : idx + 1; // convert to 1-based
}

/** Update status and adminNote for a review by id. */
export async function updateReviewStatus(
  id: string,
  status: 'approved' | 'rejected',
  adminNote: string,
): Promise<boolean> {
  const sheets = getClient();
  const rowIdx = await findRowIndex(id);
  if (rowIdx === -1) return false;

  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!J${rowIdx}:K${rowIdx}`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [[status, adminNote]] },
  });
  return true;
}

/** Delete a review row by id. */
export async function deleteReview(id: string): Promise<boolean> {
  const sheets = getClient();
  const rowIdx = await findRowIndex(id);
  if (rowIdx === -1) return false;

  // Get the sheet (tab) id first
  const meta = await sheets.spreadsheets.get({ spreadsheetId: SHEET_ID });
  const sheet = meta.data.sheets?.find(
    (s) => s.properties?.title === SHEET_NAME,
  );
  const sheetId = sheet?.properties?.sheetId ?? 0;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: SHEET_ID,
    requestBody: {
      requests: [{
        deleteDimension: {
          range: {
            sheetId,
            dimension: 'ROWS',
            startIndex: rowIdx - 1, // 0-based
            endIndex:   rowIdx,
          },
        },
      }],
    },
  });
  return true;
}
