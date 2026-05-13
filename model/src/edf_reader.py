from __future__ import annotations

from pathlib import Path

import mne


def read_edf_file(edf_path: Path) -> dict:
    """Read an EDF file and return normalized signal metadata."""
    edf_path = Path(edf_path)
    if not edf_path.exists():
        raise FileNotFoundError(f"EDF file not found: {edf_path}")

    raw = mne.io.read_raw_edf(edf_path, preload=True, verbose="ERROR")
    signals = raw.get_data()
    sampling_frequency = float(raw.info["sfreq"])
    channel_names = list(raw.ch_names)
    duration_seconds = signals.shape[1] / sampling_frequency if signals.size else 0.0

    return {
        "signals": signals,
        "channel_names": channel_names,
        "sampling_frequency": sampling_frequency,
        "duration_seconds": duration_seconds,
    }
