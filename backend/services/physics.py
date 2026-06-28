"""
Physics-based fallback functions and habitability-zone checks.
Used when ML models are unavailable (cold start / missing files).
"""
from typing import Dict, Any


# ── Habitability-zone thresholds ─────────────────────────────────────────────

HZ_CHECKS_CONFIG = {
    "radius":  dict(label="Planet radius",           unit="R⊕",    lo=0.5,  hi=1.6,   field="koi_prad",  range="0.5 – 1.6"),
    "temp":    dict(label="Equilibrium temperature", unit="K",     lo=200,  hi=320,   field="koi_teq",   range="200 – 320"),
    "flux":    dict(label="Insolation flux",         unit="S⊕",    lo=0.3,  hi=1.5,   field="koi_insol", range="0.3 – 1.5"),
    "star":    dict(label="Stellar temperature",     unit="K",     lo=3800, hi=7200,  field="koi_steff", range="3800 – 7200"),
    "period":  dict(label="Orbital period",          unit="days",  lo=200,  hi=700,   field="koi_period",range="200 – 700"),
    "gravity": dict(label="Stellar gravity",         unit="log g", lo=4.0,  hi=4.9,   field="koi_slogg", range="4.0 – 4.9"),
}


def hz_checks(data: dict) -> Dict[str, Any]:
    """Return per-parameter pass/fail for the classical habitability zone."""
    result = {}
    for key, cfg in HZ_CHECKS_CONFIG.items():
        val = data[cfg["field"]]
        result[key] = {
            "label": cfg["label"],
            "value": val,
            "unit":  cfg["unit"],
            "pass":  cfg["lo"] <= val <= cfg["hi"],
            "range": cfg["range"],
        }
    return result


# ── Fallback detection heuristic ─────────────────────────────────────────────

def physics_detection(data: dict) -> float:
    """
    Rule-based detection probability when the ML model is absent.
    Uses false-positive flags, SNR, and physical plausibility.
    Returns a value in [0, 1].
    """
    fp_flags = (
        data.get("koi_fpflag_nt", 0) +
        data.get("koi_fpflag_ss", 0) +
        data.get("koi_fpflag_co", 0) +
        data.get("koi_fpflag_ec", 0)
    )
    if fp_flags >= 2: return 0.05
    if fp_flags == 1: return 0.20

    score = 0.40
    if data.get("koi_model_snr", 0)       > 10:  score += 0.20
    if data.get("koi_prad",      99)      < 10:  score += 0.15
    if data.get("koi_teq",       9999)    < 2000: score += 0.10
    if data.get("koi_insol",     999)     < 50:  score += 0.08
    if 0.0 < data.get("koi_impact", 1)   < 1.0: score += 0.07
    return round(min(0.95, score), 4)


# ── Fallback habitability heuristic ──────────────────────────────────────────

def physics_habitability(data: dict) -> float:
    """
    Simple rule-based habitability score when the ML model is absent.
    Returns a value in [0, 1].
    """
    score = 0.0
    r, t, f, ts = (
        data["koi_prad"], data["koi_teq"],
        data["koi_insol"], data["koi_steff"],
    )
    if   0.5 <= r <= 1.6:  score += 0.30
    elif r    <= 2.5:       score += 0.10
    if   200 <= t <= 320:   score += 0.30
    elif 150 <= t <= 380:   score += 0.10
    if   0.3 <= f <= 1.5:   score += 0.25
    elif 0.1 <= f <= 2.5:   score += 0.10
    if 3800 <= ts <= 7200:  score += 0.15
    return round(min(0.97, score), 4)
