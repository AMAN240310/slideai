import os
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.models.schemas import GenerateRequest
from app.services import gemini_service, unsplash_service, ppt_service, pdf_service

router = APIRouter()
_file_registry: dict = {}   # file_id → filepath


def _cleanup(path: str):
    try:
        if os.path.exists(path):
            os.remove(path)
    except Exception:
        pass


@router.post("/generate-ppt")
async def generate_ppt(req: GenerateRequest, background_tasks: BackgroundTasks):
    try:
        # 1. Generate slide JSON via Gemini
        data = await gemini_service.generate_presentation_json(
            req.prompt, req.slide_count, req.language
        )

        # 2. Determine image limit and fetch
        limit    = 2 if req.slide_count <= 5 else 4 if req.slide_count <= 10 else 5
        img_map  = await unsplash_service.fetch_images_for_slides(data["slides"], max_images=limit)

        # 3. Build file
        if req.file_type == "pptx":
            filepath, file_id = ppt_service.generate_pptx(data, req.theme, img_map)
            media_type        = "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            ext               = "pptx"
        else:
            filepath, file_id = pdf_service.generate_pdf(data, req.theme, img_map)
            media_type        = "application/pdf"
            ext               = "pdf"

        _file_registry[file_id] = filepath

        # Schedule cleanup after 10 min
        background_tasks.add_task(_delayed_cleanup, filepath, 600)

        return {
            "success":   True,
            "file_id":   file_id,
            "title":     data.get("title"),
            "slides":    data.get("slides"),
            "download_url": f"/api/download/{file_id}",
            "file_type": ext,
        }

    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Generation failed: {str(e)}")


@router.get("/download/{file_id}")
async def download_file(file_id: str):
    filepath = _file_registry.get(file_id)
    if not filepath or not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail="File not found or expired")

    ext      = filepath.split(".")[-1]
    media    = ("application/pdf" if ext == "pdf"
                else "application/vnd.openxmlformats-officedocument.presentationml.presentation")
    return FileResponse(
        filepath,
        media_type=media,
        filename=f"slideai_presentation.{ext}",
        headers={"Content-Disposition": f"attachment; filename=slideai_presentation.{ext}"},
    )


import asyncio

async def _delayed_cleanup(path: str, delay: int):
    await asyncio.sleep(delay)
    _cleanup(path)
