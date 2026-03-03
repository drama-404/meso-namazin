export default function Prostrating({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 180 120" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head touching ground */}
      <circle cx="30" cy="85" r="12" stroke="currentColor" strokeWidth="2.5" />
      {/* Upper body angled down */}
      <path d="M42 82 L80 55" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Arms on ground */}
      <line x1="45" y1="75" x2="45" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="55" y1="72" x2="55" y2="95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Lower body - hips up */}
      <path d="M80 55 L110 40" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs folded */}
      <path d="M110 40 L130 70 L145 95" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Toes on ground */}
      <line x1="145" y1="95" x2="150" y2="90" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
