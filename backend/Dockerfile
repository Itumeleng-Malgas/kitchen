FROM python:3.11-slim

WORKDIR /app

# Install netcat for database waiting
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY . .

EXPOSE 8000

CMD sh -c '\
  echo "Waiting for database..."; \
  while ! nc -z postgres 5432; do sleep 1; done; \
  echo "Database is up"; \
  echo "Running migrations..."; \
  alembic upgrade head; \
  echo "Starting Uvicorn..."; \
  exec uvicorn app.main:app --host 0.0.0.0 --port 8000 \
'