from pydantic import BaseModel, Field
from typing import Optional, Dict, Any


class PlanetInput(BaseModel):
    # ── False-positive flags (0 = clean, 1 = flagged) ─────────────────────────
    koi_fpflag_nt:  float = Field(0.0, ge=0, le=1,      description="Not transit-like flag")
    koi_fpflag_ss:  float = Field(0.0, ge=0, le=1,      description="Stellar eclipse flag")
    koi_fpflag_co:  float = Field(0.0, ge=0, le=1,      description="Centroid offset flag")
    koi_fpflag_ec:  float = Field(0.0, ge=0, le=1,      description="Ephemeris contamination flag")

    # ── Orbital period ─────────────────────────────────────────────────────────
    koi_period:      float = Field(365.0,  ge=0.5,  le=2000,   description="Orbital period (days)")
    koi_period_err1: float = Field(0.001,  ge=0,    le=100,    description="Period upper error")
    koi_period_err2: float = Field(-0.001, le=0,    ge=-100,   description="Period lower error")

    # ── Transit epoch ──────────────────────────────────────────────────────────
    koi_time0bk:      float = Field(134.0,  ge=0,    le=2000,   description="Transit epoch (BKJD)")
    koi_time0bk_err1: float = Field(0.001,  ge=0,    le=10,     description="Epoch upper error")
    koi_time0bk_err2: float = Field(-0.001, le=0,    ge=-10,    description="Epoch lower error")

    # ── Transit shape ──────────────────────────────────────────────────────────
    koi_impact:      float = Field(0.3,   ge=0.0,  le=1.2,    description="Impact parameter")
    koi_impact_err1: float = Field(0.05,  ge=0,    le=2,      description="Impact upper error")
    koi_impact_err2: float = Field(-0.05, le=0,    ge=-2,     description="Impact lower error")

    koi_duration:      float = Field(3.0,   ge=0.1,  le=50.0,   description="Transit duration (hours)")
    koi_duration_err1: float = Field(0.01,  ge=0,    le=5,      description="Duration upper error")
    koi_duration_err2: float = Field(-0.01, le=0,    ge=-5,     description="Duration lower error")

    koi_depth:      float = Field(84.0,   ge=0.1,  le=100000, description="Transit depth (ppm)")
    koi_depth_err1: float = Field(5.0,    ge=0,    le=10000,  description="Depth upper error")
    koi_depth_err2: float = Field(-5.0,   le=0,    ge=-10000, description="Depth lower error")

    # ── Planet ─────────────────────────────────────────────────────────────────
    koi_prad:      float = Field(1.0,   ge=0.3,  le=40.0,   description="Planet radius (R⊕)")
    koi_prad_err1: float = Field(0.05,  ge=0,    le=20,     description="Radius upper error")
    koi_prad_err2: float = Field(-0.05, le=0,    ge=-20,    description="Radius lower error")

    koi_teq:  float = Field(255.0,  ge=50,   le=3000,   description="Equilibrium temperature (K)")

    koi_insol:      float = Field(1.0,   ge=0.01, le=500,    description="Insolation flux (S⊕)")
    koi_insol_err1: float = Field(0.05,  ge=0,    le=200,    description="Insolation upper error")
    koi_insol_err2: float = Field(-0.05, le=0,    ge=-200,   description="Insolation lower error")

    # ── Signal quality ─────────────────────────────────────────────────────────
    koi_model_snr:    float = Field(50.0, ge=0,    le=10000,  description="Model signal-to-noise ratio")
    koi_tce_plnt_num: float = Field(1.0,  ge=1,    le=10,     description="Planet number in system")

    # ── Host star ──────────────────────────────────────────────────────────────
    koi_steff:      float = Field(5778.0, ge=2500, le=8000,   description="Stellar temperature (K)")
    koi_steff_err1: float = Field(100.0,  ge=0,    le=1000,   description="Teff upper error")
    koi_steff_err2: float = Field(-100.0, le=0,    ge=-1000,  description="Teff lower error")

    koi_slogg:      float = Field(4.44,  ge=2.5,  le=6.0,    description="Stellar surface gravity (log g)")
    koi_slogg_err1: float = Field(0.05,  ge=0,    le=1,      description="log g upper error")
    koi_slogg_err2: float = Field(-0.05, le=0,    ge=-1,     description="log g lower error")

    koi_srad:      float = Field(1.0,   ge=0.05, le=10.0,   description="Stellar radius (R☉)")
    koi_srad_err1: float = Field(0.05,  ge=0,    le=5,      description="Stellar radius upper error")
    koi_srad_err2: float = Field(-0.05, le=0,    ge=-5,     description="Stellar radius lower error")

    # ── Sky position & brightness ──────────────────────────────────────────────
    ra:         float = Field(291.0,  ge=0,    le=360,    description="Right ascension (deg)")
    dec:        float = Field(44.5,   ge=-90,  le=90,     description="Declination (deg)")
    koi_kepmag: float = Field(14.0,   ge=7,    le=18,     description="Kepler magnitude")
    s_distance: float = Field(500.0,  ge=1,    le=10000,  description="Stellar distance (parsecs)")

    model_config = {"json_schema_extra": {"example": {
        "koi_fpflag_nt": 0, "koi_fpflag_ss": 0, "koi_fpflag_co": 0, "koi_fpflag_ec": 0,
        "koi_period": 365.0, "koi_period_err1": 0.001, "koi_period_err2": -0.001,
        "koi_time0bk": 134.0, "koi_time0bk_err1": 0.001, "koi_time0bk_err2": -0.001,
        "koi_impact": 0.3, "koi_impact_err1": 0.05, "koi_impact_err2": -0.05,
        "koi_duration": 13.0, "koi_duration_err1": 0.01, "koi_duration_err2": -0.01,
        "koi_depth": 84.0, "koi_depth_err1": 5.0, "koi_depth_err2": -5.0,
        "koi_prad": 1.0, "koi_prad_err1": 0.05, "koi_prad_err2": -0.05,
        "koi_teq": 255.0,
        "koi_insol": 1.0, "koi_insol_err1": 0.05, "koi_insol_err2": -0.05,
        "koi_model_snr": 50.0, "koi_tce_plnt_num": 1.0,
        "koi_steff": 5778.0, "koi_steff_err1": 100.0, "koi_steff_err2": -100.0,
        "koi_slogg": 4.44, "koi_slogg_err1": 0.05, "koi_slogg_err2": -0.05,
        "koi_srad": 1.0, "koi_srad_err1": 0.05, "koi_srad_err2": -0.05,
        "ra": 291.0, "dec": 44.5, "koi_kepmag": 14.0, "s_distance": 500.0,
    }}}


class PredictResponse(BaseModel):
    detection_probability: float
    is_planet:             bool
    habitability_score:    Optional[float]
    verdict:               str
    hz_checks:             Optional[Dict[str, Any]]
    detection_source:      str
    habitability_source:   Optional[str]

    model_config = {"populate_by_name": True}
