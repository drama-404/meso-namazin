export default function Sitting({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="70" cy="25" r="14" stroke="currentColor" strokeWidth="2.5" />
      {/* Body - upright sitting */}
      <line x1="70" y1="39" x2="70" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms - hands on thighs */}
      <path d="M70 60 L50 80 L45 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 60 L90 80 L95 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Folded legs */}
      <path d="M70 90 L50 110 L35 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M70 90 L90 110 L105 140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Feet tucked */}
      <line x1="35" y1="140" x2="55" y2="145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="105" y1="140" x2="85" y2="145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
