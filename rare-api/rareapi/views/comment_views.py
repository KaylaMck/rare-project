from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rareapi.models import Comment, Post
from rareapi.serializers import CommentSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_comments(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

    if request.method == 'POST':
        comment = Comment.objects.create(
            post=post,
            author=request.user,
            subject=request.data.get('subject', ''),
            content=request.data.get('content', ''),
        )
        return Response(CommentSerializer(comment).data, status=201)

    comments = Comment.objects.select_related('author').filter(post=post)
    return Response(CommentSerializer(comments, many=True).data)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def comment_detail(request, pk):
    try:
        comment = Comment.objects.select_related('author').get(pk=pk)
    except Comment.DoesNotExist:
        return Response({'error': 'Comment not found'}, status=404)

    if request.method == 'GET':
        return Response(CommentSerializer(comment).data)

    if request.method == 'PUT':
        if comment.author != request.user:
            return Response({'error': 'Forbidden'}, status=403)
        comment.subject = request.data.get('subject', comment.subject)
        comment.content = request.data.get('content', comment.content)
        comment.save()
        return Response(CommentSerializer(comment).data)

    if request.method == 'DELETE':
        if comment.author != request.user and not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        comment.delete()
        return Response(status=204)
