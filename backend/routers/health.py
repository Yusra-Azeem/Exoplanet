from fastapi import APIRouter
from backend.models.loader import registry
from backend.config import DETECT_FEATURES

router = APIRouter(tags=["health"])


@router.get("/health")
def health():
    return {
        "status":              "ok",
        "detection_model":     registry.detect_model  is not None,
        "detection_scaler":    registry.detect_scaler is not None,
        "habitability_model":  registry.hab_model     is not None,
        "hab_scaler":          registry.hab_scaler    is not None,
        "hab_features_count":  len(registry.hab_features) if registry.hab_features else 0,
    }


@router.get("/debug_features")
def debug_features():
    """Inspect the exact feature sets each model expects."""
    return {
        "detect_features":    DETECT_FEATURES,
        "hab_features":       registry.hab_features,
        "hab_features_count": len(registry.hab_features) if registry.hab_features else 0,
    }
