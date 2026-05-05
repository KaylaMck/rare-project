import pytest
from datetime import date, timedelta
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rareapi.models import RareUser, Post, Category


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def category(db):
    return Category.objects.create(label="General")


@pytest.fixture
def diana(db):
    return RareUser.objects.create_user(username="diana", password="x", is_active=True)


@pytest.fixture
def other_user(db):
    return RareUser.objects.create_user(username="other", password="x", is_active=True)


@pytest.fixture
def viewer(db):
    return RareUser.objects.create_user(username="viewer", password="x", is_active=True)


@pytest.fixture
def authenticated_client(api_client, viewer):
    token = Token.objects.create(user=viewer)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client


def make_post(user, category, title="Test Post", approved=True, days_offset=0):
    return Post.objects.create(
        user=user,
        category=category,
        title=title,
        content="Content",
        approved=approved,
        publication_date=date.today() + timedelta(days=days_offset),
    )


class TestSearchPosts:
    def test_no_params_returns_empty(self, authenticated_client):
        response = authenticated_client.get("/posts/search")
        assert response.status_code == 200
        assert response.data == []

    def test_search_by_title(self, authenticated_client, diana, category):
        make_post(diana, category, title="Learning Python")
        make_post(diana, category, title="Django Tips")
        response = authenticated_client.get("/posts/search?q=python")
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Learning Python"

    def test_search_by_title_case_insensitive(self, authenticated_client, diana, category):
        make_post(diana, category, title="Learning Python")
        response = authenticated_client.get("/posts/search?q=PYTHON")
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_search_by_author(self, authenticated_client, diana, other_user, category):
        make_post(diana, category, title="Diana's Post")
        make_post(other_user, category, title="Other's Post")
        response = authenticated_client.get("/posts/search?author=diana")
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Diana's Post"

    def test_search_by_author_case_insensitive(self, authenticated_client, diana, category):
        make_post(diana, category, title="Diana's Post")
        response = authenticated_client.get("/posts/search?author=DIANA")
        assert response.status_code == 200
        assert len(response.data) == 1

    def test_combined_q_and_author(self, authenticated_client, diana, other_user, category):
        make_post(diana, category, title="Python by Diana")
        make_post(diana, category, title="Django by Diana")
        make_post(other_user, category, title="Python by Other")
        response = authenticated_client.get("/posts/search?q=python&author=diana")
        assert response.status_code == 200
        assert len(response.data) == 1
        assert response.data[0]["title"] == "Python by Diana"

    def test_excludes_unapproved(self, authenticated_client, diana, category):
        make_post(diana, category, title="Python Draft", approved=False)
        response = authenticated_client.get("/posts/search?q=python")
        assert response.status_code == 200
        assert response.data == []

    def test_excludes_future_dated(self, authenticated_client, diana, category):
        make_post(diana, category, title="Future Python", days_offset=1)
        response = authenticated_client.get("/posts/search?q=python")
        assert response.status_code == 200
        assert response.data == []

    def test_author_only_no_q_match_still_returns(self, authenticated_client, diana, category):
        make_post(diana, category, title="Some Post")
        response = authenticated_client.get("/posts/search?author=diana")
        assert response.status_code == 200
        assert len(response.data) == 1
