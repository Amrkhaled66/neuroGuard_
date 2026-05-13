from __future__ import annotations

from typing import List


def merge_predicted_windows(
    predicted_windows: List[dict], max_gap_seconds: int = 10
) -> dict:
    """Merge predicted seizure windows into seizure events."""
    if not predicted_windows:
        return {"seizure_count": 0, "seizures": []}

    sorted_windows = sorted(
        predicted_windows, key=lambda item: item["start_time_seconds"]
    )
    merged: List[dict] = []

    current = {
        "start_time_seconds": sorted_windows[0]["start_time_seconds"],
        "end_time_seconds": sorted_windows[0]["end_time_seconds"],
    }

    for window in sorted_windows[1:]:
        gap = window["start_time_seconds"] - current["end_time_seconds"]
        if gap <= max_gap_seconds:
            current["end_time_seconds"] = max(
                current["end_time_seconds"], window["end_time_seconds"]
            )
            continue

        merged.append(current)
        current = {
            "start_time_seconds": window["start_time_seconds"],
            "end_time_seconds": window["end_time_seconds"],
        }

    merged.append(current)
    return {"seizure_count": len(merged), "seizures": merged}
