import joblib
import os
from typing import Any, Optional


def _load(path: str, label: str) -> Optional[Any]:
    """Load a joblib artifact; return None and warn if missing."""
    if os.path.exists(path):
        obj = joblib.load(path)
        print(f"  ✓  Loaded: {label}  ({os.path.basename(path)})")
        return obj
    print(f"  ✗  Missing: {label}  ({path})  → fallback will be used")
    return None


class ModelRegistry:
    """
    Singleton that holds every ML artifact.
    Import the module-level `registry` instance everywhere.
    """

    def __init__(self):
        # Detection
        self.detect_model:  Optional[Any] = None
        self.detect_scaler: Optional[Any] = None

        # Habitability
        self.hab_model:    Optional[Any] = None
        self.hab_scaler:   Optional[Any] = None
        self.hab_imputer:  Optional[Any] = None   # loaded but NOT used in inference
        self.hab_features: Optional[list] = None  # list[str] from SelectKBest step

    def load_all(
        self,
        detect_model_path:  str,
        detect_scaler_path: str,
        hab_model_path:     str,
        hab_scaler_path:    str,
        hab_imputer_path:   str,
        hab_features_path:  str,
    ) -> None:
        print("\n── Loading model artifacts ──────────────────────────")

        # Try the primary detection model name; fall back to legacy name
        self.detect_model  = _load(detect_model_path,  "detection model")
        self.detect_scaler = _load(detect_scaler_path, "detection scaler")

        self.hab_model    = _load(hab_model_path,    "habitability model")
        self.hab_scaler   = _load(hab_scaler_path,   "habitability scaler")
        self.hab_imputer  = _load(hab_imputer_path,  "habitability imputer (unused at inference)")
        self.hab_features = _load(hab_features_path, "habitability feature list")

        if self.hab_features is not None:
            print(f"\n  Habitability model expects {len(self.hab_features)} features:")
            print(f"  {self.hab_features}")

        print("── Done loading ─────────────────────────────────────\n")


# Module-level singleton — import this everywhere
registry = ModelRegistry()
