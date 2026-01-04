FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Ensure entrypoint is executable
RUN chmod +x entrypoint.sh

# Use absolute path
ENTRYPOINT ["/app/entrypoint.sh"]
