// // frontend/src/App.jsx
// // Space-theme Exoplanet Analyzer
// // npm install axios   →   npm run dev

// import { useState, useEffect, useRef } from "react"
// import axios from "axios"

// const API = "http://localhost:8000"

// // ── Exact values that guarantee BOTH models fire ─────────────────────────────
// const PRESETS = {
//   "Earth Twin": {
//     koi_period:365, koi_impact:0.3, koi_duration:13.0, koi_depth:84,
//     koi_prad:1.0, koi_teq:255, koi_insol:1.0,
//     koi_steff:5778, koi_slogg:4.44, koi_srad:1.0
//   },
//   "Kepler-442b": {
//     koi_period:112, koi_impact:0.25, koi_duration:5.1, koi_depth:610,
//     koi_prad:1.34, koi_teq:233, koi_insol:0.70,
//     koi_steff:4402, koi_slogg:4.60, koi_srad:0.60
//   },
//   "Super Earth": {
//     koi_period:280, koi_impact:0.2, koi_duration:8.0, koi_depth:300,
//     koi_prad:1.5, koi_teq:270, koi_insol:0.85,
//     koi_steff:5200, koi_slogg:4.50, koi_srad:0.90
//   },
//   "Hot Jupiter": {
//     koi_period:3, koi_impact:0.1, koi_duration:2.5, koi_depth:15000,
//     koi_prad:11.2, koi_teq:1600, koi_insol:450,
//     koi_steff:6100, koi_slogg:4.2, koi_srad:1.3
//   },
// }

// const FIELDS = [
//   { key:"koi_period",   label:"Orbital period",         unit:"days",       min:0.5,  max:1000, step:1,    default:365,  hint:"Earth = 365 d",         section:"transit" },
//   { key:"koi_impact",   label:"Impact parameter",       unit:"0–1",        min:0.0,  max:1.2,  step:0.01, default:0.3,  hint:"0 = central transit",   section:"transit" },
//   { key:"koi_duration", label:"Transit duration",       unit:"hours",      min:0.1,  max:20,   step:0.1,  default:3.0,  hint:"Length of brightness dip",section:"transit" },
//   { key:"koi_depth",    label:"Transit depth",          unit:"ppm",        min:1,    max:50000,step:1,    default:84,   hint:"Starlight blocked",      section:"transit" },
//   { key:"koi_prad",     label:"Planet radius",          unit:"R⊕",         min:0.3,  max:20,   step:0.1,  default:1.0,  hint:"Habitable: 0.5 – 1.6",  section:"planet"  },
//   { key:"koi_teq",      label:"Equilibrium temp",       unit:"K",          min:50,   max:2500, step:5,    default:255,  hint:"Habitable: 200 – 320 K", section:"planet"  },
//   { key:"koi_insol",    label:"Insolation flux",        unit:"S⊕",         min:0.01, max:100,  step:0.01, default:1.0,  hint:"Habitable: 0.3 – 1.5",  section:"planet"  },
//   { key:"koi_steff",    label:"Stellar temperature",    unit:"K",          min:2500, max:8000, step:50,   default:5778, hint:"Sun = 5778 K",           section:"star"    },
//   { key:"koi_slogg",    label:"Stellar surface gravity",unit:"log g",      min:3.0,  max:5.5,  step:0.05, default:4.44, hint:"Sun = 4.44",             section:"star"    },
//   { key:"koi_srad",     label:"Stellar radius",         unit:"R☉",         min:0.1,  max:5.0,  step:0.05, default:1.0,  hint:"Sun = 1.0",              section:"star"    },
// ]

// const INIT = Object.fromEntries(FIELDS.map(f => [f.key, f.default]))

// // ── Starfield canvas component ────────────────────────────────────────────────
// function Starfield() {
//   const ref = useRef(null)
//   useEffect(() => {
//     const canvas = ref.current
//     if (!canvas) return
//     const ctx = canvas.getContext("2d")
//     canvas.width  = canvas.offsetWidth
//     canvas.height = canvas.offsetHeight
//     const stars = Array.from({length:160}, () => ({
//       x: Math.random() * canvas.width,
//       y: Math.random() * canvas.height,
//       r: Math.random() * 1.4 + 0.2,
//       a: Math.random(),
//       speed: Math.random() * 0.004 + 0.001,
//     }))
//     let raf
//     function draw() {
//       ctx.clearRect(0,0,canvas.width,canvas.height)
//       stars.forEach(s => {
//         s.a += s.speed
//         const alpha = 0.3 + 0.5 * Math.abs(Math.sin(s.a))
//         ctx.beginPath()
//         ctx.arc(s.x, s.y, s.r, 0, Math.PI*2)
//         ctx.fillStyle = `rgba(180,200,255,${alpha})`
//         ctx.fill()
//       })
//       raf = requestAnimationFrame(draw)
//     }
//     draw()
//     return () => cancelAnimationFrame(raf)
//   }, [])
//   return (
//     <canvas ref={ref} style={{
//       position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none"
//     }}/>
//   )
// }

// // ── Circular gauge ─────────────────────────────────────────────────────────────
// function Gauge({ pct, label, color, size=110 }) {
//   const r = 40, cx = size/2, cy = size/2
//   const circ = 2 * Math.PI * r
//   const dash  = (pct / 100) * circ
//   return (
//     <div style={{ textAlign:"center" }}>
//       <svg width={size} height={size} style={{ display:"block", margin:"0 auto" }}>
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
//         <circle cx={cx} cy={cy} r={r} fill="none" stroke={color} strokeWidth="8"
//           strokeDasharray={`${dash} ${circ}`}
//           strokeDashoffset={circ/4}
//           strokeLinecap="round"
//           style={{transition:"stroke-dasharray 0.8s ease"}}/>
//         <text x={cx} y={cy-4} textAnchor="middle" fill="#fff"
//           fontSize="18" fontWeight="700" fontFamily="system-ui">
//           {pct}%
//         </text>
//         <text x={cx} y={cy+14} textAnchor="middle" fill="rgba(255,255,255,0.5)"
//           fontSize="10" fontFamily="system-ui">
//           {label}
//         </text>
//       </svg>
//     </div>
//   )
// }

// // ── Main App ───────────────────────────────────────────────────────────────────
// export default function App() {
//   const [vals,    setVals]    = useState(INIT)
//   const [result,  setResult]  = useState(null)
//   const [loading, setLoading] = useState(false)
//   const [error,   setError]   = useState(null)
//   const [active,  setActive]  = useState("transit")

//   function set(key, v) { setVals(p => ({...p, [key]: parseFloat(v)})) }

//   async function analyze() {
//     setLoading(true); setError(null); setResult(null)
//     try {
//       const { data } = await axios.post(`${API}/predict`, vals)
//       setResult(data)
//     } catch(e) {
//       setError(e.response?.data?.detail || "Cannot reach API. Start FastAPI on port 8000.")
//     } finally { setLoading(false) }
//   }

//   const detPct = result ? Math.round(result.detection_probability * 100) : 0
//   const habPct = result?.habitability_score != null ? Math.round(result.habitability_score * 100) : null

