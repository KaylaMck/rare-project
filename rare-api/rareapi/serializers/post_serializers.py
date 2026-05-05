from rest_framework import serializers
from rareapi.models import Post
from .user_serializers import UserSummarySerializer
from .category_serializers import CategorySerializer
from .tag_serializers import TagSerializer


class PostDetailSerializer(serializers.ModelSerializer):
    """Full post representation with tags, used for detail and create/update responses."""
    user = UserSummarySerializer(read_only=True)
    category = CategorySerializer(read_only=True)
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'content', 'publication_date',
            'image_url', 'approved', 'user', 'category', 'tags',
        ]

    def get_tags(self, obj):
        return TagSerializer(
            [pt.tag for pt in obj.post_tags.select_related('tag').all()],
            many=True,
        ).data


class PostListSerializer(serializers.ModelSerializer):
    """Slim post representation for list endpoints."""
    user = UserSummarySerializer(read_only=True)
    category = CategorySerializer(read_only=True)

    class Meta:
        model = Post
        fields = ['id', 'title', 'publication_date', 'approved', 'user', 'category']
