/* Decorative ambient planets — purely presentational */

function Saturn() {
  return (
    <div className="fixed top-[5%] right-[5%] pointer-events-none z-[1] animate-floatA">
      {/* Planet body */}
      <div
        className="w-[86px] h-[86px] rounded-full relative"
        style={{
          background: "radial-gradient(circle at 34% 30%, #f0d89a, #c97d3a 55%, #7a3d12 100%)",
          boxShadow:
            "inset -18px -14px 30px rgba(0,0,0,0.6), inset 8px 8px 18px rgba(255,220,140,0.22), 0 0 55px rgba(201,125,58,0.32), 0 0 110px rgba(201,125,58,0.14)",
        }}
      >
        {/* Ring wrapper */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: "50%", left: "50%",
            width: 160, height: 44,
            marginLeft: -80, marginTop: -22,
            transform: "rotateX(70deg) rotateZ(-16deg)",
          }}
        >
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "10px solid transparent",
              borderTopColor: "rgba(210,175,100,0.55)",
              borderBottomColor: "rgba(210,175,100,0.55)",
              boxShadow: "0 0 0 3px rgba(190,155,80,0.2), 0 0 0 8px rgba(170,135,60,0.1)",
            }}
          />
          <div
            className="absolute inset-2 rounded-full"
            style={{ border: "5px solid rgba(180,145,70,0.3)" }}
          />
        </div>
      </div>
    </div>
  )
}

function IcePlanet() {
  return (
    <div className="fixed bottom-[10%] left-[3%] pointer-events-none z-[1] animate-floatB">
      <div
        className="w-[60px] h-[60px] rounded-full"
        style={{
          background: "radial-gradient(circle at 33% 30%, #c8eaf8, #4a8fbe 52%, #1a4a7a 100%)",
          boxShadow:
            "inset -11px -9px 22px rgba(0,0,0,0.5), inset 6px 6px 14px rgba(180,230,255,0.28), 0 0 40px rgba(74,143,190,0.38), 0 0 80px rgba(74,143,190,0.16)",
        }}
      />
    </div>
  )
}

function MarsPlanet() {
  return (
    <div className="fixed top-[50%] right-[2%] pointer-events-none z-[1] animate-floatC">
      <div
        className="w-10 h-10 rounded-full"
        style={{
          background: "radial-gradient(circle at 35% 30%, #f09070, #b04030 55%, #5a1810 100%)",
          boxShadow:
            "inset -8px -7px 16px rgba(0,0,0,0.52), inset 4px 4px 10px rgba(255,160,120,0.22), 0 0 28px rgba(176,64,48,0.42), 0 0 60px rgba(176,64,48,0.16)",
        }}
      />
    </div>
  )
}

function HabitablePlanet() {
  return (
    <div className="fixed top-[20%] left-[1.5%] pointer-events-none z-[1] animate-floatD">
      <div
        className="w-[50px] h-[50px] rounded-full relative"
        style={{
          background: "radial-gradient(circle at 34% 31%, #b0eebc, #3a9a60 50%, #155a30 100%)",
          boxShadow:
            "inset -10px -9px 20px rgba(0,0,0,0.5), inset 5px 5px 12px rgba(160,240,180,0.28), 0 0 35px rgba(58,154,96,0.42), 0 0 70px rgba(58,154,96,0.2)",
        }}
      >
        {/* Atmosphere glow ring */}
        <div
          className="absolute rounded-full animate-atmo"
          style={{
            inset: -6,
            border: "3px solid rgba(100,220,150,0.22)",
          }}
        />
      </div>
    </div>
  )
}

export default function Planets() {
  return (
    <>
      <Saturn />
      <IcePlanet />
      <MarsPlanet />
      <HabitablePlanet />
    </>
  )
}
