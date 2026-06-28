"""
Stage-1 detection service.
Uses best_model.pkl (40-feature KOI model); falls back to physics heuristic.
"""
import numpy as np
import pandas as pd
from typing import Tuple

try:
    from config import DETECT_FEATURES
    from models.loader import registry
    from services.physics import physics_detection
except ModuleNotFoundError:
    from backend.config import DETECT_FEATURES
    from backend.models.loader import registry
    from backend.services.physics import physics_detection


def run_detection(data: dict) -> Tuple[float, str]:
    """
    Returns (probability, source_label).
    Builds a DataFrame with named columns so the scaler/model see
    the exact feature names they were trained on.
    """
    if registry.detect_model is None:
        return physics_detection(data), "physics_heuristic"

    # Build named DataFrame — preserves feature-name alignment with scaler
    X = pd.DataFrame([{f: data[f] for f in DETECT_FEATURES}])

    if registry.detect_scaler is not None:
        try:
            X = pd.DataFrame(
                registry.detect_scaler.transform(X),
                columns=DETECT_FEATURES,
            )
        except Exception as exc:
            print(f"[detection] scaler error — using raw features: {exc}")

    prob = float(registry.detect_model.predict_proba(X)[0][1])
    return round(prob, 4), "best_model (Gradient Boosting)"
