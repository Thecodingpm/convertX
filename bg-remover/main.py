import io
import logging
import os

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.responses import StreamingResponse
from rembg import new_session, remove

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="pdfconvertx BG Remover", version="1.0.0")

# Use BiRefNet for best quality (near-Canva level)
# Falls back to isnet-general-use if BiRefNet isn't available
try:
    logger.info("Loading BiRefNet model (this may take a moment on first boot)...")
    session = new_session("birefnet-general")
    logger.info("BiRefNet model loaded successfully.")
except Exception as e:
    logger.warning(f"BiRefNet failed to load ({e}), falling back to isnet-general-use.")
    try:
        session = new_session("isnet-general-use")
    except Exception:
        session = new_session("u2net")


@app.get("/health")
def health():
    return {"status": "ok", "model": str(session)}


@app.post("/remove-bg")
async def remove_background(file: UploadFile = File(...)):
    # Validate file type
    allowed = {"image/jpeg", "image/jpg", "image/png", "image/webp", "image/bmp"}
    if file.content_type not in allowed:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type: {file.content_type}. Allowed: jpeg, png, webp, bmp",
        )

    # Validate file size (max 20MB)
    contents = await file.read()
    if len(contents) > 20 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 20MB allowed.")

    try:
        logger.info(f"Processing background removal for {file.filename} ({len(contents)} bytes)")
        output_bytes = remove(contents, session=session)
        logger.info("Background removal complete.")
        return StreamingResponse(
            io.BytesIO(output_bytes),
            media_type="image/png",
            headers={"Content-Disposition": f"attachment; filename=bg-removed.png"},
        )
    except Exception as e:
        logger.error(f"Background removal failed: {e}")
        raise HTTPException(status_code=500, detail=f"Processing failed: {str(e)}")
