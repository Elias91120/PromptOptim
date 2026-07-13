from unittest.mock import MagicMock, patch, AsyncMock
from app.schemas.prompts import GreenData, SovereigntyData, Equivalences


def _make_green_data():
    return GreenData(
        tokens_saved=20, energy_saved_kwh=0.00004, co2_saved_g=0.002,
        water_saved_ml=0.02, eco_score="D",
        equivalences=Equivalences(smartphone_charges=0.0, km_electric_car=0.0, hours_led_bulb=0.002),
        methodology_source="ADEME 2024", timestamp_factor=1.0,
    )


def _make_sovereignty():
    return SovereigntyData(score=100, location="France (UE)", company="Mistral AI (Francaise)",
                           license="Open Weights / Apache", cloud_act_risk=False)


def test_generate_prompt(client, mock_supabase):
    with patch("app.routers.prompts.llm_engine.rewrite_prompt", new_callable=AsyncMock) as mock_llm, \
         patch("app.routers.prompts.impact_calculator.calculate_green_impact") as mock_green, \
         patch("app.routers.prompts.impact_calculator.get_sovereignty_data") as mock_sov, \
         patch("app.routers.prompts.anonymizer.scrub_pii", return_value="clean text"):

        mock_llm.return_value = {"optimized_prompt": "Optimized prompt", "reasoning": None}
        mock_green.return_value = _make_green_data()
        mock_sov.return_value = _make_sovereignty()

        insert_mock = MagicMock()
        insert_mock.execute.return_value = MagicMock(data=[{}])
        mock_supabase.table.return_value.insert.return_value = insert_mock

        response = client.post("/api/generate", json={
            "input_text": "Write me an email",
            "target_model": "mistral_2"
        })
        assert response.status_code == 200
        body = response.json()
        assert body["optimized_prompt"] == "Optimized prompt"
        assert "green_data" in body
        assert "sovereignty_data" in body
        assert "ai_reasoning" in body  # field is present (may be None)


def test_generate_input_too_long(client):
    response = client.post("/api/generate", json={
        "input_text": "x" * 4001,
        "target_model": "mistral_2"
    })
    assert response.status_code == 422


def test_generate_invalid_model(client):
    response = client.post("/api/generate", json={
        "input_text": "Write me an email",
        "target_model": "invalid_model"
    })
    assert response.status_code == 422


def test_history_returns_list(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value \
        .order.return_value.range.return_value.execute.return_value = MagicMock(data=[])
    response = client.get("/api/history")
    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_history_default_pagination(client, mock_supabase):
    """History endpoint should accept skip and limit query params."""
    mock_supabase.table.return_value.select.return_value.eq.return_value \
        .order.return_value.range.return_value.execute.return_value = MagicMock(data=[])
    response = client.get("/api/history?skip=0&limit=10")
    assert response.status_code == 200


def test_stats_empty(client, mock_supabase):
    mock_supabase.table.return_value.select.return_value.eq.return_value \
        .execute.return_value = MagicMock(data=[])
    response = client.get("/api/stats")
    assert response.status_code == 200
    body = response.json()
    assert body["total_prompts"] == 0
    assert body["total_tokens_saved"] == 0
    assert body["total_co2_saved"] == 0.0
    assert body["model_usage"] == {}


def test_stats_with_data(client, mock_supabase):
    rows = [
        {"target_model": "mistral_2", "green_data": {"tokens_saved": 10, "co2_saved_g": 0.5}},
        {"target_model": "gpt_5", "green_data": {"tokens_saved": 20, "co2_saved_g": 1.0}},
        {"target_model": "mistral_2", "green_data": {"tokens_saved": 5, "co2_saved_g": 0.2}},
    ]
    mock_supabase.table.return_value.select.return_value.eq.return_value \
        .execute.return_value = MagicMock(data=rows)
    response = client.get("/api/stats")
    assert response.status_code == 200
    body = response.json()
    assert body["total_prompts"] == 3
    assert body["total_tokens_saved"] == 35
    assert abs(body["total_co2_saved"] - 1.7) < 0.001
    assert body["model_usage"]["mistral_2"] == 2
    assert body["model_usage"]["gpt_5"] == 1
