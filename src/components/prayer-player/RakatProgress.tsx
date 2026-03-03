'use client';

interface RakatProgressProps {
  totalRakats: number;
  currentRakat: number;
  onRakatTap?: (rakat: number) => void;
}

export default function RakatProgress({ totalRakats, currentRakat, onRakatTap }: RakatProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2 py-2.5">
      {Array.from({ length: totalRakats }, (_, i) => {
        const rakat = i + 1;
        const isCurrent = rakat === currentRakat;
        const isPast = rakat < currentRakat;

        return (
          <button
            key={rakat}
            onClick={() => onRakatTap?.(rakat)}
            className="flex items-center gap-2 active:scale-[0.97] transition-transform"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-colors ${
                isCurrent
                  ? 'bg-[#1B7A4A] text-white'
                  : isPast
                    ? 'bg-[#E8F5EE] text-[#1B7A4A]'
                    : 'bg-[#EFEFF4] text-[#AEAEB2]'
              }`}
            >
              {rakat}
            </div>
            {rakat < totalRakats && (
              <div className={`w-6 h-0.5 rounded-full ${
                isPast ? 'bg-[#1B7A4A]/30' : 'bg-[#EFEFF4]'
              }`} />
            )}
          </button>
        );
      })}
    </div>
  );
}
