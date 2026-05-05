from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rareapi.models import Reaction, PostReaction, Post
from rareapi.serializers import ReactionSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def reaction_list(request):
    if request.method == 'POST':
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        serializer = ReactionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)

    reactions = Reaction.objects.order_by('label')
    return Response(ReactionSerializer(reactions, many=True).data)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def post_reaction_list(request, pk):
    try:
        post = Post.objects.get(pk=pk)
    except Post.DoesNotExist:
        return Response({'error': 'Post not found'}, status=404)

    if request.method == 'POST':
        reaction_id = request.data.get('reaction_id')
        try:
            reaction = Reaction.objects.get(pk=reaction_id)
        except Reaction.DoesNotExist:
            return Response({'error': 'Reaction not found'}, status=404)
        PostReaction.objects.create(user=request.user, post=post, reaction=reaction)
        return Response(status=201)

    reactions = Reaction.objects.order_by('label')
    user_reaction_ids = set(
        PostReaction.objects.filter(post=post, user=request.user).values_list('reaction_id', flat=True)
    )
    data = []
    for r in reactions:
        count = PostReaction.objects.filter(post=post, reaction=r).count()
        data.append({
            **ReactionSerializer(r).data,
            'count': count,
            'user_reacted': r.id in user_reaction_ids,
        })
    return Response(data)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def post_reaction_detail(request, pk, reaction_id):
    try:
        post_reaction = PostReaction.objects.get(post_id=pk, reaction_id=reaction_id, user=request.user)
    except PostReaction.DoesNotExist:
        return Response({'error': 'Reaction not found'}, status=404)
    post_reaction.delete()
    return Response(status=204)
