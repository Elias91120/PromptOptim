from app.data.models_registry import (
    DEFAULT_MODEL_ID,
    get_model,
    is_valid_model,
    list_models,
    resolve_model_id,
)


def test_list_models_count():
    assert len(list_models()) == 6


def test_default_model():
    assert DEFAULT_MODEL_ID == "claude_sonnet_5"


def test_resolve_legacy_aliases():
    assert resolve_model_id("mistral_2") == "composer_2_5"
    assert resolve_model_id("codestral_2") == "composer_2_5"
    assert resolve_model_id("gpt_5") == "gpt_5_6_sol"
    assert resolve_model_id("gpt_4_1") == "gpt_5_6_sol"
    assert resolve_model_id("gpt_5_6") == "gpt_5_6_sol"
    assert resolve_model_id("claude_opus") == "claude_opus_4_8"
    assert resolve_model_id("claude_opus_4") == "claude_opus_4_8"
    assert resolve_model_id("claude_sonnet_4") == "claude_sonnet_5"
    assert resolve_model_id("gemini_3_pro") == "fable_5"
    assert resolve_model_id("midjourney_v6") == "fable_5"


def test_resolve_canonical_ids():
    assert resolve_model_id("composer_2_5") == "composer_2_5"
    assert resolve_model_id("gpt_5_6_terra") == "gpt_5_6_terra"
    assert resolve_model_id("fable_5") == "fable_5"


def test_unknown_model_raises():
    try:
        resolve_model_id("invalid_model")
        assert False, "Expected ValueError"
    except ValueError as exc:
        assert "Unknown model" in str(exc)


def test_is_valid_model():
    assert is_valid_model("mistral_2") is True
    assert is_valid_model("composer_2_5") is True
    assert is_valid_model("invalid") is False


def test_model_categories():
    code_models = [m for m in list_models() if m.category == "code"]
    assert len(code_models) == 1
    assert code_models[0].id == "composer_2_5"


def test_get_model_has_system_prompt():
    model = get_model("composer_2_5")
    assert "Composer" in model.system_prompt
    assert model.hub_model == "qwen2.5-coder:7b-instruct"
