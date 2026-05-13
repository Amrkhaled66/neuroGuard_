from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np

from config import DEFAULT_MERGE_GAP_SECONDS, MODEL_PATH
from src.counting import merge_predicted_windows
from src.edf_reader import read_edf_file
from src.features import extract_features_from_windows
from src.windowing import create_windows


def load_model_artifact(model_path: Path = MODEL_PATH) -> dict:
    model_path = Path(model_path)
    if not model_path.exists():
        raise FileNotFoundError(f"Model artifact not found: {model_path}")
    artifact = joblib.load(model_path)
    required_keys = {"model", "window_size_seconds", "step_size_seconds", "channel_names"}
    missing = required_keys.difference(artifact)
    if missing:
        raise ValueError(f"Model artifact is missing required keys: {sorted(missing)}")
    return artifact


def _align_signals_to_channels(
    signals: np.ndarray, channel_names: list[str], expected_channels: list[str]
) -> np.ndarray:
    channel_index = {name: idx for idx, name in enumerate(channel_names)}
    missing_channels = [name for name in expected_channels if name not in channel_index]
    if missing_channels:
        raise ValueError(f"EDF file is missing required channels: {missing_channels}")
    ordered_indices = [channel_index[name] for name in expected_channels]
    return signals[ordered_indices, :]


def predict_seizure_windows(edf_path: Path, model_path: Path = MODEL_PATH) -> dict:
    artifact = load_model_artifact(model_path)
    eeg = read_edf_file(edf_path)
    aligned_signals = _align_signals_to_channels(
        eeg["signals"], eeg["channel_names"], artifact["channel_names"]
    )

    windows = create_windows(
        aligned_signals,
        eeg["sampling_frequency"],
        window_size_seconds=artifact["window_size_seconds"],
        step_size_seconds=artifact["step_size_seconds"],
    )
    if not windows:
        return {"predicted_windows": [], "seizure_count": 0, "seizures": []}

    features = extract_features_from_windows(windows)
    predictions = artifact["model"].predict(features)

    predicted_windows = []
    for window, label in zip(windows, predictions):
        if int(label) == 1:
            predicted_windows.append(
                {
                    "start_time_seconds": window["start_time_seconds"],
                    "end_time_seconds": window["end_time_seconds"],
                }
            )

    merged = merge_predicted_windows(
        predicted_windows,
        max_gap_seconds=artifact.get("merge_gap_seconds", DEFAULT_MERGE_GAP_SECONDS),
    )
    return {"predicted_windows": predicted_windows, **merged}
