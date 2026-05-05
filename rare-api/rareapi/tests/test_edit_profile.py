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
        username="testuser",
        password="testpass123",
        first_name="Jane",
        last_name="Doe",
        email="jane@example.com",
        bio="Original bio",
        is_active=True,
    )


@pytest.fixture
def other_user(db):
    return RareUser.objects.create_user(
        username="otheruser",
        password="testpass123",
        first_name="Other",
        last_name="Person",
        email="other@example.com",
        is_active=True,
    )


@pytest.fixture
def auth_client(api_client, user):
    token = Token.objects.create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client


class TestEditProfile:
    def test_user_can_edit_own_profile(self, auth_client, user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "first_name": "Updated",
            "last_name": "Name",
            "bio": "New bio",
        }, format="json")
        assert response.status_code == 200
        user.refresh_from_db()
        assert user.first_name == "Updated"
        assert user.last_name == "Name"
        assert user.bio == "New bio"

    def test_partial_update_leaves_other_fields_unchanged(self, auth_client, user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "bio": "Just bio update",
        }, format="json")
        assert response.status_code == 200
        user.refresh_from_db()
        assert user.first_name == "Jane"
        assert user.last_name == "Doe"
        assert user.bio == "Just bio update"

    def test_response_includes_updated_fields(self, auth_client, user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "first_name": "NewFirst",
            "last_name": "NewLast",
        }, format="json")
        assert response.status_code == 200
        data = response.json()
        assert data["first_name"] == "NewFirst"
        assert data["last_name"] == "NewLast"

    def test_cannot_edit_another_users_profile(self, auth_client, other_user):
        response = auth_client.put(f"/profiles/{other_user.id}/edit", {
            "bio": "Hacked",
        }, format="json")
        assert response.status_code == 403

    def test_unauthenticated_cannot_edit_profile(self, api_client, user):
        response = api_client.put(f"/profiles/{user.id}/edit", {
            "bio": "no auth",
        }, format="json")
        assert response.status_code in (401, 403)

    def test_user_can_change_own_username(self, auth_client, user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "username": "newusername",
        }, format="json")
        assert response.status_code == 200
        user.refresh_from_db()
        assert user.username == "newusername"

    def test_username_unchanged_does_not_conflict(self, auth_client, user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "username": "testuser",
        }, format="json")
        assert response.status_code == 200

    def test_duplicate_username_returns_400(self, auth_client, user, other_user):
        response = auth_client.put(f"/profiles/{user.id}/edit", {
            "username": "otheruser",
        }, format="json")
        assert response.status_code == 400
        assert "username" in response.json()
