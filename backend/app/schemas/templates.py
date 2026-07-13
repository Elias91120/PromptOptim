from pydantic import BaseModel, ConfigDict, Field
from datetime import datetime
from app.schemas.prompts import ModelType


class TemplateCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: str | None = None
    template_text: str = Field(..., min_length=1, max_length=4000)
    target_model: ModelType = ModelType.MISTRAL_2
    category: str = "general"
    is_public: bool = False


class TemplateRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    template_text: str
    target_model: ModelType
    category: str
    is_public: bool
    is_mine: bool
    usage_count: int
    created_at: datetime
