export function ScoreRing({ score, size = 80 }: { score: number; size?: number }) {
  const color =
    score >= 90 ? '#10b981' :
    score >= 70 ? '#f59e0b' :
    score >= 50 ? '#f97316' : '#ef4444';

  const glowColor =
    score >= 90 ? 'rgba(16,185,129,0.3)' :
    score >= 70 ? 'rgba(245,158,11,0.3)' :
    score >= 50 ? 'rgba(249,115,22,0.3)' : 'rgba(239,68,68,0.3)';

  const r = (size / 2) - 7;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div
      className="relative inline-flex items-center justify-center flex-shrink-0"
      style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
    >
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={6} />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={circ} strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.32,0.72,0,1)' }}
        />
      </svg>
      <span
        className="absolute font-semibold tabular-nums"
        style={{ color, fontSize: size * 0.23 }}
      >
        {score}
      </span>
    </div>
  );
}
