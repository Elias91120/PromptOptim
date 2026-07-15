from app.services.impact_calculator import calculate_green_impact, get_sovereignty_data
import pytest


def test_sovereignty_composer():
    data = get_sovereignty_data("composer_2_5")
    assert data.score == 0
    assert data.cloud_act_risk is True


def test_sovereignty_legacy_mistral():
    data = get_sovereignty_data("mistral_2")
    assert data.score == 0


def test_sovereignty_gpt():
    data = get_sovereignty_data("gpt_5_6_sol")
    assert data.score == 0
    assert data.cloud_act_risk is True


def test_sovereignty_unknown_model_raises():
    with pytest.raises(ValueError, match="Unknown model"):
        get_sovereignty_data("nonexistent_model")


def test_green_impact_tokens_saved():
    original = "Write me a professional email to ask for a salary raise please, I would really like to get one"
    optimized = "Draft salary raise email"
    result = calculate_green_impact(original, optimized, "claude_sonnet_5")
    assert result.tokens_saved > 0
    assert result.eco_score in ["A", "B", "C", "D", "E"]


def test_green_impact_no_savings():
    text = "Hello"
    result = calculate_green_impact(text, text, "claude_sonnet_5")
    assert result.tokens_saved == 0
    assert result.eco_score == "E"


def test_green_impact_equivalences_non_negative():
    result = calculate_green_impact("long text " * 50, "short", "gpt_5_6_sol")
    assert result.equivalences.smartphone_charges >= 0
    assert result.equivalences.km_electric_car >= 0
    assert result.equivalences.hours_led_bulb >= 0


def test_timestamp_factor_valid():
    result = calculate_green_impact("test text", "short", "claude_sonnet_5")
    assert result.timestamp_factor in [1.0, 1.2]


def test_green_impact_unknown_model_raises():
    with pytest.raises(ValueError, match="Unknown model"):
        calculate_green_impact("text", "shorter", "nonexistent_model")


def test_all_models_supported():
    for model in [
        "composer_2_5",
        "claude_opus_4_8",
        "gpt_5_6_sol",
        "fable_5",
        "claude_sonnet_5",
        "gpt_5_6_terra",
    ]:
        data = get_sovereignty_data(model)
        assert data is not None
