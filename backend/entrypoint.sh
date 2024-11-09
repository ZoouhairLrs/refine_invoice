#!/bin/sh
echo "Waiting for PostgreSQL to start..."
./wait-for-it.sh ilyass:5432 --timeout=30 --strict -- echo "PostgreSQL started"

# Run migrations and collectstatic
python manage.py makemigrations
python manage.py migrate
python manage.py collectstatic --noinput

# Start Gunicorn server
gunicorn backend.wsgi:application --bind 0.0.0.0:8000
