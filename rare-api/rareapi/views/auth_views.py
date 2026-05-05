from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from rareapi.models import RareUser
from rareapi.serializers import RegisterSerializer


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    try:
        user = RareUser.objects.get(username=username)
        if user.check_password(password) and user.is_active:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'valid': True,
                'token': token.key,
                'user_id': user.id,
                'is_staff': user.is_staff
            })
        else:
            return Response({'valid': False})
    except RareUser.DoesNotExist:
        return Response({'valid': False})


@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    new_user = serializer.save()

    token = Token.objects.create(user=new_user)
    return Response({
        'valid': True,
        'token': token.key,
        'user_id': new_user.id,
        'is_staff': new_user.is_staff
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    """Return the current authenticated user's profile."""
    user = request.user
    return Response({
        'id': user.id,
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'is_staff': user.is_staff,
        'bio': user.bio,
        'profile_image_url': user.profile_image_url,
    })
