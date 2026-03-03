export default function Bowing({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="40" cy="55" r="14" stroke="currentColor" strokeWidth="2.5" />
      {/* Body - bent forward */}
      <line x1="54" y1="58" x2="110" y2="58" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms going down to knees */}
      <line x1="80" y1="58" x2="80" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="95" y1="58" x2="95" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs - straight */}
      <line x1="110" y1="58" x2="110" y2="140" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Feet */}
      <line x1="110" y1="140" x2="120" y2="145" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
