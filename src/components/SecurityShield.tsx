'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Sends a security alert to admin without blocking UX
function sendAlert(type: string, page: string) {
  const ua = navigator.userAgent;
  fetch('/api/security/alert', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ type, page, ua }),
    keepalive: true,
  }).catch(() => {});
}

export default function SecurityShield() {
  const pathname = usePathname();

  useEffect(() => {
    // ── Console warning ─────────────────────────────────────────────────────
    console.clear();
    console.log(
      '%c⚠ STOP!',
      'color:#f00;font-size:48px;font-weight:900;text-shadow:2px 2px 4px rgba(0,0,0,0.5)'
    );
    console.log(
      '%cThis is a browser feature intended for developers. If someone told you to paste something here to "get free trips" or "hack this site" — that is a scam. This action is monitored and your IP has been logged.',
      'color:#fff;background:#111;font-size:14px;padding:10px 16px;border-radius:6px;border-left:4px solid #f00'
    );

    // ── Disable right-click ─────────────────────────────────────────────────
    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      sendAlert('rightclick', pathname);
    };

    // ── Block devtools keyboard shortcuts ────────────────────────────────────
    const onKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;

      // F12
      if (e.key === 'F12') { e.preventDefault(); sendAlert('keybind', pathname); return; }
      // Ctrl+U (view source)
      if (ctrl && e.key === 'u') { e.preventDefault(); sendAlert('keybind', pathname); return; }
      // Ctrl+S (save page)
      if (ctrl && e.key === 's') { e.preventDefault(); return; }
      // Ctrl+Shift+I / Ctrl+Shift+J / Ctrl+Shift+C (devtools)
      if (ctrl && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        sendAlert('devtools', pathname);
        return;
      }
      // Ctrl+A (select all) — only on non-input elements
      if (ctrl && e.key === 'a') {
        const tag = (e.target as HTMLElement).tagName;
        if (!['INPUT', 'TEXTAREA'].includes(tag)) {
          e.preventDefault();
          sendAlert('copy', pathname);
        }
      }
      // Ctrl+C on non-input (copy page content)
      if (ctrl && e.key === 'c') {
        const tag = (e.target as HTMLElement).tagName;
        if (!['INPUT', 'TEXTAREA'].includes(tag) && (window.getSelection()?.toString().length || 0) > 100) {
          sendAlert('copy', pathname);
        }
      }
    };

    // ── DevTools size detection ──────────────────────────────────────────────
    let devtoolsAlerted = false;
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if ((widthThreshold || heightThreshold) && !devtoolsAlerted) {
        devtoolsAlerted = true;
        sendAlert('devtools', pathname);
        // Reset after 10s so it can re-alert if they keep it open
        setTimeout(() => { devtoolsAlerted = false; }, 10_000);
      }
    };

    // ── Prevent text selection on non-interactive elements ───────────────────
    const style = document.createElement('style');
    style.id = 'security-shield-style';
    style.textContent = `
      body { -webkit-user-select: none; user-select: none; }
      input, textarea, [contenteditable] { -webkit-user-select: text; user-select: text; }
    `;
    document.head.appendChild(style);

    // ── Disable print ────────────────────────────────────────────────────────
    const onBeforePrint = () => { sendAlert('copy', pathname); };

    // ── Detect drag-copy ────────────────────────────────────────────────────
    const onDragStart = (e: DragEvent) => {
      e.preventDefault();
      sendAlert('copy', pathname);
    };

    const devToolsInterval = setInterval(detectDevTools, 1000);

    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('dragstart', onDragStart);
    window.addEventListener('beforeprint', onBeforePrint);

    return () => {
      clearInterval(devToolsInterval);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('dragstart', onDragStart);
      window.removeEventListener('beforeprint', onBeforePrint);
      document.getElementById('security-shield-style')?.remove();
    };
  }, [pathname]);

  return null; // renders nothing
}
