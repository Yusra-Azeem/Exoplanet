// frontend/src/App.jsx
// Space-theme Exoplanet Analyzer
// npm install axios   →   npm run dev

import { useState, useEffect, useRef } from "react"
import axios from "axios"

const API = "http://localhost:8000"

// ── Exact values that guarantee BOTH models fire ─────────────────────────────
const PRESETS = {
  "Earth Twin": {
    koi_period:365, koi_impact:0.3, koi_duration:13.0, koi_depth:84,
    koi_prad:1.0, koi_teq:255, koi_insol:1.0,
    koi_steff:5778, koi_slogg:4.44, koi_srad:1.0
  },
  "Kepler-442b": {
    koi_period:112, koi_impact:0.25, koi_duration:5.1, koi_depth:610,
    koi_prad:1.34, koi_teq:233, koi_insol:0.70,
    koi_steff:4402, koi_slogg:4.60, koi_srad:0.60
  },
  "Super Earth": {
    koi_period:280, koi_impact:0.2, koi_duration:8.0, koi_depth:300,
    koi_prad:1.5, koi_teq:270, koi_insol:0.85,
    koi_steff:5200, koi_slogg:4.50, koi_srad:0.90
  },
  "Hot Jupiter": {
    koi_period:3, koi_impact:0.1, koi_duration:2.5, koi_depth:15000,
    koi_prad:11.2, koi_teq:1600, koi_insol:450,
    koi_steff:6100, koi_slogg:4.2, koi_srad:1.3
  },
}

const FIELDS = [
  { key:"koi_period",   label:"Orbital period",         unit:"days",       min:0.5,  max:1000, step:1,    default:365,  hint:"Earth = 365 d",         section:"transit" },
  { key:"koi_impact",   label:"Impact parameter",       unit:"0–1",        min:0.0,  max:1.2,  step:0.01, default:0.3,  hint:"0 = central transit",   section:"transit" },
  { key:"koi_duration", label:"Transit duration",       unit:"hours",      min:0.1,  max:20,   step:0.1,  default:3.0,  hint:"Length of brightness dip",section:"transit" },
  { key:"koi_depth",    label:"Transit depth",          unit:"ppm",        min:1,    max:50000,step:1,    default:84,   hint:"Starlight blocked",      section:"transit" },
  { key:"koi_prad",     label:"Planet radius",          unit:"R⊕",         min:0.3,  max:20,   step:0.1,  default:1.0,  hint:"Habitable: 0.5 – 1.6",  section:"planet"  },
  { key:"koi_teq",      label:"Equilibrium temp",       unit:"K",          min:50,   max:2500, step:5,    default:255,  hint:"Habitable: 200 – 320 K", section:"planet"  },
  { key:"koi_insol",    label:"Insolation flux",        unit:"S⊕",         min:0.01, max:100,  step:0.01, default:1.0,  hint:"Habitable: 0.3 – 1.5",  section:"planet"  },
  { key:"koi_steff",    label:"Stellar temperature",    unit:"K",          min:2500, max:8000, step:50,   default:5778, hint:"Sun = 5778 K",           section:"star"    },
  { key:"koi_slogg",    label:"Stellar surface gravity",unit:"log g",      min:3.0,  max:5.5,  step:0.05, default:4.44, hint:"Sun = 4.44",             section:"star"    },
  { key:"koi_srad",     label:"Stellar radius",         unit:"R☉",         min:0.1,  max:5.0,  step:0.05, default:1.0,  hint:"Sun = 1.0",              section:"star"    },
]

const INIT = Object.fromEntries(FIELDS.map(f => [f.key, f.default]))

// ── Starfield canvas component ────────────────────────────────────────────────
function Starfield() {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    canvas.width  = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    const stars = Array.from({length:160}, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.4 + 0.2,
      a: Math.random(),
      speed: Math.random() * 0.004 + 0.001,
    }))
    let raf
    function draw() {
      ctx.clearRect(0,0,canvas.width,canvas.height)
      stars.forEach(s => {
        s.a += s.speed
        const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.a))
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
        ctx.fillStyle = `rgba(180,200,255,${alpha})`
        ctx.fill()
      })
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => cancelAnimationFrame(raf)
  }, [])
  return (
    <canvas ref={ref} style={{
      position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none"
    }}/>
  )
}

