import { useState } from "react"
import { SECTIONS, FIELDS } from "../constants/fields"
import SliderField from "./SliderField"
import FlagToggles from "./FlagToggles"

const TAB_HINT = {
  flags:   "FALSE-POSITIVE FLAGS · each flag set to 1 strongly reduces detection probability",
  transit: "TRANSIT SIGNAL · detection model only",
  planet:  "PLANETARY BODY · used by both detection + habitability models",
  star:    "HOST STAR · used by both detection + habitability models",
  signal:  "SIGNAL QUALITY · SNR + planet count · detection model only",
  sky:     "SKY POSITION & DISTANCE · ra/dec → detection · s_distance → habitability",
}

export default function InputPanel({ values, onChange, onAnalyze, loading }) {
  const [activeTab, setActiveTab] = useState("flags")
  const section   = SECTIONS.find((s) => s.id === activeTab)
  const tabFields = FIELDS.filter((f) => f.section === activeTab)

  const flagCount = ["koi_fpflag_nt","koi_fpflag_ss","koi_fpflag_co","koi_fpflag_ec"]
    .filter(k => values[k] === 1).length

  return (
    <div className="
      rounded-[20px] overflow-hidden
      bg-[rgba(4,6,18,0.84)] backdrop-blur-[22px]
      border border-white/[0.07]
      shadow-[0_24px_64px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)]
    ">
      {/* ── Tabs (2 rows of 3) ── */}
      <div className="grid grid-cols-3 border-b border-white/[0.06] bg-black/25">
        {SECTIONS.map((s) => {
          const isActive   = s.id === activeTab
          const isFlagsTab = s.id === "flags"
          return (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className="relative py-3 text-[10px] font-bold font-display tracking-widest transition-all duration-200 border-b-2 border-t-0 border-x-0 cursor-pointer"
              style={{
                background:  isActive ? `${s.accent}12` : "transparent",
                color:       isActive ? s.accent : "#64748b",
                borderColor: isActive ? s.accent : "transparent",
              }}
            >
              {s.label.toUpperCase()}
              {isFlagsTab && flagCount > 0 && (
                <span className="absolute top-1.5 right-2 w-4 h-4 rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center">
                  {flagCount}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* ── Body ── */}
      <div className="p-5 max-h-[70vh] overflow-y-auto">
        {/* Section hint */}
        <div className="flex items-start gap-1.5 text-[9px] text-slate-400 font-mono tracking-wide mb-4 leading-relaxed">
          <div
            className="w-1.5 h-1.5 rounded-full shrink-0 mt-0.5"
            style={{ background: section.accent, boxShadow: `0 0 8px ${section.accent}` }}
          />
          {TAB_HINT[activeTab]}
        </div>

        {/* Flags tab → toggles, all other tabs → sliders */}
        {activeTab === "flags"
          ? <FlagToggles values={values} onChange={onChange} />
          : tabFields.map((field) => (
              <SliderField
                key={field.key}
                field={field}
                value={values[field.key]}
                sliderClass={section.sliderClass}
                onChange={onChange}
              />
            ))
        }

        {/* Analyze button */}
        <button
          onClick={onAnalyze}
          disabled={loading}
          className="
            w-full py-3 mt-2 rounded-xl text-[13px] font-bold font-display tracking-widest
            transition-all duration-200 border
            disabled:cursor-not-allowed disabled:bg-white/[0.03] disabled:border-white/[0.05] disabled:text-slate-700
            enabled:text-white enabled:border-indigo-400/35
            enabled:shadow-[0_8px_32px_rgba(79,70,229,0.38)]
            enabled:hover:shadow-[0_0_40px_rgba(79,70,229,0.55),inset_0_0_20px_rgba(99,102,241,0.08)]
            enabled:hover:-translate-y-px enabled:active:scale-[0.98]
          "
          style={loading ? {} : { background: "linear-gradient(135deg,#3730a3,#4f46e5 50%,#7c3aed)" }}
        >
          {loading
            ? <span className="font-mono text-[11px]">ANALYZING…</span>
            : "⬡  ANALYZE PLANET"}
        </button>

        {/* Tip */}
        <div className="mt-2.5 px-3 py-2 rounded-lg text-[9px] font-mono leading-relaxed
          bg-emerald-500/[0.04] border border-emerald-500/10 text-slate-500">
          Tip: Keep all flags OFF for a clean signal. SNR &gt; 10 strongly helps detection.
        </div>
      </div>
    </div>
  )
}
