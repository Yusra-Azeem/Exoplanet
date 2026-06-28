import { STARS, SHOOTING_STARS } from "../constants/fields"

const NEBULAE = [
  { top: "2%",  left: "12%", w: 520, h: 420, color: "rgba(80,40,160,0.20)",  nd: "28s", na: "0s"   },
  { top: "42%", left: "58%", w: 600, h: 480, color: "rgba(20,70,150,0.18)",  nd: "36s", na: "-14s" },
  { top: "-8%", left: "52%", w: 420, h: 320, color: "rgba(150,40,80,0.12)",  nd: "24s", na: "-7s"  },
  { top: "62%", left: "3%",  w: 360, h: 300, color: "rgba(30,110,90,0.14)",  nd: "32s", na: "-20s" },
]

export default function StarField() {
  return (
    <>
      {/* Nebulae */}
      {NEBULAE.map((n, i) => (
        <div
          key={i}
          className="fixed pointer-events-none z-0 rounded-full animate-nebdrift"
          style={{
            top: n.top, left: n.left,
            width: n.w, height: n.h,
            background: `radial-gradient(ellipse, ${n.color} 0%, transparent 70%)`,
            filter: "blur(70px)",
            "--nd": n.nd, "--na": n.na,
          }}
        />
      ))}

      {/* Milky Way band */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(125deg,transparent 20%,rgba(180,190,255,0.018) 40%,rgba(200,210,255,0.03) 50%,rgba(180,190,255,0.018) 60%,transparent 80%)",
        }}
      />

      {/* Stars */}
      {STARS.map((s) => (
        <div
          key={s.id}
          className="fixed rounded-full pointer-events-none z-0 animate-twinkle"
          style={{
            top: `${s.top}%`, left: `${s.left}%`,
            width: `${s.size}px`, height: `${s.size}px`,
            background: "#fff",
            "--dur": `${s.dur}s`, "--delay": `${s.delay}s`,
            "--lo": s.lo,        "--hi": s.hi,
          }}
        />
      ))}

      {/* Shooting stars */}
      {SHOOTING_STARS.map((s, i) => (
        <div
          key={i}
          className="fixed w-0.5 h-0.5 bg-white rounded-full pointer-events-none z-0 opacity-0 animate-shoot shoot-tail"
          style={{ top: s.top, left: s.left, "--sd": s.sd, "--sa": s.sa }}
        />
      ))}

      {/* Scan lines */}
      <div className="fixed inset-0 z-0 pointer-events-none scan-lines" />
    </>
  )
}
