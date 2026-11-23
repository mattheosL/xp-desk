import type { ProjectColor } from '../../types/project';

/* Ícones em SVG inline, no estilo dos ícones de pasta/usuário do Windows XP. */

const FOLDER_COLORS: Record<ProjectColor, { back: string; front: string; stroke: string }> = {
  blue: { back: '#2f63c4', front: '#5b95e6', stroke: '#1f4a9c' },
  green: { back: '#2f8a3c', front: '#5cbf62', stroke: '#22692d' },
  yellow: { back: '#e0a21f', front: '#fdd660', stroke: '#b9801a' },
  gray: { back: '#8a93a3', front: '#c4cad5', stroke: '#6b7486' },
};

interface FolderIconProps {
  color?: ProjectColor;
  size?: number;
  search?: boolean;
}

export function FolderIcon({ color = 'yellow', size = 34, search = false }: FolderIconProps) {
  const c = FOLDER_COLORS[color];
  return (
    <svg width={size} height={size * 0.75} viewBox="0 0 32 24" aria-hidden="true" focusable="false">
      <path d="M1.5 3.5h9l2.5 2.5h17.5v16.5h-29z" fill={c.back} stroke={c.stroke} />
      <path d="M1.5 8.5h29v14h-29z" fill={c.front} stroke={c.stroke} />
      <path d="M2.5 9.5h27" stroke="rgba(255,255,255,0.55)" />
      {search && (
        <g>
          <circle cx="23" cy="16" r="4.2" fill="#dff0ff" stroke="#1f4a9c" strokeWidth="1.6" />
          <path d="M26 19l3.5 3.5" stroke="#1f4a9c" strokeWidth="2.2" strokeLinecap="round" />
        </g>
      )}
    </svg>
  );
}

export function PeopleIcon({ size = 30 }: { size?: number }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 30 24" aria-hidden="true" focusable="false">
      <circle cx="10" cy="6.5" r="4.5" fill="#f7c88f" stroke="#b07a3c" />
      <circle cx="20" cy="6.5" r="4.5" fill="#f7c88f" stroke="#b07a3c" />
      <path d="M2 22c0-6 3.5-9 8-9s8 3 8 9z" fill="#3fae4f" stroke="#277c33" />
      <path d="M12 22c0-6 3.5-9 8-9s8 3 8 9z" fill="#3b78d8" stroke="#244f9a" />
    </svg>
  );
}

export function BoltIcon({ size = 26 }: { size?: number }) {
  return (
    <svg width={size * 0.75} height={size} viewBox="0 0 18 24" aria-hidden="true" focusable="false">
      <path d="M11 1L2 14h6l-2 9 10-14h-6.5z" fill="#ffd23d" stroke="#c98a10" strokeLinejoin="round" />
    </svg>
  );
}

export function UserIcon({ size = 26, shirt = '#3b78d8' }: { size?: number; shirt?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="7.5" r="5" fill="#f7c88f" stroke="#a8743a" />
      <path d="M3 23c0-6 4-9.5 9-9.5s9 3.5 9 9.5z" fill={shirt} stroke="rgba(0,0,0,0.35)" />
    </svg>
  );
}

export function InfoIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <circle cx="12" cy="12" r="11" fill="#2f6fd6" stroke="#1d4ea6" />
      <circle cx="12" cy="6.8" r="1.6" fill="#fff" />
      <path d="M10 10.5h3v7h1.5v1.5h-5v-1.5H11v-5.5h-1z" fill="#fff" />
    </svg>
  );
}

export function WindowsLogo({ size = 76 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 80 80" aria-hidden="true" focusable="false">
      <defs>
        <filter id="wl-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.6" floodOpacity="0.25" />
        </filter>
      </defs>
      <g filter="url(#wl-shadow)">
        <path d="M5 12c9-5 20-5 31 0v26c-11-5-22-5-31 0z" fill="#ec4a2f" />
        <path d="M42 9c11-5 22-5 33 0v27c-11-5-22-5-33 0z" fill="#6db33f" />
        <path d="M5 44c9-5 20-5 31 0v26c-11-5-22-5-31 0z" fill="#2f7fd8" />
        <path d="M42 42c11-5 22-5 33 0v27c-11-5-22-5-33 0z" fill="#f7be2a" />
      </g>
    </svg>
  );
}
