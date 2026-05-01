'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { X, Upload, Camera, Video, CheckCircle, ArrowRight, Wallet, RefreshCw, AlertCircle } from 'lucide-react';
import { useWallet } from '@/context/WalletContext';

const GOLD = '#C9A96E';
const CASHBACK_PHOTO = 500;
const CASHBACK_VIDEO = 1000;

interface TripMemorySheetProps {
  onClose: () => void;
}

type Step = 'pick' | 'details' | 'uploading' | 'success' | 'error';

export default function TripMemorySheet({ onClose }: TripMemorySheetProps) {
  const { balance, addCashback } = useWallet();
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
  const fileRef = useRef<HTMLInputElement>(null);

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
    setUploadProgress(0);
    setErrorMsg('');

    try {
      let fileUrl: string | null = null;

      // ── Step 1: try to upload file directly to GCS (optional — skipped if GCS not configured) ──
      if (file) {
        setUploadStage('Getting upload link...');
        setUploadProgress(5);

        try {
          const urlRes = await fetch('/api/trip-memories/upload-url', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mediaType, fileName: file.name, contentType: file.type }),
          });

          if (urlRes.ok) {
            const { signedUrl, fileUrl: gcsUrl } = await urlRes.json() as {
              signedUrl: string; fileUrl: string;
            };

            setUploadStage('Uploading to Google Cloud...');
            setUploadProgress(15);

            // Direct PUT to GCS signed URL — bypasses Vercel entirely, supports large files
            await new Promise<void>((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.upload.onprogress = (ev) => {
                if (ev.lengthComputable) {
                  const pct = Math.round((ev.loaded / ev.total) * 75) + 15;
                  setUploadProgress(pct);
                }
              };
              xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) resolve();
                else reject(new Error(`GCS upload failed (${xhr.status})`));
              };
              xhr.onerror = () => reject(new Error('Network error during upload'));
              xhr.open('PUT', signedUrl);
              xhr.setRequestHeader('Content-Type', file.type);
              xhr.send(file);
            });

            fileUrl = gcsUrl;
          }
          // GCS not configured → continue without file, post still saves
        } catch {
          // File upload failed → continue, post saves without image
        }

        setUploadProgress(92);
      }

      // ── Step 2: save metadata + credit cashback ──
      setUploadStage('Crediting cashback...');
      setUploadProgress(95);

      const metaRes = await fetch('/api/trip-memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:      name.trim(),
          contact:   contact.trim(),
          tripName:  tripName.trim(),
          mediaType,
          fileUrl,
          fileName:   file?.name || '',
          fileSizeKB: file ? Math.round(file.size / 1024) : 0,
        }),
      });

      const json = await metaRes.json() as { success?: boolean; cashback?: number; walletBalance?: number; error?: string };
      if (!metaRes.ok || !json.success) {
        throw new Error(json.error || 'Failed to save memory');
      }

      setUploadProgress(100);
      const earned = json.cashback ?? (mediaType === 'video' ? CASHBACK_VIDEO : CASHBACK_PHOTO);
      setCashbackEarned(earned);
      setNewBalance(json.walletBalance ?? balance + earned);
      addCashback(earned * 10, `MEM-${Date.now()}`, tripName.trim());
      setStep('success');

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Something went wrong. Try again.';
      setErrorMsg(msg);
      setStep('error');
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col justify-end"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}
    >
      <div
        className="rounded-t-3xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300 max-h-[95vh] flex flex-col"
        style={{ background: 'rgba(8,8,12,0.99)', border: '1px solid rgba(201,169,110,0.2)', borderBottom: 'none' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle + close */}
        <div className="flex items-center justify-between px-5 pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full bg-white/20 mx-auto absolute left-1/2 -translate-x-1/2" />
          <div />
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center ml-auto" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <X size={14} className="text-white/60" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-5 pb-10">

          {/* ── Step: Pick ── */}
          {step === 'pick' && (
            <div>
              {/* Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-3" style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)' }}>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em]" style={{ color: GOLD }}>Share & Earn</span>
                </div>
                <h2 className="text-2xl font-black text-white leading-tight">Upload Your<br />Trip Memories</h2>
                <p className="text-white/40 text-sm mt-2">Get instant cashback credited to your wallet</p>
              </div>

              {/* Reward pills */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: <Camera size={20} />, type: 'Photo', reward: CASHBACK_PHOTO, color: 'rgba(201,169,110,0.15)', border: 'rgba(201,169,110,0.3)' },
                  { icon: <Video size={20} />, type: 'Video', reward: CASHBACK_VIDEO, color: 'rgba(99,102,241,0.15)', border: 'rgba(99,102,241,0.35)' },
                ].map(({ icon, type, reward, color, border }) => (
                  <div key={type} className="rounded-2xl p-4 text-center" style={{ background: color, border: `1px solid ${border}` }}>
                    <div className="flex items-center justify-center mb-2" style={{ color: GOLD }}>{icon}</div>
                    <p className="text-white font-bold text-sm">{type}</p>
                    <p className="font-black text-lg mt-0.5" style={{ color: GOLD }}>₹{reward.toLocaleString('en-IN')}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">cashback</p>
                  </div>
                ))}
              </div>

              {/* Drop zone */}
              <div
                className="rounded-2xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all active:scale-[0.98]"
                style={{
                  borderColor: dragOver ? GOLD : 'rgba(201,169,110,0.3)',
                  background: dragOver ? 'rgba(201,169,110,0.08)' : 'rgba(255,255,255,0.03)',
                }}
                onClick={() => fileRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(201,169,110,0.12)', border: `1px solid rgba(201,169,110,0.3)` }}>
                  <Upload size={24} style={{ color: GOLD }} />
                </div>
                <div className="text-center">
                  <p className="text-white font-semibold text-sm">Tap to upload</p>
                  <p className="text-white/30 text-xs mt-0.5">Photos up to 10 MB · Videos up to 100 MB</p>
                </div>
                <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileChange} />
              </div>

              {/* How it works */}
              <div className="mt-5 rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(201,169,110,0.6)' }}>How it works</p>
                {[
                  ['📸', 'Upload a photo or video from your trip'],
                  ['✍️', 'Tell us your name & trip details'],
                  ['💰', 'Get ₹500–₹1000 credited to your wallet instantly'],
                  ['🛒', 'Use cashback on your next YlooTrips booking'],
                ].map(([emoji, text]) => (
                  <div key={text} className="flex items-start gap-3 mb-2 last:mb-0">
                    <span className="text-base shrink-0">{emoji}</span>
                    <p className="text-white/50 text-xs leading-relaxed">{text}</p>
                  </div>
                ))}
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
                <p className="text-white font-bold text-lg mb-1">Uploading your memory...</p>
                <p className="text-white/30 text-sm mb-4">{uploadStage || 'Please wait'}</p>
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
                    top: ['−20%', '−20%', '85%', '85%'][i],
                    left: ['−10%', '90%', '−10%', '90%'][i],
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
    </div>
  );
}
