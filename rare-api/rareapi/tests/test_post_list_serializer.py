import pytest
from datetime import date
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rareapi.models import RareUser, Post, Category, Comment, PostReaction, Reaction


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def author(db):
    return RareUser.objects.create_user(
        username="author", password="x", is_active=True,
        first_name="Jane", last_name="Doe",
    )


@pytest.fixture
def viewer(db):
    return RareUser.objects.create_user(username="viewer", password="x", is_active=True)


@pytest.fixture
def category(db):
    return Category.objects.create(label="General")


@pytest.fixture
def reaction_type(db):
    return Reaction.objects.create(label="Like", image_url="")


@pytest.fixture
def authenticated_client(api_client, viewer):
    token = Token.objects.create(user=viewer)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client


def make_post(author, category, content="Content"):
    return Post.objects.create(
        user=author,
        category=category,
        title="Test Post",
        content=content,
        approved=True,
        publication_date=date.today(),
    )


class TestPostListFields:
    def test_comment_count_zero(self, authenticated_client, author, category):
        make_post(author, category)
        response = authenticated_client.get("/posts")
        assert response.status_code == 200
        assert response.data[0]["comment_count"] == 0

    def test_comment_count_reflects_comments(self, authenticated_client, author, category, viewer):
        post = make_post(author, category)
        Comment.objects.create(post=post, author=viewer, content="Nice.")
        Comment.objects.create(post=post, author=viewer, content="Great.")
        response = authenticated_client.get("/posts")
        assert response.data[0]["comment_count"] == 2

    def test_reaction_count_zero(self, authenticated_client, author, category):
        make_post(author, category)
        response = authenticated_client.get("/posts")
        assert response.data[0]["reaction_count"] == 0

    def test_reaction_count_reflects_reactions(self, authenticated_client, author, category, viewer, reaction_type):
        post = make_post(author, category)
        PostReaction.objects.create(user=viewer, post=post, reaction=reaction_type)
        response = authenticated_client.get("/posts")
        assert response.data[0]["reaction_count"] == 1

    def test_excerpt_short_content_unchanged(self, authenticated_client, author, category):
        make_post(author, category, content="Short content.")
        response = authenticated_client.get("/posts")
        assert response.data[0]["content_excerpt"] == "Short content."

    def test_excerpt_long_content_truncated(self, authenticated_client, author, category):
        long_content = "a" * 200
        make_post(author, category, content=long_content)
        response = authenticated_client.get("/posts")
        excerpt = response.data[0]["content_excerpt"]
        assert len(excerpt) == 153
        assert excerpt.endswith("...")

    def test_excerpt_exactly_150_chars_not_truncated(self, authenticated_client, author, category):
        content = "b" * 150
        make_post(author, category, content=content)
        response = authenticated_client.get("/posts")
        assert response.data[0]["content_excerpt"] == content

    def test_user_full_name(self, authenticated_client, author, category):
        make_post(author, category)
        response = authenticated_client.get("/posts")
        assert response.data[0]["user"]["full_name"] == "Jane Doe"
