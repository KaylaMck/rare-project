from django.db import models


class Post(models.Model):
    user = models.ForeignKey('RareUser', on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey('Category', on_delete=models.CASCADE, related_name='posts')
    title = models.CharField(max_length=300)
    publication_date = models.DateField()
    image_url = models.CharField(max_length=500, blank=True, default='')
    content = models.TextField()
    approved = models.BooleanField(default=False)
