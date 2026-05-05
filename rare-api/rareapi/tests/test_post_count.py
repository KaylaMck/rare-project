import pytest
from datetime import date, timedelta
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rareapi.models import RareUser, Post, Category


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user(db):
    return RareUser.objects.create_user(username="author", password="x", is_active=True)


@pytest.fixture
def viewer(db):
    return RareUser.objects.create_user(username="viewer", password="x", is_active=True)


@pytest.fixture
def category(db):
    return Category.objects.create(label="General")


@pytest.fixture
def authenticated_client(api_client, viewer):
    token = Token.objects.create(user=viewer)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client


def make_post(user, category, approved, days_offset=0):
    return Post.objects.create(
        user=user,
        category=category,
        title="Test Post",
        content="Content",
        approved=approved,
        publication_date=date.today() + timedelta(days=days_offset),
    )


class TestPostCount:
    def test_zero_posts(self, authenticated_client, user):
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 0

    def test_only_unapproved_posts(self, authenticated_client, user, category):
        make_post(user, category, approved=False)
        make_post(user, category, approved=False)
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 0

    def test_only_approved_past_posts(self, authenticated_client, user, category):
        make_post(user, category, approved=True)
        make_post(user, category, approved=True)
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 2

    def test_mixed_approved_and_unapproved(self, authenticated_client, user, category):
        make_post(user, category, approved=True)
        make_post(user, category, approved=False)
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 1

    def test_future_dated_post_excluded(self, authenticated_client, user, category):
        make_post(user, category, approved=True, days_offset=1)
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 0

    def test_past_approved_and_future_approved(self, authenticated_client, user, category):
        make_post(user, category, approved=True, days_offset=-1)
        make_post(user, category, approved=True, days_offset=1)
        response = authenticated_client.get(f"/profiles/{user.pk}")
        assert response.status_code == 200
        assert response.data["post_count"] == 1
