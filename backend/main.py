import os
import warnings
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import (
    DETECTION_MODEL_PATH, DETECTION_SCALER_PATH,
    HAB_MODEL_PATH, HAB_SCALER_PATH, HAB_IMPUTER_PATH, HAB_FEATURES_PATH,
)
from models.loader import registry
from routers import predict, health

warnings.filterwarnings("ignore")


@asynccontextmanager
async def lifespan(app: FastAPI):
    registry.load_all(
        detect_model_path=DETECTION_MODEL_PATH,
        detect_scaler_path=DETECTION_SCALER_PATH,
        hab_model_path=HAB_MODEL_PATH,
        hab_scaler_path=HAB_SCALER_PATH,
        hab_imputer_path=HAB_IMPUTER_PATH,
        hab_features_path=HAB_FEATURES_PATH,
    )
    yield


app = FastAPI(
    title="Exoplanet Detection & Habitability API",
    version="2.0.0",
    lifespan=lifespan,
)

origins = {
    "http://localhost:3000",
    "http://localhost:5173",
    "https://exoplanet-iota.vercel.app",
}

for env_name in ("FRONTEND_URL", "FRONTEND_URLS"):
    for origin in os.getenv(env_name, "").split(","):
        origin = origin.strip().rstrip("/")
        if origin:
            origins.add(origin)

app.add_middleware(
    CORSMiddleware,
    allow_origins=sorted(origins),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(health.router)
