from rest_framework import serializers
from rareapi.models import Comment
from .user_serializers import UserSummarySerializer


class CommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ['id', 'subject', 'content', 'post', 'author', 'created_on']
        read_only_fields = ['post', 'author', 'created_on']
