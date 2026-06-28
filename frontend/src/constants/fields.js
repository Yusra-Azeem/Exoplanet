export const SECTIONS = [
  { id: "flags",   label: "Flags",   accent: "#f87171", sliderClass: "slider-flags"   },
  { id: "transit", label: "Transit", accent: "#818cf8", sliderClass: "slider-transit" },
  { id: "planet",  label: "Planet",  accent: "#34d399", sliderClass: "slider-planet"  },
  { id: "star",    label: "Star",    accent: "#fbbf24", sliderClass: "slider-star"    },
  { id: "signal",  label: "Signal",  accent: "#c084fc", sliderClass: "slider-signal"  },
  { id: "sky",     label: "Sky",     accent: "#38bdf8", sliderClass: "slider-sky"     },
]

export const FIELDS = [
  // ── Transit ───────────────────────────────────────────────────────────────
  { key: "koi_period",      label: "Orbital period",       unit: "days",  min: 0.5,  max: 1000, step: 1,     default: 365.0,  hint: "Earth = 365 d",            section: "transit", habitRange: null },
  { key: "koi_period_err1", label: "Period error (+)",     unit: "days",  min: 0,    max: 10,   step: 0.001, default: 0.001,  hint: "Upper uncertainty",        section: "transit", habitRange: null },
  { key: "koi_period_err2", label: "Period error (−)",     unit: "days",  min: -10,  max: 0,    step: 0.001, default: -0.001, hint: "Lower uncertainty (neg)",  section: "transit", habitRange: null },
  { key: "koi_time0bk",     label: "Transit epoch",        unit: "BKJD", min: 0,    max: 2000, step: 0.1,   default: 134.0,  hint: "Reference transit time",   section: "transit", habitRange: null },
  { key: "koi_time0bk_err1",label: "Epoch error (+)",      unit: "BKJD", min: 0,    max: 10,   step: 0.001, default: 0.001,  hint: "Upper uncertainty",        section: "transit", habitRange: null },
  { key: "koi_time0bk_err2",label: "Epoch error (−)",      unit: "BKJD", min: -10,  max: 0,    step: 0.001, default: -0.001, hint: "Lower uncertainty (neg)",  section: "transit", habitRange: null },
  { key: "koi_impact",      label: "Impact parameter",     unit: "0–1",  min: 0.0,  max: 1.2,  step: 0.01,  default: 0.3,    hint: "0 = central transit",      section: "transit", habitRange: null },
  { key: "koi_impact_err1", label: "Impact error (+)",     unit: "",     min: 0,    max: 2,    step: 0.01,  default: 0.05,   hint: "Upper uncertainty",        section: "transit", habitRange: null },
  { key: "koi_impact_err2", label: "Impact error (−)",     unit: "",     min: -2,   max: 0,    step: 0.01,  default: -0.05,  hint: "Lower uncertainty (neg)",  section: "transit", habitRange: null },
  { key: "koi_duration",    label: "Transit duration",     unit: "hours",min: 0.1,  max: 20,   step: 0.1,   default: 3.0,    hint: "Length of brightness dip", section: "transit", habitRange: null },
  { key: "koi_duration_err1",label:"Duration error (+)",   unit: "hours",min: 0,    max: 5,    step: 0.01,  default: 0.01,   hint: "Upper uncertainty",        section: "transit", habitRange: null },
  { key: "koi_duration_err2",label:"Duration error (−)",   unit: "hours",min: -5,   max: 0,    step: 0.01,  default: -0.01,  hint: "Lower uncertainty (neg)",  section: "transit", habitRange: null },
  { key: "koi_depth",       label: "Transit depth",        unit: "ppm",  min: 1,    max: 50000,step: 1,     default: 84.0,   hint: "Starlight blocked",        section: "transit", habitRange: null },
  { key: "koi_depth_err1",  label: "Depth error (+)",      unit: "ppm",  min: 0,    max: 10000,step: 1,     default: 5.0,    hint: "Upper uncertainty",        section: "transit", habitRange: null },
  { key: "koi_depth_err2",  label: "Depth error (−)",      unit: "ppm",  min:-10000,max: 0,    step: 1,     default: -5.0,   hint: "Lower uncertainty (neg)",  section: "transit", habitRange: null },

  // ── Planet ────────────────────────────────────────────────────────────────
  { key: "koi_prad",      label: "Planet radius",          unit: "R⊕",  min: 0.3,  max: 20,   step: 0.1,   default: 1.0,    hint: "Habitable: 0.5 – 1.6",    section: "planet",  habitRange: [0.5, 1.6] },
  { key: "koi_prad_err1", label: "Radius error (+)",       unit: "R⊕",  min: 0,    max: 20,   step: 0.01,  default: 0.05,   hint: "Upper uncertainty",        section: "planet",  habitRange: null },
  { key: "koi_prad_err2", label: "Radius error (−)",       unit: "R⊕",  min: -20,  max: 0,    step: 0.01,  default: -0.05,  hint: "Lower uncertainty (neg)",  section: "planet",  habitRange: null },
  { key: "koi_teq",       label: "Equilibrium temp",       unit: "K",   min: 50,   max: 2500, step: 5,     default: 255.0,  hint: "Habitable: 200 – 320 K",  section: "planet",  habitRange: [200, 320] },
  { key: "koi_insol",     label: "Insolation flux",        unit: "S⊕",  min: 0.01, max: 100,  step: 0.01,  default: 1.0,    hint: "Habitable: 0.3 – 1.5",    section: "planet",  habitRange: [0.3, 1.5] },
  { key: "koi_insol_err1",label: "Insolation error (+)",   unit: "S⊕",  min: 0,    max: 200,  step: 0.01,  default: 0.05,   hint: "Upper uncertainty",        section: "planet",  habitRange: null },
  { key: "koi_insol_err2",label: "Insolation error (−)",   unit: "S⊕",  min: -200, max: 0,    step: 0.01,  default: -0.05,  hint: "Lower uncertainty (neg)",  section: "planet",  habitRange: null },

  // ── Star ──────────────────────────────────────────────────────────────────
  { key: "koi_steff",      label: "Stellar temperature",   unit: "K",     min: 2500, max: 8000, step: 50,   default: 5778.0, hint: "Sun = 5778 K",             section: "star",    habitRange: null },
  { key: "koi_steff_err1", label: "Teff error (+)",        unit: "K",     min: 0,    max: 1000, step: 1,    default: 100.0,  hint: "Upper uncertainty",        section: "star",    habitRange: null },
  { key: "koi_steff_err2", label: "Teff error (−)",        unit: "K",     min:-1000, max: 0,    step: 1,    default: -100.0, hint: "Lower uncertainty (neg)",  section: "star",    habitRange: null },
  { key: "koi_slogg",      label: "Stellar surface gravity",unit: "log g",min: 2.5,  max: 6.0,  step: 0.05, default: 4.44,   hint: "Sun = 4.44",               section: "star",    habitRange: null },
  { key: "koi_slogg_err1", label: "log g error (+)",       unit: "log g", min: 0,    max: 1,    step: 0.01, default: 0.05,   hint: "Upper uncertainty",        section: "star",    habitRange: null },
  { key: "koi_slogg_err2", label: "log g error (−)",       unit: "log g", min: -1,   max: 0,    step: 0.01, default: -0.05,  hint: "Lower uncertainty (neg)",  section: "star",    habitRange: null },
  { key: "koi_srad",       label: "Stellar radius",        unit: "R☉",   min: 0.1,  max: 5.0,  step: 0.05, default: 1.0,    hint: "Sun = 1.0",                section: "star",    habitRange: null },
  { key: "koi_srad_err1",  label: "Stellar radius error (+)",unit:"R☉",  min: 0,    max: 5,    step: 0.01, default: 0.05,   hint: "Upper uncertainty",        section: "star",    habitRange: null },
  { key: "koi_srad_err2",  label: "Stellar radius error (−)",unit:"R☉",  min: -5,   max: 0,    step: 0.01, default: -0.05,  hint: "Lower uncertainty (neg)",  section: "star",    habitRange: null },

  // ── Signal quality ────────────────────────────────────────────────────────
  { key: "koi_model_snr",    label: "Model SNR",           unit: "",     min: 0,    max: 5000, step: 1,    default: 50.0,   hint: "Higher = stronger signal",  section: "signal",  habitRange: null },
  { key: "koi_tce_plnt_num", label: "Planet number",       unit: "#",    min: 1,    max: 8,    step: 1,    default: 1,      hint: "Planet index in system",   section: "signal",  habitRange: null },

  // ── Sky position ──────────────────────────────────────────────────────────
  { key: "ra",         label: "Right ascension",           unit: "deg",  min: 0,    max: 360,  step: 0.1,  default: 291.0,  hint: "Sky position (longitude)", section: "sky",     habitRange: null },
  { key: "dec",        label: "Declination",               unit: "deg",  min: -90,  max: 90,   step: 0.1,  default: 44.5,   hint: "Sky position (latitude)",  section: "sky",     habitRange: null },
  { key: "koi_kepmag", label: "Kepler magnitude",          unit: "mag",  min: 7,    max: 18,   step: 0.1,  default: 14.0,   hint: "Brightness (lower = brighter)", section: "sky", habitRange: null },
  { key: "s_distance",  label: "Stellar distance",           unit: "pc",   min: 1,    max: 10000,step: 10,   default: 500.0,  hint: "Distance to host star (parsecs)", section: "sky", habitRange: null },
]

