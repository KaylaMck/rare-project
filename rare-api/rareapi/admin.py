from django.contrib import admin
from .models import (
    RareUser, Post, Category, Tag, PostTag,
    Comment, Reaction, PostReaction, Subscription, DemotionQueue
)

admin.site.register(RareUser)
admin.site.register(Post)
admin.site.register(Category)
admin.site.register(Tag)
admin.site.register(PostTag)
admin.site.register(Comment)
admin.site.register(Reaction)
admin.site.register(PostReaction)
admin.site.register(Subscription)
admin.site.register(DemotionQueue)
