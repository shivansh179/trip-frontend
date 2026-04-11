'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, RefreshCw, CheckCircle2, XCircle, AlertTriangle,
  Wifi, WifiOff, Users, Activity, Zap, Clock, ExternalLink,
  Copy, Check, Shield, Server, CreditCard, Mail, Plane, Brain,
  Globe, Radio
} from 'lucide-react';

interface ApiStatus {
  name: string;
  key: string;
  purpose: string;
  configured: boolean;
  status: 'ok' | 'missing' | 'error' | 'rate_limited';
  latencyMs?: number;
  message?: string;
  docsUrl: string;
  envVars: string[];
}

interface HealthData {
  checkedAt: string;
  allOk: boolean;
  hasIssues: boolean;
  apis: ApiStatus[];
}

const API_ICONS: Record<string, React.ElementType> = {
  'Groq AI': Brain,
  'OpenAI': Brain,
  'Google Gemini': Brain,
  'SerpAPI': Plane,
  'Amadeus': Plane,
  'Easebuzz': CreditCard,
  'Resend (Email)': Mail,
  'Backend API': Server,
};

function StatusBadge({ status }: { status: ApiStatus['status'] }) {
  const cfg = {
    ok:           { cls: 'bg-green-100 text-green-700 border-green-200',     icon: CheckCircle2, label: 'Operational' },
    missing:      { cls: 'bg-red-100 text-red-700 border-red-200',           icon: XCircle,      label: 'Key Missing' },
    error:        { cls: 'bg-red-100 text-red-700 border-red-200',           icon: XCircle,      label: 'Error' },
    rate_limited: { cls: 'bg-amber-100 text-amber-700 border-amber-200',     icon: AlertTriangle,label: 'Rate Limited' },
  }[status];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${cfg.cls}`}>
      <Icon size={11} />
      {cfg.label}
    </span>
  );
}

function LatencyBar({ ms }: { ms?: number }) {
  if (!ms) return null;
  const color = ms < 500 ? 'bg-green-500' : ms < 1500 ? 'bg-amber-500' : 'bg-red-500';
  const width = Math.min(100, (ms / 3000) * 100);
  return (
    <div className="flex items-center gap-2 mt-1.5">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${width}%` }} />
      </div>
      <span className="text-[10px] text-gray-400 tabular-nums shrink-0">{ms}ms</span>
    </div>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
    </button>
  );
}

export default function HealthDashboard() {
  const router = useRouter();
  const [health, setHealth] = useState<HealthData | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) { router.push('/admin'); return; }
    runChecks();
    fetchActiveUsers();
  }, [router]);

  // Poll active users every 10s
  useEffect(() => {
    const t = setInterval(fetchActiveUsers, 10_000);
    return () => clearInterval(t);
  }, []);

  const fetchActiveUsers = async () => {
    try {
      const r = await fetch('/api/admin/active-users');
      if (r.ok) { const d = await r.json(); setActiveUsers(d.count ?? 0); }
    } catch { /* silent */ }
  };

  const runChecks = useCallback(async () => {
    setChecking(true);
    try {
      const r = await fetch('/api/admin/health');
      if (r.ok) { setHealth(await r.json()); setLastChecked(new Date()); }
    } finally {
      setChecking(false);
      setLoading(false);
    }
  }, []);

  const issueCount = health?.apis.filter(a => a.status !== 'ok').length ?? 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-gray-900 text-white px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <ArrowLeft size={16} /> Admin
          </Link>
          <span className="text-gray-600">/</span>
          <span className="font-semibold flex items-center gap-2">
            <Activity size={16} className="text-green-400" /> Website Health
          </span>
        </div>
        <button
          onClick={runChecks}
          disabled={checking}
          className="flex items-center gap-2 px-3 py-1.5 text-xs bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw size={13} className={checking ? 'animate-spin' : ''} />
          {checking ? 'Checking…' : 'Re-check All'}
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* Hero status bar */}
        {health && (
          <div className={`rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 border ${health.allOk ? 'bg-green-50 border-green-200' : health.hasIssues ? 'bg-red-50 border-red-200' : 'bg-amber-50 border-amber-200'}`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${health.allOk ? 'bg-green-500' : 'bg-red-500'}`}>
              {health.allOk ? <CheckCircle2 size={24} className="text-white" /> : <XCircle size={24} className="text-white" />}
            </div>
            <div className="flex-1">
              <h1 className={`text-lg font-bold ${health.allOk ? 'text-green-800' : 'text-red-800'}`}>
                {health.allOk ? 'All Systems Operational' : `${issueCount} Issue${issueCount > 1 ? 's' : ''} Detected`}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">
                Last checked: {lastChecked ? lastChecked.toLocaleTimeString('en-IN') : '—'}
                {health.allOk && ' · All APIs are online and responding'}
              </p>
            </div>
            {!health.allOk && (
              <div className="flex items-center gap-1.5 bg-red-100 text-red-700 text-xs font-bold px-3 py-2 rounded-full border border-red-200">
                <AlertTriangle size={13} />
                {issueCount} API{issueCount > 1 ? 's' : ''} need attention
              </div>
            )}
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Live users */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Live on Site</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <Radio size={14} className="text-green-500" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeUsers}</p>
            <p className="text-xs text-gray-400 mt-1">active users right now</p>
          </div>

          {/* APIs OK */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">APIs Online</span>
              <CheckCircle2 size={16} className="text-green-500" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {health ? health.apis.filter(a => a.status === 'ok').length : '—'}
              <span className="text-sm text-gray-400 font-normal"> / {health?.apis.length ?? 8}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">all services</p>
          </div>

          {/* Issues */}
          <div className={`bg-white rounded-xl border p-5 shadow-sm ${issueCount > 0 ? 'border-red-200' : 'border-gray-200'}`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Issues</span>
              <AlertTriangle size={16} className={issueCount > 0 ? 'text-red-500' : 'text-gray-300'} />
            </div>
            <p className={`text-3xl font-bold ${issueCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>{issueCount}</p>
            <p className="text-xs text-gray-400 mt-1">need action</p>
          </div>

          {/* Avg latency */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-gray-500 font-medium">Avg Latency</span>
              <Clock size={16} className="text-blue-400" />
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {health
                ? (() => {
                    const vals = health.apis.map(a => a.latencyMs).filter(Boolean) as number[];
                    return vals.length ? `${Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)}ms` : '—';
                  })()
                : '—'}
            </p>
            <p className="text-xs text-gray-400 mt-1">across all APIs</p>
          </div>
        </div>

        {/* API Cards */}
        {loading ? (
          <div className="grid sm:grid-cols-2 gap-4">
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} className="h-36 bg-white rounded-xl border border-gray-200 animate-pulse" />
            ))}
          </div>
        ) : health ? (
          <>
            {/* Issues first — if any */}
            {health.apis.some(a => a.status !== 'ok') && (
              <div className="space-y-3">
                <h2 className="text-sm font-bold text-red-700 uppercase tracking-widest flex items-center gap-2">
                  <AlertTriangle size={14} /> Action Required
                </h2>
                {health.apis.filter(a => a.status !== 'ok').map(api => (
                  <ApiCard key={api.name} api={api} highlight />
                ))}
              </div>
            )}

            {/* All APIs grid */}
            <div className="space-y-3">
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} /> All API Services
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {health.apis.map(api => (
                  <ApiCard key={api.name} api={api} />
                ))}
              </div>
            </div>
          </>
        ) : null}

        {/* How to update keys */}
        <div className="bg-gray-900 rounded-2xl p-6 text-white">
          <h3 className="font-bold text-base mb-1 flex items-center gap-2">
            <Zap size={16} className="text-amber-400" />
            How to add / update API keys
          </h3>
          <p className="text-gray-400 text-sm mb-4">All keys are set as environment variables on Vercel. Follow these steps:</p>
          <ol className="space-y-2 text-sm text-gray-300">
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shrink-0">1</span> Go to <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="text-amber-400 underline">vercel.com/dashboard</a> → your project → <strong>Settings → Environment Variables</strong></li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shrink-0">2</span> Add or update the variable name (e.g. <code className="bg-gray-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">GROQ_API_KEY</code>) with the new key value</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shrink-0">3</span> Click <strong>Save</strong> then <strong>Redeploy</strong> the latest deployment for changes to take effect</li>
            <li className="flex gap-3"><span className="w-6 h-6 rounded-full bg-amber-500 text-white text-xs flex items-center justify-center font-bold shrink-0">4</span> Return here and click <strong>Re-check All</strong> to confirm the key is working</li>
          </ol>
        </div>

      </div>
    </div>
  );
}

