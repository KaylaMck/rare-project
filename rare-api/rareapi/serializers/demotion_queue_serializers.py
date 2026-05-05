from rest_framework import serializers
from rareapi.models import DemotionQueue, RareUser


class DemotionQueueSerializer(serializers.ModelSerializer):
    action_type = serializers.SerializerMethodField()
    target_id = serializers.SerializerMethodField()
    target_username = serializers.SerializerMethodField()
    initiated_by_id = serializers.IntegerField(source='admin.id', read_only=True)
    initiated_by = serializers.CharField(source='admin.username', read_only=True)

    class Meta:
        model = DemotionQueue
        fields = [
            'id', 'action', 'action_type', 'target_id',
            'target_username', 'initiated_by_id', 'initiated_by',
        ]

    def _parse_action(self, obj):
        parts = obj.action.split(':')
        return parts[0], int(parts[1])

    def get_action_type(self, obj):
        action_type, _ = self._parse_action(obj)
        return action_type

    def get_target_id(self, obj):
        _, target_id = self._parse_action(obj)
        return target_id

    def get_target_username(self, obj):
        _, target_id = self._parse_action(obj)
        try:
            return RareUser.objects.get(pk=target_id).username
        except RareUser.DoesNotExist:
            return 'Unknown'
