import pytest
from rest_framework.test import APIClient
from users.models import User
from products.models import Product, Category
from cart.models import Cart, CartItem

@pytest.mark.django_db
def test_place_order():
    user = User.objects.create_user(username="cust", password="pass123", is_customer=True)
    category = Category.objects.create(name="Gadgets")
    product = Product.objects.create(name="Phone", description="Smartphone", price=1000, stock=10, category=category)

    cart, _ = Cart.objects.get_or_create(user=user)  # Use get_or_create to avoid IntegrityError
    CartItem.objects.create(cart=cart, product=product, quantity=1)

    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post("/api/orders/place/")
    assert response.status_code == 201
    assert "Order placed successfully" in response.data["message"]
