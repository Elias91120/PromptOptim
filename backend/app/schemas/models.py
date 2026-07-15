from typing import Literal

from pydantic import BaseModel


class SovereigntyInfo(BaseModel):
    score: int
    location: str
    company: str
    license: str
    cloud_act_risk: bool
    rgpd_compliant: bool


class GreenInfo(BaseModel):
    energy_per_1k_tokens_kwh: float
    carbon_intensity_gco2_kwh: float
    water_intensity_ml_kwh: float
    datacenter_location: str


class AIModelInfo(BaseModel):
    id: str
    name: str
    provider: str
    category: Literal["general", "code", "image"]
    description: str
    color: str
    sovereignty: SovereigntyInfo
    green: GreenInfo
