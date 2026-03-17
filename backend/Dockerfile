FROM python:3.10-slim

WORKDIR /app

# System-Dependencies installieren
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Python Dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Backend Code kopieren
COPY backend/app ./app
COPY backend/main.py .

EXPOSE 8000

CMD ["python", "main.py"]
