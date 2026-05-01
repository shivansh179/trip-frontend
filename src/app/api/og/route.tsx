import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const title = url.searchParams.get('title') || 'Curated India Tour Packages';
    const subtitle = url.searchParams.get('subtitle') || 'Manali · Goa · Kerala · Kashmir · Bali · Dubai · Thailand';
    const type = url.searchParams.get('type') || 'default';

    const typeLabel = type === 'trip' ? 'TOUR PACKAGE' : type === 'blog' ? 'TRAVEL JOURNAL' : null;
    const fontSize = title.length > 55 ? '40px' : title.length > 38 ? '48px' : '56px';

    const GOLD = '#C9A96E';
    const GOLD_LIGHT = '#E2C68F';
    const GOLD_DIM = 'rgba(201,169,110,0.22)';
    const GOLD_FAINT = 'rgba(201,169,110,0.12)';
    const TEXT = '#F8F4EE';
    const TEXT_MID = 'rgba(248,244,238,0.55)';
    const TEXT_LOW = 'rgba(248,244,238,0.28)';

    const stats = [
      { num: '25,000+', label: 'TRAVELERS' },
      { num: '150+', label: 'DESTINATIONS' },
      { num: '₹4,999', label: 'FROM' },
      { num: 'MSME', label: 'CERTIFIED' },
    ];

    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            display: 'flex',
            background: '#0c0c0c',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background gradient — warm deep */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundImage: 'linear-gradient(160deg, #141008 0%, #0c0c0c 50%, #080c10 100%)',
            display: 'flex',
          }} />

          {/* Gold glow — top left */}
          <div style={{
            position: 'absolute', top: '-180px', left: '-80px',
            width: '600px', height: '600px', borderRadius: '50%',
            backgroundImage: 'radial-gradient(circle at center, rgba(201,169,110,0.10) 0%, rgba(201,169,110,0) 65%)',
            display: 'flex',
          }} />

          {/* Gold glow — bottom right */}
          <div style={{
            position: 'absolute', bottom: '-200px', right: '-100px',
            width: '580px', height: '580px', borderRadius: '50%',
            backgroundImage: 'radial-gradient(circle at center, rgba(201,169,110,0.07) 0%, rgba(201,169,110,0) 65%)',
            display: 'flex',
          }} />

          {/* Outer frame */}
          <div style={{
            position: 'absolute', top: '24px', left: '24px', right: '24px', bottom: '24px',
            border: `1px solid ${GOLD_DIM}`,
            display: 'flex',
          }} />

          {/* Corner — top-left */}
          <div style={{ position: 'absolute', top: '14px', left: '14px', width: '20px', height: '20px', borderTop: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}`, display: 'flex' }} />
          {/* Corner — top-right */}
          <div style={{ position: 'absolute', top: '14px', right: '14px', width: '20px', height: '20px', borderTop: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}`, display: 'flex' }} />
          {/* Corner — bottom-left */}
          <div style={{ position: 'absolute', bottom: '14px', left: '14px', width: '20px', height: '20px', borderBottom: `2px solid ${GOLD}`, borderLeft: `2px solid ${GOLD}`, display: 'flex' }} />
          {/* Corner — bottom-right */}
          <div style={{ position: 'absolute', bottom: '14px', right: '14px', width: '20px', height: '20px', borderBottom: `2px solid ${GOLD}`, borderRight: `2px solid ${GOLD}`, display: 'flex' }} />

          {/* Content */}
          <div style={{
            position: 'relative', display: 'flex', flexDirection: 'column',
            padding: '52px 68px', width: '100%', height: '100%',
            justifyContent: 'space-between',
          }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* Logo */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
                  <span style={{ color: GOLD_LIGHT, fontSize: '30px', fontWeight: 700, letterSpacing: '6px', fontFamily: 'serif' }}>YLOO</span>
                  <span style={{ color: TEXT_MID, fontSize: '20px', fontWeight: 400, letterSpacing: '8px', marginBottom: '2px', fontFamily: 'serif' }}>TRIPS</span>
                </div>
                <div style={{ width: '120px', height: '1px', backgroundImage: `linear-gradient(90deg, ${GOLD}, transparent)`, display: 'flex' }} />
              </div>

              {/* Stars + label */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '5px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: GOLD, fontSize: '16px' }}>★★★★★</span>
                  <span style={{ color: TEXT_MID, fontSize: '15px', fontFamily: 'serif' }}>4.9 / 5.0</span>
                </div>
                <span style={{ color: TEXT_LOW, fontSize: '11px', letterSpacing: '3px', fontFamily: 'serif' }}>2,400+ VERIFIED REVIEWS</span>
              </div>
            </div>

            {/* Main */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '980px' }}>
              {typeLabel && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ width: '32px', height: '1px', background: GOLD, display: 'flex' }} />
                  <span style={{ color: GOLD, fontSize: '12px', letterSpacing: '4px', fontFamily: 'serif' }}>{typeLabel}</span>
                  <div style={{ width: '32px', height: '1px', background: GOLD, display: 'flex' }} />
                </div>
              )}

              <div style={{ color: TEXT, fontSize, fontWeight: 700, lineHeight: 1.2, fontFamily: 'serif' }}>
                {title}
              </div>

              <div style={{ color: TEXT_MID, fontSize: '20px', fontWeight: 400, lineHeight: 1.5, fontFamily: 'serif' }}>
                {subtitle}
              </div>
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ width: '100%', height: '1px', background: GOLD_FAINT, display: 'flex' }} />

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                  {/* Stat 1 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingRight: '32px' }}>
                    <span style={{ color: GOLD_LIGHT, fontSize: '20px', fontWeight: 700, fontFamily: 'serif' }}>{stats[0].num}</span>
                    <span style={{ color: TEXT_LOW, fontSize: '10px', letterSpacing: '3px', fontFamily: 'serif' }}>{stats[0].label}</span>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: GOLD_FAINT, display: 'flex' }} />
                  {/* Stat 2 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '32px', paddingRight: '32px' }}>
                    <span style={{ color: GOLD_LIGHT, fontSize: '20px', fontWeight: 700, fontFamily: 'serif' }}>{stats[1].num}</span>
                    <span style={{ color: TEXT_LOW, fontSize: '10px', letterSpacing: '3px', fontFamily: 'serif' }}>{stats[1].label}</span>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: GOLD_FAINT, display: 'flex' }} />
                  {/* Stat 3 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '32px', paddingRight: '32px' }}>
                    <span style={{ color: GOLD_LIGHT, fontSize: '20px', fontWeight: 700, fontFamily: 'serif' }}>{stats[2].num}</span>
                    <span style={{ color: TEXT_LOW, fontSize: '10px', letterSpacing: '3px', fontFamily: 'serif' }}>{stats[2].label}</span>
                  </div>
                  <div style={{ width: '1px', height: '30px', background: GOLD_FAINT, display: 'flex' }} />
                  {/* Stat 4 */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', paddingLeft: '32px' }}>
                    <span style={{ color: GOLD_LIGHT, fontSize: '20px', fontWeight: 700, fontFamily: 'serif' }}>{stats[3].num}</span>
                    <span style={{ color: TEXT_LOW, fontSize: '10px', letterSpacing: '3px', fontFamily: 'serif' }}>{stats[3].label}</span>
                  </div>
                </div>

                <span style={{ color: TEXT_LOW, fontSize: '13px', letterSpacing: '3px', fontFamily: 'serif' }}>YLOOTRIPS.COM</span>
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  } catch (err) {
    console.error('[api/og] error:', err);
    return new Response('Failed to generate image', { status: 500 });
  }
}
