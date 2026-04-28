/**
 * Daily Health-Check Agent
 * ─────────────────────────────────────────────────────────────
 * Triggered by Vercel Cron (vercel.json → 07:00 IST every day).
 * Also callable manually: GET /api/health-check?secret=<CRON_SECRET>
 *
 * What it does:
 *  1. Checks every critical frontend page + backend API endpoint
 *  2. Auto-retries backend endpoints up to 3× (warms GCP Cloud Run cold starts)
 *  3. Flags SLOW (>2 s), WARN (4xx), ERROR (5xx / timeout)
 *  4. Emails admin a colour-coded HTML report via Resend
 */

import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Give the cron route 60 s — enough for parallel checks + 2 retry sleeps (5 s each)
export const maxDuration = 60;

const SITE      = 'https://www.ylootrips.com';
const BACKEND   = 'https://trip-backend-65232427280.asia-south1.run.app/api';
const ADMIN     = process.env.ADMIN_EMAIL   || 'hello@ylootrips.com';
const FROM      = process.env.EMAIL_FROM    || 'onboarding@resend.dev';
const SECRET    = process.env.CRON_SECRET   || '';

// ── Check definitions ────────────────────────────────────────────────────────

interface CheckDef {
  name: string;
  url: string;
  /** Expected HTTP status (default 200) */
  expect?: number;
  /** Slow threshold in ms (default 3000) */
  slowMs?: number;
  /** Max auto-retries on 5xx / timeout (default 1) */
  retries?: number;
  /** Short human label for the category */
  group: 'Frontend Page' | 'Internal API' | 'Backend API';
}

const CHECKS: CheckDef[] = [
  // ── Frontend pages ───────────────────────────────────────────
  { group: 'Frontend Page', name: 'Homepage',            url: `${SITE}/`                          },
  { group: 'Frontend Page', name: 'Trips listing',       url: `${SITE}/trips`                     },
  { group: 'Frontend Page', name: 'Blogs listing',       url: `${SITE}/blogs`                     },
  { group: 'Frontend Page', name: 'Destinations',        url: `${SITE}/destinations`              },
  { group: 'Frontend Page', name: 'Reviews page',        url: `${SITE}/reviews`                   },
  { group: 'Frontend Page', name: 'About page',          url: `${SITE}/about`                     },
  { group: 'Frontend Page', name: 'Contact page',        url: `${SITE}/contact`                   },
  { group: 'Frontend Page', name: 'Trip Planner',        url: `${SITE}/trip-planner`              },
  { group: 'Frontend Page', name: 'Sitemap',             url: `${SITE}/sitemap.xml`               },
  { group: 'Frontend Page', name: 'llms.txt',            url: `${SITE}/llms.txt`                  },
  { group: 'Frontend Page', name: 'Bali package page',   url: `${SITE}/bali-honeymoon-package`    },
  { group: 'Frontend Page', name: 'Dubai package page',  url: `${SITE}/dubai-tour-package-from-delhi` },
  { group: 'Frontend Page', name: 'Kashmir package',     url: `${SITE}/kashmir-tour-package`      },
  { group: 'Frontend Page', name: 'Blog: Manali guide',  url: `${SITE}/blogs/manali-trip-guide`   },

  // ── Internal Next.js API routes ──────────────────────────────
  { group: 'Internal API', name: 'Reviews approved',     url: `${SITE}/api/reviews/approved`      },

  // ── Backend API endpoints ────────────────────────────────────
  { group: 'Backend API', name: 'Trips list',            url: `${BACKEND}/trips`,            retries: 3, slowMs: 5000 },
  { group: 'Backend API', name: 'Featured trips',        url: `${BACKEND}/trips/featured`,   retries: 3, slowMs: 5000 },
  { group: 'Backend API', name: 'Destinations list',     url: `${BACKEND}/destinations`,     retries: 3, slowMs: 5000 },
  { group: 'Backend API', name: 'Events list',           url: `${BACKEND}/events`,           retries: 3, slowMs: 5000 },
  { group: 'Backend API', name: 'Blogs list',            url: `${BACKEND}/blogs`,            retries: 3, slowMs: 5000 },
];

// ── Runner ───────────────────────────────────────────────────────────────────

type Status = 'OK' | 'SLOW' | 'WARN' | 'ERROR';

interface CheckResult extends CheckDef {
  status: Status;
  httpStatus: number | null;
  ms: number;
  error: string | null;
  attempts: number;
}

