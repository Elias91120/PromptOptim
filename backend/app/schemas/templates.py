from pydantic import BaseModel, ConfigDict, Field, field_validator
from datetime import datetime

from app.data.models_registry import DEFAULT_MODEL_ID, is_valid_model, resolve_model_id


class TemplateCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    template_text: str = Field(..., min_length=1, max_length=4000)
    target_model: str = DEFAULT_MODEL_ID
    category: str = "general"
    is_public: bool = False

    @field_validator("target_model")
    @classmethod
    def validate_target_model(cls, value: str) -> str:
        if not is_valid_model(value):
            raise ValueError(f"Unknown target model: {value}")
        return resolve_model_id(value)


class TemplateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    template_text: str
    target_model: str
    category: str
    is_public: bool
    is_mine: bool
    usage_count: int
    created_at: datetime