//   const verdictColor =
//     !result ? "#94a3b8" :
//     !result.is_planet ? "#f87171" :
//     habPct > 70 ? "#34d399" :
//     habPct > 40 ? "#fbbf24" : "#f87171"

//   const detColor  = detPct > 60 ? "#34d399" : detPct > 40 ? "#fbbf24" : "#f87171"
//   const habColor  = habPct > 70 ? "#34d399" : habPct > 40 ? "#fbbf24" : "#f87171"

//   const sections = [
//     { id:"transit", label:"Transit" },
//     { id:"planet",  label:"Planet"  },
//     { id:"star",    label:"Star"    },
//   ]

//   return (
//     <div style={{
//       minHeight:"100vh", background:"#080c14",
//       color:"#e2e8f0", fontFamily:"system-ui,-apple-system,sans-serif",
//       position:"relative", overflow:"hidden"
//     }}>
//       {/* Animated starfield */}
//       <div style={{position:"absolute",inset:0,pointerEvents:"none"}}>
//         <Starfield/>
//         {/* Nebula glow blobs */}
//         <div style={{position:"absolute",top:"10%",left:"60%",width:400,height:300,
//           background:"radial-gradient(ellipse,rgba(99,102,241,0.07) 0%,transparent 70%)",
//           borderRadius:"50%",transform:"rotate(-20deg)"}}/>
//         <div style={{position:"absolute",bottom:"20%",right:"10%",width:300,height:200,
//           background:"radial-gradient(ellipse,rgba(16,185,129,0.06) 0%,transparent 70%)",
//           borderRadius:"50%"}}/>
//         <div style={{position:"absolute",top:"40%",left:"5%",width:250,height:250,
//           background:"radial-gradient(ellipse,rgba(139,92,246,0.05) 0%,transparent 70%)",
//           borderRadius:"50%"}}/>
//       </div>

//       <div style={{position:"relative",zIndex:1,maxWidth:1100,margin:"0 auto",padding:"2rem 1.5rem"}}>

//         {/* ── Header ── */}
//         <div style={{textAlign:"center",marginBottom:"2.5rem"}}>
//           <div style={{display:"inline-flex",alignItems:"center",gap:10,
//             background:"rgba(99,102,241,0.12)",border:"1px solid rgba(99,102,241,0.3)",
//             borderRadius:24,padding:"6px 16px",marginBottom:16}}>
//             <div style={{width:8,height:8,borderRadius:"50%",background:"#818cf8"}}/>
//             <span style={{fontSize:12,color:"#a5b4fc",letterSpacing:"0.08em"}}>
//               NASA KEPLER MISSION · ML ANALYSIS
//             </span>
//           </div>
//           <h1 style={{fontSize:36,fontWeight:700,margin:"0 0 8px",
//           }}>
//             Exoplanet Analyzer
//           </h1>
//           <p style={{fontSize:14,color:"#64748b",margin:0}}>
//             Two-stage ML pipeline — Detection (XGBoost · KOI) → Habitability (Random Forest · PHL-EC)
//           </p>
//         </div>

//         {/* ── Preset buttons ── */}
//         <div style={{display:"flex",gap:8,justifyContent:"center",flexWrap:"wrap",marginBottom:"2rem"}}>
//           {Object.entries(PRESETS).map(([name, preset]) => (
//             <button key={name} onClick={() => { setVals(preset); setResult(null) }}
//               style={{
//                 padding:"7px 16px", fontSize:12, cursor:"pointer",
//                 background:"rgba(255,255,255,0.04)",
//                 border:"1px solid rgba(255,255,255,0.12)",
//                 borderRadius:20, color:"#94a3b8",
//                 transition:"all 0.15s"
//               }}
//               onMouseEnter={e => {
//                 e.target.style.background="rgba(99,102,241,0.15)"
//                 e.target.style.borderColor="rgba(129,140,248,0.5)"
//                 e.target.style.color="#a5b4fc"
//               }}
//               onMouseLeave={e => {
//                 e.target.style.background="rgba(255,255,255,0.04)"
//                 e.target.style.borderColor="rgba(255,255,255,0.12)"
//                 e.target.style.color="#94a3b8"
//               }}>
//               {name}
//             </button>
//           ))}
//           <div style={{
//             padding:"7px 14px",fontSize:11,
//             background:"rgba(52,211,153,0.08)",
//             border:"1px solid rgba(52,211,153,0.2)",
//             borderRadius:20,color:"#6ee7b7"
//           }}>
//             Earth Twin + Kepler-442b trigger habitability
//           </div>
//         </div>

//         {/* ── Main grid ── */}
//         <div style={{display:"grid",gridTemplateColumns:"1fr 1.1fr",gap:20,alignItems:"start"}}>

//           {/* LEFT: Input form */}
//           <div style={{
//             background:"rgba(255,255,255,0.03)",
//             border:"1px solid rgba(255,255,255,0.08)",
//             borderRadius:16,overflow:"hidden"
//           }}>
//             {/* Tab bar */}
//             <div style={{
//               display:"flex",borderBottom:"1px solid rgba(255,255,255,0.08)",
//               background:"rgba(0,0,0,0.2)"
//             }}>
//               {sections.map(s => (
//                 <button key={s.id} onClick={() => setActive(s.id)}
//                   style={{
//                     flex:1, padding:"12px 0", fontSize:13, cursor:"pointer",
//                     border:"none",
//                     background: active===s.id ? "rgba(99,102,241,0.15)" : "transparent",
//                     color: active===s.id ? "#a5b4fc" : "#475569",
//                     borderBottom: active===s.id ? "2px solid #818cf8" : "2px solid transparent",
//                     transition:"all 0.15s"
//                   }}>
//                   {s.label}
//                 </button>
//               ))}
//             </div>

//             <div style={{padding:"1.25rem"}}>
//               {/* Section description */}
//               <div style={{
//                 fontSize:11,color:"#475569",marginBottom:14,
//                 display:"flex",alignItems:"center",gap:6
//               }}>
//                 <div style={{width:6,height:6,borderRadius:"50%",
//                   background: active==="transit"?"#818cf8":active==="planet"?"#34d399":"#fbbf24"}}/>
//                 {active==="transit" && "Transit signal parameters — used by Detection model only"}
//                 {active==="planet"  && "Physical planet parameters — used by BOTH models"}
//                 {active==="star"    && "Host star parameters — used by BOTH models"}
//               </div>

