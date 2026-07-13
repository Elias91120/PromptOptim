import uuid
from datetime import datetime, timezone
from unittest.mock import AsyncMock, MagicMock

import pytest
from fastapi.testclient import TestClient

from app.dependencies import AuthUser, get_current_user
from app.main import app


def make_mock_user(user_id="test-user-id", email="test@example.com"):
    return AuthUser(
        id=uuid.UUID(user_id) if isinstance(user_id, str) else user_id,
        email=email,
        created_at=datetime.now(timezone.utc),
    )


@pytest.fixture
def mock_user():
    return make_mock_user()


@pytest.fixture
def client(mock_user):
    app.dependency_overrides[get_current_user] = lambda: mock_user
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()


@pytest.fixture
def client_no_auth():
    with TestClient(app) as c:
        yield c
    app.dependency_overrides.clear()
