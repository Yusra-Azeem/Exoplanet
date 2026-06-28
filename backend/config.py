import os
import glob

BASE_DIR   = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, "models")


def _find_model(preferred: str, pattern: str) -> str:
    if os.path.exists(preferred):
        return preferred
    matches = glob.glob(os.path.join(MODELS_DIR, pattern))
    if matches:
        print(f"  ⚠  '{os.path.basename(preferred)}' not found — using '{os.path.basename(matches[0])}'")
        return matches[0]
    return preferred  # loader will emit ✗ warning

# Detection: best_model.pkl + scaler.pkl
DETECTION_MODEL_PATH  = _find_model(os.path.join(MODELS_DIR, "best_model.pkl"),         "best_model*.pkl")
DETECTION_SCALER_PATH = _find_model(os.path.join(MODELS_DIR, "scaler.pkl"),             "scaler.pkl")

# Habitability (unchanged)
HAB_MODEL_PATH    = _find_model(os.path.join(MODELS_DIR, "habitability_model.pkl"),  "habitability*.pkl")
HAB_SCALER_PATH   = _find_model(os.path.join(MODELS_DIR, "hab_scaler.pkl"),          "hab_scaler*.pkl")
HAB_IMPUTER_PATH  = _find_model(os.path.join(MODELS_DIR, "hab_imputer.pkl"),         "hab_imputer*.pkl")
HAB_FEATURES_PATH = _find_model(os.path.join(MODELS_DIR, "hab_features.pkl"),        "hab_features*.pkl")

# All 40 features the detection model was trained on — exact order matters
DETECT_FEATURES = [
    "koi_fpflag_nt", "koi_fpflag_ss", "koi_fpflag_co", "koi_fpflag_ec",
    "koi_period",    "koi_period_err1",  "koi_period_err2",
    "koi_time0bk",   "koi_time0bk_err1", "koi_time0bk_err2",
    "koi_impact",    "koi_impact_err1",  "koi_impact_err2",
    "koi_duration",  "koi_duration_err1","koi_duration_err2",
    "koi_depth",     "koi_depth_err1",   "koi_depth_err2",
    "koi_prad",      "koi_prad_err1",    "koi_prad_err2",
    "koi_teq",
    "koi_insol",     "koi_insol_err1",   "koi_insol_err2",
    "koi_model_snr", "koi_tce_plnt_num",
    "koi_steff",     "koi_steff_err1",   "koi_steff_err2",
    "koi_slogg",     "koi_slogg_err1",   "koi_slogg_err2",
    "koi_srad",      "koi_srad_err1",    "koi_srad_err2",
    "ra", "dec", "koi_kepmag",
]
