FROM python:3.12-alpine

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    LOG_PATH=/logs/bedrock.log \
    HOST=0.0.0.0 \
    PORT=8081 \
    DEFAULT_LINES=300 \
    MAX_LINES=3000

WORKDIR /app
COPY infra/log-viewer/server.py /app/server.py

EXPOSE 8081
CMD ["python", "/app/server.py"]
