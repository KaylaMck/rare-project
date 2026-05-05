import pytest
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from rareapi.models import RareUser


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return RareUser.objects.create_user(
        username="janedoe",
        password="testpass123",
        first_name="Jane",
        last_name="Doe",
        email="jane@example.com",
        bio="Writer and explorer.",
        is_active=True,
    )


@pytest.fixture
def viewer(db):
    return RareUser.objects.create_user(
        username="viewer",
        password="testpass123",
        is_active=True,
    )


@pytest.fixture
def auth_client(api_client, viewer):
    token = Token.objects.create(user=viewer)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client


class TestProfileDetail:
    def test_response_includes_first_name(self, auth_client, user):
        response = auth_client.get(f"/profiles/{user.id}")
        assert response.status_code == 200
        assert response.data["first_name"] == "Jane"

    def test_response_includes_last_name(self, auth_client, user):
        response = auth_client.get(f"/profiles/{user.id}")
        assert response.status_code == 200
        assert response.data["last_name"] == "Doe"

    def test_response_includes_bio(self, auth_client, user):
        response = auth_client.get(f"/profiles/{user.id}")
        assert response.status_code == 200
        assert response.data["bio"] == "Writer and explorer."

    def test_bio_is_empty_string_when_not_set(self, auth_client, viewer):
        response = auth_client.get(f"/profiles/{viewer.id}")
        assert response.status_code == 200
        assert response.data["bio"] == ""

    def test_requires_authentication(self, api_client, user):
        response = api_client.get(f"/profiles/{user.id}")
        assert response.status_code in (401, 403)

    def test_returns_404_for_missing_user(self, auth_client):
        response = auth_client.get("/profiles/999999")
        assert response.status_code == 404
