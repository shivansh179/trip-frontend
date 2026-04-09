'use client';

import { useState, useRef, useEffect } from 'react';
import { Phone, X, Mic, MicOff, PhoneOff, Loader2 } from 'lucide-react';

type State = 'idle' | 'open' | 'connecting' | 'active' | 'ended' | 'error';

const VAPI_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY || '';
const VAPI_ASSISTANT_ID = process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID || '';

export default function CallbackWidget() {
  const [state, setState] = useState<State>('idle');
  const [isMuted, setIsMuted] = useState(false);
  const [statusText, setStatusText] = useState('');
  const vapiRef = useRef<any>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (vapiRef.current) {
        vapiRef.current.stop();
      }
    };
  }, []);

  async function startCall() {
    setState('connecting');
    setStatusText('Starting AI assistant…');

    try {
      // Dynamically import to avoid SSR issues
      const { default: Vapi } = await import('@vapi-ai/web');

      const vapi = new Vapi(VAPI_PUBLIC_KEY);
      vapiRef.current = vapi;

      // Event listeners
      vapi.on('call-start', () => {
        setState('active');
        setStatusText('Connected — speak now');
      });

      vapi.on('speech-start', () => setStatusText('AI is speaking…'));
      vapi.on('speech-end', () => setStatusText('Listening…'));

      vapi.on('call-end', () => {
        setState('ended');
        setStatusText('');
        vapiRef.current = null;
      });

      vapi.on('error', (err: any) => {
        console.error('Vapi error:', err);
        setState('error');
        vapiRef.current = null;
      });

      // Start the call with the Yloo assistant
      await vapi.start(VAPI_ASSISTANT_ID);
    } catch (err) {
      console.error('Failed to start call:', err);
      setState('error');
    }
  }

  function endCall() {
    if (vapiRef.current) {
      vapiRef.current.stop();
      vapiRef.current = null;
    }
    setState('ended');
  }

  function toggleMute() {
    if (vapiRef.current) {
      vapiRef.current.setMuted(!isMuted);
      setIsMuted(m => !m);
    }
  }

  function reset() {
    setState('idle');
    setIsMuted(false);
    setStatusText('');
  }

  // ── Floating Button (idle) ────────────────────────────────────────────────
  if (state === 'idle') {
    return (
      <button
        onClick={() => setState('open')}
        aria-label="Talk to our AI travel assistant"
        className="fixed bottom-48 right-5 z-50 group flex flex-col items-end gap-2"
      >
        <div className="flex items-center gap-1.5 bg-white text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-lg border border-gray-100 opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
          <Phone size={12} className="text-primary shrink-0" />
          <span>Talk to our <strong>AI agent</strong> — free</span>
        </div>
        <div className="relative bg-primary hover:bg-primary/90 text-cream px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center gap-2">
          <Phone size={20} className="shrink-0" />
          <span className="text-sm font-semibold pr-1 hidden sm:block">AI Call</span>
          <span className="absolute inset-0 rounded-full bg-primary animate-ping opacity-15 pointer-events-none" />
        </div>
      </button>
    );
  }

  // ── Active Call UI ────────────────────────────────────────────────────────
  if (state === 'active' || state === 'connecting') {
    return (
      <div className="fixed bottom-24 right-5 z-[100]">
        <div className="bg-primary rounded-2xl shadow-2xl p-5 w-72">
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Phone size={18} className="text-accent" />
              {state === 'active' && (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-primary" />
              )}
            </div>
            <div>
              <p className="text-cream font-semibold text-sm leading-none">Yloo — YlooTrips AI</p>
              <p className="text-cream/50 text-xs mt-1">
                {state === 'connecting' ? 'Connecting…' : statusText || 'On call'}
              </p>
            </div>
          </div>

          {/* Sound wave animation when active */}
          {state === 'active' && (
            <div className="flex items-center justify-center gap-1 h-8 mb-4">
              {[1,2,3,4,5,4,3,2,1].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-accent rounded-full animate-pulse"
                  style={{
                    height: `${h * 6}px`,
                    animationDelay: `${i * 0.1}s`,
                    animationDuration: '0.8s',
                  }}
                />
              ))}
            </div>
          )}

          {/* Connecting spinner */}
          {state === 'connecting' && (
            <div className="flex justify-center mb-4">
              <Loader2 size={24} className="text-accent animate-spin" />
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <button
              onClick={toggleMute}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                isMuted ? 'bg-red-500 text-white' : 'bg-cream/10 text-cream hover:bg-cream/20'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
            </button>

            <button
              onClick={endCall}
              className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
              title="End call"
            >
              <PhoneOff size={18} />
            </button>
          </div>

          <p className="text-center text-cream/30 text-[10px] mt-3">
            Allow microphone access if prompted
          </p>
        </div>
      </div>
    );
  }

  // ── Call Ended ────────────────────────────────────────────────────────────
  if (state === 'ended') {
    return (
      <div className="fixed bottom-24 right-5 z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 text-center">
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
            <Phone size={20} className="text-green-600" />
          </div>
          <h4 className="font-semibold text-primary">Call ended</h4>
          <p className="text-primary/60 text-sm mt-1">
            Our team will follow up on WhatsApp shortly.
          </p>
          <div className="flex gap-2 mt-4">
            <button
              onClick={startCall}
              className="flex-1 bg-primary text-cream rounded-full py-2 text-sm font-semibold"
            >
              Call Again
            </button>
            <button
              onClick={reset}
              className="flex-1 border border-primary/20 text-primary rounded-full py-2 text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Error ────────────────────────────────────────────────────────────────
  if (state === 'error') {
    return (
      <div className="fixed bottom-24 right-5 z-[100]">
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-72 text-center">
          <p className="text-red-600 font-medium">Could not start call</p>
          <p className="text-primary/60 text-sm mt-1">
            Please allow microphone access or{' '}
            <a href="https://wa.me/918427831127" className="text-primary font-semibold underline">
              WhatsApp us
            </a>
          </p>
          <button onClick={reset} className="mt-3 text-sm text-primary/40 underline">
            Dismiss
          </button>
        </div>
      </div>
    );
  }

  // ── Pre-call Prompt ───────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={reset} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">

        <div className="bg-primary px-6 py-5">
          <button onClick={reset} className="absolute top-4 right-4 text-cream/60 hover:text-cream">
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
              <Phone size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-cream font-semibold text-base leading-none">Talk to Yloo AI</h3>
              <p className="text-cream/50 text-xs mt-1">YlooTrips AI travel assistant · Free</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-6 text-center">
          <div className="flex justify-center gap-1 mb-4">
            {['🏖️','🗼','🏔️','🌴','🕌'].map((e, i) => (
              <span key={i} className="text-2xl">{e}</span>
            ))}
          </div>
          <p className="text-primary/70 text-sm mb-1">
            Hindi, Punjabi, ya English — kisi bhi language mein baat karo.
          </p>
          <p className="text-primary/40 text-xs mb-6">
            Browser mic use karta hai · Phone number ki zaroorat nahi · Bilkul free
          </p>

          <button
            onClick={startCall}
            className="w-full bg-primary text-cream font-semibold rounded-full py-3.5 text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <Mic size={16} />
            Start AI Call
          </button>
          <p className="text-[10px] text-primary/30 mt-3">
            Your browser will ask for microphone permission
          </p>
        </div>
      </div>
    </div>
  );
}
