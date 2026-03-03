'use client';

interface RakatProgressProps {
  totalRakats: number;
  currentRakat: number;
  onRakatTap?: (rakat: number) => void;
}

export default function RakatProgress({ totalRakats, currentRakat, onRakatTap }: RakatProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2">
      {Array.from({ length: totalRakats }, (_, i) => {
        const rakat = i + 1;
        const isCurrent = rakat === currentRakat;
        const isPast = rakat < currentRakat;

        return (
          <button
            key={rakat}
            onClick={() => onRakatTap?.(rakat)}
            className="flex items-center gap-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                isCurrent
                  ? 'bg-primary text-white'
                  : isPast
                    ? 'bg-primary/20 text-primary'
                    : 'bg-border text-text-muted'
              }`}
            >
              {rakat}
            </div>
            {rakat < totalRakats && (
              <div className={`w-6 h-0.5 ${
                isPast ? 'bg-primary/30' : 'bg-border'
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
