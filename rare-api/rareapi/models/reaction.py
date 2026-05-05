from django.db import models


class Reaction(models.Model):
    label = models.CharField(max_length=200)
    image_url = models.CharField(max_length=500)
