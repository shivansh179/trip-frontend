'use client';

interface PaintSplashBgProps {
    children: React.ReactNode;
    className?: string;
}

function SplatterSvg({ color, className }: { color: string; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M100 20C120 20 155 35 170 60C185 85 180 120 165 145C150 170 120 185 95 180C70 175 45 155 30 130C15 105 15 70 30 50C45 30 75 20 100 20Z"
                fill={color}
            />
            <circle cx="170" cy="40" r="12" fill={color} />
            <circle cx="30" cy="160" r="9" fill={color} />
            <circle cx="175" cy="130" r="7" fill={color} />
            <ellipse cx="55" cy="30" rx="10" ry="6" fill={color} />
            <circle cx="150" cy="175" r="5" fill={color} />
        </svg>
    );
}

function DripSvg({ color, className }: { color: string; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 30 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 0C15 0 20 15 20 30C20 45 22 60 20 80C18 95 17 105 15 115C15 118 13 120 15 120C17 120 15 118 15 115C13 105 12 95 10 80C8 60 10 45 10 30C10 15 15 0 15 0Z"
                fill={color}
            />
            <ellipse cx="15" cy="118" rx="6" ry="4" fill={color} />
        </svg>
    );
}

function SmallSplat({ color, className }: { color: string; className?: string }) {
    return (
        <svg className={className} viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M40 8C52 8 65 18 70 32C75 46 68 62 56 70C44 78 28 76 18 66C8 56 5 38 12 25C19 12 30 8 40 8Z"
                fill={color}
            />
            <circle cx="68" cy="18" r="5" fill={color} />
            <circle cx="12" cy="65" r="4" fill={color} />
            <circle cx="60" cy="68" r="3" fill={color} />
        </svg>
    );
}

export default function PaintSplashBg({ children, className = '' }: PaintSplashBgProps) {
    return (
        <div className={`paint-splash-bg ${className}`}>
            {/* Large corner splatters */}
            <SplatterSvg color="rgba(255,70,130,0.18)" className="holi-splat holi-splat-tl" />
            <SplatterSvg color="rgba(0,170,255,0.16)" className="holi-splat holi-splat-tr" />
            <SplatterSvg color="rgba(255,200,0,0.18)" className="holi-splat holi-splat-br" />
            <SplatterSvg color="rgba(80,200,80,0.16)" className="holi-splat holi-splat-bl" />

            {/* Mid-page accent splatters */}
            <SmallSplat color="rgba(180,80,255,0.14)" className="holi-mini holi-mini-1" />
            <SmallSplat color="rgba(255,120,50,0.14)" className="holi-mini holi-mini-2" />
            <SmallSplat color="rgba(0,200,200,0.13)" className="holi-mini holi-mini-3" />
            <SmallSplat color="rgba(255,70,130,0.12)" className="holi-mini holi-mini-4" />

            {/* Paint drips from top edge */}
            <DripSvg color="rgba(255,70,130,0.22)" className="holi-drip holi-drip-1" />
            <DripSvg color="rgba(0,170,255,0.20)" className="holi-drip holi-drip-2" />
            <DripSvg color="rgba(255,200,0,0.22)" className="holi-drip holi-drip-3" />
            <DripSvg color="rgba(80,200,80,0.18)" className="holi-drip holi-drip-4" />
            <DripSvg color="rgba(180,80,255,0.18)" className="holi-drip holi-drip-5" />

            {/* Scattered color powder dots */}
            <div className="holi-dots">
                <span className="holi-dot" style={{ background: '#FF4682', top: '8%', left: '15%', width: 8, height: 8 }} />
                <span className="holi-dot" style={{ background: '#00AAFF', top: '5%', right: '20%', width: 6, height: 6 }} />
                <span className="holi-dot" style={{ background: '#FFC800', bottom: '12%', left: '25%', width: 7, height: 7 }} />
                <span className="holi-dot" style={{ background: '#50C850', top: '30%', right: '8%', width: 5, height: 5 }} />
                <span className="holi-dot" style={{ background: '#B450FF', bottom: '20%', right: '18%', width: 6, height: 6 }} />
                <span className="holi-dot" style={{ background: '#FF7832', top: '50%', left: '5%', width: 5, height: 5 }} />
                <span className="holi-dot" style={{ background: '#00AAFF', top: '65%', left: '40%', width: 4, height: 4 }} />
                <span className="holi-dot" style={{ background: '#FF4682', bottom: '30%', right: '35%', width: 5, height: 5 }} />
                <span className="holi-dot" style={{ background: '#FFC800', top: '18%', left: '55%', width: 6, height: 6 }} />
                <span className="holi-dot" style={{ background: '#50C850', bottom: '8%', left: '60%', width: 7, height: 7 }} />
                <span className="holi-dot" style={{ background: '#B450FF', top: '40%', left: '85%', width: 4, height: 4 }} />
                <span className="holi-dot" style={{ background: '#FF7832', bottom: '45%', left: '12%', width: 6, height: 6 }} />
            </div>

            {children}
        </div>
    );
}
