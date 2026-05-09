from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from app.routes.generate import router as generate_router
from app.routes.summarize import router as summarize_router

# Ensure generated folder exists
os.makedirs("app/generated", exist_ok=True)

app = FastAPI(
    title="SlideAI API",
    description="AI-powered presentation generator",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(generate_router, prefix="/api", tags=["Generate"])
app.include_router(summarize_router, prefix="/api", tags=["Summarize"])

# Serve generated files
app.mount("/files", StaticFiles(directory="app/generated"), name="files")

@app.get("/")
async def root():
    return {"message": "SlideAI API is running ✅", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "healthy"}