//               {/* Fields for active tab */}
//               {FIELDS.filter(f => f.section===active).map(f => {
//                 const dec = f.step < 1 ? (f.step < 0.1 ? 2 : 1) : 0
//                 const v   = vals[f.key]
//                 return (
//                   <div key={f.key} style={{marginBottom:14}}>
//                     <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
//                       <span style={{fontSize:12,color:"#94a3b8"}}>
//                         {f.label}
//                         <span style={{color:"#475569",marginLeft:4}}>({f.unit})</span>
//                       </span>
//                       <span style={{
//                         fontSize:12,fontWeight:700,
//                         color: f.key==="koi_prad" ? (v>=0.5&&v<=1.6?"#34d399":v<=2.5?"#fbbf24":"#f87171") :
//                                f.key==="koi_teq"  ? (v>=200&&v<=320?"#34d399":v<=400?"#fbbf24":"#f87171") :
//                                f.key==="koi_insol"? (v>=0.3&&v<=1.5?"#34d399":v<=3?"#fbbf24":"#f87171") :
//                                "#e2e8f0"
//                       }}>
//                         {Number(v).toFixed(dec)}
//                       </span>
//                     </div>
//                     <input type="range"
//                       min={f.min} max={f.max} step={f.step} value={v}
//                       onChange={e => set(f.key, e.target.value)}
//                       style={{
//                         width:"100%",height:4,
//                         accentColor: f.section==="transit"?"#818cf8":
//                                      f.section==="planet"?"#34d399":"#fbbf24",
//                         cursor:"pointer"
//                       }}/>
//                     <div style={{fontSize:10,color:"#334155",marginTop:3}}>{f.hint}</div>
//                   </div>
//                 )
//               })}

//               {/* Analyze button */}
//               <button onClick={analyze} disabled={loading}
//                 style={{
//                   width:"100%",marginTop:8,padding:"12px 0",
//                   fontSize:14,fontWeight:600,cursor:loading?"not-allowed":"pointer",
//                   background: loading
//                     ? "rgba(255,255,255,0.04)"
//                     : "linear-gradient(135deg,#4f46e5,#7c3aed)",
//                   color: loading ? "#475569" : "#fff",
//                   border:"none",borderRadius:10,
//                   letterSpacing:"0.03em",
//                   transition:"opacity 0.2s",
//                   opacity: loading ? 0.6 : 1
//                 }}>
//                 {loading ? "Analyzing…" : "Analyze Planet"}
//               </button>

//               {/* Values tip */}
//               <div style={{
//                 marginTop:12,padding:"10px 12px",
//                 background:"rgba(52,211,153,0.05)",
//                 border:"1px solid rgba(52,211,153,0.15)",
//                 borderRadius:8,fontSize:11,color:"#6ee7b7",lineHeight:1.5
//               }}>
//                 For habitability to compute: prad 0.5–3, teq 150–400, insol 0.1–5, impact below 0.9
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: Results */}
//           <div style={{display:"flex",flexDirection:"column",gap:14}}>

//             {/* Error */}
//             {error && (
//               <div style={{
//                 background:"rgba(248,113,113,0.08)",
//                 border:"1px solid rgba(248,113,113,0.2)",
//                 borderRadius:12,padding:"12px 16px",
//                 color:"#fca5a5",fontSize:13
//               }}>
//                 {error}
//               </div>
//             )}

//             {/* Placeholder */}
//             {!result && !error && !loading && (
//               <div style={{
//                 background:"rgba(255,255,255,0.02)",
//                 border:"1px solid rgba(255,255,255,0.06)",
//                 borderRadius:16,padding:"3rem 2rem",
//                 textAlign:"center",color:"#334155"
//               }}>
//                 <div style={{fontSize:32,marginBottom:12,opacity:0.3}}>
//                   ◎
//                 </div>
//                 <div style={{fontSize:14}}>
//                   Select a preset or tune the sliders, then click Analyze
//                 </div>
//               </div>
//             )}

//             {/* Loading */}
//             {loading && (
//               <div style={{
//                 background:"rgba(99,102,241,0.06)",
//                 border:"1px solid rgba(99,102,241,0.2)",
//                 borderRadius:16,padding:"2rem",
//                 textAlign:"center",color:"#818cf8",fontSize:14
//               }}>
//                 Running ML pipeline…
//               </div>
//             )}

//             {/* Result card */}
//             {result && (
//               <div style={{
//                 background:"rgba(255,255,255,0.03)",
//                 border:"1px solid rgba(255,255,255,0.08)",
//                 borderRadius:16,padding:"1.25rem"
//               }}>

//                 {/* Gauges */}
//                 <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:16}}>
//                   <Gauge pct={detPct}  label="Detection"   color={detColor} />
//                   <Gauge pct={habPct ?? 0} label="Habitability" color={habColor} />
//                 </div>

//                 {/* Stage pills */}
//                 <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
//                   <span style={{
//                     fontSize:11,padding:"3px 10px",borderRadius:20,
//                     background:"rgba(99,102,241,0.12)",color:"#a5b4fc"
//                   }}>
//                     Stage 1: Detection · 
//                   </span>
//                   {result.is_planet && (
//                     <span style={{
//                       fontSize:11,padding:"3px 10px",borderRadius:20,
//                       background:"rgba(52,211,153,0.12)",color:"#6ee7b7"
//                     }}>
//                       Stage 2: Habitability · 
//                     </span>
//                   )}
//                   {!result.is_planet && (
//                     <span style={{
//                       fontSize:11,padding:"3px 10px",borderRadius:20,
//                       background:"rgba(248,113,113,0.1)",color:"#fca5a5"
//                     }}>
//                       Stage 2: Skipped — not a planet
//                     </span>
//                   )}
//                 </div>

//                 {/* Verdict */}
//                 <div style={{
//                   padding:"12px 16px",borderRadius:10,marginBottom:12,
//                   background: !result.is_planet ? "rgba(248,113,113,0.08)" :
//                     habPct > 70 ? "rgba(52,211,153,0.08)" :
//                     habPct > 40 ? "rgba(251,191,36,0.08)" :
//                     "rgba(248,113,113,0.08)",
//                   border:`1px solid ${verdictColor}30`,
//                   fontSize:14,fontWeight:600,color:verdictColor
//                 }}>
//                   {result.verdict}
//                 </div>

//                 {/* Model source */}
//                 <div style={{
//                   display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11,color:"#475569"
//                 }}>
//                   <div style={{
//                     background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"
//                   }}>
//                     <div style={{color:"#64748b",marginBottom:2}}>Detection model</div>
//                     <div style={{color:"#94a3b8"}}>{result.detection_source || "XGBoost"}</div>
//                   </div>
//                   <div style={{
//                     background:"rgba(0,0,0,0.2)",borderRadius:8,padding:"8px 10px"
//                   }}>
//                     <div style={{color:"#64748b",marginBottom:2}}>Habitability model</div>
//                     <div style={{color:"#94a3b8"}}>{result.habitability_source || (result.is_planet ? "Random Forest" : "—")}</div>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* HZ checks */}
//             {result?.hz_checks && (
//               <div style={{
//                 background:"rgba(255,255,255,0.03)",
//                 border:"1px solid rgba(255,255,255,0.08)",
//                 borderRadius:16,padding:"1.25rem"
//               }}>
//                 <div style={{fontSize:13,fontWeight:600,color:"#94a3b8",marginBottom:12}}>
//                   Physical habitability checks
//                 </div>
//                 {Object.values(result.hz_checks).map((c, i) => (
//                   <div key={i} style={{
//                     display:"flex",justifyContent:"space-between",alignItems:"center",
//                     padding:"7px 0",
//                     borderBottom:"1px solid rgba(255,255,255,0.04)"
//                   }}>
//                     <div>
//                       <span style={{fontSize:12,color:"#94a3b8"}}>{c.label}</span>
//                       <span style={{fontSize:10,color:"#334155",marginLeft:8}}>
//                         {c.range} {c.unit}
//                       </span>
//                     </div>
//                     <div style={{display:"flex",alignItems:"center",gap:8}}>
//                       <span style={{fontSize:11,color:"#475569"}}>
//                         {typeof c.value==="number" ? c.value.toFixed(2) : c.value}
//                       </span>
//                       <span style={{
//                         fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:600,
//                         background: c.pass ? "rgba(52,211,153,0.12)" : "rgba(248,113,113,0.1)",
//                         color: c.pass ? "#34d399" : "#f87171"
//                       }}>
//                         {c.pass ? "Pass" : "Fail"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

       
//         {/* ── Footer ── */}
//         <div style={{
//           textAlign:"center",marginTop:24,
//           fontSize:11,color:"#1e293b"
//         }}>
//           Detection: XGBoost · KOI dataset ·  &nbsp;|&nbsp;
//           Habitability: Random Forest · PHL-EC ·  &nbsp;|&nbsp;
//           FastAPI + React
//         </div>
//       </div>
//     </div>
//   )
// }

