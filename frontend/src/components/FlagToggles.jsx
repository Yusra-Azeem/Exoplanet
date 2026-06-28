const FLAG_META = {
  koi_fpflag_nt: {
    label: "Not Transit-Like",
    short: "NT",
    hint:  "Signal shape doesn't match a planetary transit",
    icon:  "⚡",
  },
  koi_fpflag_ss: {
    label: "Stellar Eclipse",
    short: "SS",
    hint:  "Secondary eclipse detected — likely an eclipsing binary",
    icon:  "🌑",
  },
  koi_fpflag_co: {
    label: "Centroid Offset",
    short: "CO",
    hint:  "Transit signal originates off-target — background star",
    icon:  "🎯",
  },
  koi_fpflag_ec: {
    label: "Ephemeris Contamination",
    short: "EC",
    hint:  "Signal contaminated by a nearby eclipsing binary",
    icon:  "☄️",
  },
}

const FLAG_KEYS = ["koi_fpflag_nt", "koi_fpflag_ss", "koi_fpflag_co", "koi_fpflag_ec"]

export default function FlagToggles({ values, onChange }) {
  const activeCount = FLAG_KEYS.filter((k) => values[k] === 1).length

  return (
    <div className="space-y-3 mb-4">
      {/* Summary bar */}
      <div className={`
        flex items-center justify-between px-3 py-2 rounded-lg text-[10px] font-mono
        ${activeCount === 0
          ? "bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-400"
          : "bg-red-500/[0.08] border border-red-500/20 text-red-400"}
      `}>
        <span>
          {activeCount === 0
            ? "✓ No false-positive flags — clean signal"
            : `⚠ ${activeCount} flag${activeCount > 1 ? "s" : ""} active — detection probability will drop`}
        </span>
        {activeCount > 0 && (
          <button
            onClick={() => FLAG_KEYS.forEach((k) => onChange(k, 0))}
            className="text-[9px] px-2 py-0.5 rounded border border-red-400/30 hover:bg-red-400/10 transition-colors cursor-pointer"
          >
            CLEAR ALL
          </button>
        )}
      </div>

      {/* Toggle cards */}
      {FLAG_KEYS.map((key) => {
        const meta    = FLAG_META[key]
        const flagged = values[key] === 1

        return (
          <button
            key={key}
            onClick={() => onChange(key, flagged ? 0 : 1)}
            className={`
              w-full text-left px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer
              ${flagged
                ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/15"
                : "bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.12]"}
            `}
          >
            <div className="flex items-center justify-between">
              {/* Left: icon + label */}
              <div className="flex items-center gap-3">
                <span className="text-lg leading-none">{meta.icon}</span>
                <div>
                  <div className={`text-[12px] font-semibold font-display ${flagged ? "text-red-300" : "text-slate-300"}`}>
                    {meta.label}
                    <span className={`ml-2 text-[9px] font-mono px-1.5 py-0.5 rounded ${flagged ? "bg-red-500/20 text-red-400" : "bg-white/[0.06] text-slate-600"}`}>
                      {meta.short}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-600 mt-0.5 font-mono">{meta.hint}</div>
                </div>
              </div>

              {/* Right: toggle pill */}
              <div className={`
                relative w-10 h-5 rounded-full transition-all duration-300 shrink-0
                ${flagged ? "bg-red-500/70" : "bg-white/10"}
              `}>
                <div className={`
                  absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300
                  ${flagged
                    ? "left-[22px] bg-red-200 shadow-[0_0_8px_rgba(248,113,113,0.8)]"
                    : "left-0.5 bg-slate-500"}
                `}/>
              </div>
            </div>

            {/* Flagged warning */}
            {flagged && (
              <div className="mt-2 text-[9px] font-mono text-red-400/70 flex items-center gap-1">
                <span>●</span> Flagged as false positive — value = 1
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
