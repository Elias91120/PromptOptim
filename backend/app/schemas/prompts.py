from pydantic import BaseModel, ConfigDict, Field
from enum import Enum
from datetime import datetime
from typing import Literal


class ModelType(str, Enum):
    GPT_5 = "gpt_5"
    CLAUDE_OPUS = "claude_opus"
    GEMINI_3_PRO = "gemini_3_pro"
    MISTRAL_2 = "mistral_2"
    MIDJOURNEY_V6 = "midjourney_v6"


class PromptRequest(BaseModel):
    input_text: str = Field(..., min_length=1, max_length=4000)
    target_model: ModelType = ModelType.MISTRAL_2


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
