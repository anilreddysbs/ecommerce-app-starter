from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import OrderViewSet, StripeCheckoutSessionView

router = DefaultRouter()
router.register(r'', OrderViewSet, basename='orders')

urlpatterns = router.urls + [
    path('create-checkout-session/', StripeCheckoutSessionView.as_view(), name='create-checkout-session'),
]
