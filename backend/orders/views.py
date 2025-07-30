from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Order, OrderItem
from cart.models import CartItem
from .serializers import OrderSerializer
from rest_framework.decorators import action
from .tasks import send_order_confirmation_email 

class OrderViewSet(viewsets.ModelViewSet):  # ✅ use ModelViewSet
    queryset = Order.objects.all()          # ✅ required for router actions
    serializer_class = OrderSerializer      # ✅ required for router actions
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_admin:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def list(self, request):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def place(self, request):
        cart_items = CartItem.objects.filter(cart__user=request.user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        order = Order.objects.create(user=request.user)
        for item in cart_items:
            OrderItem.objects.create(order=order, product=item.product, quantity=item.quantity)
        cart_items.delete()
        send_order_confirmation_email.delay(request.user.email, order.id)
        return Response({"message": "Order placed successfully"}, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['patch'], url_path='update-status')  # ✅ ensure dash version
    def update_status(self, request, pk=None):
        if not request.user.is_admin:
            return Response({"error": "Not authorized"}, status=status.HTTP_403_FORBIDDEN)

        order = self.get_queryset().filter(pk=pk).first()
        if not order:
            return Response({"error": "Order not found"}, status=status.HTTP_404_NOT_FOUND)

        status_value = request.data.get('status')
        if status_value not in dict(Order._meta.get_field('status').choices):
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)

        order.status = status_value
        order.save()
        return Response({"message": "Order status updated"})
    
    @action(detail=True, methods=['post'])
    def pay(self, request, pk=None):
        order = Order.objects.filter(pk=pk, user=request.user).first()
        if not order:
            return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

        if order.status != 'PENDING':
            return Response({'error': 'Only pending orders can be paid'}, status=status.HTTP_400_BAD_REQUEST)

        order.status = 'CONFIRMED'
        order.save()
        return Response({'message': 'Payment successful (mock)'})
    
# orders/views.py
import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from cart.models import CartItem

stripe.api_key = settings.STRIPE_SECRET_KEY

class StripeCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart_items = CartItem.objects.filter(cart__user=request.user)
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=400)

        line_items = []
        for item in cart_items:
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': item.product.name,
                    },
                    'unit_amount': int(item.product.price * 100),  # convert to cents
                },
                'quantity': item.quantity,
            })

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:3000/success',
            cancel_url='http://localhost:3000/cancel',
            metadata={'user_id': request.user.id}
        )

        return Response({'id': session.id})


