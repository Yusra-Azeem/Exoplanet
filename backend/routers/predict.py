from fastapi import APIRouter
from schemas import PlanetInput, PredictResponse
from services.detection import run_detection
from services.habitability import run_habitability
from services.physics import hz_checks

router = APIRouter(prefix="/predict", tags=["predict"])


def _verdict(hab_score: float) -> str:
    if   hab_score > 0.70: return "Strong habitability candidate"
    elif hab_score > 0.45: return "Marginal habitability — worth investigating"
    elif hab_score > 0.20: return "Confirmed planet — low habitability"
    else:                  return "Confirmed planet — uninhabitable"


@router.post("", response_model=PredictResponse)
def predict(planet: PlanetInput):
    data = planet.model_dump()

    # ── Stage 1: Detection ────────────────────────────────────────────────────
    det_prob, det_source = run_detection(data)

    if det_prob < 0.5:
        return PredictResponse(
            detection_probability=det_prob,
            is_planet=False,
            habitability_score=None,
            verdict="False positive — transit signal is NOT a real planet",
            hz_checks=None,
            detection_source=det_source,
            habitability_source=None,
        )

    # ── Stage 2: Habitability ─────────────────────────────────────────────────
    hab_score, hab_source = run_habitability(data)

    return PredictResponse(
        detection_probability=det_prob,
        is_planet=True,
        habitability_score=hab_score,
        verdict=_verdict(hab_score),
        hz_checks=hz_checks(data),
        detection_source=det_source,
        habitability_source=hab_source,
    )
