from fastapi import APIRouter
from app.schemas.models import AIModelInfo, SovereigntyInfo, GreenInfo

router = APIRouter()

_MODELS_DATA = [
    AIModelInfo(
        id="mistral_2", name="Mistral Large 2", provider="Mistral AI",
        sovereignty=SovereigntyInfo(
            score=100, location="France (UE)", company="Mistral AI (Francaise)",
            license="Open Weights / Apache", cloud_act_risk=False, rgpd_compliant=True
        ),
        green=GreenInfo(
            energy_per_1k_tokens_kwh=0.002, carbon_intensity_gco2_kwh=50,
            water_intensity_ml_kwh=500, datacenter_location="France"
        ),
    ),
    AIModelInfo(
        id="gpt_5", name="GPT-5", provider="OpenAI",
        sovereignty=SovereigntyInfo(
            score=0, location="USA (Virginia)", company="OpenAI (USA)",
            license="Proprietaire", cloud_act_risk=True, rgpd_compliant=False
        ),
        green=GreenInfo(
            energy_per_1k_tokens_kwh=0.008, carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800, datacenter_location="USA"
        ),
    ),
    AIModelInfo(
        id="claude_opus", name="Claude Opus", provider="Anthropic",
        sovereignty=SovereigntyInfo(
            score=0, location="USA (Oregon)", company="Anthropic (USA)",
            license="Proprietaire", cloud_act_risk=True, rgpd_compliant=False
        ),
        green=GreenInfo(
            energy_per_1k_tokens_kwh=0.008, carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800, datacenter_location="USA"
        ),
    ),
    AIModelInfo(
        id="gemini_3_pro", name="Gemini 3 Pro", provider="Google",
        sovereignty=SovereigntyInfo(
            score=0, location="USA (Iowa)", company="Google (USA)",
            license="Proprietaire", cloud_act_risk=True, rgpd_compliant=False
        ),
        green=GreenInfo(
            energy_per_1k_tokens_kwh=0.006, carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800, datacenter_location="USA"
        ),
    ),
    AIModelInfo(
        id="midjourney_v6", name="Midjourney V6", provider="Midjourney Inc",
        sovereignty=SovereigntyInfo(
            score=0, location="USA", company="Midjourney Inc (USA)",
            license="Proprietaire", cloud_act_risk=True, rgpd_compliant=False
        ),
        green=GreenInfo(
            energy_per_1k_tokens_kwh=0.05, carbon_intensity_gco2_kwh=380,
            water_intensity_ml_kwh=1800, datacenter_location="USA"
        ),
    ),
]


@router.get("/models", response_model=list[AIModelInfo])
async def list_models():
    """List all supported AI models with sovereignty and green impact data. No auth required."""
    return _MODELS_DATA
