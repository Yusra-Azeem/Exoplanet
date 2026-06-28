import { PRESETS } from "../constants/fields"

const PRESET_COLORS = {
  "Earth Twin":    "hover:bg-emerald-500/15 hover:border-emerald-400/45 hover:text-emerald-300 hover:shadow-[0_0_18px_rgba(52,211,153,0.22)]",
  "Kepler-442b":  "hover:bg-indigo-500/15 hover:border-indigo-400/45 hover:text-indigo-300 hover:shadow-[0_0_18px_rgba(99,102,241,0.22)]",
  "Super Earth":  "hover:bg-sky-500/15 hover:border-sky-400/45 hover:text-sky-300 hover:shadow-[0_0_18px_rgba(56,189,248,0.22)]",
  "Hot Jupiter":  "hover:bg-amber-500/15 hover:border-amber-400/45 hover:text-amber-300 hover:shadow-[0_0_18px_rgba(251,191,36,0.22)]",
  "False Positive":"hover:bg-red-500/15 hover:border-red-400/45 hover:text-red-300 hover:shadow-[0_0_18px_rgba(248,113,113,0.22)]",
}

export default function PresetBar({ onSelect }) {
  return (
    <div className="flex gap-2 justify-center flex-wrap mb-8">
      {Object.entries(PRESETS).map(([name, preset]) => (
        <button
          key={name}
          onClick={() => onSelect(preset)}
          className={`
            px-4 py-1.5 text-xs font-semibold font-display rounded-full cursor-pointer
            bg-white/[0.03] border border-white/[0.09] text-slate-500
            transition-all duration-200
            ${PRESET_COLORS[name] ?? "hover:bg-indigo-500/15 hover:border-indigo-400/45 hover:text-indigo-300"}
          `}
        >
          {name}
        </button>
      ))}
    </div>
  )
}
