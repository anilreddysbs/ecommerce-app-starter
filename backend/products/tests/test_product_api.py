import pytest
from rest_framework.test import APIClient
from users.models import User
from products.models import Category, Product

@pytest.mark.django_db
def test_admin_can_create_product():
    admin = User.objects.create_user(username="admin", password="adminpass", is_admin=True)
    category = Category.objects.create(name="Books")
    client = APIClient()
    client.force_authenticate(user=admin)

    data = {
        "name": "Django Book",
        "description": "Learn Django",
        "price": 499.99,
        "stock": 5,
        "category_id": category.id
    }

    response = client.post("/api/products/products/", data)
    assert response.status_code == 201
    assert Product.objects.filter(name="Django Book").exists()
