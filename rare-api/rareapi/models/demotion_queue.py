from django.db import models


class DemotionQueue(models.Model):
    action = models.CharField(max_length=200)
    admin = models.ForeignKey('RareUser', on_delete=models.CASCADE, related_name='demotions_initiated')
    approver_one = models.ForeignKey('RareUser', on_delete=models.CASCADE, related_name='demotions_approved')

    class Meta:
        unique_together = ('action', 'admin', 'approver_one')
