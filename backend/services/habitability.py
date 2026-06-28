"""
Stage-2 habitability service.
Feature dict is built to exactly match the 20 features in hab_features.pkl:
['P_RADIUS_ERROR_MAX', 'S_DEC', 'S_DISTANCE', 'P_HABZONE_CON', 'P_ESI',
 'koi_prad', 'P_MASS_EST', 'P_UPDATED', 'S_ALT_NAMES', 'S_RA_T', 'S_DEC_T',
 'S_CONSTELLATION_ABR', 'TEMP_IN_WATER_ZONE', 'FLUX_IN_HZ', 'ESI_ABOVE_06',
 'ESI_ABOVE_08', 'SOLAR_LIKE_STAR', 'PERIOD_EARTH_LIKE', 'koi_pmass',
 'LOG_S_LUMINOSITY']
"""
import numpy as np
import pandas as pd
from typing import Tuple

from backend.models.loader import registry
from backend.services.physics import physics_habitability


def _build_feature_dict(data: dict) -> dict:
    r   = data["koi_prad"]
    t   = data["koi_teq"]
    f   = data["koi_insol"]
    ts  = data["koi_steff"]
    p   = data["koi_period"]
    sr  = data["koi_srad"]

    # Derived quantities
    esi        = float(np.clip(
        1.0
        - abs(r - 1.0) / 1.5  * 0.40
        - abs(t - 255) / 2000 * 0.30
        - abs(f - 1.0) / 50   * 0.30,
        0.0, 1.0,
    ))
    mass       = 0.9718 * (r ** 3.58)          # estimated planet mass (M⊕)
    luminosity = (sr ** 2) * ((ts / 5778) ** 4) # stellar luminosity (L☉)

    # Sky coords — use actual values from input if present, else defaults
    s_dec      = data.get("dec",  0.0)
    s_ra_t     = data.get("ra",   0.0)
    s_dec_t    = data.get("dec",  0.0)

    return {
        # ── The exact 20 features hab_features.pkl needs ──────────────────────

        # P_RADIUS_ERROR_MAX: upper radius uncertainty — koi_prad_err1
        "P_RADIUS_ERROR_MAX":   data.get("koi_prad_err1", r * 0.05),

        # S_DEC: actual declination from KOI input
        "S_DEC":                s_dec,

        # S_DISTANCE: actual stellar distance from user input (parsecs)
        "S_DISTANCE":           data.get("s_distance", 500.0),

        # P_HABZONE_CON: conservative habitable zone (stricter flux bounds)
        "P_HABZONE_CON":        int(0.3 <= f <= 1.5),

        # P_ESI: Earth Similarity Index
        "P_ESI":                esi,

        # koi_prad: planet radius (R⊕) — raw KOI column
        "koi_prad":             r,

        # P_MASS_EST: estimated planet mass (M⊕) — same formula, different PHL column name
        "P_MASS_EST":           mass,

        # P_UPDATED: static ordinal — PHL uses a date string encoded as float;
        # use 0.0 (model learned a baseline, constant input won't mislead it)
        "P_UPDATED":            0.0,

        # S_ALT_NAMES: number of alternative names — always 0 at inference
        "S_ALT_NAMES":          0.0,

        # S_RA_T: topocentric right ascension — use RA from input
        "S_RA_T":               s_ra_t,

        # S_DEC_T: topocentric declination — use Dec from input
        "S_DEC_T":              s_dec_t,

        # S_CONSTELLATION_ABR: encoded constellation ID — 0 as neutral default
        "S_CONSTELLATION_ABR":  0.0,

        # Binary engineered flags
        "TEMP_IN_WATER_ZONE":   int(273 <= t <= 373),
        "FLUX_IN_HZ":           int(0.2 <= f <= 2.0),
        "ESI_ABOVE_06":         int(esi > 0.6),
        "ESI_ABOVE_08":         int(esi > 0.8),
        "SOLAR_LIKE_STAR":      int(5000 <= ts <= 7000),
        "PERIOD_EARTH_LIKE":    int(200  <= p <= 700),

        # koi_pmass: same mass value under KOI column name
        "koi_pmass":            mass,

        # LOG_S_LUMINOSITY: log1p of stellar luminosity
        "LOG_S_LUMINOSITY":     float(np.log1p(max(0.0, luminosity))),
    }


def run_habitability(data: dict) -> Tuple[float, str]:
    if registry.hab_model is None or registry.hab_features is None:
        return physics_habitability(data), "physics_heuristic"

    feature_dict = _build_feature_dict(data)
    features     = registry.hab_features  # exact 20-item list from pkl

    # Build DataFrame — any feature not in dict gets 0.0 (safe fallback)
    X = pd.DataFrame([{feat: feature_dict.get(feat, 0.0) for feat in features}])

    # Scale — hab_scaler was fitted on these same engineered features
    if registry.hab_scaler is not None:
        try:
            X_scaled = pd.DataFrame(
                registry.hab_scaler.transform(X),
                columns=features,
            )
        except Exception as exc:
            print(f"[habitability] scaler error — using unscaled: {exc}")
            X_scaled = X
    else:
        X_scaled = X

    prob = float(registry.hab_model.predict_proba(X_scaled.values)[0][1])
    return round(prob, 4), "XG_Boost"
