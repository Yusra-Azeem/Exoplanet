"""
Entry point: python -m uvicorn backend.main:app --reload
               OR: uvicorn backend.main:app --host 0.0.0.0 --port $PORT
"""
import warnings
warnings.filterwarnings("ignore")  # suppress sklearn version warnings

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.config import (
    DETECTION_MODEL_PATH, DETECTION_SCALER_PATH,
    HAB_MODEL_PATH, HAB_SCALER_PATH, HAB_IMPUTER_PATH, HAB_FEATURES_PATH,
)
from backend.models.loader import registry
from backend.routers import predict, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load all model artifacts exactly once on startup."""
    registry.load_all(
        detect_model_path  = DETECTION_MODEL_PATH,
        detect_scaler_path = DETECTION_SCALER_PATH,
        hab_model_path     = HAB_MODEL_PATH,
        hab_scaler_path    = HAB_SCALER_PATH,
        hab_imputer_path   = HAB_IMPUTER_PATH,
        hab_features_path  = HAB_FEATURES_PATH,
    )
    yield
    # (cleanup on shutdown goes here if ever needed)


app = FastAPI(
    title="Exoplanet Detection & Habitability API",
    version="2.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # restrict to your Vercel domain in production
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(health.router)
