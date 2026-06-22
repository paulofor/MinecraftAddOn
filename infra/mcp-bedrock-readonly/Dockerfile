FROM python:3.12-slim AS wheel-builder

RUN apt-get update && \
    apt-get install -y --no-install-recommends g++ && \
    rm -rf /var/lib/apt/lists/*

RUN pip wheel --no-cache-dir --wheel-dir /wheels amulet-leveldb==1.0.6

FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY --from=wheel-builder /wheels /wheels
RUN pip install --no-cache-dir /wheels/*.whl && \
    rm -rf /wheels

COPY infra/mcp-bedrock-readonly/server.py /app/server.py

RUN chmod 755 /app/server.py && \
    chmod 755 /root

# Necessário para permitir escrita em caminhos do mundo Bedrock (ex.: worlds/*/resource_packs)
# ao usar a tool write_png_base64 no host montado em /root/MinecraftServer.
USER root
ENTRYPOINT ["python", "/app/server.py"]