async function runCheck(def: CheckDef): Promise<CheckResult> {
  const maxAttempts = 1 + (def.retries ?? 0);
  const slowMs      = def.slowMs  ?? 3000;
  const expectCode  = def.expect  ?? 200;

  let lastResult: CheckResult = {
    ...def,
    status: 'ERROR',
    httpStatus: null,
    ms: 0,
    error: 'Not attempted',
    attempts: 0,
  };

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {

    const t0 = Date.now();
    try {
      const res = await fetch(def.url, {
        method: 'GET',
        headers: { 'User-Agent': 'YlooTrips-HealthBot/1.0' },
        signal: AbortSignal.timeout(12_000),
        cache: 'no-store',
      });

      const ms         = Date.now() - t0;
      const httpStatus = res.status;
      let status: Status;

      if (httpStatus === expectCode) {
        status = ms > slowMs ? 'SLOW' : 'OK';
      } else if (httpStatus >= 400 && httpStatus < 500) {
        status = 'WARN';
      } else {
        status = 'ERROR';
      }

      lastResult = { ...def, status, httpStatus, ms, error: null, attempts: attempt };

      // Stop retrying once we get a non-5xx
      if (httpStatus < 500) break;

    } catch (err) {
      const ms = Date.now() - t0;
      lastResult = {
        ...def,
        status: 'ERROR',
        httpStatus: null,
        ms,
        error: err instanceof Error ? err.message : String(err),
        attempts: attempt,
      };
    }
  }

  return lastResult;
}


// ── Email report ─────────────────────────────────────────────────────────────

function statusBadge(s: Status) {
  const map: Record<Status, string> = {
    OK:    'background:#16a34a;color:#fff',
    SLOW:  'background:#d97706;color:#fff',
    WARN:  'background:#ca8a04;color:#fff',
    ERROR: 'background:#dc2626;color:#fff',
  };
  return `<span style="display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700;${map[s]}">${s}</span>`;
}

function buildEmailHtml(results: CheckResult[], durationMs: number): string {
  const counts = { OK: 0, SLOW: 0, WARN: 0, ERROR: 0 };
  results.forEach(r => counts[r.status]++);

  const overallOk = counts.ERROR === 0 && counts.WARN === 0;
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'full', timeStyle: 'short' });

  const groups: CheckDef['group'][] = ['Frontend Page', 'Internal API', 'Backend API'];

  const tableRows = groups.map(group => {
    const groupResults = results.filter(r => r.group === group);
    const header = `<tr><td colspan="4" style="padding:10px 12px 4px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;background:#f9fafb;border-top:2px solid #e5e7eb;">${group}</td></tr>`;
    const rows = groupResults.map(r => `
      <tr style="border-bottom:1px solid #f3f4f6;">
        <td style="padding:8px 12px;font-size:13px;color:#111827;">${r.name}</td>
        <td style="padding:8px 12px;text-align:center;">${statusBadge(r.status)}</td>
        <td style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;font-family:monospace;">${r.httpStatus ?? '—'}</td>
        <td style="padding:8px 12px;text-align:right;font-size:12px;color:#6b7280;font-family:monospace;">${r.ms}ms${r.attempts > 1 ? ` <span style="color:#f59e0b">(${r.attempts} attempts)</span>` : ''}${r.error ? `<br><span style="color:#dc2626;font-size:11px;">${r.error.slice(0, 80)}</span>` : ''}</td>
      </tr>`).join('');
    return header + rows;
  }).join('');

  const summaryText  = overallOk ? '✅ All systems operational' : counts.ERROR > 0 ? `🚨 ${counts.ERROR} error(s) detected` : `⚠️ ${counts.WARN + counts.SLOW} warning(s)`;

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>YlooTrips Health Report</title></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,.1);">

    <!-- Header -->
    <div style="background:#111827;padding:28px 32px;">
      <div style="font-size:11px;font-weight:700;letter-spacing:0.15em;color:#9ca3af;text-transform:uppercase;margin-bottom:6px;">YlooTrips — Daily Health Report</div>
      <div style="font-size:22px;font-weight:700;color:#fff;">${summaryText}</div>
      <div style="font-size:12px;color:#6b7280;margin-top:6px;">${timestamp} IST · scan took ${(durationMs / 1000).toFixed(1)}s</div>
    </div>

    <!-- Summary pills -->
    <div style="padding:20px 32px;border-bottom:1px solid #f3f4f6;display:flex;gap:16px;flex-wrap:wrap;">
      <div style="text-align:center;padding:12px 20px;border-radius:8px;background:#f0fdf4;border:1px solid #bbf7d0;">
        <div style="font-size:24px;font-weight:800;color:#16a34a;">${counts.OK}</div>
        <div style="font-size:11px;color:#166534;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Passing</div>
      </div>
      <div style="text-align:center;padding:12px 20px;border-radius:8px;background:#fffbeb;border:1px solid #fde68a;">
        <div style="font-size:24px;font-weight:800;color:#d97706;">${counts.SLOW}</div>
        <div style="font-size:11px;color:#92400e;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Slow</div>
      </div>
      <div style="text-align:center;padding:12px 20px;border-radius:8px;background:#fefce8;border:1px solid #fef08a;">
        <div style="font-size:24px;font-weight:800;color:#ca8a04;">${counts.WARN}</div>
        <div style="font-size:11px;color:#713f12;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Warnings</div>
      </div>
      <div style="text-align:center;padding:12px 20px;border-radius:8px;background:#fef2f2;border:1px solid #fecaca;">
        <div style="font-size:24px;font-weight:800;color:#dc2626;">${counts.ERROR}</div>
        <div style="font-size:11px;color:#7f1d1d;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Errors</div>
      </div>
      <div style="text-align:center;padding:12px 20px;border-radius:8px;background:#f9fafb;border:1px solid #e5e7eb;">
        <div style="font-size:24px;font-weight:800;color:#374151;">${results.length}</div>
        <div style="font-size:11px;color:#6b7280;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;">Total checks</div>
      </div>
    </div>

    <!-- Results table -->
    <div style="padding:0 32px 24px;">
      <table style="width:100%;border-collapse:collapse;margin-top:20px;">
        <thead>
          <tr style="border-bottom:2px solid #e5e7eb;">
            <th style="text-align:left;padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;">Check</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;text-align:center;">Status</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;text-align:right;">HTTP</th>
            <th style="padding:8px 12px;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#6b7280;text-align:right;">Response</th>
          </tr>
        </thead>
        <tbody>${tableRows}</tbody>
      </table>
    </div>

    <!-- Auto-remediation notes -->
    ${results.filter(r => r.attempts > 1).length > 0 ? `
    <div style="margin:0 32px 24px;padding:14px 16px;background:#fffbeb;border-radius:8px;border:1px solid #fde68a;">
      <div style="font-size:12px;font-weight:700;color:#92400e;margin-bottom:4px;">🔄 Auto-remediation applied</div>
      <div style="font-size:12px;color:#78350f;">
        ${results.filter(r => r.attempts > 1).map(r => `<b>${r.name}</b> needed ${r.attempts} attempts (backend warm-up retry)`).join(' · ')}
      </div>
    </div>` : ''}

    <!-- Footer -->
    <div style="padding:20px 32px;background:#f9fafb;border-top:1px solid #e5e7eb;">
      <div style="font-size:11px;color:#9ca3af;">
        Sent by YlooTrips Health Agent · <a href="${SITE}/admin" style="color:#6366f1;text-decoration:none;">Admin Dashboard</a>
        · Runs daily at 07:00 IST
      </div>
    </div>

  </div>
