from fastapi import APIRouter

from app.data.models_registry import list_models
from app.schemas.models import AIModelInfo, GreenInfo, SovereigntyInfo

router = APIRouter()


@router.get("/models", response_model=list[AIModelInfo])
async def list_models_endpoint():
    """List all supported AI models with sovereignty and green impact data. No auth required."""
    return [
        AIModelInfo(
            id=model.id,
            name=model.name,
            provider=model.provider,
            category=model.category,
            description=model.description,
            color=model.color,
            sovereignty=SovereigntyInfo(
                score=model.sovereignty.score,
                location=model.sovereignty.location,
                company=model.sovereignty.company,
                license=model.sovereignty.license,
                cloud_act_risk=model.sovereignty.cloud_act_risk,
                rgpd_compliant=model.sovereignty.rgpd_compliant,
            ),
            green=GreenInfo(
                energy_per_1k_tokens_kwh=model.green.energy_per_1k_tokens_kwh,
                carbon_intensity_gco2_kwh=model.green.carbon_intensity_gco2_kwh,
                water_intensity_ml_kwh=model.green.water_intensity_ml_kwh,
                datacenter_location=model.green.datacenter_location,
            ),
        )
        for model in list_models()
    ]
