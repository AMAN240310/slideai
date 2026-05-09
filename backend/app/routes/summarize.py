from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from app.models.schemas import SummarizeRequest
from app.services import gemini_service
from app.services.pdf_summary_service import generate_summary_pdf

router = APIRouter()
_summary_files: dict = {}


@router.post("/summarize")
async def summarize(req: SummarizeRequest, background_tasks: BackgroundTasks):
    try:
        summary = await gemini_service.summarize_text(req.text)

        result  = {"success": True, "summary": summary}

        if req.export_type == "pdf":
            filepath, file_id     = generate_summary_pdf(summary)
            _summary_files[file_id] = filepath
            result["pdf_url"]     = f"/api/download-summary/{file_id}"

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/download-summary/{file_id}")
async def download_summary(file_id: str):
    filepath = _summary_files.get(file_id)
    if not filepath:
        raise HTTPException(status_code=404, detail="Summary PDF not found")
    return FileResponse(filepath, media_type="application/pdf",
                        filename="slideai_summary.pdf")
