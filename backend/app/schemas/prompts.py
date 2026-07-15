from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime
from typing import Literal

from app.data.models_registry import DEFAULT_MODEL_ID, is_valid_model, resolve_model_id


class PromptRequest(BaseModel):
    input_text: str = Field(..., min_length=1, max_length=4000)
    target_model: str = DEFAULT_MODEL_ID

    @field_validator("target_model")
    @classmethod
    def validate_target_model(cls, value: str) -> str:
        if not is_valid_model(value):
            raise ValueError(f"Unknown target model: {value}")
        return resolve_model_id(value)


class Equivalences(BaseModel):
    smartphone_charges: float
    km_electric_car: float
    hours_led_bulb: float


class GreenData(BaseModel):
    tokens_saved: int
    energy_saved_kwh: float
    co2_saved_g: float
    water_saved_ml: float
    eco_score: Literal["A", "B", "C", "D", "E"]
    equivalences: Equivalences
    methodology_source: str
    timestamp_factor: float


class SovereigntyData(BaseModel):
    score: int = Field(..., ge=0, le=100)
    location: str
    company: str
    license: str
    cloud_act_risk: bool


class PromptResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    original_intent: str
    optimized_prompt: str
    target_model: str
    green_data: GreenData | None = None
    sovereignty_data: SovereigntyData | None = None
    ai_reasoning: str | None = None


class PromptHistoryRead(PromptResponse):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class UserStatsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    total_prompts: int
    total_tokens_saved: int
    total_co2_saved: float
    model_usage: dict[str, int]
