export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 72 72" className={className} role="img" aria-label="MarketLoopAI logo">
      {/* Outer loop: content flowing out to every channel */}
      <path
        d="M40.17 59.64 A24 24 0 1 1 59.64 40.17"
        fill="none"
        stroke="#fa0707"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <path d="M64.56 41.04 L61.44 34.22 L56.2 43.35 Z" fill="#fa0707" />

      {/* Inner loop: performance data flowing back in — the closed loop */}
      <path
        d="M33.74 23.2 A13 13 0 1 1 23.2 33.74"
        fill="none"
        stroke="#c7c9cc"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
      <path d="M18.77 32.96 L23.21 30.31 L25 36 Z" fill="#c7c9cc" />

      <circle cx="36" cy="36" r="3.4" fill="#ffffff" />
    </svg>
  );
}
