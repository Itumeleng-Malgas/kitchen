FROM python:3.10-slim

WORKDIR /app

ARG ENV=prod
ENV ENV=${ENV}

RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD sh -c '\
  echo "Waiting for database..."; \
  while ! nc -z postgres 5432; do sleep 1; done; \
  echo "Database is up"; \
  \
  if [ "$ENV" = "dev" ]; then \
    alembic upgrade head; \
    exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload; \
  else \
    exec gunicorn app.main:app -c gunicorn.conf.py; \
  fi \
'


# FROM python:3.11-slim

# WORKDIR /app

# # Install netcat for database waiting
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     netcat-openbsd \
#     && rm -rf /var/lib/apt/lists/*

# # Copy and install Python dependencies
# COPY requirements.txt .
# RUN pip install --no-cache-dir -r requirements.txt

# # Copy app code
# COPY . .

# EXPOSE 8000

# CMD sh -c '\
#   echo "Waiting for database..."; \
#   while ! nc -z postgres 5432; do sleep 1; done; \
#   echo "Database is up"; \
#   echo "Running migrations..."; \
#   alembic upgrade head; \
#   echo "Starting Uvicorn..."; \
#   exec uvicorn app.main:app --host 0.0.0.0 --port 8000 \  
# '