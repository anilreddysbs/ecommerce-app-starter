🛍️ MyShop — Django + React E-commerce App
A full-stack e-commerce application built with Django REST Framework (DRF) on the backend and React + Tailwind CSS on the frontend. Features include product listings, cart, orders, admin dashboard, and mock payments.
📦 Features
    • - User authentication (JWT-based)
    • - Product and category browsing
    • - Cart and order placement
    • - Admin dashboard for product & order management
    • - Mock payment flow (Stripe-ready)
    • - REST API support
    • - Dockerized development
🚀 Manual Setup (Local)
1. Backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
2. Frontend
cd frontend
npm install
npm start
🐳 Docker Setup
docker-compose up --build

Access:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api
- Admin panel: http://localhost:8000/admin
⚙️ Docker Configuration
docker-compose.yml
- Spins up:
  - backend (Django app)
  - frontend (React app)
  - db (PostgreSQL)

Dockerfile
- Backend and frontend each have their own Dockerfile
- Django served using gunicorn (optional)
🧪 Tests
To run backend tests:
python manage.py test
📮 API Documentation
- Use Postman
- Postman collection: docs/postman_collection.json
  

Example Endpoints:
- /api/products/ (GET) — List products
- /api/cart/ (GET) — Get current user’s cart
- /api/orders/place/ (POST) — Place an order
- /api/orders/ (GET) — List user/admin orders
- /api/token/ (POST) — Login (JWT access token)
🔐 Environment Variables
Create a .env file in the backend root:

SECRET_KEY=your-django-secret
DEBUG=True
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_HOST=db
STRIPE_SECRET_KEY=sk_test_...
🛠 Admin Login
Username: admin
Password: ********
📁 Project Structure
backend/
  └── orders/
  └── products/
  └── users/
  └── cart/
frontend/
  └── components/
  └── admin/
  └── pages/
