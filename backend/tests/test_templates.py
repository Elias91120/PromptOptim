from unittest.mock import MagicMock


def _make_template_row(user_id="test-user-id"):
    return {
        "id": 1,
        "user_id": user_id,
        "title": "Test Template",
        "description": "A test",
        "template_text": "Do {task}",
        "target_model": "mistral_2",
        "category": "general",
        "is_public": False,
        "usage_count": 0,
        "created_at": "2026-03-20T10:00:00+00:00",
    }


def test_list_templates(client, mock_supabase, mock_user):
    row = _make_template_row(mock_user.id)
    # list_templates (no mine_only): .select("*").order(...).range(...).execute()
    table_mock = mock_supabase.table.return_value
    table_mock.select.return_value.order.return_value.range.return_value \
        .execute.return_value = MagicMock(data=[row])

    response = client.get("/api/templates")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 1
    assert data[0]["is_mine"] is True


def test_list_templates_mine_only(client, mock_supabase, mock_user):
    row = _make_template_row(mock_user.id)
    table_mock = mock_supabase.table.return_value
    # mine_only adds an .eq("user_id", ...) before .order()
    table_mock.select.return_value.eq.return_value.order.return_value.range.return_value \
        .execute.return_value = MagicMock(data=[row])
    response = client.get("/api/templates?mine_only=true")
    assert response.status_code == 200


def test_create_template(client, mock_supabase, mock_user):
    row = _make_template_row(mock_user.id)
    mock_supabase.table.return_value.insert.return_value.execute.return_value = MagicMock(data=[row])
    response = client.post("/api/templates", json={
        "title": "Test Template",
        "template_text": "Do {task}",
    })
    assert response.status_code == 201
    assert response.json()["is_mine"] is True


def test_create_template_validation(client):
    """title is required."""
    response = client.post("/api/templates", json={
        "template_text": "Do {task}",
    })
    assert response.status_code == 422


def test_delete_template_not_found(client, mock_supabase):
    # Ownership check: .select("id").eq("id",...).eq("user_id",...).execute() must return data=[]
    # Build the chain carefully: table -> select -> eq (id) -> eq (user_id) -> execute -> data=[]
    execute_result = MagicMock(data=[])
    inner_eq = MagicMock()
    inner_eq.execute.return_value = execute_result
    outer_eq = MagicMock()
    outer_eq.eq.return_value = inner_eq
    select_mock = MagicMock()
    select_mock.eq.return_value = outer_eq
    mock_supabase.table.return_value.select.return_value = select_mock
    response = client.delete("/api/templates/999")
    assert response.status_code == 404


def test_delete_template_success(client, mock_supabase, mock_user):
    row = _make_template_row(mock_user.id)
    # Ownership check: .select("id").eq("id",...).eq("user_id",...).execute() -> data=[row]
    mock_supabase.table.return_value.select.return_value.eq.return_value \
        .eq.return_value.execute.return_value = MagicMock(data=[row])
    # Delete: .delete().eq("id",...).execute() -> data=[row]
    mock_supabase.table.return_value.delete.return_value.eq.return_value \
        .execute.return_value = MagicMock(data=[row])
    response = client.delete("/api/templates/1")
    assert response.status_code == 204
