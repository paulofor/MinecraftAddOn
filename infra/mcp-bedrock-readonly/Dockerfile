FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app
COPY infra/mcp-bedrock-readonly/server.py /app/server.py

RUN adduser --disabled-password --gecos '' appuser && \
    chmod 755 /app/server.py && \
    chmod 755 /root

USER appuser
ENTRYPOINT ["python", "/app/server.py"]