// frontend/src/App.jsx
// Space-theme Exoplanet Analyzer — Enhanced Edition
// npm install axios   →   npm run dev

import { useState, useEffect } from "react"
import axios from "axios"

const API = "http://localhost:8000"

const PRESETS = {
  "Earth Twin": { koi_period:365, koi_impact:0.3, koi_duration:13.0, koi_depth:84, koi_prad:1.0, koi_teq:255, koi_insol:1.0, koi_steff:5778, koi_slogg:4.44, koi_srad:1.0 },
  "Kepler-442b": { koi_period:112, koi_impact:0.25, koi_duration:5.1, koi_depth:610, koi_prad:1.34, koi_teq:233, koi_insol:0.70, koi_steff:4402, koi_slogg:4.60, koi_srad:0.60 },
  "Super Earth": { koi_period:280, koi_impact:0.2, koi_duration:8.0, koi_depth:300, koi_prad:1.5, koi_teq:270, koi_insol:0.85, koi_steff:5200, koi_slogg:4.50, koi_srad:0.90 },
  "Hot Jupiter": { koi_period:3, koi_impact:0.1, koi_duration:2.5, koi_depth:15000, koi_prad:11.2, koi_teq:1600, koi_insol:450, koi_steff:6100, koi_slogg:4.2, koi_srad:1.3 },
}

const FIELDS = [
  { key:"koi_period",   label:"Orbital period",          unit:"days",  min:0.5,  max:1000, step:1,    default:365,  hint:"Earth = 365 d",           section:"transit" },
  { key:"koi_impact",   label:"Impact parameter",        unit:"0–1",   min:0.0,  max:1.2,  step:0.01, default:0.3,  hint:"0 = central transit",     section:"transit" },
  { key:"koi_duration", label:"Transit duration",        unit:"hours", min:0.1,  max:20,   step:0.1,  default:3.0,  hint:"Length of brightness dip", section:"transit" },
  { key:"koi_depth",    label:"Transit depth",           unit:"ppm",   min:1,    max:50000,step:1,    default:84,   hint:"Starlight blocked",        section:"transit" },
  { key:"koi_prad",     label:"Planet radius",           unit:"R⊕",    min:0.3,  max:20,   step:0.1,  default:1.0,  hint:"Habitable: 0.5 – 1.6",    section:"planet"  },
  { key:"koi_teq",      label:"Equilibrium temp",        unit:"K",     min:50,   max:2500, step:5,    default:255,  hint:"Habitable: 200 – 320 K",   section:"planet"  },
  { key:"koi_insol",    label:"Insolation flux",         unit:"S⊕",    min:0.01, max:100,  step:0.01, default:1.0,  hint:"Habitable: 0.3 – 1.5",    section:"planet"  },
  { key:"koi_steff",    label:"Stellar temperature",     unit:"K",     min:2500, max:8000, step:50,   default:5778, hint:"Sun = 5778 K",             section:"star"    },
  { key:"koi_slogg",    label:"Stellar surface gravity", unit:"log g", min:3.0,  max:5.5,  step:0.05, default:4.44, hint:"Sun = 4.44",               section:"star"    },
  { key:"koi_srad",     label:"Stellar radius",          unit:"R☉",    min:0.1,  max:5.0,  step:0.05, default:1.0,  hint:"Sun = 1.0",                section:"star"    },
]

const INIT = Object.fromEntries(FIELDS.map(f => [f.key, f.default]))

// Deterministic stars
const STARS = Array.from({ length: 200 }, (_, i) => ({
  id: i,
  top:  ((i * 137.508) % 100).toFixed(2),
  left: ((i * 97.31)   % 100).toFixed(2),
  size: (((i * 31) % 3) + 0.8).toFixed(1),
  delay: ((i * 0.23) % 5).toFixed(2),
  dur:   (2.5 + ((i * 0.19) % 3.5)).toFixed(1),
  minOp: (0.1  + ((i * 0.07) % 0.25)).toFixed(2),
  maxOp: (0.4  + ((i * 0.13) % 0.55)).toFixed(2),
}))

