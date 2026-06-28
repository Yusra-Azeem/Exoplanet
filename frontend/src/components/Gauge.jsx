export default function Gauge({ pct, label, color }) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const progress = (pct / 100) * circumference;
  const filterId = `gf-${label}`;

  return (
    <div className="text-center">
      <svg
        width="120"
        height="120"
        viewBox="0 0 120 120"
        style={{ display: "block", margin: "0 auto" }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Rotate so progress starts from top */}
        <g transform="rotate(-90 60 60)">
          {/* Background */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="7"
          />

          {/* Progress */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            filter={`url(#${filterId})`}
          />
        </g>

        {/* Percentage */}
        <text
          x="60"
          y="60"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#fff"
          style={{
            fontSize: 22,
            fontWeight: 800,
            fontFamily: "'Space Mono', monospace",
          }}
        >
          {pct}%
        </text>

        {/* Label */}
        <text
          x="60"
          y="78"
          textAnchor="middle"
          fill="rgba(255,255,255,0.3)"
          style={{
            fontSize: 9,
            fontFamily: "'Syne', sans-serif",
            letterSpacing: "0.14em",
          }}
        >
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  );
}