export default function SliderField({ field, value, sliderClass, onChange }) {
  const dec    = field.step < 0.1 ? 2 : field.step < 1 ? 1 : 0
  const pct    = ((value - field.min) / (field.max - field.min)) * 100
  const inRange = field.habitRange
    ? value >= field.habitRange[0] && value <= field.habitRange[1]
    : null

  const valueColor =
    inRange === null  ? "text-slate-300" :
    inRange           ? "text-emerald-400" : "text-red-400"

  const valueGlow =
    inRange === true ? { textShadow: "0 0 12px rgba(52,211,153,0.5)" } : {}

  return (
    <div className="mb-4">
      {/* Label row */}
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-[11px] font-semibold text-slate-500 font-display">
          {field.label}
          <span className="text-slate-700 ml-1.5 font-mono text-[9px]">{field.unit}</span>
        </span>
        <span
          className={`text-[12px] font-bold font-mono tabular-nums ${valueColor}`}
          style={valueGlow}
        >
          {Number(value).toFixed(dec)}
        </span>
      </div>

      {/* Slider */}
      <input
        type="range"
        className={sliderClass}
        min={field.min}
        max={field.max}
        step={field.step}
        value={value}
        style={{ "--p": `${pct}%` }}
        onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
      />

      {/* Hint */}
      <div className="text-[9.5px] text-slate-700 mt-1 font-mono">{field.hint}</div>
    </div>
  )
}
