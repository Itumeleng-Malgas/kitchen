#!/bin/sh
set -e

echo "Waiting for database..."

while ! nc -z postgres 5432; do
  sleep 1
done

echo "Database is up"

echo "Running migrations..."
alembic upgrade head

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