</body>
</html>`;
}

// ── Structured logger ────────────────────────────────────────────────────────

function log(level: 'info' | 'warn' | 'error', msg: string, data?: Record<string, unknown>) {
  const entry = JSON.stringify({ ts: new Date().toISOString(), level, msg, ...data });
  if (level === 'error') console.error(entry);
  else if (level === 'warn')  console.warn(entry);
  else                        console.log(entry);
}

// ── Route handler ─────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  // Auth: Vercel passes Authorization: Bearer <CRON_SECRET> for cron jobs
  const authHeader = req.headers.get('authorization');
  const querySecret = req.nextUrl.searchParams.get('secret');

  if (SECRET) {
    const validBearer = authHeader === `Bearer ${SECRET}`;
    const validQuery  = querySecret === SECRET;
    if (!validBearer && !validQuery) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  const t0 = Date.now();
  log('info', 'health-check started', { checks: CHECKS.length });

  // Run all checks in parallel (backend checks have their own retry logic)
  const results = await Promise.all(CHECKS.map(runCheck));

  const durationMs = Date.now() - t0;
  const counts = { OK: 0, SLOW: 0, WARN: 0, ERROR: 0 };
  results.forEach(r => counts[r.status]++);

  log('info', 'health-check complete', { ...counts, durationMs });
  results.filter(r => r.status !== 'OK').forEach(r =>
    log(r.status === 'ERROR' ? 'error' : 'warn', `check ${r.status}: ${r.name}`, {
      url: r.url, httpStatus: r.httpStatus, ms: r.ms, attempts: r.attempts, error: r.error,
    })
  );

  // Send email report
  let emailSent = false;
  let emailError: string | null = null;

  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey) {
    try {
      const resend = new Resend(resendKey);
      const overallOk = counts.ERROR === 0 && counts.WARN === 0;
      const emoji = overallOk ? '✅' : counts.ERROR > 0 ? '🚨' : '⚠️';
      const subject = `${emoji} YlooTrips Health Check — ${counts.OK}/${results.length} OK · ${new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium' })}`;

      await resend.emails.send({ from: FROM, to: ADMIN, subject, html: buildEmailHtml(results, durationMs) });
      emailSent = true;
      log('info', 'health-check email sent', { to: ADMIN, subject });
    } catch (err) {
      emailError = err instanceof Error ? err.message : String(err);
      log('error', 'health-check email failed', { error: emailError });
    }
  } else {
    log('warn', 'RESEND_API_KEY not set — email skipped');
  }

  return NextResponse.json({
    summary: counts,
    total: results.length,
    durationMs,
    emailSent,
    emailError,
    results: results.map(r => ({
      name:       r.name,
      group:      r.group,
      status:     r.status,
      httpStatus: r.httpStatus,
      ms:         r.ms,
      attempts:   r.attempts,
      error:      r.error,
    })),
  });
}
