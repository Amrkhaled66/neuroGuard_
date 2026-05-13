from __future__ import annotations

from typing import Iterable, List

import numpy as np


def extract_window_features(window_signal: np.ndarray) -> np.ndarray:
    """Extract fixed-order channel-wise statistical features from one window."""
    if window_signal.ndim != 2:
        raise ValueError("Window signal must be 2D with shape (channels, samples)")

    feature_vector: List[float] = []
    for channel_signal in window_signal:
        feature_vector.extend(
            [
                float(np.mean(channel_signal)),
                float(np.std(channel_signal)),
                float(np.min(channel_signal)),
                float(np.max(channel_signal)),
                float(np.var(channel_signal)),
                float(np.sum(np.square(channel_signal))),
            ]
        )
    return np.asarray(feature_vector, dtype=np.float64)


def extract_features_from_windows(windows: Iterable[dict]) -> np.ndarray:
    """Extract feature vectors from a sequence of windows."""
    feature_rows = [extract_window_features(window["signal"]) for window in windows]
    if not feature_rows:
        return np.empty((0, 0), dtype=np.float64)
    return np.vstack(feature_rows)
