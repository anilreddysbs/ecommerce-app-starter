import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from users.models import User

@pytest.mark.django_db
def test_register_user():
    client = APIClient()
    url = reverse('register')  # Match this to your view URL name
    data = {"username": "testuser", "email": "test@example.com", "password": "testpass123"}
    response = client.post(url, data)
    assert response.status_code == 201
    assert User.objects.filter(username="testuser").exists()
