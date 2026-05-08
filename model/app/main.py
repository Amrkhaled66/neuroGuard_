# app/main.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from pathlib import Path

from app.services.ai_model import process_file_with_ai

app = FastAPI()


class FilePathRequest(BaseModel):
    file_path: str


@app.post("/process")
def process_file(request: FilePathRequest):
    file_path = Path(request.file_path)

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    if not file_path.is_file():
        raise HTTPException(status_code=400, detail="Path is not a file")

    result = process_file_with_ai(str(file_path))

    return {
        "result": result
    }