const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@400;600;700;800&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #02030a; font-family: 'Syne', system-ui, sans-serif; color: #e2e8f0; overflow-x: hidden; }

  /* Stars */
  .xstar { position: fixed; border-radius: 50%; background: #fff; pointer-events: none; z-index: 0; animation: xtwinkle var(--xd) ease-in-out var(--xa) infinite alternate; }
  @keyframes xtwinkle { 0%{opacity:var(--xlo);transform:scale(0.8);} 100%{opacity:var(--xhi);transform:scale(1.3);} }

  /* Shooting stars */
  .xshoot { position: fixed; width: 2px; height: 2px; background: white; border-radius: 50%; pointer-events: none; z-index: 0; opacity: 0; animation: xshoot var(--xsd) linear var(--xsa) infinite; }
  .xshoot::after { content:''; position:absolute; top:50%; right:0; width:90px; height:1px; background:linear-gradient(to left,rgba(255,255,255,0.9),transparent); transform:translateY(-50%); }
  @keyframes xshoot { 0%{opacity:0;transform:translate(0,0)} 5%{opacity:1} 75%{opacity:0.5} 100%{opacity:0;transform:translate(280px,160px)} }

  /* Nebulae */
  .xneb { position: fixed; border-radius: 50%; pointer-events: none; z-index: 0; filter: blur(70px); animation: xnebdrift var(--xnd) ease-in-out var(--xna) infinite alternate; }
  @keyframes xnebdrift { 0%{transform:scale(1) rotate(0deg);opacity:0.6;} 100%{transform:scale(1.18) rotate(10deg);opacity:1;} }

  /* Planets */
  .xplanet-wrap { position: fixed; pointer-events: none; z-index: 1; }

  .xplanet-saturn {
    width: 86px; height: 86px; border-radius: 50%;
    background: radial-gradient(circle at 34% 30%, #f0d89a, #c97d3a 55%, #7a3d12 100%);
    box-shadow: inset -18px -14px 30px rgba(0,0,0,0.6), inset 8px 8px 18px rgba(255,220,140,0.22), 0 0 55px rgba(201,125,58,0.32), 0 0 110px rgba(201,125,58,0.14);
    animation: xfloatA 18s ease-in-out infinite;
    position: relative;
  }
  /* Saturn ring using a wrapper div approach */
  .xring-wrap {
    position: absolute; top: 50%; left: 50%;
    width: 160px; height: 44px;
    margin-left: -80px; margin-top: -22px;
    transform: rotateX(70deg) rotateZ(-16deg);
    pointer-events: none;
  }
  .xring-outer {
    position: absolute; inset: 0;
    border-radius: 50%;
    border: 10px solid transparent;
    border-top-color: rgba(210,175,100,0.55);
    border-bottom-color: rgba(210,175,100,0.55);
    box-shadow: 0 0 0 3px rgba(190,155,80,0.2), 0 0 0 8px rgba(170,135,60,0.1);
  }
  .xring-inner {
    position: absolute; inset: 8px;
    border-radius: 50%;
    border: 5px solid rgba(180,145,70,0.3);
  }

  .xplanet-ice {
    width: 60px; height: 60px; border-radius: 50%;
    background: radial-gradient(circle at 33% 30%, #c8eaf8, #4a8fbe 52%, #1a4a7a 100%);
    box-shadow: inset -11px -9px 22px rgba(0,0,0,0.5), inset 6px 6px 14px rgba(180,230,255,0.28), 0 0 40px rgba(74,143,190,0.38), 0 0 80px rgba(74,143,190,0.16);
    animation: xfloatB 22s ease-in-out infinite;
  }

  .xplanet-mars {
    width: 40px; height: 40px; border-radius: 50%;
    background: radial-gradient(circle at 35% 30%, #f09070, #b04030 55%, #5a1810 100%);
    box-shadow: inset -8px -7px 16px rgba(0,0,0,0.52), inset 4px 4px 10px rgba(255,160,120,0.22), 0 0 28px rgba(176,64,48,0.42), 0 0 60px rgba(176,64,48,0.16);
    animation: xfloatC 14s ease-in-out infinite;
  }

  .xplanet-hab {
    width: 50px; height: 50px; border-radius: 50%;
    background: radial-gradient(circle at 34% 31%, #b0eebc, #3a9a60 50%, #155a30 100%);
    box-shadow: inset -10px -9px 20px rgba(0,0,0,0.5), inset 5px 5px 12px rgba(160,240,180,0.28), 0 0 35px rgba(58,154,96,0.42), 0 0 70px rgba(58,154,96,0.2);
    animation: xfloatD 26s ease-in-out infinite;
    position: relative;
  }
  .xplanet-hab::before {
    content: ''; position: absolute; inset: -6px; border-radius: 50%;
    border: 3px solid rgba(100,220,150,0.22);
    animation: xatmo 3s ease-in-out infinite alternate;
  }
  @keyframes xatmo { from{opacity:0.4;transform:scale(1);} to{opacity:0.9;transform:scale(1.06);} }

  @keyframes xfloatA { 0%,100%{transform:translateY(0) translateX(0)} 33%{transform:translateY(-14px) translateX(7px)} 66%{transform:translateY(9px) translateX(-9px)} }
  @keyframes xfloatB { 0%,100%{transform:translateY(0) translateX(0)} 40%{transform:translateY(18px) translateX(-9px)} 70%{transform:translateY(-10px) translateX(12px)} }
  @keyframes xfloatC { 0%,100%{transform:translateY(0) translateX(0)} 50%{transform:translateY(-13px) translateX(9px)} }
  @keyframes xfloatD { 0%,100%{transform:translateY(0) translateX(0)} 25%{transform:translateY(11px) translateX(6px)} 75%{transform:translateY(-9px) translateX(-7px)} }

  /* Glass card */
  .xcard {
    background: rgba(4,6,18,0.84);
    backdrop-filter: blur(22px);
    -webkit-backdrop-filter: blur(22px);
    border: 1px solid rgba(255,255,255,0.07);
    border-radius: 20px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05);
  }

  /* Sliders */
  input[type=range] { -webkit-appearance:none; appearance:none; background:transparent; width:100%; cursor:pointer; }
  input[type=range]::-webkit-slider-runnable-track { height:3px; border-radius:2px; }
  input[type=range].st::-webkit-slider-runnable-track { background:linear-gradient(to right,#818cf8 var(--p),rgba(255,255,255,0.07) var(--p)); }
  input[type=range].sp::-webkit-slider-runnable-track { background:linear-gradient(to right,#34d399 var(--p),rgba(255,255,255,0.07) var(--p)); }
  input[type=range].ss::-webkit-slider-runnable-track { background:linear-gradient(to right,#fbbf24 var(--p),rgba(255,255,255,0.07) var(--p)); }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance:none; width:14px; height:14px; border-radius:50%; margin-top:-5.5px; border:2px solid rgba(255,255,255,0.12); }
  input[type=range].st::-webkit-slider-thumb { background:#818cf8; box-shadow:0 0 10px rgba(129,140,248,0.75); }
  input[type=range].sp::-webkit-slider-thumb { background:#34d399; box-shadow:0 0 10px rgba(52,211,153,0.75); }
  input[type=range].ss::-webkit-slider-thumb { background:#fbbf24; box-shadow:0 0 10px rgba(251,191,36,0.75); }

  /* Tabs */
  .xtab { flex:1; border:none; cursor:pointer; padding:13px 0; font-size:11px; font-weight:700; font-family:'Syne',sans-serif; letter-spacing:0.08em; transition:all 0.2s; }

  /* Buttons */
  .xpreset { padding:7px 18px; font-size:12px; cursor:pointer; background:rgba(255,255,255,0.03); border:1px solid rgba(255,255,255,0.09); border-radius:24px; color:#64748b; font-family:'Syne',sans-serif; font-weight:600; transition:all 0.2s; }
  .xpreset:hover { background:rgba(99,102,241,0.15); border-color:rgba(129,140,248,0.45); color:#a5b4fc; box-shadow:0 0 18px rgba(99,102,241,0.22); }
  .xanalyze { width:100%; padding:13px 0; font-size:13px; font-weight:700; border-radius:12px; border:none; font-family:'Syne',sans-serif; letter-spacing:0.08em; transition:all 0.25s; }
  .xanalyze:not(:disabled):hover { box-shadow:0 0 40px rgba(79,70,229,0.55),inset 0 0 20px rgba(99,102,241,0.08)!important; transform:translateY(-1px); }
  .xanalyze:active { transform:scale(0.98); }

  /* Gauge arc */
  .xarc { transition: stroke-dasharray 1s cubic-bezier(0.34,1.56,0.64,1), stroke 0.5s; }

  /* Animations */
  @keyframes xfadeup { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
  @keyframes xshimmer { 0%{background-position:200% center} 100%{background-position:-200% center} }
  @keyframes xspin  { from{transform:rotate(0deg)}   to{transform:rotate(360deg)}  }
  @keyframes xspinr { from{transform:rotate(360deg)} to{transform:rotate(0deg)}    }
  @keyframes xpulse { 0%,100%{opacity:0.4} 50%{opacity:1} }
  .xfadeup { animation: xfadeup 0.45s ease forwards; }
  .xtitle {
    color: white;
    
  }
  ::-webkit-scrollbar { width:4px; }
  ::-webkit-scrollbar-track { background:rgba(255,255,255,0.02); }
  ::-webkit-scrollbar-thumb { background:rgba(99,102,241,0.35); border-radius:2px; }
`

function Gauge({ pct, label, color }) {
  const r = 42, cx = 60, cy = 60
  const startA = Math.PI * 0.75
  const endA   = Math.PI * 2.25
  const span   = endA - startA

  function arc(a1, a2) {
    const x1 = cx + r*Math.cos(a1), y1 = cy + r*Math.sin(a1)
    const x2 = cx + r*Math.cos(a2), y2 = cy + r*Math.sin(a2)
    return `M${x1},${y1} A${r},${r} 0 ${a2-a1>Math.PI?1:0} 1 ${x2},${y2}`
  }

  const fillA = startA + span * Math.min(pct/100, 0.999)
  const dotX = cx + r * Math.cos(fillA), dotY = cy + r * Math.sin(fillA)

  return (
    <div style={{ textAlign:"center" }}>
      <svg width="120" height="88" style={{ overflow:"visible", display:"block", margin:"0 auto" }}>
        <defs>
          <filter id={`xg${label}`}>
            <feGaussianBlur stdDeviation="2.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <path d={arc(startA, endA)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" strokeLinecap="round"/>
        <path d={arc(startA, fillA)} fill="none" stroke={color} strokeWidth="7"
          strokeLinecap="round" filter={`url(#xg${label})`} className="xarc"/>
        {pct > 2 && <circle cx={dotX} cy={dotY} r={4} fill={color} filter={`url(#xg${label})`}/>}
        <text x={cx} y={cy+4} textAnchor="middle" fill="#fff"
          style={{ fontSize:22, fontWeight:800, fontFamily:"'Space Mono',monospace" }}>
          {pct}%
        </text>
        <text x={cx} y={cy+18} textAnchor="middle" fill="rgba(255,255,255,0.3)"
          style={{ fontSize:9, fontFamily:"'Syne',sans-serif", letterSpacing:"0.14em" }}>
          {label.toUpperCase()}
        </text>
      </svg>
    </div>
  )
}

export default function App() {
  const [vals,    setVals]   = useState(INIT)
  const [result,  setResult] = useState(null)
  const [loading, setLoad]   = useState(false)
  const [error,   setError]  = useState(null)
  const [active,  setActive] = useState("transit")

  useEffect(() => {
    const el = document.createElement("style")
    el.textContent = GLOBAL_CSS
    document.head.appendChild(el)
    return () => document.head.removeChild(el)
  }, [])

  function set(key, v) { setVals(p => ({ ...p, [key]: parseFloat(v) })) }

  async function analyze() {
    setLoad(true); setError(null); setResult(null)
    try {
      const { data } = await axios.post(`${API}/predict`, vals)
      setResult(data)
    } catch (e) {
      setError(e.response?.data?.detail || "Cannot reach API — start FastAPI on port 8000.")
    } finally { setLoad(false) }
  }

  const detPct = result ? Math.round(result.detection_probability * 100) : 0
  const habPct = result?.habitability_score != null ? Math.round(result.habitability_score * 100) : null
  const vc = !result ? "#94a3b8" : !result.is_planet ? "#f87171" : habPct > 70 ? "#34d399" : habPct > 40 ? "#fbbf24" : "#f87171"
  const dc = detPct > 60 ? "#34d399" : detPct > 40 ? "#fbbf24" : "#f87171"
  const hc = habPct != null ? (habPct > 70 ? "#34d399" : habPct > 40 ? "#fbbf24" : "#f87171") : "#475569"

  const secs = [
    { id:"transit", label:"Transit", accent:"#818cf8" },
    { id:"planet",  label:"Planet",  accent:"#34d399" },
    { id:"star",    label:"Star",    accent:"#fbbf24" },
  ]
  const acc = secs.find(s => s.id === active)?.accent || "#818cf8"

  return (
    <div style={{ minHeight:"100vh", position:"relative", overflow:"hidden", background:"#02030a" }}>

      {/* Nebulae */}
      <div className="xneb" style={{ top:"2%",  left:"12%", width:520, height:420, background:"radial-gradient(ellipse,rgba(80,40,160,0.2) 0%,transparent 70%)", "--xnd":"28s", "--xna":"0s" }}/>
      <div className="xneb" style={{ top:"42%", left:"58%", width:600, height:480, background:"radial-gradient(ellipse,rgba(20,70,150,0.18) 0%,transparent 70%)", "--xnd":"36s", "--xna":"-14s" }}/>
      <div className="xneb" style={{ top:"-8%", left:"52%", width:420, height:320, background:"radial-gradient(ellipse,rgba(150,40,80,0.12) 0%,transparent 70%)", "--xnd":"24s", "--xna":"-7s" }}/>
      <div className="xneb" style={{ top:"62%", left:"3%",  width:360, height:300, background:"radial-gradient(ellipse,rgba(30,110,90,0.14) 0%,transparent 70%)", "--xnd":"32s", "--xna":"-20s" }}/>

      {/* Milky Way band */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        background:"linear-gradient(125deg,transparent 20%,rgba(180,190,255,0.018) 40%,rgba(200,210,255,0.03) 50%,rgba(180,190,255,0.018) 60%,transparent 80%)" }}/>

      {/* Stars */}
      {STARS.map(s => (
        <div key={s.id} className="xstar" style={{
          top:`${s.top}%`, left:`${s.left}%`,
          width:`${s.size}px`, height:`${s.size}px`,
          "--xd":  `${s.dur}s`,
          "--xa":  `${s.delay}s`,
          "--xlo": s.minOp,
          "--xhi": s.maxOp,
        }}/>
      ))}

      {/* Shooting stars */}
      {[
        { top:"10%", left:"18%", "--xsd":"7s",  "--xsa":"3s"  },
        { top:"32%", left:"68%", "--xsd":"5.5s","--xsa":"13s" },
        { top:"58%", left:"38%", "--xsd":"8s",  "--xsa":"22s" },
      ].map((s, i) => (
        <div key={i} className="xshoot" style={{ top:s.top, left:s.left, "--xsd":s["--xsd"], "--xsa":s["--xsa"] }}/>
      ))}

      {/* Saturn — top right */}
      <div className="xplanet-wrap" style={{ top:"5%", right:"5%" }}>
        <div className="xplanet-saturn">
          <div className="xring-wrap">
            <div className="xring-outer"/>
            <div className="xring-inner"/>
          </div>
        </div>
      </div>

      {/* Ice planet — bottom left */}
      <div className="xplanet-wrap" style={{ bottom:"10%", left:"3%" }}>
        <div className="xplanet-ice"/>
      </div>

      {/* Mars — mid right */}
      <div className="xplanet-wrap" style={{ top:"50%", right:"2%" }}>
        <div className="xplanet-mars"/>
      </div>

      {/* Habitable — upper left */}
      <div className="xplanet-wrap" style={{ top:"20%", left:"1.5%" }}>
        <div className="xplanet-hab"/>
      </div>

      {/* Scan lines */}
      <div style={{ position:"fixed", inset:0, zIndex:0, pointerEvents:"none",
        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.012) 3px,rgba(0,0,0,0.012) 4px)" }}/>

      {/* ── APP CONTENT ── */}
      <div style={{ position:"relative", zIndex:2, maxWidth:1120, margin:"0 auto", padding:"2rem 1.5rem" }}>

        {/* Header */}
        <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:8,
            background:"rgba(99,102,241,0.1)", border:"1px solid rgba(99,102,241,0.24)",
            borderRadius:40, padding:"6px 20px", marginBottom:18 }}>
            <div style={{ width:6, height:6, borderRadius:"50%", background:"#818cf8",
              boxShadow:"0 0 8px #818cf8", animation:"xpulse 2s ease-in-out infinite" }}/>
            <span style={{ fontSize:10, color:"#a5b4fc", letterSpacing:"0.16em", fontFamily:"'Space Mono',monospace" }}>
              NASA · KEPLER MISSION · ML ANALYSIS
            </span>
          </div>
          <h1 className="xtitle" style={{ fontSize:"clamp(30px,4.5vw,50px)", fontWeight:800 }}>
            Exoplanet Analyzer
          </h1>
          <p style={{ fontSize:12, color:"#1e3a5f", fontFamily:"'Space Mono',monospace", letterSpacing:"0.04em" }}>
            Stage I · Detection ( KOI) → Stage II · Habitability ( PHL-EC)
          </p>
        </div>

        {/* Presets */}
        <div style={{ display:"flex", gap:8, justifyContent:"center", flexWrap:"wrap", marginBottom:"2rem" }}>
          {Object.entries(PRESETS).map(([name, preset]) => (
            <button key={name} className="xpreset" onClick={() => { setVals(preset); setResult(null) }}>
              {name}
            </button>
          ))}
          <div style={{ padding:"7px 16px", fontSize:10,
            background:"rgba(52,211,153,0.07)", border:"1px solid rgba(52,211,153,0.17)",
            borderRadius:24, color:"#6ee7b7", fontFamily:"'Space Mono',monospace" }}>
            ⬡ Earth Twin + Kepler-442b → habitability
          </div>
        </div>

        {/* Grid */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1.12fr", gap:18, alignItems:"start" }}>

          {/* LEFT — Inputs */}
          <div className="xcard" style={{ overflow:"hidden" }}>
            {/* Tabs */}
            <div style={{ display:"flex", borderBottom:"1px solid rgba(255,255,255,0.06)", background:"rgba(0,0,0,0.25)" }}>
              {secs.map(s => (
                <button key={s.id} className="xtab" onClick={() => setActive(s.id)} style={{
                  background: active===s.id ? `${s.accent}12` : "transparent",
                  color: active===s.id ? s.accent : "#2d3748",
                  borderBottom: active===s.id ? `2px solid ${s.accent}` : "2px solid transparent",
                  borderTop:"none", borderLeft:"none", borderRight:"none",
                }}>
                  {s.label.toUpperCase()}
                </button>
              ))}
            </div>

            <div style={{ padding:"1.25rem" }}>
              <div style={{ display:"flex", alignItems:"center", gap:6, fontSize:10, color:"#1e3a5f", marginBottom:14, fontFamily:"'Space Mono',monospace", letterSpacing:"0.06em" }}>
                <div style={{ width:5, height:5, borderRadius:"50%", background:acc, boxShadow:`0 0 8px ${acc}` }}/>
                {active==="transit" && "TRANSIT SIGNAL · DETECTION MODEL ONLY"}
                {active==="planet"  && "PLANETARY BODY · BOTH MODELS"}
                {active==="star"    && "HOST STAR · BOTH MODELS"}
              </div>

              {FIELDS.filter(f => f.section===active).map(f => {
                const dec = f.step < 1 ? (f.step < 0.1 ? 2 : 1) : 0
                const v   = vals[f.key]
                const pct = ((v - f.min) / (f.max - f.min)) * 100
                const good = f.key==="koi_prad" ? v>=0.5&&v<=1.6 : f.key==="koi_teq" ? v>=200&&v<=320 : f.key==="koi_insol" ? v>=0.3&&v<=1.5 : null
                const vc2 = good===null ? "#cbd5e1" : good ? "#34d399" : "#f87171"
                const cls = { transit:"st", planet:"sp", star:"ss" }[active]
                return (
                  <div key={f.key} style={{ marginBottom:15 }}>
                    <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                      <span style={{ fontSize:11, color:"#475569", fontWeight:600 }}>
                        {f.label}
                        <span style={{ color:"#1e293b", marginLeft:5, fontFamily:"'Space Mono',monospace", fontSize:9 }}>{f.unit}</span>
                      </span>
                      <span style={{ fontSize:12, fontWeight:700, color:vc2, fontFamily:"'Space Mono',monospace", textShadow:good?`0 0 12px ${vc2}80`:"none" }}>
                        {Number(v).toFixed(dec)}
                      </span>
                    </div>
                    <input type="range" className={cls} min={f.min} max={f.max} step={f.step} value={v}
                      style={{ "--p":`${pct}%` }}
                      onChange={e => set(f.key, e.target.value)}/>
                    <div style={{ fontSize:9.5, color:"#1e293b", marginTop:3, fontFamily:"'Space Mono',monospace" }}>{f.hint}</div>
                  </div>
                )
              })}

              <button className="xanalyze" onClick={analyze} disabled={loading} style={{
                marginTop:8,
                background: loading ? "rgba(255,255,255,0.03)" : "linear-gradient(135deg,#3730a3,#4f46e5 50%,#7c3aed)",
                color: loading ? "#334155" : "#fff",
                border: loading ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(129,140,248,0.35)",
                boxShadow: loading ? "none" : "0 8px 32px rgba(79,70,229,0.38)",
                cursor: loading ? "not-allowed" : "pointer",
              }}>
                {loading
                  ? <span style={{ fontFamily:"'Space Mono',monospace", fontSize:11 }}>ANALYZING…</span>
                  : "⬡  ANALYZE PLANET"}
              </button>

              <div style={{ marginTop:10, padding:"8px 12px", background:"rgba(52,211,153,0.04)", border:"1px solid rgba(52,211,153,0.1)", borderRadius:8, fontSize:9.5, color:"#1e4a38", lineHeight:1.7, fontFamily:"'Space Mono',monospace" }}>
                Habitability: prad 0.5–3 · teq 150–400K · insol 0.1–5 · impact &lt;0.9
              </div>
            </div>
          </div>

          {/* RIGHT — Results */}
          <div style={{ display:"flex", flexDirection:"column", gap:14 }}>

            {error && (
              <div className="xfadeup xcard" style={{ padding:"14px 18px", color:"#fca5a5", fontSize:11, fontFamily:"'Space Mono',monospace", background:"rgba(248,113,113,0.06)", borderColor:"rgba(248,113,113,0.18)" }}>
                ⚠ {error}
              </div>
            )}

            {!result && !error && !loading && (
              <div className="xcard" style={{ padding:"4rem 2rem", textAlign:"center" }}>
                <svg width="80" height="80" style={{ display:"block", margin:"0 auto 16px", opacity:0.22 }}>
                  <circle cx="40" cy="40" r="30" fill="none" stroke="rgba(99,102,241,0.7)" strokeWidth="1" strokeDasharray="5 4"/>
                  <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(99,102,241,0.4)" strokeWidth="1"/>
                  <g style={{ transformOrigin:"40px 40px", animation:"xspin 8s linear infinite" }}>
                    <circle cx="40" cy="10" r="4.5" fill="rgba(129,140,248,0.9)"/>
                  </g>
                  <circle cx="40" cy="40" r="8" fill="rgba(250,204,21,0.25)" stroke="rgba(250,204,21,0.3)" strokeWidth="1.5"/>
                </svg>
                <div style={{ fontSize:13, color:"#1e293b" }}>Select a preset or tune the sliders</div>
                <div style={{ fontSize:10, color:"#0f172a", marginTop:6, fontFamily:"'Space Mono',monospace" }}>THEN CLICK ANALYZE PLANET</div>
              </div>
            )}

            {loading && (
              <div className="xcard" style={{ padding:"3rem 2rem", textAlign:"center" }}>
                <svg width="64" height="64" style={{ display:"block", margin:"0 auto 14px", overflow:"visible" }}>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="3"/>
                  <circle cx="32" cy="32" r="26" fill="none" stroke="#6366f1" strokeWidth="3"
                    strokeDasharray="38 126" strokeLinecap="round"
                    style={{ transformOrigin:"32px 32px", animation:"xspin 1.1s linear infinite" }}/>
                  <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(129,140,248,0.4)" strokeWidth="2"
                    strokeDasharray="20 80" strokeLinecap="round"
                    style={{ transformOrigin:"32px 32px", animation:"xspinr 0.75s linear infinite" }}/>
                  <circle cx="32" cy="32" r="5" fill="rgba(99,102,241,0.5)"/>
                </svg>
                <div style={{ color:"#6366f1", fontSize:11, fontFamily:"'Space Mono',monospace", letterSpacing:"0.1em" }}>RUNNING ML PIPELINE…</div>
              </div>
            )}

            {result && (
              <div className="xfadeup xcard" style={{ padding:"1.5rem" }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:10, marginBottom:16 }}>
                  {[{pct:detPct,label:"Detection",color:dc},{pct:habPct??0,label:"Habitability",color:hc}].map(g => (
                    <div key={g.label} style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:14, padding:"10px 6px" }}>
                      <Gauge {...g}/>
                    </div>
                  ))}
                </div>

                <div style={{ display:"flex", gap:6, marginBottom:14, alignItems:"center", flexWrap:"wrap" }}>
                  <span style={{ fontSize:10, padding:"4px 12px", borderRadius:20, background:"rgba(99,102,241,0.1)", color:"#a5b4fc", border:"1px solid rgba(99,102,241,0.2)", fontFamily:"'Space Mono',monospace" }}>
                    I · DETECTION
                  </span>
                  <span style={{ color:"#1e293b" }}>→</span>
                  {result.is_planet
                    ? <span style={{ fontSize:10, padding:"4px 12px", borderRadius:20, background:"rgba(52,211,153,0.1)", color:"#6ee7b7", border:"1px solid rgba(52,211,153,0.2)", fontFamily:"'Space Mono',monospace" }}>II · HABITABILITY</span>
                    : <span style={{ fontSize:10, padding:"4px 12px", borderRadius:20, background:"rgba(248,113,113,0.07)", color:"#fca5a5", border:"1px solid rgba(248,113,113,0.15)", fontFamily:"'Space Mono',monospace" }}>II · SKIPPED</span>
                  }
                </div>

                <div style={{ padding:"13px 18px", borderRadius:12, marginBottom:14,
                  background:`${vc}0c`, border:`1px solid ${vc}28`,
                  fontSize:14, fontWeight:700, color:vc, textShadow:`0 0 22px ${vc}55` }}>
                  {result.verdict}
                </div>

                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[
                    { label:"DETECTION MODEL",    val:result.detection_source||"XGBoost" },
                    { label:"HABITABILITY MODEL", val:result.habitability_source||(result.is_planet?"Random Forest":"XGBoost") },
                  ].map(item => (
                    <div key={item.label} style={{ background:"rgba(0,0,0,0.3)", border:"1px solid rgba(255,255,255,0.04)", borderRadius:10, padding:"10px 12px" }}>
                      <div style={{ fontSize:9, color:"#1e293b", marginBottom:4, fontFamily:"'Space Mono',monospace", letterSpacing:"0.06em" }}>{item.label}</div>
                      <div style={{ fontSize:11, color:"#64748b", fontFamily:"'Space Mono',monospace" }}>{item.val}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result?.hz_checks && (
              <div className="xfadeup xcard" style={{ padding:"1.25rem" }}>
                <div style={{ fontSize:10, color:"#334155", marginBottom:14, fontFamily:"'Space Mono',monospace", letterSpacing:"0.1em" }}>
                  HABITABILITY ZONE · PHYSICAL CHECKS
                </div>
                {Object.values(result.hz_checks).map((c, i) => (
                  <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"9px 0", borderBottom:"1px solid rgba(255,255,255,0.03)" }}>
                    <div>
                      <div style={{ fontSize:11, color:"#64748b" }}>{c.label}</div>
                      <div style={{ fontSize:9, color:"#1e293b", marginTop:2, fontFamily:"'Space Mono',monospace" }}>{c.range} {c.unit}</div>
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                      <span style={{ fontSize:11, color:"#334155", fontFamily:"'Space Mono',monospace" }}>
                        {typeof c.value==="number" ? c.value.toFixed(2) : c.value}
                      </span>
                      <span style={{ fontSize:9, padding:"3px 10px", borderRadius:20, fontWeight:700,
                        fontFamily:"'Space Mono',monospace", letterSpacing:"0.06em",
                        background:c.pass?"rgba(52,211,153,0.1)":"rgba(248,113,113,0.08)",
                        border:`1px solid ${c.pass?"rgba(52,211,153,0.25)":"rgba(248,113,113,0.2)"}`,
                        color:c.pass?"#34d399":"#f87171",
                        boxShadow:c.pass?"0 0 10px rgba(52,211,153,0.18)":"none" }}>
                        {c.pass ? "PASS" : "FAIL"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ textAlign:"center", marginTop:28, paddingTop:20, borderTop:"1px solid rgba(220, 230, 233, 0.04)", fontSize:10, color:"#e9ecf2", fontFamily:"'Space Mono',monospace", letterSpacing:"0.08em" }}>
          DETECTION · XGBOOST · KOI &nbsp;·&nbsp; HABITABILITY · LOGISTIC REGRESSION · PHL-EC &nbsp;·&nbsp; FASTAPI + REACT
        </div>
      </div>
    </div>
  )
}