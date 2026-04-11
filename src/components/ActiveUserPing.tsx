'use client';

import { useEffect } from 'react';

// Generate a random session ID once per tab and persist in sessionStorage
function getSessionId(): string {
  const key = '_yloo_sid';
  let id = sessionStorage.getItem(key);
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(key, id);
  }
  return id;
}

export default function ActiveUserPing() {
  useEffect(() => {
    const ping = () => {
      fetch('/api/admin/active-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: getSessionId() }),
        keepalive: true,
      }).catch(() => {/* silent */});
    };

    // Ping immediately on mount, then every 30s
    ping();
    const interval = setInterval(ping, 30_000);
    return () => clearInterval(interval);
  }, []);

  return null;
}
