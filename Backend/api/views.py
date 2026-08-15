from rest_framework import viewsets, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.conf import settings
from rest_framework_simplejwt.tokens import RefreshToken

from .models import Product
from .serializers import (
    ProductSerializer,
    UserSerializer,
    RegisterSerializer,
    LoginSerializer
)

User = get_user_model()


class ProductViewSet(viewsets.ModelViewSet):
    """
    API endpoint for full CRUD operations on Products (GET, POST, PUT, DELETE).
    """
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [AllowAny]


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint for managing Users.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


import random
from django.core.mail import send_mail

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        
        # Set user as inactive until email verification
        user.is_active = False
        user.is_email_verified = False
        
        # Generate 6-digit OTP code
        otp_code = f"{random.randint(100000, 999999)}"
        user.email_verification_token = otp_code
        user.save()

        # Send verification email
        subject = "Verify your email - Protech"
        message = f"Hello {user.full_name or 'User'},\n\nYour 6-digit verification code is: {otp_code}\n\nPlease enter this code to activate your account."
        try:
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Failed to send email: {e}")

        return Response({
            "message": "Registration successful! Please check your email for your 6-digit verification code.",
            "email": user.email,
            "requires_verification": True
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def verify_email_view(request):
    email = request.data.get('email')
    code = request.data.get('code')

    if not email or not code:
        return Response({"error": "Email and verification code are required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({"error": "Invalid email address."}, status=status.HTTP_404_NOT_FOUND)

    if user.is_active and user.is_email_verified:
        return Response({"message": "Account is already verified! You can sign in."}, status=status.HTTP_200_OK)

    if user.email_verification_token == str(code).strip():
        user.is_active = True
        user.is_email_verified = True
        user.email_verification_token = None
        user.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "message": "Email verified successfully! Your account is now active.",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid verification code. Please check your email and try again."}, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        return Response({
            "message": "Login successful!",
            "access_token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "avatar_url": user.avatar_url,
                "role": user.role
            }
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def google_login_view(request):
    """
    Endpoint to receive and verify Google ID Token from the React frontend,
    create or fetch the user, and return JWT authentication tokens.
    """
    # Lazy import to avoid startup errors with google namespace packages
    from google.oauth2 import id_token
    from google.auth.transport import requests as google_requests

    token = request.data.get('token') or request.data.get('id_token')
    if not token:
        return Response({"error": "Google ID token is required."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        id_info = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID,
            clock_skew_in_seconds=10  # Tolerate minor clock drift between server and Google
        )
    except ValueError as e:
        return Response({"error": f"Invalid Google token: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": f"Token verification failed: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)

    email = id_info.get('email')
    if not email:
        return Response({"error": "Email not provided by Google token."}, status=status.HTTP_400_BAD_REQUEST)

    full_name = id_info.get('name', '')
    avatar_url = id_info.get('picture', '')

    user, created = User.objects.get_or_create(
        email=email,
        defaults={
            'full_name': full_name,
            'avatar_url': avatar_url,
            'is_email_verified': True,
        }
    )

    if created:
        user.set_unusable_password()
        user.save()
    else:
        updated = False
        if not user.full_name and full_name:
            user.full_name = full_name
            updated = True
        if not user.avatar_url and avatar_url:
            user.avatar_url = avatar_url
            updated = True
        if not user.is_email_verified:
            user.is_email_verified = True
            updated = True
        if updated:
            user.save()

    refresh = RefreshToken.for_user(user)

    return Response({
        "message": "Google authentication successful!",
        "access_token": str(refresh.access_token),
        "refresh_token": str(refresh),
        "user": {
            "id": str(user.id),
            "email": user.email,
            "full_name": user.full_name,
            "avatar_url": user.avatar_url,
            "role": user.role
        }
    }, status=status.HTTP_200_OK)