// ── Circular gauge ─────────────────────────────────────────────────────────────
function Gauge({ pct, label, color, size=110 }) {
  const r = 40, cx = size/2, cy = size/2
  const circ = 2 * Math.PI * r
  const dash  = (pct / 100) * circ
  return (
    <div style={{ textAlign:"center" }}>
      <svg width={size} height={size} style={{ display:"block", margin:"0 auto" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ/4}
          strokeLinecap="round"
          style={{transition:"stroke-dasharray 0.8s ease"}}/>
        <text x={cx} y={cy-4} textAnchor="middle" fill="#fff"
          fontSize="18" fontWeight="700" fontFamily="system-ui">
          {pct}%
        </text>
        <text x={cx} y={cy+14} textAnchor="middle" fill="rgba(255,255,255,0.5)"
          fontSize="10" fontFamily="system-ui">
          {label}
        </text>
      </svg>
    </div>
  )
}

// ── Main App ───────────────────────────────────────────────────────────────────
export default function App() {
  const [vals,    setVals]    = useState(INIT)
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)
  const [active,  setActive]  = useState("transit")

  function set(key, v) { setVals(p => ({...p, [key]: parseFloat(v)})) }

  async function analyze() {
    setLoading(true); setError(null); setResult(null)
    try {
      const { data } = await axios.post(`${API}/predict`, vals)
      setResult(data)
    } catch(e) {
      setError(e.response?.data?.detail || "Cannot reach API. Start FastAPI on port 8000.")
    } finally { setLoading(false) }
  }

  const detPct = result ? Math.round(result.detection_probability * 100) : 0
  const habPct = result?.habitability_score != null ? Math.round(result.habitability_score * 100) : null

  const verdictColor =
    !result ? "#94a3b8" :
    !result.is_planet ? "#f87171" :
    habPct > 70 ? "#34d399" :
    habPct > 40 ? "#fbbf24" : "#f87171"

  const detColor  = detPct > 60 ? "#34d399" : detPct > 40 ? "#fbbf24" : "#f87171"
  const habColor  = habPct > 70 ? "#34d399" : habPct > 40 ? "#fbbf24" : "#f87171"

  const sections = [
    { id:"transit", label:"Transit" },
    { id:"planet",  label:"Planet"  },
    { id:"star",    label:"Star"    },
  ]

  return (
    <div style={{
      minHeight:"100vh", background:"#080c14",
      color:"#e2e8f0", fontFamily:"system-ui,-apple-system,sans-serif",
      position:"relative", overflow:"hidden"
    }}>
      {/* Animated starfield */}
      <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
        <Starfield/>
        {/* Nebula glow blobs */}
        <div style={{position:"absolute",top:"10%",left:"60%",width:400,height:300,
          background:"radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 70%)",
          borderRadius:"50%",transform:"rotate(-20deg)"}}/>
        <div style={{position:"absolute",bottom:"20%",right:"10%",width:300,height:200,
          background:"radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)",
          borderRadius:"50%"}}/>
        <div style={{position:"absolute",top:"40%",left:"5%",width:250,height:250,
          background:"radial-gradient(ellipse,rgba(139,92,246,0.05) 0%,transparent 70%)",
          borderRadius:"50%"}}/>
      </div>

      <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"2rem 1.5rem"}}>

        {/* ── Header ── */}
        <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:10,
            background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",
            borderRadius:24,padding:"6px 16px",marginBottom:16}}>
            <div style={{width:8,height:8,borderRadius:"50%",background:"#818cf8"}}/>
            <span style={{fontSize:12,color:"#a5b4fc",letterSpacing:"0.08em"}}>
              NASA KEPLER MISSION · ML ANALYSIS
            </span>
          </div>
          <h1 style={{fontSize:36,fontWeight:700,margin:"0 0 8px",
            background:"linear-gradient(135deg,#e0e7ff,#818cf8)",
            WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
            Exoplanet Analyzer
          </h1>
          <p style={{fontSize:14,color:"#64748b",margin:0}}>
            Two-stage ML pipeline — Detection (XGBoost · KOI) → Habitability (Random Forest · PHL-EC)
          </p>
        </div>

        {/* ── Preset buttons ── */}
        <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:"2rem"}}>
          {Object.entries(PRESETS).map(([name, preset]) => (
            <button key={name} onClick={() => { setVals(preset); setResult(null) }}
              style={{
                padding:"7px 16px", fontSize:12, cursor:"pointer",
                background:"rgba(255,255,255,0.04)",
                border:"1px solid rgba(255,255,255,0.12)",
                borderRadius:20, color:"#94a3b8",
                transition:"all 0.15s"
              }}
              onMouseEnter={e => {
                e.target.style.background="rgba(99,102,241,0.15)"
                e.target.style.borderColor="rgba(129,140,248,0.5)"
                e.target.style.color="#a5b4fc"
              }}
              onMouseLeave={e => {
                e.target.style.background="rgba(255,255,255,0.04)"
                e.target.style.borderColor="rgba(255,255,255,0.12)"
                e.target.style.color="#94a3b8"
              }}>
              {name}
            </button>
          ))}
          <div style={{
            padding:"7px 14px",fontSize:11,
            background:"rgba(52,211,153,0.08)",
            border:"1px solid rgba(52,211,153,0.2)",
            borderRadius:20,color:"#6ee7b7"
          }}>
            Earth Twin + Kepler-442b trigger habitability
          </div>
        </div>

        {/* ── Main grid ── */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:20,alignItems:"start"}}>

          {/* LEFT: Input form */}
          <div style={{
            background:"rgba(255,255,255,0.03)",
            border:"1px solid rgba(255,255,255,0.08)",
            borderRadius:16,overflow:"hidden"
          }}>
            {/* Tab bar */}
            <div style={{
              display:"flex",borderBottom:"1px solid rgba(255,255,255,0.08)",
              background:"rgba(0,0,0,0.2)"
            }}>
              {sections.map(s => (
                <button key={s.id} onClick={() => setActive(s.id)}
                  style={{
                    flex:1, padding:"12px 0", fontSize:13, cursor:"pointer",
                    border:"none",
                    background: active===s.id ? "rgba(99,102,241,0.15)" : "transparent",
                    color: active===s.id ? "#a5b4fc" : "#475569",
                    borderBottom: active===s.id ? "2px solid #818cf8" : "2px solid transparent",
                    transition:"all 0.15s"
                  }}>
                  {s.label}
                </button>
              ))}
            </div>

            <div style={{padding:"1.25rem"}}>
              {/* Section description */}
              <div style={{
                fontSize:11,color:"#475569",marginBottom:14,
                display:"flex",alignItems:"center",gap:6
              }}>
                <div style={{width:6,height:6,borderRadius:"50%",
                  background: active==="transit"?"#818cf8":active==="planet"?"#34d399":"#fbbf24"}}/>
                {active==="transit" && "Transit signal parameters — used by Detection model only"}
                {active==="planet"  && "Physical planet parameters — used by BOTH models"}
                {active==="star"    && "Host star parameters — used by BOTH models"}
              </div>

              {/* Fields for active tab */}
              {FIELDS.filter(f => f.section===active).map(f => {
                const dec = f.step < 1 ? (f.step < 0.1 ? 2 : 1) : 0
                const v   = vals[f.key]
                return (
                  <div key={f.key} style={{marginBottom:14}}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                      <span style={{fontSize:12,color:"#94a3b8"}}>
                        {f.label}
                        <span style={{color:"#475569",marginLeft:4}}>({f.unit})</span>
                      </span>
                      <span style={{
                        fontSize:12,fontWeight:700,
                        color: f.key==="koi_prad" ? (v>=0.5&&v<=1.6?"#34d399":v<=2.5?"#fbbf24":"#f87171") :
                               f.key==="koi_teq"  ? (v>=200&&v<=320?"#34d399":v<=400?"#fbbf24":"#f87171") :
                               f.key==="koi_insol"? (v>=0.3&&v<=1.5?"#34d399":v<=3?"#fbbf24":"#f87171") :
                               "#e2e8f0"
                      }}>
                        {Number(v).toFixed(dec)}
                      </span>
                    </div>
                    <input type="range"
                      min={f.min} max={f.max} step={f.step} value={v}
                      onChange={e => set(f.key, e.target.value)}
                      style={{
                        width:"100%",height:4,
                        accentColor: f.section==="transit"?"#818cf8":
                                     f.section==="planet"?"#34d399":"#fbbf24",
                        cursor:"pointer"
                      }}/>
                    <div style={{fontSize:10,color:"#334155",marginTop:3}}>{f.hint}</div>
                  </div>
                )
              })}

              {/* Analyze button */}
              <button onClick={analyze} disabled={loading}
                style={{
                  width:"100%",marginTop:8,padding:"12px 0",
                  fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",
                  background: loading
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg,#4f46e5,#7c3aed)",
                  color: loading ? "#475569" : "#fff",
                  border:"none",borderRadius:10,
                  letterSpacing:"0.03em",
                  transition:"opacity 0.2s",
                  opacity: loading ? 0.6 : 1
                }}>
                {loading ? "Analyzing…" : "Analyze Planet"}
              </button>

              {/* Values tip */}
              <div style={{
                marginTop:12,padding:"10px 12px",
                background:"rgba(52,211,153,0.05)",
                border:"1px solid rgba(52,211,153,0.15)",
                borderRadius:8,fontSize:11,color:"#6ee7b7",lineHeight:1.5
              }}>
                For habitability to compute: prad 0.5–3, teq 150–400, insol 0.1–5, impact below 0.9
              </div>
            </div>
          </div>

          {/* RIGHT: Results */}
          <div style={{display:"flex",flexDirection:"column",gap:14}}>

            {/* Error */}
            {error && (
              <div style={{
                background:"rgba(248,113,113,0.08)",
                border:"1px solid rgba(248,113,113,0.2)",
                borderRadius:12,padding:"12px 16px",
                color:"#fca5a5",fontSize:13
              }}>
                {error}
              </div>
            )}

            {/* Placeholder */}
            {!result && !error && !loading && (
              <div style={{
                background:"rgba(255,255,255,0.02)",
                border:"1px solid rgba(255,255,255,0.06)",
                borderRadius:16,padding:"3rem 2rem",
                textAlign:"center",color:"#334155"
              }}>
                <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>
                  ◎
                </div>
                <div style={{fontSize:14}}>
                  Select a preset or tune the sliders, then click Analyze
                </div>
              </div>
            )}

            {/* Loading */}
            {loading && (
              <div style={{
                background:"rgba(99,102,241,0.06)",
                border:"1px solid rgba(99,102,241,0.2)",
                borderRadius:16,padding:"2rem",
                textAlign:"center",color:"#818cf8",fontSize:14
              }}>
                Running ML pipeline…
              </div>
            )}

            {/* Result card */}
            {result && (
              <div style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:16,padding:"1.25rem"
              }}>

                {/* Gauges */}
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
                  <Gauge pct={detPct}  label="Detection"   color={detColor} />
                  <Gauge pct={habPct ?? 0} label="Habitability" color={habColor} />
                </div>

                {/* Stage pills */}
                <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
                  <span style={{
                    fontSize:11,padding:"3px 10px",borderRadius:20,
                    background:"rgba(99,102,241,0.12)",color:"#a5b4fc"
                  }}>
                    Stage 1: Detection · Person A
                  </span>
                  {result.is_planet && (
                    <span style={{
                      fontSize:11,padding:"3px 10px",borderRadius:20,
                      background:"rgba(52,211,153,0.12)",color:"#6ee7b7"
                    }}>
                      Stage 2: Habitability · Person B
                    </span>
                  )}
                  {!result.is_planet && (
                    <span style={{
                      fontSize:11,padding:"3px 10px",borderRadius:20,
                      background:"rgba(248,113,113,0.1)",color:"#fca5a5"
                    }}>
                      Stage 2: Skipped — not a planet
                    </span>
                  )}
                </div>

                {/* Verdict */}
                <div style={{
                  padding:"12px 16px",borderRadius:10,marginBottom:12,
                  background: !result.is_planet ? "rgba(248,113,113,0.08)" :
                    habPct > 70 ? "rgba(52,211,153,0.08)" :
                    habPct > 40 ? "rgba(251,191,36,0.08)" :
                    "rgba(248,113,113,0.08)",
                  border:`1px solid ${verdictColor}30`,
                  fontSize:14,fontWeight:600,color:verdictColor
                }}>
                  {result.verdict}
                </div>

                {/* Model source */}
                <div style={{
                  display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:"#475569"
                }}>
                  <div style={{
                    background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"
                  }}>
                    <div style={{color:"#64748b",marginBottom:2}}>Detection model</div>
                    <div style={{color:"#94a3b8"}}>{result.detection_source || "XGBoost"}</div>
                  </div>
                  <div style={{
                    background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"
                  }}>
                    <div style={{color:"#64748b",marginBottom:2}}>Habitability model</div>
                    <div style={{color:"#94a3b8"}}>{result.habitability_source || (result.is_planet ? "Random Forest" : "—")}</div>
                  </div>
                </div>
              </div>
            )}

            {/* HZ checks */}
            {result?.hz_checks && (
              <div style={{
                background:"rgba(255,255,255,0.03)",
                border:"1px solid rgba(255,255,255,0.08)",
                borderRadius:16,padding:"1.25rem"
              }}>
                <div style={{fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:12}}>
                  Physical habitability checks
                </div>
                {Object.values(result.hz_checks).map((c, i) => (
                  <div key={i} style={{
                    display:"flex",justifyContent:"space-between",alignItems:"center",
                    padding:"7px 0",
                    borderBottom:"1px solid rgba(255,255,255,0.04)"
                  }}>
                    <div>
                      <span style={{fontSize:12,color:"#94a3b8"}}>{c.label}</span>
                      <span style={{fontSize:10,color:"#334155",marginLeft:8}}>
                        {c.range} {c.unit}
                      </span>
                    </div>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <span style={{fontSize:11,color:"#475569"}}>
                        {typeof c.value==="number" ? c.value.toFixed(2) : c.value}
                      </span>
                      <span style={{
                        fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600,
                        background: c.pass ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.1)",
                        color: c.pass ? "#34d399" : "#f87171"
                      }}>
                        {c.pass ? "Pass" : "Fail"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

       
        {/* ── Footer ── */}
        <div style={{
          textAlign:"center",marginTop:24,
          fontSize:11,color:"#1e293b"
        }}>
          Detection: XGBoost · KOI dataset · Person A &nbsp;|&nbsp;
          Habitability: Random Forest · PHL-EC · Person B &nbsp;|&nbsp;
          FastAPI + React
        </div>
      </div>
    </div>
  )
}