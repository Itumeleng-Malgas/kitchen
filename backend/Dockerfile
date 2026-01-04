FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x entrypoint.sh

# Use exec form for ENTRYPOINT with absolute path
ENTRYPOINT ["/app/entrypoint.sh"]