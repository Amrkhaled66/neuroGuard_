from __future__ import annotations

from typing import List

import numpy as np


def create_windows(
    signals: np.ndarray,
    sampling_frequency: float,
    window_size_seconds: int = 10,
    step_size_seconds: int = 5,
) -> List[dict]:
    """Split EEG data into overlapping windows with timestamps."""
    if signals.ndim != 2:
        raise ValueError("Signals must be a 2D array of shape (channels, samples)")
    if sampling_frequency <= 0:
        raise ValueError("Sampling frequency must be positive")
    if window_size_seconds <= 0 or step_size_seconds <= 0:
        raise ValueError("Window and step sizes must be positive")

    window_samples = int(window_size_seconds * sampling_frequency)
    step_samples = int(step_size_seconds * sampling_frequency)
    total_samples = signals.shape[1]

    if total_samples < window_samples:
        return []

    windows: List[dict] = []
    for start_sample in range(0, total_samples - window_samples + 1, step_samples):
        end_sample = start_sample + window_samples
        windows.append(
            {
                "signal": signals[:, start_sample:end_sample],
                "start_time_seconds": start_sample / sampling_frequency,
                "end_time_seconds": end_sample / sampling_frequency,
            }
        )
    return windows
