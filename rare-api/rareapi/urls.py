from django.urls import path
from .views.auth_views import login_user, register_user, me
from .views.tag_views import tags, tag_detail
from .views.post_views import (
    post_list, post_detail, post_tags, upload_post_image,
    approve_post, unapprove_post, unapproved_post_list, approved_post_list,
    my_post_list, user_post_list, subscribed_posts,
    category_post_list, tag_post_list, search_posts,
)
from .views.category_views import category_list, category_detail
from .views.comment_views import post_comments, comment_detail
from .views.user_views import (
    profile_list, profile_detail, deactivate_user, reactivate_user,
    change_user_type, upload_profile_image,
    demotion_queue_list, cancel_demotion_queue_item,
)
from .views.subscription_views import subscribe, unsubscribe
from .views.reaction_views import reaction_list, post_reaction_list, post_reaction_detail


urlpatterns = [
    # Auth
    path('login', login_user, name='login'),
    path('register', register_user, name='register'),
    path('me', me, name='me'),

    # Tags
    path('tags', tags, name='tags'),
    path('tags/<int:pk>', tag_detail, name='tag_detail'),
    path('tags/<int:tag_id>/posts', tag_post_list, name='tag_post_list'),

    # Categories
    path('categories', category_list, name='category_list'),
    path('categories/<int:pk>', category_detail, name='category_detail'),
    path('categories/<int:category_id>/posts', category_post_list, name='category_post_list'),

    # Posts
    path('posts/search', search_posts, name='search_posts'),
    path('posts', post_list, name='post_list'),
    path('posts/<int:pk>', post_detail, name='post_detail'),
    path('posts/<int:pk>/tags', post_tags, name='post_tags'),
    path('posts/<int:pk>/image', upload_post_image, name='upload_post_image'),
    path('posts/<int:pk>/approve', approve_post, name='approve_post'),
    path('posts/<int:pk>/unapprove', unapprove_post, name='unapprove_post'),
    path('unapprovedposts', unapproved_post_list, name='unapproved_post_list'),
    path('approvedposts', approved_post_list, name='approved_post_list'),
    path('myposts', my_post_list, name='my_post_list'),
    path('subscribedposts', subscribed_posts, name='subscribed_posts'),

    # Comments
    path('posts/<int:pk>/comments', post_comments, name='post_comments'),
    path('comments/<int:pk>', comment_detail, name='comment_detail'),

    # Profiles
    path('profiles', profile_list, name='profile_list'),
    path('profiles/<int:pk>', profile_detail, name='profile_detail'),
    path('profiles/<int:pk>/image', upload_profile_image, name='upload_profile_image'),
    path('profiles/<int:pk>/deactivate', deactivate_user, name='deactivate_user'),
    path('profiles/<int:pk>/reactivate', reactivate_user, name='reactivate_user'),
    path('profiles/<int:pk>/type', change_user_type, name='change_user_type'),
    path('profiles/<int:user_id>/posts', user_post_list, name='user_post_list'),
    path('profiles/<int:author_id>/subscribe', subscribe, name='subscribe'),
    path('profiles/<int:author_id>/unsubscribe', unsubscribe, name='unsubscribe'),

    # Demotion queue (admin voting)
    path('demotionqueue', demotion_queue_list, name='demotion_queue_list'),
    path('demotionqueue/<int:pk>', cancel_demotion_queue_item, name='cancel_demotion_queue_item'),

    # Reactions
    path('reactions', reaction_list, name='reaction_list'),
    path('posts/<int:pk>/reactions', post_reaction_list, name='post_reaction_list'),
    path('posts/<int:pk>/reactions/<int:reaction_id>', post_reaction_detail, name='post_reaction_detail'),
]