export const DEFAULTS = {
  ...Object.fromEntries(FIELDS.map((f) => [f.key, f.default])),
  // FP flags managed by FlagToggles, not in FIELDS
  koi_fpflag_nt: 0,
  koi_fpflag_ss: 0,
  koi_fpflag_co: 0,
  koi_fpflag_ec: 0,
}

export const PRESETS = {
  "Earth Twin": {
    koi_fpflag_nt:0, koi_fpflag_ss:0, koi_fpflag_co:0, koi_fpflag_ec:0,
    koi_period:365.0, koi_period_err1:0.001, koi_period_err2:-0.001,
    koi_time0bk:134.0, koi_time0bk_err1:0.001, koi_time0bk_err2:-0.001,
    koi_impact:0.30, koi_impact_err1:0.05, koi_impact_err2:-0.05,
    koi_duration:13.0, koi_duration_err1:0.01, koi_duration_err2:-0.01,
    koi_depth:84.0, koi_depth_err1:5.0, koi_depth_err2:-5.0,
    koi_prad:1.00, koi_prad_err1:0.05, koi_prad_err2:-0.05,
    koi_teq:255, koi_insol:1.00, koi_insol_err1:0.05, koi_insol_err2:-0.05,
    koi_model_snr:200, koi_tce_plnt_num:1,
    koi_steff:5778, koi_steff_err1:100, koi_steff_err2:-100,
    koi_slogg:4.44, koi_slogg_err1:0.05, koi_slogg_err2:-0.05,
    koi_srad:1.00, koi_srad_err1:0.05, koi_srad_err2:-0.05,
    ra:291.0, dec:44.5, koi_kepmag:14.0,
    s_distance:500.0,
  },
  "Kepler-442b": {
    koi_fpflag_nt:0, koi_fpflag_ss:0, koi_fpflag_co:0, koi_fpflag_ec:0,
    koi_period:112.3, koi_period_err1:0.002, koi_period_err2:-0.002,
    koi_time0bk:100.0, koi_time0bk_err1:0.002, koi_time0bk_err2:-0.002,
    koi_impact:0.25, koi_impact_err1:0.04, koi_impact_err2:-0.04,
    koi_duration:5.1, koi_duration_err1:0.05, koi_duration_err2:-0.05,
    koi_depth:610.0, koi_depth_err1:20.0, koi_depth_err2:-20.0,
    koi_prad:1.34, koi_prad_err1:0.12, koi_prad_err2:-0.12,
    koi_teq:233, koi_insol:0.70, koi_insol_err1:0.03, koi_insol_err2:-0.03,
    koi_model_snr:35, koi_tce_plnt_num:1,
    koi_steff:4402, koi_steff_err1:100, koi_steff_err2:-100,
    koi_slogg:4.60, koi_slogg_err1:0.06, koi_slogg_err2:-0.06,
    koi_srad:0.60, koi_srad_err1:0.06, koi_srad_err2:-0.06,
    ra:281.4, dec:39.0, koi_kepmag:14.9,
    s_distance:1200.0,
  },
  "Super Earth": {
    koi_fpflag_nt:0, koi_fpflag_ss:0, koi_fpflag_co:0, koi_fpflag_ec:0,
    koi_period:280.0, koi_period_err1:0.005, koi_period_err2:-0.005,
    koi_time0bk:120.0, koi_time0bk_err1:0.003, koi_time0bk_err2:-0.003,
    koi_impact:0.20, koi_impact_err1:0.03, koi_impact_err2:-0.03,
    koi_duration:8.0, koi_duration_err1:0.1, koi_duration_err2:-0.1,
    koi_depth:300.0, koi_depth_err1:15.0, koi_depth_err2:-15.0,
    koi_prad:1.50, koi_prad_err1:0.10, koi_prad_err2:-0.10,
    koi_teq:270, koi_insol:0.85, koi_insol_err1:0.04, koi_insol_err2:-0.04,
    koi_model_snr:80, koi_tce_plnt_num:1,
    koi_steff:5200, koi_steff_err1:120, koi_steff_err2:-120,
    koi_slogg:4.50, koi_slogg_err1:0.06, koi_slogg_err2:-0.06,
    koi_srad:0.90, koi_srad_err1:0.05, koi_srad_err2:-0.05,
    ra:285.0, dec:42.0, koi_kepmag:13.5,
    s_distance:800.0,
  },
  "Hot Jupiter": {
    koi_fpflag_nt:0, koi_fpflag_ss:0, koi_fpflag_co:0, koi_fpflag_ec:0,
    koi_period:3.0, koi_period_err1:0.0001, koi_period_err2:-0.0001,
    koi_time0bk:50.0, koi_time0bk_err1:0.001, koi_time0bk_err2:-0.001,
    koi_impact:0.10, koi_impact_err1:0.02, koi_impact_err2:-0.02,
    koi_duration:2.5, koi_duration_err1:0.05, koi_duration_err2:-0.05,
    koi_depth:15000.0, koi_depth_err1:200.0, koi_depth_err2:-200.0,
    koi_prad:11.2, koi_prad_err1:0.50, koi_prad_err2:-0.50,
    koi_teq:1600, koi_insol:450.0, koi_insol_err1:20.0, koi_insol_err2:-20.0,
    koi_model_snr:900, koi_tce_plnt_num:1,
    koi_steff:6100, koi_steff_err1:150, koi_steff_err2:-150,
    koi_slogg:4.20, koi_slogg_err1:0.07, koi_slogg_err2:-0.07,
    koi_srad:1.30, koi_srad_err1:0.08, koi_srad_err2:-0.08,
    ra:295.0, dec:40.0, koi_kepmag:12.8,
    s_distance:400.0,
  },
  "Stellar Mimic": {
  koi_fpflag_nt:1, koi_fpflag_ss:1, koi_fpflag_co:1, koi_fpflag_ec:0,
  koi_period:1.2, koi_period_err1:2.5, koi_period_err2:-2.5,
  koi_time0bk:800.0, koi_time0bk_err1:3.0, koi_time0bk_err2:-3.0,
  koi_impact:1.15, koi_impact_err1:0.8, koi_impact_err2:-0.8,
  koi_duration:0.2, koi_duration_err1:0.9, koi_duration_err2:-0.9,
  koi_depth:48000, koi_depth_err1:8000, koi_depth_err2:-8000,
  koi_prad:28.0, koi_prad_err1:9.0, koi_prad_err2:-9.0,
  koi_teq:2800, koi_insol:480, koi_insol_err1:90, koi_insol_err2:-90,
  koi_model_snr:3.2, koi_tce_plnt_num:7,
  koi_steff:3100, koi_steff_err1:400, koi_steff_err2:-400,
  koi_slogg:2.8, koi_slogg_err1:0.9, koi_slogg_err2:-0.9,
  koi_srad:8.5, koi_srad_err1:3.0, koi_srad_err2:-3.0,
  ra:45.0, dec:-20.0, koi_kepmag:16.8,
  s_distance:3500.0,
},
}

// Deterministic star positions
export const STARS = Array.from({ length: 200 }, (_, i) => ({
  id:    i,
  top:   ((i * 137.508) % 100).toFixed(2),
  left:  ((i * 97.31)   % 100).toFixed(2),
  size:  (((i * 31)  % 3) + 0.8).toFixed(1),
  delay: ((i * 0.23) % 5).toFixed(2),
  dur:   (2.5 + ((i * 0.19) % 3.5)).toFixed(1),
  lo:    (0.10 + ((i * 0.07) % 0.25)).toFixed(2),
  hi:    (0.40 + ((i * 0.13) % 0.55)).toFixed(2),
}))

export const SHOOTING_STARS = [
  { top: "10%", left: "18%", sd: "7s",   sa: "3s"  },
  { top: "32%", left: "68%", sd: "5.5s", sa: "13s" },
  { top: "58%", left: "38%", sd: "8s",   sa: "22s" },
]
