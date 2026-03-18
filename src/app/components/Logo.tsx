interface LogoProps {
  size?: number;
  className?: string;
}

export function Logo({ size = 40, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Circle */}
      <circle cx="50" cy="50" r="48" fill="white" />
      
      {/* Main Location Pin */}
      <path
        d="M50 20C39.5 20 31 28.5 31 39C31 47 38 58 50 70C62 58 69 47 69 39C69 28.5 60.5 20 50 20Z"
        fill="url(#gradient1)"
      />
      
      {/* Inner Circle of Pin */}
      <circle cx="50" cy="39" r="8" fill="white" />
      
      {/* Small Connection Dots */}
      <circle cx="35" cy="50" r="4" fill="url(#gradient2)" />
      <circle cx="65" cy="50" r="4" fill="url(#gradient2)" />
      <circle cx="50" cy="65" r="4" fill="url(#gradient2)" />
      
      {/* Connection Lines */}
      <line x1="39" y1="48" x2="46" y2="43" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
      <line x1="61" y1="48" x2="54" y2="43" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
      <line x1="50" y1="61" x2="50" y2="52" stroke="url(#gradient2)" strokeWidth="2" strokeLinecap="round" />
      
      {/* Heatmap Waves */}
      <path
        d="M30 75C30 75 40 72 50 72C60 72 70 75 70 75"
        stroke="url(#gradient3)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M25 82C25 82 37.5 78 50 78C62.5 78 75 82 75 82"
        stroke="url(#gradient3)"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.3"
      />
      
      {/* Gradients */}
      <defs>
        <linearGradient id="gradient1" x1="31" y1="20" x2="69" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="gradient2" x1="35" y1="50" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
        <linearGradient id="gradient3" x1="25" y1="75" x2="75" y2="82" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F59E0B" />
          <stop offset="50%" stopColor="#EF4444" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>
    </svg>
  );
}

interface LogoTextProps {
  className?: string;
}

export function LogoText({ className = '' }: LogoTextProps) {
  return (
    <svg
      width="140"
      height="40"
      viewBox="0 0 140 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <text
        x="0"
        y="30"
        fontFamily="system-ui, -apple-system, sans-serif"
        fontSize="32"
        fontWeight="800"
        fill="white"
      >
        Ceb<tspan fill="#FCD34D">Spot</tspan>
      </text>
    </svg>
  );
}
