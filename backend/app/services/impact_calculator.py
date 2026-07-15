import tiktoken
from datetime import datetime, timezone

from app.data.models_registry import get_model_or_legacy_meta, resolve_model_id
from app.schemas.prompts import GreenData, SovereigntyData, Equivalences

_ENCODER = tiktoken.get_encoding("cl100k_base")


def _count_tokens(text: str) -> int:
    if not isinstance(text, str):
        return 0
    return len(_ENCODER.encode(text))


def _get_time_factor(tz_offset: int) -> float:
    """Return 1.2 if local datacenter hour is between 18-22 (peak), else 1.0."""
    utc_hour = datetime.now(timezone.utc).hour
    local_hour = (utc_hour + tz_offset) % 24
    return 1.2 if 18 <= local_hour < 22 else 1.0


def _eco_score(co2_saved_g: float) -> str:
    if co2_saved_g >= 1.0:
        return "A"
    elif co2_saved_g >= 0.5:
        return "B"
    elif co2_saved_g >= 0.1:
        return "C"
    elif co2_saved_g > 0:
        return "D"
    else:
        return "E"


def calculate_green_impact(original_text: str, optimized_text: str, model_name: str) -> GreenData:
    model = get_model_or_legacy_meta(model_name)
    meta = model.green

    tokens_original = _count_tokens(original_text)
    tokens_optimized = _count_tokens(optimized_text)

    if original_text.strip() == optimized_text.strip() or tokens_optimized == 0:
        tokens_saved = 0
    else:
        tokens_saved = max(50, 250 + tokens_original - tokens_optimized)

    time_factor = _get_time_factor(meta.tz_offset)

    energy_saved_kwh = (tokens_saved / 1000) * meta.energy_per_1k_tokens_kwh * time_factor
    co2_saved_g = energy_saved_kwh * meta.carbon_intensity_gco2_kwh
    water_saved_ml = energy_saved_kwh * meta.water_intensity_ml_kwh

    equivalences = Equivalences(
        smartphone_charges=round(co2_saved_g / 8.22, 4),
        km_electric_car=round(co2_saved_g / 20, 4),
        hours_led_bulb=round(co2_saved_g / 0.4, 4),
    )

    return GreenData(
        tokens_saved=tokens_saved,
        energy_saved_kwh=round(energy_saved_kwh, 6),
        co2_saved_g=round(co2_saved_g, 4),
        water_saved_ml=round(water_saved_ml, 4),
        eco_score=_eco_score(co2_saved_g),
        equivalences=equivalences,
        methodology_source="Methodology based on ADEME 2024 factors & Cloud Carbon Footprint standards.",
        timestamp_factor=time_factor,
    )


def get_sovereignty_data(model_name: str) -> SovereigntyData:
    model = get_model_or_legacy_meta(model_name)
    sovereignty = model.sovereignty
    return SovereigntyData(
        score=sovereignty.score,
        location=sovereignty.location,
        company=sovereignty.company,
        license=sovereignty.license,
        cloud_act_risk=sovereignty.cloud_act_risk,
    )
