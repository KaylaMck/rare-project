from django.contrib.auth.models import AbstractUser
from django.db import models


class RareUser(AbstractUser):
    bio = models.CharField(max_length=500, blank=True, default='')
    profile_image_url = models.CharField(max_length=500, blank=True, default='')
    created_on = models.DateField(auto_now_add=True)
