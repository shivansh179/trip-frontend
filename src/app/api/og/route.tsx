import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const title = url.searchParams.get('title') || 'Safe & Affordable India Tour Packages';
  const subtitle = url.searchParams.get('subtitle') || 'Manali · Goa · Kerala · Kashmir · Bali · Dubai · Thailand';
  const type = url.searchParams.get('type') || 'default'; // default | trip | blog

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: '#1a0a00',
          fontFamily: 'serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(135deg, #1a0a00 0%, #2d1200 40%, #1a0a00 100%)',
            display: 'flex',
          }}
        />

        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(205, 133, 63, 0.12)',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-80px',
            width: '350px',
            height: '350px',
            borderRadius: '50%',
            background: 'rgba(205, 133, 63, 0.08)',
            display: 'flex',
          }}
        />

        {/* Top border accent */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: 'linear-gradient(90deg, #c8832a, #e8a84a, #c8832a)',
            display: 'flex',
          }}
        />

        {/* Content */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            padding: '56px 72px',
            height: '100%',
            justifyContent: 'space-between',
          }}
        >
          {/* Top: Logo + badge */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  background: '#c8832a',
                  borderRadius: '12px',
                  padding: '10px 18px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: '#fff', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.5px' }}>
                  YLOO<span style={{ color: '#1a0a00' }}>TRIPS</span>
                </span>
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(200, 131, 42, 0.15)',
                border: '1px solid rgba(200, 131, 42, 0.4)',
                borderRadius: '100px',
                padding: '8px 20px',
              }}
            >
              <span style={{ color: '#e8a84a', fontSize: '18px' }}>★★★★★</span>
              <span style={{ color: '#c8832a', fontSize: '16px', fontWeight: 700 }}>4.9 · 2,400+ Reviews</span>
            </div>
          </div>

          {/* Middle: Title */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '900px' }}>
            {type === 'trip' && (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(200, 131, 42, 0.2)',
                  border: '1px solid rgba(200, 131, 42, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#e8a84a', fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Tour Package
                </span>
              </div>
            )}
            {type === 'blog' && (
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(200, 131, 42, 0.2)',
                  border: '1px solid rgba(200, 131, 42, 0.3)',
                  borderRadius: '6px',
                  padding: '6px 16px',
                  width: 'fit-content',
                }}
              >
                <span style={{ color: '#e8a84a', fontSize: '13px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                  Travel Guide
                </span>
              </div>
            )}
            <div
              style={{
                color: '#f5f0eb',
                fontSize: title.length > 50 ? '44px' : '52px',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.5px',
              }}
            >
              {title}
            </div>
            <div style={{ color: 'rgba(245, 240, 235, 0.6)', fontSize: '22px', fontWeight: 400 }}>
              {subtitle}
            </div>
          </div>

          {/* Bottom: Stats */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '48px' }}>
            {[
              { num: '25,000+', label: 'Happy Travelers' },
              { num: '150+', label: 'Destinations' },
              { num: '₹4,999', label: 'Trips from' },
              { num: 'MSME', label: 'Certified' },
            ].map(({ num, label }) => (
              <div key={label} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ color: '#c8832a', fontSize: '24px', fontWeight: 800 }}>{num}</span>
                <span style={{ color: 'rgba(245, 240, 235, 0.45)', fontSize: '14px', fontWeight: 500 }}>{label}</span>
              </div>
            ))}
            <div style={{ flex: 1 }} />
            <div style={{ color: 'rgba(245, 240, 235, 0.3)', fontSize: '15px' }}>ylootrips.com</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
