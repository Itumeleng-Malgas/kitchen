FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

# Wait for DB, run migrations, start app — all inline
CMD sh -c '\
  echo "Waiting for database..."; \
  while ! nc -z postgres 5432; do sleep 1; done; \
  echo "Database is up"; \
  echo "Running migrations..."; \
  alembic upgrade head; \
  echo "Starting application..."; \
  exec uvicorn app.main:app --host 0.0.0.0 --port 8000 \
'
