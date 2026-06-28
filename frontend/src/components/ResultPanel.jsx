import Gauge from "./Gauge"

function EmptyState() {
  return (
    <div className="
      rounded-[20px] px-8 py-16 text-center
      bg-[rgba(4,6,18,0.84)] backdrop-blur-[22px]
      border border-white/[0.07]
      shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
    ">
      <svg width="80" height="80" className="mx-auto mb-4 opacity-20" style={{ display: "block" }}>
        <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="1" strokeDasharray="5 4" />
        <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1" />
        <g style={{ transformOrigin: "40px 40px", animation: "spin 8s linear infinite" }}>
          <circle cx="40" cy="10" r="4.5" fill="rgba(129,140,248,0.9)" />
        </g>
        <circle cx="40" cy="40" r="8" fill="rgba(250,204,21,0.25)" stroke="rgba(250,204,21,0.3)" strokeWidth="1.5" />
      </svg>
      <div className="text-[13px] text-slate-700">Select a preset or tune the sliders</div>
      <div className="text-[10px] text-slate-800 mt-1.5 font-mono">THEN CLICK ANALYZE PLANET</div>
    </div>
  )
}

function LoadingState() {
  return (
    <div className="
      rounded-[20px] px-8 py-12 text-center
      bg-[rgba(4,6,18,0.84)] backdrop-blur-[22px]
      border border-white/[0.07]
      shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
    ">
      <svg width="64" height="64" className="mx-auto mb-3.5" style={{ overflow: "visible", display: "block" }}>
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="3" />
        <circle cx="32" cy="32" r="26" fill="none" stroke="#6366f1" strokeWidth="3"
          strokeDasharray="38 126" strokeLinecap="round"
          style={{ transformOrigin: "32px 32px", animation: "spin 1.1s linear infinite" }}
        />
        <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="2"
          strokeDasharray="20 80" strokeLinecap="round"
          style={{ transformOrigin: "32px 32px", animation: "spinCCW 0.75s linear infinite" }}
        />
        <circle cx="32" cy="32" r="5" fill="rgba(99,102,241,0.5)" />
      </svg>
      <div className="text-indigo-400 text-[11px] font-mono tracking-widest">RUNNING ML PIPELINE…</div>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="
      animate-fadeUp rounded-[20px] px-4 py-3.5
      bg-red-400/[0.06] border border-red-400/[0.18]
      text-red-300 text-[11px] font-mono
    ">
      ⚠ {message}
    </div>
  )
}

function ResultCard({ result }) {
  const detPct = Math.round(result.detection_probability * 100)
  const habPct = result.habitability_score != null ? Math.round(result.habitability_score * 100) : null

  const verdictColor =
    !result.is_planet      ? "#f87171" :
    habPct > 70            ? "#34d399" :
    habPct > 40            ? "#fbbf24" : "#f87171"

  const detColor  = detPct > 60 ? "#34d399" : detPct > 40 ? "#fbbf24" : "#f87171"
  const habColor  = habPct != null ? (habPct > 70 ? "#34d399" : habPct > 40 ? "#fbbf24" : "#f87171") : "#475569"

  return (
    <div className="
      animate-fadeUp rounded-[20px] p-6
      bg-[rgba(4,6,18,0.84)] backdrop-blur-[22px]
      border border-white/[0.07]
      shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
    ">
      {/* Gauges */}
      <div className="grid grid-cols-2 gap-2.5 mb-4">
        {[
          { pct: detPct,    label: "Detection",    color: detColor },
          { pct: habPct ?? 0, label: "Habitability", color: habColor },
        ].map((g) => (
          <div key={g.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl py-2.5 px-1.5">
            <Gauge {...g} />
          </div>
        ))}
      </div>

      {/* Pipeline stage badges */}
      <div className="flex gap-1.5 mb-3.5 items-center flex-wrap">
        <span className="text-[10px] px-3 py-1 rounded-full font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
          I · DETECTION
        </span>
        <span className="text-slate-700">→</span>
        {result.is_planet
          ? <span className="text-[10px] px-3 py-1 rounded-full font-mono bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">II · HABITABILITY</span>
          : <span className="text-[10px] px-3 py-1 rounded-full font-mono bg-red-400/[0.07] text-red-300 border border-red-400/[0.15]">II · SKIPPED</span>
        }
      </div>

      {/* Verdict */}
      <div
        className="px-4 py-3 rounded-xl mb-3.5 text-[14px] font-bold"
        style={{
          background: `${verdictColor}0c`,
          border: `1px solid ${verdictColor}28`,
          color: verdictColor,
          textShadow: `0 0 22px ${verdictColor}55`,
        }}
      >
        {result.verdict}
      </div>

      {/* Model info */}
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: "DETECTION MODEL",    val: result.detection_source    ?? "XGBoost" },
          { label: "HABITABILITY MODEL", val: result.habitability_source ?? (result.is_planet ? "Random Forest" : "—") },
        ].map((item) => (
          <div key={item.label} className="bg-black/30 border border-white/[0.04] rounded-xl px-3 py-2.5">
            <div className="text-[9px] text-slate-700 mb-1 font-mono tracking-wide">{item.label}</div>
            <div className="text-[11px] text-slate-500 font-mono">{item.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function HZCard({ checks }) {
  return (
    <div className="
      animate-fadeUp rounded-[20px] p-5
      bg-[rgba(4,6,18,0.84)] backdrop-blur-[22px]
      border border-white/[0.07]
      shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
    ">
      <div className="text-[10px] text-slate-700 mb-3.5 font-mono tracking-widest">
        HABITABILITY ZONE · PHYSICAL CHECKS
      </div>

      {Object.values(checks).map((c, i) => (
        <div
          key={i}
          className="flex justify-between items-center py-2.5 border-b border-white/[0.03] last:border-0"
        >
          <div>
            <div className="text-[11px] text-slate-500 font-display">{c.label}</div>
            <div className="text-[9px] text-slate-700 mt-0.5 font-mono">
              {c.range} {c.unit}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-600 font-mono tabular-nums">
              {typeof c.value === "number" ? c.value.toFixed(2) : c.value}
            </span>
            <span
              className="text-[9px] px-2.5 py-0.5 rounded-full font-bold font-mono tracking-wide"
              style={
                c.pass
                  ? { background: "rgba(52,211,153,0.10)", border: "1px solid rgba(52,211,153,0.25)", color: "#34d399", boxShadow: "0 0 10px rgba(52,211,153,0.18)" }
                  : { background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.2)",  color: "#f87171" }
              }
            >
              {c.pass ? "PASS" : "FAIL"}
            </span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function ResultPanel({ result, loading, error }) {
  return (
    <div className="flex flex-col gap-3.5">
      {error   && <ErrorBanner message={error} />}
      {loading && <LoadingState />}
      {!result && !loading && !error && <EmptyState />}
      {result  && <ResultCard result={result} />}
      {result?.hz_checks && <HZCard checks={result.hz_checks} />}
    </div>
  )
}
