from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rareapi.models import Tag
from rareapi.serializers import TagSerializer


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def tags(request):
    if request.method == 'GET':
        all_tags = Tag.objects.order_by('label')
        return Response(TagSerializer(all_tags, many=True).data)

    if request.method == 'POST':
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        serializer = TagSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
def tag_detail(request, pk):
    try:
        tag = Tag.objects.get(pk=pk)
    except Tag.DoesNotExist:
        return Response({'error': 'Tag not found'}, status=404)

    if request.method == 'GET':
        return Response(TagSerializer(tag).data)

    if request.method == 'PUT':
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        serializer = TagSerializer(tag, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    if request.method == 'DELETE':
        if not request.user.is_staff:
            return Response({'error': 'Forbidden'}, status=403)
        tag.delete()
        return Response(status=204)
