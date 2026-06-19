import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: 'class',
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                // MakeMyTrip-inspired palette — Navy + Blue + Clean White
                primary: {
                    DEFAULT: '#0A2752',
                    light: '#1A3C6E',
                    dark: '#05152E',
                },
                secondary: {
                    DEFAULT: '#1A73E8',
                    light: '#4A93F8',
                    dark: '#0D5CC0',
                },
                accent: {
                    DEFAULT: '#008CFF',
                    warm: '#33A3FF',
                    muted: '#66BAFF',
                },
                cream: {
                    DEFAULT: '#F6F9FF',
                    dark: '#E8EFF9',
                    light: '#FAFCFF',
                },
                sage: {
                    DEFAULT: '#5C8DBA',
                    light: '#7AADD4',
                    dark: '#3D6E9A',
                },
                terracotta: {
                    DEFAULT: '#FF6B35',
                    light: '#FF8C5A',
                    dark: '#E8501A',
                },
            },
            fontFamily: {
                display: ['var(--font-playfair)', 'Georgia', 'serif'],
                body: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            fontSize: {
                'display-2xl': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '0.95', letterSpacing: '-0.02em' }],
                'display-xl': ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
                'display-lg': ['clamp(2rem, 4vw, 3.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
                'body-lg': ['1.125rem', { lineHeight: '1.75' }],
                'body-sm': ['0.875rem', { lineHeight: '1.6', letterSpacing: '0.01em' }],
                'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.08em' }],
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
                '30': '7.5rem',
                '128': '32rem',
            },
            animation: {
                'fade-up': 'fadeUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'fade-in': 'fadeIn 0.6s ease-out forwards',
                'slide-in-left': 'slideInLeft 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-in-right': 'slideInRight 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'slide-out-right': 'slideOutRight 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'scale-in': 'scaleIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'reveal': 'reveal 1.2s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
                'marquee': 'marquee 30s linear infinite',
                'pulse-slow': 'pulse 4s ease-in-out infinite',
            },
            keyframes: {
                fadeUp: {
                    '0%': { opacity: '0', transform: 'translateY(40px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideInLeft: {
                    '0%': { opacity: '0', transform: 'translateX(-60px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideInRight: {
                    '0%': { opacity: '0', transform: 'translateX(60px)' },
                    '100%': { opacity: '1', transform: 'translateX(0)' },
                },
                slideOutRight: {
                    '0%': { opacity: '1', transform: 'translateX(0)' },
                    '100%': { opacity: '0', transform: 'translateX(80px)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.9)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                reveal: {
                    '0%': { clipPath: 'inset(0 100% 0 0)' },
                    '100%': { clipPath: 'inset(0 0% 0 0)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-20px)' },
                },
                marquee: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(-50%)' },
                },
            },
            transitionTimingFunction: {
                'smooth': 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-warm': 'linear-gradient(135deg, #C4A77D 0%, #C17F59 100%)',
                'gradient-dark': 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
            },
        },
    },
    plugins: [],
};

export default config;
