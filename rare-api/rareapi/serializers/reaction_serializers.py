from rest_framework import serializers
from rareapi.models import Reaction


class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'label', 'image_url']
