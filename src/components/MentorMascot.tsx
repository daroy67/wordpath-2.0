import React from 'react';

export type MascotState = 'idle' | 'thinking' | 'ready' | 'offline';

interface MentorMascotProps {
  state?: MascotState;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE_MAP = {
  sm: 44,
  md: 64,
  lg: 88
} as const;

export const MentorMascot: React.FC<MentorMascotProps> = ({
  state = 'ready',
  size = 'md',
  className = ''
}) => {
  const px = SIZE_MAP[size];
  const isThinking = state === 'thinking';
  const isOffline = state === 'offline';

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${className}`}
      style={{ width: px, height: px }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 96 96"
        width={px}
        height={px}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="overflow-visible"
      >
        <defs>
          <linearGradient id="wp-bot-shell" x1="16" y1="16" x2="80" y2="86" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor={isOffline ? '#64748B' : '#4F46E5'} />
            <stop offset="55%" stopColor={isOffline ? '#475569' : '#2563EB'} />
            <stop offset="100%" stopColor={isOffline ? '#334155' : '#0D9488'} />
          </linearGradient>
          <linearGradient id="wp-bot-visor" x1="26" y1="36" x2="70" y2="62" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0F172A" />
            <stop offset="100%" stopColor="#1E1B4B" />
          </linearGradient>
        </defs>

        {/* Soft ambient halo */}
        <circle
          cx="48"
          cy="50"
          r="42"
          fill={isOffline ? '#94A3B8' : '#6366F1'}
          fillOpacity={isThinking ? 0.18 : 0.1}
        />

        {/* Antenna stem & signal bulb */}
        <line
          x1="48"
          y1="20"
          x2="48"
          y2="11"
          stroke={isOffline ? '#64748B' : '#38BDF8'}
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <circle
          cx="48"
          cy="9"
          r="5"
          fill={isOffline ? '#94A3B8' : isThinking ? '#F59E0B' : '#14B8A6'}
          className={isThinking ? 'motion-safe:animate-pulse' : ''}
        />

        {/* Side ear sensors */}
        <rect
          x="10"
          y="41"
          width="8"
          height="18"
          rx="4"
          fill={isOffline ? '#64748B' : '#3B82F6'}
        />
        <rect
          x="78"
          y="41"
          width="8"
          height="18"
          rx="4"
          fill={isOffline ? '#64748B' : '#14B8A6'}
        />

        {/* Rounded robot head */}
        <rect
          x="16"
          y="20"
          width="64"
          height="58"
          rx="20"
          fill="url(#wp-bot-shell)"
        />

        {/* Inner highlight rim */}
        <rect
          x="18.5"
          y="22.5"
          width="59"
          height="53"
          rx="18"
          stroke="#FFFFFF"
          strokeOpacity="0.25"
          strokeWidth="1.5"
        />

        {/* Visor display */}
        <rect x="24" y="32" width="48" height="30" rx="12" fill="url(#wp-bot-visor)" />

        {/* Friendly eyes & expression */}
        {isOffline ? (
          <>
            <line x1="33" y1="45" x2="41" y2="45" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <line x1="55" y1="45" x2="63" y2="45" stroke="#94A3B8" strokeWidth="3" strokeLinecap="round" />
            <path d="M42 54H54" stroke="#94A3B8" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : isThinking ? (
          <>
            <circle cx="37" cy="45" r="4" fill="#38BDF8" />
            <circle cx="59" cy="45" r="4" fill="#2DD4BF" />
            <circle cx="42" cy="54" r="1.8" fill="#FBBF24" />
            <circle cx="48" cy="54" r="1.8" fill="#FBBF24" />
            <circle cx="54" cy="54" r="1.8" fill="#FBBF24" />
          </>
        ) : (
          <>
            {/* Happy curved / bright eyes */}
            <circle cx="37" cy="44" r="4.5" fill="#38BDF8" />
            <circle cx="38.5" cy="42.5" r="1.5" fill="#E0F2FE" />
            <circle cx="59" cy="44" r="4.5" fill="#2DD4BF" />
            <circle cx="60.5" cy="42.5" r="1.5" fill="#CCFBF1" />
            {/* Warm smile */}
            <path
              d="M41 53.5C43.2 56.5 52.8 56.5 55 53.5"
              stroke="#5EEAD4"
              strokeWidth="2.6"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Base collar / badge accent */}
        <rect x="34" y="81" width="28" height="6" rx="3" fill={isOffline ? '#64748B' : '#4F46E5'} fillOpacity="0.65" />
      </svg>
    </div>
  );
};
