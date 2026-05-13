from __future__ import annotations

import sys
from pathlib import Path
from typing import Iterable

import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier


ROOT_DIR = Path(__file__).resolve().parents[1]
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))

from config import (  # noqa: E402
    ANNOTATIONS_DIR,
    DEFAULT_MERGE_GAP_SECONDS,
    DEFAULT_STEP_SIZE_SECONDS,
    DEFAULT_WINDOW_SIZE_SECONDS,
    EDF_DIR,
    FEATURE_NAMES,
    MODEL_PATH,
    RANDOM_STATE,
)
from src.annotations import load_annotations  # noqa: E402
from src.edf_reader import read_edf_file  # noqa: E402
from src.features import extract_window_features  # noqa: E402
from src.windowing import create_windows  # noqa: E402


def overlaps_with_seizure(
    window_start: float, window_end: float, seizure_intervals: Iterable[dict]
) -> bool:
    for interval in seizure_intervals:
        overlap_start = max(window_start, interval["start"])
        overlap_end = min(window_end, interval["end"])
        if overlap_start < overlap_end:
            return True
    return False


def train() -> None:
    edf_files = sorted(EDF_DIR.glob("*.edf"))
    if not edf_files:
        raise FileNotFoundError(f"No EDF files found in {EDF_DIR}")

    annotations = load_annotations(ANNOTATIONS_DIR)
    features = []
    labels = []
    reference_channels: list[str] | None = None
    used_files = 0
    skipped_files: list[str] = []

    for edf_path in edf_files:
        eeg = read_edf_file(edf_path)
        file_name = edf_path.name
        seizure_intervals = annotations.get(file_name, [])

        if reference_channels is None:
            reference_channels = list(eeg["channel_names"])

        channel_index = {name: idx for idx, name in enumerate(eeg["channel_names"])}
        missing_channels = [
            channel for channel in reference_channels if channel not in channel_index
        ]
        if missing_channels:
            skipped_files.append(f"{file_name} (missing channels: {missing_channels})")
            continue

        aligned_indices = [channel_index[name] for name in reference_channels]
        aligned_signals = eeg["signals"][aligned_indices, :]
        windows = create_windows(
            aligned_signals,
            eeg["sampling_frequency"],
            window_size_seconds=DEFAULT_WINDOW_SIZE_SECONDS,
            step_size_seconds=DEFAULT_STEP_SIZE_SECONDS,
        )
        if not windows:
            skipped_files.append(f"{file_name} (signal shorter than one window)")
            continue

        for window in windows:
            features.append(extract_window_features(window["signal"]))
            labels.append(
                int(
                    overlaps_with_seizure(
                        window["start_time_seconds"],
                        window["end_time_seconds"],
                        seizure_intervals,
                    )
                )
            )

        used_files += 1

    if not features:
        raise RuntimeError("No training windows were generated from the provided EDF files")

    X = np.vstack(features)
    y = np.asarray(labels, dtype=np.int64)

    model = RandomForestClassifier(
        n_estimators=200,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    model.fit(X, y)

    MODEL_PATH.parent.mkdir(parents=True, exist_ok=True)
    artifact = {
        "model": model,
        "window_size_seconds": DEFAULT_WINDOW_SIZE_SECONDS,
        "step_size_seconds": DEFAULT_STEP_SIZE_SECONDS,
        "merge_gap_seconds": DEFAULT_MERGE_GAP_SECONDS,
        "feature_names": list(FEATURE_NAMES),
        "channel_names": reference_channels or [],
    }
    joblib.dump(artifact, MODEL_PATH)

    seizure_windows = int(y.sum())
    non_seizure_windows = int(len(y) - seizure_windows)

    print(f"EDF files used: {used_files}")
    print(f"Total windows: {len(y)}")
    print(f"Seizure windows: {seizure_windows}")
    print(f"Non-seizure windows: {non_seizure_windows}")
    print(f"Model saved to: {MODEL_PATH}")
    if skipped_files:
        print("Skipped files:")
        for item in skipped_files:
            print(f"  - {item}")


if __name__ == "__main__":
    train()
