import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), '.data', 'flight-bookings.json');

/**
 * Auth check for admin API routes.
 * Accepts either:
 *   1. x-admin-secret header matching ADMIN_SECRET env var (server-to-server internal calls)
 *   2. x-admin-token header with any truthy value (admin panel UI calls using backend JWT)
 * If ADMIN_SECRET is not configured → allow all (backwards compat until env var is set).
 */
function isAuthorised(req: NextRequest): boolean {
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) return true; // not yet configured: allow all
    if (req.headers.get('x-admin-secret') === adminSecret) return true;
    if (req.headers.get('x-admin-token')) return true; // admin panel JWT
    return false;
}

function readBookings(): Record<string, unknown>[] {
    try {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(raw);
    } catch {
        return [];
    }
}

function writeBookings(bookings: Record<string, unknown>[]) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const evtRef = searchParams.get('evtRef');
    const txnid = searchParams.get('txnid');
    const bookings = readBookings();

    // Specific lookups (txnid/evtRef) — used by my-booking page, no auth needed
    if (txnid) {
        const booking = bookings.find((b: Record<string, unknown>) => b.txnid === txnid);
        return NextResponse.json({ data: booking || null });
    }
    if (evtRef) {
        const booking = bookings.find((b: Record<string, unknown>) => b.evtRef === evtRef);
        return NextResponse.json({ data: booking || null });
    }

    // List-all — admin only
    if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ data: bookings.slice().reverse() });
}

export async function POST(req: NextRequest) {
    // POST is called by payment flow (server-side) to save booking — kept open
    try {
        const booking = await req.json();
        const bookings = readBookings();
        bookings.push({ ...booking, savedAt: new Date().toISOString() });
        writeBookings(bookings);
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to save booking' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    if (!isAuthorised(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    try {
        const body = await req.json();
        const { txnid, status, evtRef } = body;
        const bookings = readBookings();
        const idx = bookings.findIndex((b: Record<string, unknown>) =>
            b.txnid === txnid || (evtRef && b.evtRef === evtRef)
        );
        if (idx !== -1) {
            const updates: Record<string, unknown> = {};
            if (status !== undefined) updates.status = status;
            if (evtRef !== undefined) updates.evtRef = evtRef;
            bookings[idx] = { ...bookings[idx], ...updates };
            writeBookings(bookings);
        }
        return NextResponse.json({ success: true });
    } catch {
        return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
    }
}
