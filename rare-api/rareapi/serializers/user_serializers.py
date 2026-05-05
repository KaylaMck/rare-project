from django.utils import timezone
from rest_framework import serializers
from rareapi.models import RareUser


class UserSummarySerializer(serializers.ModelSerializer):
    """Minimal user representation for nesting inside posts, comments, etc."""
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = RareUser
        fields = ['id', 'username', 'full_name']

    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()


class ProfileDetailSerializer(serializers.ModelSerializer):
    """Full user profile for the detail endpoint."""
    full_name = serializers.SerializerMethodField()
    created_on = serializers.DateField(format='%m/%d/%Y')
    user_type = serializers.SerializerMethodField()
    is_subscribed = serializers.SerializerMethodField()
    subscriber_count = serializers.SerializerMethodField()
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = RareUser
        fields = [
            'id', 'full_name', 'first_name', 'last_name', 'username', 'email',
            'bio', 'profile_image_url', 'created_on', 'user_type',
            'is_subscribed', 'subscriber_count', 'post_count',
        ]

    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()

    def get_user_type(self, obj):
        return 'Admin' if obj.is_staff else 'Author'

    def get_is_subscribed(self, obj):
        request = self.context.get('request')
        if not request or not request.user.is_authenticated:
            return False
        return obj.subscribers.filter(
            follower=request.user, ended_on__isnull=True
        ).exists()

    def get_subscriber_count(self, obj):
        return obj.subscribers.filter(ended_on__isnull=True).count()

    def get_post_count(self, obj):
        return obj.posts.filter(approved=True, publication_date__lte=timezone.now().date()).count()


class ProfileListSerializer(serializers.ModelSerializer):
    """Slim user profile for admin list endpoint."""
    full_name = serializers.SerializerMethodField()
    user_type = serializers.SerializerMethodField()

    class Meta:
        model = RareUser
        fields = ['id', 'full_name', 'username', 'user_type', 'is_active']

    def get_full_name(self, obj):
        return f'{obj.first_name} {obj.last_name}'.strip()

    def get_user_type(self, obj):
        return 'Admin' if obj.is_staff else 'Author'


class RegisterSerializer(serializers.ModelSerializer):
    """Validates and creates a new user during registration."""
    class Meta:
        model = RareUser
        fields = ['username', 'password', 'first_name', 'last_name', 'email', 'bio']
        extra_kwargs = {
            'password': {'write_only': True},
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True},
        }

    def create(self, validated_data):
        return RareUser.objects.create_user(
            **validated_data,
            is_active=True,
        )


class ProfileEditSerializer(serializers.ModelSerializer):
    """Validates profile fields the user is allowed to edit themselves."""
    class Meta:
        model = RareUser
        fields = ['username', 'first_name', 'last_name', 'bio']

    def validate_username(self, value):
        qs = RareUser.objects.filter(username=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError("This username is already taken.")
        return value
