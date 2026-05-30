import { useId } from 'react';

export function Logo({ className }: { className?: string }) {
  const id = useId();
  const hid = (s: string) => `${s}-${id}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="none"
      viewBox="0 0 64 64"
      className={className}
      aria-label="Aerilia"
    >
      <defs>
        <filter id={hid('hexGlow')} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id={hid('silver')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f0f0f8" />
          <stop offset="35%" stopColor="#b8b8d0" />
          <stop offset="50%" stopColor="#e8e8f4" />
          <stop offset="65%" stopColor="#9098b0" />
          <stop offset="100%" stopColor="#d8d8e8" />
        </linearGradient>
        <linearGradient id={hid('gold')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffeaaa" />
          <stop offset="30%" stopColor="#e8b840" />
          <stop offset="50%" stopColor="#fff0c0" />
          <stop offset="70%" stopColor="#c89030" />
          <stop offset="100%" stopColor="#ffd866" />
        </linearGradient>
        <linearGradient id={hid('prismatic')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ff7eb3" />
          <stop offset="20%" stopColor="#c461ff" />
          <stop offset="40%" stopColor="#5ec5ff" />
          <stop offset="60%" stopColor="#47ff94" />
          <stop offset="80%" stopColor="#ff7eb3" />
          <stop offset="100%" stopColor="#c461ff" />
        </linearGradient>
        <linearGradient id={hid('hexBorder')} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#7b4fff" />
          <stop offset="50%" stopColor="#a878ff" />
          <stop offset="100%" stopColor="#6040d0" />
        </linearGradient>
      </defs>

      <polygon
        points="32,2 58,17 58,47 32,62 6,47 6,17"
        fill="none"
        stroke="#7b4fff"
        strokeWidth="1"
        opacity="0.3"
        filter={`url(#${hid('hexGlow')})`}
      />
      <polygon
        points="32,3 57,17.5 57,46.5 32,61 7,46.5 7,17.5"
        fill="none"
        stroke={`url(#${hid('hexBorder')})`}
        strokeWidth="1.8"
        filter={`url(#${hid('hexGlow')})`}
      />
      <polygon
        points="32,5 55.5,18.5 55.5,45.5 32,59 8.5,45.5 8.5,18.5"
        fill="#0d0820"
        stroke="#6040d0"
        strokeWidth="0.5"
        opacity="0.95"
      />

      <ellipse cx="32" cy="32" rx="10" ry="18" fill="#7b4fff" opacity="0.08" />

      <rect x="21" y="17" width="5" height="30" rx="2.5" fill={`url(#${hid('silver')})`} opacity="0.9" />
      <rect x="29.5" y="14" width="5" height="36" rx="2.5" fill={`url(#${hid('gold')})`} opacity="0.95" />
      <rect x="38" y="17" width="5" height="30" rx="2.5" fill={`url(#${hid('prismatic')})`} opacity="0.9" />

      <circle cx="32" cy="4.5" r="1.2" fill="#a878ff" opacity="0.7" />
      <circle cx="56.5" cy="18" r="1" fill="#a878ff" opacity="0.5" />
      <circle cx="56.5" cy="46" r="1" fill="#a878ff" opacity="0.5" />
      <circle cx="32" cy="59.5" r="1" fill="#a878ff" opacity="0.4" />
      <circle cx="7.5" cy="46" r="1" fill="#a878ff" opacity="0.5" />
      <circle cx="7.5" cy="18" r="1" fill="#a878ff" opacity="0.5" />
    </svg>
  );
}
