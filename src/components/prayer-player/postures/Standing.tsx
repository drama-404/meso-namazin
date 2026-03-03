export default function Standing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 200" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="60" cy="30" r="16" stroke="currentColor" strokeWidth="2.5" />
      {/* Body */}
      <line x1="60" y1="46" x2="60" y2="120" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms folded on chest */}
      <path d="M60 70 L40 80 L50 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M60 70 L80 80 L70 85" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Legs */}
      <line x1="60" y1="120" x2="45" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60" y1="120" x2="75" y2="185" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="45" y1="185" x2="35" y2="190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="185" x2="85" y2="190" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
