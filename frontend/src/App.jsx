import { useState } from "react"
import { DEFAULTS } from "./constants/fields"
import { predictPlanet } from "./api/client"
import StarField from "./components/StarField"
import Planets from "./components/Planets"
import PresetBar from "./components/PresetBar"
import InputPanel from "./components/InputPanel"
import ResultPanel from "./components/ResultPanel"

export default function App() {
  const [values,  setValues]  = useState(DEFAULTS)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  function handleChange(key, val) {
    setValues((prev) => ({ ...prev, [key]: val }))
  }

  function handlePreset(preset) {
    setValues(preset)
    setResult(null)
    setError(null)
  }

  async function handleAnalyze() {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await predictPlanet(values)
      setResult(data)
    } catch (e) {
      setError(
        e.response?.data?.detail ??
        "Cannot reach API — ensure FastAPI is running (or VITE_API_URL is set)."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#02030a]">
      {/* Ambient background layers */}
      <StarField />
      <Planets />

      {/* Content */}
      <div className="relative z-10 max-w-[1120px] mx-auto px-6 py-8">

        {/* ── Header ── */}
        <header className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/24 rounded-full px-5 py-1.5 mb-4">
            <div
              className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse2"
              style={{ boxShadow: "0 0 8px #818cf8" }}
            />
            <span className="text-[10px] text-indigo-300 font-mono tracking-[0.16em]">
              NASA · KEPLER MISSION · ML ANALYSIS
            </span>
          </div>

          <h1 className="text-white font-display font-extrabold text-[clamp(30px,4.5vw,50px)] leading-tight mb-1">
            Exoplanet Analyzer
          </h1>
          <p className="text-[12px] text-blue-950 font-mono tracking-wide">
            Stage I · Detection (KOI) → Stage II · Habitability (PHL-EC)
          </p>
        </header>

        {/* ── Presets ── */}
        <PresetBar onSelect={handlePreset} />

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.12fr] gap-4 items-start">
          <InputPanel
            values={values}
            onChange={handleChange}
            onAnalyze={handleAnalyze}
            loading={loading}
          />
          <ResultPanel result={result} loading={loading} error={error} />
        </div>

        {/* ── Footer ── */}
        <footer className="text-center mt-7 pt-5 border-t border-white/[0.04] text-[10px] text-slate-200 font-mono tracking-wide">
          DETECTION · XGBOOST · KOI &nbsp;·&nbsp; HABITABILITY · LOGISTIC REGRESSION · PHL-EC &nbsp;·&nbsp; FASTAPI + REACT
        </footer>
      </div>
    </div>
  )
}
