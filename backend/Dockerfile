FROM python:3.11
WORKDIR /code
COPY . .
RUN pip install -r requirements.txt
CMD ["gunicorn", "ecommerce.wsgi:application", "--bind", "0.0.0.0:8000"]
