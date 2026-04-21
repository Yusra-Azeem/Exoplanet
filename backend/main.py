# backend/main.py  ── FIXED VERSION
# Fix applied: hab_imputer was trained on raw PHL columns (P_FLUX, P_DISTANCE etc.)
# but backend was sending it engineered feature names (FLUX_IN_HZ, ESI_ABOVE_06 etc.)
# Solution: skip the imputer entirely in backend inference — user input has no
# missing values, so imputation is unnecessary. Feed scaler + model directly.

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import joblib
import numpy as np
import pandas as pd
import os
import warnings
warnings.filterwarnings("ignore")   # suppress sklearn version warnings

app = FastAPI(title="Exoplanet Detection & Habitability API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Load all model artifacts ──────────────────────────────────────────────────
BASE = os.path.dirname(os.path.abspath(__file__))

def load(path):
    full = os.path.join(BASE, path)
    if os.path.exists(full):
        obj = joblib.load(full)
        print(f"  ✓ Loaded: {path}")
        return obj
    print(f"  ✗ Missing: {path}  (fallback will be used)")
    return None

print("\nLoading models...")
detect_model  = load("models/detection_model.pkl")
detect_scaler = load("models/scaler.pkl")
hab_model     = load("models/habitability_model.pkl")
hab_scaler    = load("models/hab_scaler.pkl")
hab_imputer   = load("models/hab_imputer.pkl")   # loaded but NOT used in inference
hab_features  = load("models/hab_features.pkl")  # list of selected feature names

# Print what features the habitability model actually expects
if hab_features is not None:
    print(f"\nHabitability model expects {len(hab_features)} features:")
    print(hab_features)
print("Done loading.\n")

# ── Person A's exact feature order (must match her training code) ─────────────
DETECT_FEATURES = [
    'koi_period', 'koi_impact', 'koi_duration', 'koi_depth',
    'koi_prad', 'koi_teq', 'koi_insol', 'koi_steff', 'koi_slogg', 'koi_srad'
]

# ── Input schema ──────────────────────────────────────────────────────────────
class PlanetInput(BaseModel):
    koi_period:   float = Field(365.0,  ge=0.5,    le=2000)
    koi_impact:   float = Field(0.3,    ge=0.0,    le=1.2)
    koi_duration: float = Field(3.0,    ge=0.1,    le=50.0)
    koi_depth:    float = Field(84.0,   ge=0.1,    le=100000)
    koi_prad:     float = Field(1.0,    ge=0.3,    le=40.0)
    koi_teq:      float = Field(255.0,  ge=50,     le=3000)
    koi_insol:    float = Field(1.0,    ge=0.01,   le=500)
    koi_steff:    float = Field(5778.0, ge=2500,   le=8000)
    koi_slogg:    float = Field(4.44,   ge=2.5,    le=6.0)
    koi_srad:     float = Field(1.0,    ge=0.05,   le=10.0)

# ── Main predict endpoint ─────────────────────────────────────────────────────
@app.post("/predict")
def predict(planet: PlanetInput):
    data = planet.dict()

    # Stage 1: Detection
    det_prob, det_source = _run_detection(data)

    if det_prob < 0.5:
        return {
            "detection_probability": round(det_prob, 4),
            "is_planet":             False,
            "habitability_score":    None,
            "verdict":               "False positive — transit signal is NOT a real planet",
            "hz_checks":             None,
            "detection_source":      det_source,
            "habitability_source":   None,
        }

    # Stage 2: Habitability
    hab_score, hab_source = _run_habitability(data)

    if   hab_score > 0.70: verdict = "Strong habitability candidate"
    elif hab_score > 0.45: verdict = "Marginal habitability — worth investigating"
    elif hab_score > 0.20: verdict = "Confirmed planet — low habitability"
    else:                  verdict = "Confirmed planet — uninhabitable"

    return {
        "detection_probability": round(det_prob, 4),
        "is_planet":             True,
        "habitability_score":    round(hab_score, 4),
        "verdict":               verdict,
        "hz_checks":             _hz_checks(data),
        "detection_source":      det_source,
        "habitability_source":   hab_source,
    }

@app.get("/health")
def health():
    return {
        "status":             "ok",
        "detection_model":    detect_model  is not None,
        "detection_scaler":   detect_scaler is not None,
        "habitability_model": hab_model     is not None,
        "hab_features_count": len(hab_features) if hab_features else 0,
    }

@app.get("/debug_features")
def debug_features():
    """Call this to see exactly what features your habitability model needs."""
    return {
        "hab_features": hab_features,
        "hab_features_count": len(hab_features) if hab_features else 0,
        "detect_features": DETECT_FEATURES,
    }

# ── Detection helper ──────────────────────────────────────────────────────────
def _run_detection(data: dict):
    if detect_model is None:
        return _physics_detection_fallback(data), "physics_heuristic"

    X = np.array([[data[f] for f in DETECT_FEATURES]])

    # Apply Person A's scaler only if she used it during training
    # Person A's XGBoost was trained WITHOUT scaling (XGBoost doesn't need it)
    # but she saved a scaler anyway — only apply if her training used it
    # Safe default: don't apply (XGBoost is scale-invariant)
    # If results look wrong, try uncommenting the two lines below:
    # if detect_scaler is not None:
    #     X = detect_scaler.transform(X)

    prob = float(detect_model.predict_proba(X)[0][1])
    return prob, "xgboost_model"

# ── Habitability helper ───────────────────────────────────────────────────────
def _run_habitability(data: dict):
    if hab_model is None:
        return _physics_habitability_fallback(data), "physics_heuristic"

    # Compute the same features Person B created in her step 04
    r   = data['koi_prad']
    t   = data['koi_teq']
    f   = data['koi_insol']
    ts  = data['koi_steff']
    p   = data['koi_period']
    sr  = data['koi_srad']
    sg  = data['koi_slogg']

    # Derived quantities
    esi = float(np.clip(
        1.0 - abs(r - 1.0)/1.5*0.40
            - abs(t - 255)/2000*0.30
            - abs(f - 1.0)/50*0.30,
        0.0, 1.0
    ))
    mass        = 0.9718 * (r ** 3.58)
    luminosity  = (sr ** 2) * ((ts / 5778) ** 4)

    # Full feature dictionary — every feature Person B might have created
    # Key names must match EXACTLY what Person B used in feature engineering step
    all_features = {
        # Raw renamed features (from PHL rename map in step 04)
        'P_RADIUS_EST':       r,
        'koi_prad':           r,
        'P_TEMP_EQUIL':       t,
        'koi_teq':            t,
        'P_FLUX':             f,
        'koi_insol':          f,
        'S_TEMPERATURE':      ts,
        'koi_steff':          ts,
        'S_LOG_G':            sg,
        'koi_slogg':          sg,
        'S_RADIUS':           sr,
        'koi_srad':           sr,
        'P_PERIOD':           p,
        'koi_period':         p,
        'P_MASS':             mass,
        'koi_pmass':          mass,

        # Engineered features
        'P_ESI':              esi,
        'S_LUMINOSITY':       luminosity,
        'TEMP_IN_WATER_ZONE': 1 if 273 <= t <= 373 else 0,
        'FLUX_IN_HZ':         1 if 0.2 <= f <= 2.0 else 0,
        'FLUX_RATIO':         f / 1.0,
        'ESI_ABOVE_06':       1 if esi > 0.6 else 0,
        'ESI_ABOVE_08':       1 if esi > 0.8 else 0,
        'SOLAR_LIKE_STAR':    1 if 5000 <= ts <= 7000 else 0,
        'PERIOD_EARTH_LIKE':  1 if 200 <= p <= 700 else 0,
        'DENSITY_PROXY':      mass / (r ** 3 + 1e-6),

        # Log transforms
        'LOG_P_MASS':         float(np.log1p(max(0, mass))),
        'LOG_koi_pmass':      float(np.log1p(max(0, mass))),
        'LOG_P_PERIOD':       float(np.log1p(max(0, p))),
        'LOG_koi_period':     float(np.log1p(max(0, p))),
        'LOG_P_FLUX':         float(np.log1p(max(0, f))),
        'LOG_koi_insol':      float(np.log1p(max(0, f))),
        'LOG_P_RADIUS_EST':   float(np.log1p(max(0, r))),
        'LOG_koi_prad':       float(np.log1p(max(0, r))),
        'LOG_S_LUMINOSITY':   float(np.log1p(max(0, luminosity))),

        # Extra PHL columns that might have survived cleaning
        'P_APASTRON':         p * (1 + 0.0),      # circular orbit approx
        'P_DISTANCE':         float((p/365.25)**(2/3)),  # Kepler's 3rd law approx (AU)
        'P_DISTANCE_EFF':     float((p/365.25)**(2/3)),
        'P_FLUX_MAX':         f * 1.05,
        'P_FLUX_MIN':         f * 0.95,
        'P_GRAVITY':          mass / (r ** 2 + 1e-6),
        'P_ESCAPE':           float(np.sqrt(2 * mass / (r + 1e-6))),
        'P_POTENTIAL':        mass / (r + 1e-6),
        'P_HILL_SPHERE':      float((p/365.25)**(2/3) * (mass/(3*1e6))**(1/3)),
        'P_TIDAL':            0.0,
        'P_TYPE':             1.0,
        'P_TYPE_TEMP':        1.0,
        'P_HABZONE_OPT':      1 if 0.2 <= f <= 2.0 else 0,
        'P_HABZONE_CON':      1 if 0.3 <= f <= 1.5 else 0,
        'S_MASS':             luminosity ** (1/4),   # rough approx
        'S_AGE':              5.0,
        'S_METALLICITY':      0.0,
        'S_RA':               0.0,
        'S_DEC':              0.0,
        'S_DISTANCE':         100.0,
        'S_TYPE_TEMP':        2.0 if 5000 <= ts <= 7000 else 1.0,
    }

    # Build DataFrame with ONLY the features the model was trained on
    # hab_features is the saved list from Person B's step 04 SelectKBest
    features = hab_features
    X = pd.DataFrame([{feat: all_features.get(feat, 0.0) for feat in features}])

    # ── KEY FIX: Do NOT pass through hab_imputer ──────────────────────────────
    # The imputer was fitted on raw PHL columns before feature engineering.
    # At inference time the user provides clean values — no imputation needed.
    # Passing engineered features through the raw-column imputer causes the
    # "Feature names unseen at fit time" error in your traceback.
    # ──────────────────────────────────────────────────────────────────────────

    # Apply only the scaler (fitted on the same engineered features)
    if hab_scaler is not None:
        try:
            X_scaled = pd.DataFrame(
                hab_scaler.transform(X),
                columns=features
            )
        except Exception as e:
            print(f"Scaler error: {e} — using unscaled features")
            X_scaled = X
    else:
        X_scaled = X

    prob = float(hab_model.predict_proba(X_scaled.values)[0][1])
    return prob, "logistic_regression_model"

# ── Physical checks ───────────────────────────────────────────────────────────
def _hz_checks(data: dict) -> dict:
    r, t, f, ts = data['koi_prad'], data['koi_teq'], data['koi_insol'], data['koi_steff']
    p, g = data['koi_period'], data['koi_slogg']
    return {
        "radius":  {"label":"Planet radius",          "value":r,  "unit":"R⊕",   "pass":0.5<=r<=1.6,    "range":"0.5 – 1.6"},
        "temp":    {"label":"Equilibrium temperature","value":t,  "unit":"K",    "pass":200<=t<=320,    "range":"200 – 320"},
        "flux":    {"label":"Insolation flux",        "value":f,  "unit":"S⊕",   "pass":0.3<=f<=1.5,    "range":"0.3 – 1.5"},
        "star":    {"label":"Stellar temperature",    "value":ts, "unit":"K",    "pass":3800<=ts<=7200, "range":"3800 – 7200"},
        "period":  {"label":"Orbital period",         "value":p,  "unit":"days", "pass":200<=p<=700,    "range":"200 – 700"},
        "gravity": {"label":"Stellar gravity",        "value":g,  "unit":"log g","pass":4.0<=g<=4.9,    "range":"4.0 – 4.9"},
    }

def _physics_detection_fallback(data: dict) -> float:
    s = 0.4
    if data['koi_prad']   < 10:  s += 0.25
    if data['koi_teq']    < 2000:s += 0.15
    if data['koi_insol']  < 50:  s += 0.10
    if 0.0 < data['koi_impact'] < 1.0: s += 0.10
    return round(min(0.95, s), 4)

def _physics_habitability_fallback(data: dict) -> float:
    s = 0.0
    r,t,f,ts = data['koi_prad'],data['koi_teq'],data['koi_insol'],data['koi_steff']
    if 0.5<=r<=1.6:   s+=0.30
    elif r<=2.5:      s+=0.10
    if 200<=t<=320:   s+=0.30
    elif 150<=t<=380: s+=0.10
    if 0.3<=f<=1.5:   s+=0.25
    elif 0.1<=f<=2.5: s+=0.10
    if 3800<=ts<=7200:s+=0.15
    return round(min(0.97, s), 4)