function ApiCard({ api, highlight = false }: { api: ApiStatus; highlight?: boolean }) {
  const Icon = API_ICONS[api.name] ?? Globe;
  const borderCls = highlight
    ? api.status === 'rate_limited' ? 'border-amber-300' : 'border-red-300'
    : 'border-gray-200';

  return (
    <div className={`bg-white rounded-xl border ${borderCls} shadow-sm p-5`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            api.status === 'ok' ? 'bg-green-50' : api.status === 'rate_limited' ? 'bg-amber-50' : 'bg-red-50'
          }`}>
            <Icon size={18} className={
              api.status === 'ok' ? 'text-green-600' : api.status === 'rate_limited' ? 'text-amber-600' : 'text-red-500'
            } />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{api.name}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">{api.purpose}</p>
          </div>
        </div>
        <StatusBadge status={api.status} />
      </div>

      {/* Latency */}
      <LatencyBar ms={api.latencyMs} />

      {/* Message */}
      {api.message && (
        <p className={`text-xs mt-2 ${api.status === 'ok' ? 'text-gray-400' : api.status === 'rate_limited' ? 'text-amber-700' : 'text-red-600'}`}>
          {api.status !== 'ok' && '⚠ '}{api.message}
        </p>
      )}

      {/* Env vars */}
      <div className="mt-3 pt-3 border-t border-gray-50 flex flex-wrap gap-1.5">
        {api.envVars.map(v => (
          <div key={v} className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded px-2 py-0.5">
            <code className="text-[10px] text-gray-600 font-mono">{v}</code>
            <CopyButton text={v} />
          </div>
        ))}
        <a
          href={api.docsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-blue-500 hover:text-blue-700 ml-auto"
        >
          Get key <ExternalLink size={9} />
        </a>
      </div>

      {/* Action hint for issues */}
      {api.status !== 'ok' && (
        <div className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
          api.status === 'rate_limited' ? 'bg-amber-50 text-amber-800' : 'bg-red-50 text-red-800'
        }`}>
          {api.status === 'missing'
            ? `Add ${api.envVars[0]} to Vercel environment variables to enable this feature.`
            : api.status === 'rate_limited'
            ? `Quota exceeded. Get a new key from the provider and update ${api.envVars[0]} in Vercel.`
            : `API returned an error. Check the key at the provider dashboard and update ${api.envVars[0]}.`
          }
        </div>
      )}
    </div>
  );
}
