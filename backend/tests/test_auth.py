from unittest.mock import MagicMock


def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "ok"
    assert response.json()["version"] == "5.0.0"


def test_register_success(client, mock_supabase):
    mock_supabase.auth.sign_up.return_value = MagicMock()
    response = client.post("/auth/register", json={
        "email": "new@example.com",
        "password": "Password1!"
    })
    assert response.status_code == 201
    assert "Registration successful" in response.json()["message"]


def test_register_weak_password(client):
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "weak"
    })
    assert response.status_code == 422


def test_register_invalid_email(client):
    response = client.post("/auth/register", json={
        "email": "not-an-email",
        "password": "Password1!"
    })
    assert response.status_code == 422


def test_register_password_no_uppercase(client):
    response = client.post("/auth/register", json={
        "email": "test@example.com",
        "password": "password1!"
    })
    assert response.status_code == 422


def test_login_success(client, mock_supabase):
    session = MagicMock()
    session.access_token = "access_token_123"
    session.refresh_token = "refresh_token_123"
    session.expires_in = 3600
    user = MagicMock()
    user.id = "user-uuid"
    user.email = "test@example.com"
    mock_supabase.auth.sign_in_with_password.return_value = MagicMock(session=session, user=user)

    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "Password1!"
    })
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"] == "access_token_123"
    assert body["token_type"] == "bearer"
    assert body["user"]["email"] == "test@example.com"


def test_login_no_session_returns_401(client, mock_supabase):
    mock_supabase.auth.sign_in_with_password.return_value = MagicMock(session=None, user=None)
    response = client.post("/auth/login", json={
        "email": "test@example.com",
        "password": "Password1!"
    })
    assert response.status_code == 401


def test_get_me(client, mock_user):
    response = client.get("/auth/me")
    assert response.status_code == 200
    assert response.json()["email"] == mock_user.email


def test_logout(client):
    response = client.post("/auth/logout")
    assert response.status_code == 200
    assert "Logged out" in response.json()["message"]


def test_forgot_password_always_200(client, mock_supabase):
    mock_supabase.auth.reset_password_email.return_value = None
    response = client.post("/auth/forgot-password", json={"email": "anyone@example.com"})
    assert response.status_code == 200
    assert "reset link" in response.json()["message"]


def test_forgot_password_enumeration_safe(client, mock_supabase):
    """Should return 200 even for unregistered emails."""
    mock_supabase.auth.reset_password_email.side_effect = Exception("user not found")
    response = client.post("/auth/forgot-password", json={"email": "nonexistent@example.com"})
    assert response.status_code == 200


def test_delete_me(client, mock_supabase):
    """DELETE /auth/me should return 204 and call admin.delete_user."""
    mock_supabase.auth.admin.delete_user.return_value = None
    response = client.delete("/auth/me")
    assert response.status_code == 204
    mock_supabase.auth.admin.delete_user.assert_called_once_with("test-user-id")


def test_refresh_token_success(client, mock_supabase):
    """POST /auth/refresh should return new tokens."""
    from unittest.mock import MagicMock
    session = MagicMock()
    session.access_token = "new_access_token"
    session.refresh_token = "new_refresh_token"
    session.expires_in = 3600
    mock_supabase.auth.refresh_session.return_value = MagicMock(session=session)

    response = client.post("/auth/refresh", json={"refresh_token": "old_refresh_token"})
    assert response.status_code == 200
    body = response.json()
    assert body["access_token"] == "new_access_token"
    assert body["token_type"] == "bearer"


def test_refresh_token_invalid(client, mock_supabase):
    """POST /auth/refresh with invalid token should return 401."""
    mock_supabase.auth.refresh_session.side_effect = Exception("invalid token")
    response = client.post("/auth/refresh", json={"refresh_token": "bad_token"})
    assert response.status_code == 401


def test_models_public_endpoint(client_no_auth):
    """GET /api/models should work without authentication."""
    response = client_no_auth.get("/api/models")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 8
    ids = [m["id"] for m in data]
    assert "mistral_large_3" in ids
    assert "codestral_2" in ids
    assert "gpt_4_1" in ids
    categories = {m["category"] for m in data}
    assert "code" in categories
