FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends libleveldb1d && \
    pip install --no-cache-dir plyvel==1.5.1 && \
    rm -rf /var/lib/apt/lists/*

COPY infra/mcp-bedrock-readonly/server.py /app/server.py

RUN chmod 755 /app/server.py && \
    chmod 755 /root

# Necessário para permitir escrita em caminhos do mundo Bedrock (ex.: worlds/*/resource_packs)
# ao usar a tool write_png_base64 no host montado em /root/MinecraftServer.
USER root
ENTRYPOINT ["python", "/app/server.py"]
