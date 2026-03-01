# ── Stage 1: install dependencies ─────────────────────────────────────
FROM python:3.11-slim AS builder

WORKDIR /app

# System libs needed by Pillow / onnxruntime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# ── Stage 2: runtime image ─────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libglib2.0-0 \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed packages from builder stage
COPY --from=builder /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

COPY main.py .

# Pre-download the BiRefNet model weights at build time so first request is instant.
# rembg stores models in ~/.u2net – we set a custom cache dir.
ENV U2NET_HOME=/app/models
RUN python -c "from rembg import new_session; new_session('birefnet-general')" || \
    python -c "from rembg import new_session; new_session('isnet-general-use')" || \
    python -c "from rembg import new_session; new_session('u2net')"

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "1"]
