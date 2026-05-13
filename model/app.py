from __future__ import annotations

from pathlib import Path

from flask import Flask, jsonify, request

from config import BASE_DIR, MODEL_PATH, SESSION_DIR
from src.predict import predict_seizure_windows


app = Flask(__name__)


def _resolve_edf_path(user_path: str) -> Path:
    if not user_path:
        raise ValueError("`edf_file` is required")

    candidate = Path(user_path)
    if candidate.is_absolute():
        resolved = candidate.resolve(strict=False)
    else:
        resolved = (SESSION_DIR / candidate).resolve(strict=False)

    allowed_root = SESSION_DIR.resolve(strict=False)
    try:
        resolved.relative_to(allowed_root)
    except ValueError as exc:
        raise ValueError(f"EDF path must be inside {SESSION_DIR.name}") from exc

    if resolved.suffix.lower() != ".edf":
        raise ValueError("Only .edf files are allowed")
    if not resolved.exists() or not resolved.is_file():
        raise FileNotFoundError(f"EDF file not found: {resolved}")
    return resolved


@app.get("/")
def index():
    return jsonify({"message": "Neuro Guard AI API is running"})


@app.get("/model/status")
def model_status():
    return jsonify(
        {
            "model_exists": MODEL_PATH.exists(),
            "model_path": str(MODEL_PATH.relative_to(BASE_DIR)),
        }
    )


@app.post("/predict-seizures")
def predict_seizures():
    payload = request.get_json(silent=True) or {}
    try:
        edf_path = _resolve_edf_path(payload.get("edf_file", ""))
        prediction = predict_seizure_windows(edf_path, MODEL_PATH)
    except (ValueError, FileNotFoundError) as exc:
        return jsonify({"success": False, "error": str(exc)}), 400
    except Exception as exc:  # pragma: no cover - defensive API boundary
        return jsonify({"success": False, "error": str(exc)}), 500

    return jsonify(
        {
            "success": True,
            "file": edf_path.name,
            "resolved_path": str(edf_path.relative_to(SESSION_DIR.resolve(strict=False))),
            "seizure_count": prediction["seizure_count"],
            "seizures": prediction["seizures"],
        }
    )


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
