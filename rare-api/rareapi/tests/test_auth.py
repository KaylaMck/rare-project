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
        first_name="Test",
        last_name="User",
        email="test@example.com",
        bio="A test user",
        is_active=True,
    )


@pytest.fixture
def admin_user(db):
    return RareUser.objects.create_user(
        username="testadmin",
        password="adminpass123",
        first_name="Admin",
        last_name="User",
        email="admin@example.com",
        is_staff=True,
        is_active=True,
    )


class TestLogin:
    def test_login_returns_token_and_user_id(self, api_client, user):
        response = api_client.post("/login", {
            "username": "testuser",
            "password": "testpass123",
        })
        assert response.status_code == 200
        data = response.json()
        assert data["valid"] is True
        assert data["user_id"] == user.id
        assert data["is_staff"] is False
        # Token should be an opaque string, not the user ID
        assert isinstance(data["token"], str)
        assert data["token"] != str(user.id)

    def test_login_bad_password(self, api_client, user):
        response = api_client.post("/login", {
            "username": "testuser",
            "password": "wrong",
        })
        assert response.json() == {"valid": False}

    def test_login_nonexistent_user(self, api_client, db):
        response = api_client.post("/login", {
            "username": "nobody",
            "password": "whatever",
        })
        assert response.json() == {"valid": False}

    def test_login_inactive_user(self, api_client, user):
        user.is_active = False
        user.save()
        response = api_client.post("/login", {
            "username": "testuser",
            "password": "testpass123",
        })
        assert response.json() == {"valid": False}

    def test_login_admin_returns_is_staff_true(self, api_client, admin_user):
        response = api_client.post("/login", {
            "username": "testadmin",
            "password": "adminpass123",
        })
        data = response.json()
        assert data["valid"] is True
        assert data["is_staff"] is True


class TestRegister:
    def test_register_creates_user_and_returns_token(self, api_client, db):
        response = api_client.post("/register", {
            "username": "newuser",
            "password": "newpass123",
            "first_name": "New",
            "last_name": "Person",
            "email": "new@example.com",
            "bio": "I'm new here",
        })
        data = response.json()
        assert data["valid"] is True
        assert data["is_staff"] is False
        assert isinstance(data["token"], str)
        assert "user_id" in data

        # Verify user was actually created
        assert RareUser.objects.filter(username="newuser").exists()


class TestMe:
    def test_me_returns_current_user(self, api_client, user):
        token = Token.objects.create(user=user)
        api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = api_client.get("/me")
        assert response.status_code == 200
        data = response.json()
        assert data["id"] == user.id
        assert data["username"] == "testuser"
        assert data["is_staff"] is False
        assert data["bio"] == "A test user"

    def test_me_requires_authentication(self, api_client, db):
        response = api_client.get("/me")
        assert response.status_code in (401, 403)

    def test_me_rejects_invalid_token(self, api_client, db):
        api_client.credentials(HTTP_AUTHORIZATION="Token fakeinvalidtoken")
        response = api_client.get("/me")
        assert response.status_code == 401
