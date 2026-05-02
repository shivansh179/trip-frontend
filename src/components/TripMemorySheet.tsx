'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Camera, Video, CheckCircle, ArrowRight, Wallet, RefreshCw, AlertCircle, ImageIcon } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const GOLD = '#C9A96E';
const CASHBACK_PHOTO = 500;
const CASHBACK_VIDEO = 1000;

interface TripMemorySheetProps {
  onClose: () => void;
}

type Step = 'pick' | 'details' | 'uploading' | 'success' | 'error';

export default function TripMemorySheet({ onClose }: TripMemorySheetProps) {
  const { balance, creditWallet } = useWallet();
  const [step, setStep]           = useState<Step>('pick');
  const [mediaType, setMediaType] = useState<'photo' | 'video'>('photo');
  const [file, setFile]           = useState<File | null>(null);
  const [preview, setPreview]     = useState<string | null>(null);
  const [name, setName]           = useState('');
  const [contact, setContact]     = useState('');
  const [tripName, setTripName]   = useState('');
  const [errorMsg, setErrorMsg]   = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStage, setUploadStage]       = useState('');
  const [cashbackEarned, setCashbackEarned] = useState(0);
  const [newBalance, setNewBalance]         = useState(balance);
  const [dragOver, setDragOver]             = useState(false);
  const fileRef   = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setNewBalance(balance); }, [balance]);

  const processFile = useCallback((f: File) => {
    const isVideo = f.type.startsWith('video/');
    setMediaType(isVideo ? 'video' : 'photo');
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setStep('details');
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) processFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contact.trim() || !tripName.trim()) {
      setErrorMsg('Please fill all fields.'); return;
    }
    setStep('uploading');
    setUploadStage('Saving your post...');
    setUploadProgress(30);
    setErrorMsg('');

    try {
      // ── Step 1: save metadata immediately (no file) — fast, instant cashback ──
      const metaRes = await fetch('/api/trip-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      name.trim(),
          contact:   contact.trim(),
          tripName:  tripName.trim(),
          mediaType,
          fileUrl:    null,
          fileName:   file?.name || '',
          fileSizeKB: file ? Math.round(file.size / 1024) : 0,
        }),
      });

      const json = await metaRes.json() as { success?: boolean; ref?: string; cashback?: number; walletBalance?: number; error?: string };
      if (!metaRes.ok || !json.success) {
        throw new Error(json.error || 'Failed to save post');
      }

      setUploadProgress(70);

      // ── Step 2: credit wallet instantly ──
      const earned = (json.cashback && json.cashback > 0)
        ? json.cashback
        : (mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO);
      const ref = json.ref ?? `MEM-${Date.now()}`;

      setCashbackEarned(earned);
      setNewBalance(json.walletBalance && json.walletBalance > 0 ? json.walletBalance : balance + earned);
      creditWallet(earned, ref, `📸 YLOO Reels reward — ${tripName.trim()}`);

      setUploadProgress(100);
      setStep('success');

      // ── Step 3: upload file to GCS in the background (user doesn't wait) ──
      if (file && json.ref) {
        const savedRef = json.ref;
        const uploadFile = file;
        (async () => {
          try {
            const urlRes = await fetch('/api/trip-memories/upload-url', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ mediaType, fileName: uploadFile.name, contentType: uploadFile.type }),
            });
            if (!urlRes.ok) return;
            const { signedUrl, fileUrl: gcsUrl } = await urlRes.json() as { signedUrl: string; fileUrl: string };

            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.onload = () => xhr.status >= 200 && xhr.status < 300 ? resolve() : reject();
              xhr.onerror = () => reject();
              xhr.open('PUT', signedUrl);
              xhr.setRequestHeader('Content-Type', uploadFile.type);
              xhr.send(uploadFile);
            });

            // Attach the file URL to the saved record
            await fetch('/api/trip-memories', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ref: savedRef, fileUrl: gcsUrl }),
            });
          } catch {
            // Background upload failed — post is already saved, just no media URL
          }
        })();
      }

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setErrorMsg(msg);
      setStep('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col"
      style={{ background: 'rgba(8,8,12,0.99)' }}
    >
      {/* ── Top bar — always visible ── */}
      <div
        className="flex items-center justify-between px-5 pt-safe-top pt-4 pb-3 shrink-0"
        style={{ borderBottom: '1px solid rgba(201,169,110,0.12)' }}
      >
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>YLOO Reels</p>
          <h2 className="text-lg font-black text-white leading-tight mt-0.5">Upload Your Trip Memory</h2>
        </div>
        <button
          onClick={onClose}
          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <X size={16} className="text-white/60" />
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-5 pb-8">

        {/* ── Step: Pick ── */}
        {step === 'pick' && (
          <div className="pt-5 flex flex-col gap-4">

            {/* Hidden inputs */}
            <input ref={cameraRef} type="file" accept="image/*,video/*" capture="environment" className="hidden" onChange={handleFileChange} />
            <input ref={fileRef}   type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />

            {/* Camera button */}
            <button
              onClick={() => cameraRef.current?.click()}
              className="w-full flex items-center gap-5 px-6 py-6 rounded-3xl active:scale-[0.97] transition-all"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1.5px solid rgba(201,169,110,0.35)' }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)` }}>
                <Camera size={28} className="text-black" />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-lg leading-tight">Open Camera</p>
                <p className="text-white/40 text-sm mt-0.5">Take a photo or record a video</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(201,169,110,0.15)', color: GOLD }}>📸 ₹{CASHBACK_PHOTO}</span>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8' }}>🎬 ₹{CASHBACK_VIDEO}</span>
                </div>
              </div>
            </button>

            {/* Gallery button */}
            <button
              onClick={() => fileRef.current?.click()}
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className="w-full flex items-center gap-5 px-6 py-6 rounded-3xl active:scale-[0.97] transition-all"
              style={{
                background: dragOver ? 'rgba(99,102,241,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1.5px solid ${dragOver ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.12)'}`,
              }}
            >
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <ImageIcon size={28} className="text-white/60" />
              </div>
              <div className="text-left">
                <p className="text-white font-black text-lg leading-tight">Choose from Gallery</p>
                <p className="text-white/40 text-sm mt-0.5">Pick a saved photo or video</p>
                <p className="text-white/20 text-[10px] mt-1.5">or drag & drop here</p>
              </div>
            </button>

            {/* Reward strip */}
            <div className="flex items-center justify-center gap-3 py-3 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-white/30 text-xs">Earn instantly after posting:</span>
              <span className="font-black text-xs" style={{ color: GOLD }}>Photo ₹{CASHBACK_PHOTO}</span>
              <span className="text-white/20 text-xs">·</span>
              <span className="font-black text-xs" style={{ color: '#818cf8' }}>Video ₹{CASHBACK_VIDEO}</span>
            </div>
          </div>
        )}

          {/* ── Step: Details ── */}
          {step === 'details' && (
            <div>
              {/* Media preview */}
              <div className="rounded-2xl overflow-hidden mb-5 relative" style={{ maxHeight: 220 }}>
                {mediaType === 'video' && preview
                  ? <video src={preview} className="w-full object-cover" style={{ maxHeight: 220 }} controls muted playsInline />
                  : preview && <img src={preview} alt="preview" className="w-full object-cover" style={{ maxHeight: 220 }} />
                }
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: 'rgba(0,0,0,0.7)', border: `1px solid ${mediaType === 'video' ? 'rgba(99,102,241,0.5)' : 'rgba(201,169,110,0.4)'}` }}>
                  {mediaType === 'video' ? <Video size={11} style={{ color: '#818cf8' }} /> : <Camera size={11} style={{ color: GOLD }} />}
                  <span className="text-[10px] font-bold" style={{ color: mediaType === 'video' ? '#818cf8' : GOLD }}>
                    {mediaType === 'video' ? 'VIDEO' : 'PHOTO'} · ₹{mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO} cashback
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-black text-white mb-1">Almost there!</h2>
              <p className="text-white/40 text-sm mb-5">Fill in your details to claim your cashback</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                {[
                  { label: 'Your Name', value: name, set: setName, placeholder: 'e.g. Priya Sharma', type: 'text' },
                  { label: 'Phone or Email', value: contact, set: setContact, placeholder: '+91 98765 43210 or email', type: 'text' },
                  { label: 'Trip Destination', value: tripName, set: setTripName, placeholder: 'e.g. Manali, Bali, Kedarnath...', type: 'text' },
                ].map(({ label, value, set, placeholder, type }) => (
                  <div key={label}>
                    <label className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: 'rgba(201,169,110,0.6)' }}>{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={e => set(e.target.value)}
                      placeholder={placeholder}
                      required
                      className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 focus:outline-none transition-all text-sm"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(201,169,110,0.2)' }}
                    />
                  </div>
                ))}

                {errorMsg && (
                  <div className="flex items-start gap-2 p-3 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
                    <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                    <p className="text-red-400 text-xs">{errorMsg}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button type="button" onClick={() => { setStep('pick'); setPreview(null); setFile(null); }}
                    className="flex-none px-4 py-3.5 rounded-xl text-sm font-bold text-white/40 transition-all"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    Back
                  </button>
                  <button type="submit"
                    className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-black text-black text-sm transition-all active:scale-[0.98]"
                    style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)`, boxShadow: `0 4px 20px rgba(201,169,110,0.3)` }}>
                    Claim ₹{mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO} Cashback
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── Step: Uploading ── */}
          {step === 'uploading' && (
            <div className="py-16 flex flex-col items-center gap-6 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                <RefreshCw size={32} className="animate-spin" style={{ color: GOLD }} />
              </div>
              <div className="w-full max-w-xs">
                <p className="text-white font-bold text-lg mb-1">Almost done...</p>
                <p className="text-white/30 text-sm mb-4">{uploadStage || 'Crediting cashback'}</p>
                {/* Progress bar */}
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%`, background: `linear-gradient(90deg, ${GOLD}, #E2C68F)` }}
                  />
                </div>
                <p className="text-right text-xs mt-1.5" style={{ color: GOLD }}>{uploadProgress}%</p>
              </div>
            </div>
          )}

          {/* ── Step: Success ── */}
          {step === 'success' && (
            <div className="py-10 flex flex-col items-center gap-5 text-center">
              {/* Confetti-like decoration */}
              <div className="relative">
                <div className="w-24 h-24 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(201,169,110,0.3), rgba(201,169,110,0.1))', border: '2px solid rgba(201,169,110,0.4)' }}>
                  <CheckCircle size={42} style={{ color: GOLD }} />
                </div>
                {['🎉', '✨', '💰', '🌟'].map((emoji, i) => (
                  <span key={i} className="absolute text-xl animate-bounce" style={{
                    top: ['-20%', '-20%', '85%', '85%'][i],
                    left: ['-10%', '90%', '-10%', '90%'][i],
                    animationDelay: `${i * 0.15}s`,
                  }}>{emoji}</span>
                ))}
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: GOLD }}>Cashback Credited!</p>
                <h2 className="text-3xl font-black text-white">₹{cashbackEarned.toLocaleString('en-IN')}</h2>
                <p className="text-white/40 text-sm mt-1">added to your WanderLoot wallet</p>
              </div>

              {/* Wallet balance card */}
              <div className="w-full rounded-2xl p-5" style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)' }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet size={18} style={{ color: GOLD }} />
                    <span className="text-white/70 text-sm font-medium">New Wallet Balance</span>
                  </div>
                  <span className="text-2xl font-black" style={{ color: GOLD }}>₹{(newBalance).toLocaleString('en-IN')}</span>
                </div>
                <p className="text-white/30 text-xs mt-2">Use on your next YlooTrips booking for instant discount</p>
              </div>

              <div className="w-full space-y-2">
                <button
                  onClick={onClose}
                  className="w-full py-4 rounded-2xl font-black text-black text-sm"
                  style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)` }}
                >
                  Back to Explore
                </button>
                <button
                  onClick={() => { setStep('pick'); setFile(null); setPreview(null); setName(''); setContact(''); setTripName(''); }}
                  className="w-full py-3 rounded-2xl font-bold text-white/50 text-sm"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Upload Another Memory
                </button>
              </div>
            </div>
          )}

          {/* ── Step: Error ── */}
          {step === 'error' && (
            <div className="py-12 flex flex-col items-center gap-5 text-center">
              <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                <AlertCircle size={36} className="text-red-400" />
              </div>
              <div>
                <h2 className="text-xl font-black text-white">Upload Failed</h2>
                <p className="text-white/40 text-sm mt-2">{errorMsg}</p>
              </div>
              <button onClick={() => setStep('details')}
                className="w-full py-4 rounded-2xl font-black text-black"
                style={{ background: `linear-gradient(135deg, ${GOLD}, #E2C68F)` }}>
                Try Again
              </button>
            </div>
          )}
      </div>
    </div>
  );
}
