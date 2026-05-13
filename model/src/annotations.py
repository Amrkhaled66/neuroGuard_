from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List


FILE_NAME_RE = re.compile(r"^File Name:\s*(?P<name>.+)$", re.IGNORECASE)
SEIZURE_COUNT_RE = re.compile(
    r"^Number of Seizures in File:\s*(?P<count>\d+)$", re.IGNORECASE
)
SEIZURE_START_RE = re.compile(
    r"^Seizure Start Time:\s*(?P<start>\d+)\s+seconds$", re.IGNORECASE
)
SEIZURE_END_RE = re.compile(
    r"^Seizure End Time:\s*(?P<end>\d+)\s+seconds$", re.IGNORECASE
)


def parse_annotation_summary(summary_path: Path) -> Dict[str, List[dict]]:
    """Parse one CHB-MIT-style annotation summary file."""
    summary_path = Path(summary_path)
    if not summary_path.exists():
        raise FileNotFoundError(f"Annotation file not found: {summary_path}")

    annotations: Dict[str, List[dict]] = {}
    current_file: str | None = None
    expected_seizures = 0
    current_intervals: List[dict] = []
    pending_start: int | None = None

    def flush_current() -> None:
        nonlocal current_file, expected_seizures, current_intervals, pending_start
        if current_file is not None:
            if pending_start is not None:
                raise ValueError(
                    f"Incomplete seizure interval for {current_file} in {summary_path}"
                )
            if expected_seizures != len(current_intervals):
                raise ValueError(
                    f"Expected {expected_seizures} seizures for {current_file} "
                    f"but found {len(current_intervals)} in {summary_path}"
                )
            annotations[current_file] = current_intervals
        current_file = None
        expected_seizures = 0
        current_intervals = []
        pending_start = None

    for raw_line in summary_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line:
            continue

        file_match = FILE_NAME_RE.match(line)
        if file_match:
            flush_current()
            current_file = file_match.group("name")
            continue

        if current_file is None:
            continue

        seizure_count_match = SEIZURE_COUNT_RE.match(line)
        if seizure_count_match:
            expected_seizures = int(seizure_count_match.group("count"))
            continue

        seizure_start_match = SEIZURE_START_RE.match(line)
        if seizure_start_match:
            pending_start = int(seizure_start_match.group("start"))
            continue

        seizure_end_match = SEIZURE_END_RE.match(line)
        if seizure_end_match:
            if pending_start is None:
                raise ValueError(
                    f"Found seizure end without start for {current_file} in {summary_path}"
                )
            end = int(seizure_end_match.group("end"))
            if end < pending_start:
                raise ValueError(
                    f"Seizure end before start for {current_file} in {summary_path}"
                )
            current_intervals.append({"start": pending_start, "end": end})
            pending_start = None

    flush_current()
    return annotations


def load_annotations(annotation_dir: Path) -> Dict[str, List[dict]]:
    """Load and merge all TXT annotation summaries from a directory."""
    annotation_dir = Path(annotation_dir)
    if not annotation_dir.exists():
        raise FileNotFoundError(f"Annotation directory not found: {annotation_dir}")

    combined: Dict[str, List[dict]] = {}
    for summary_path in sorted(annotation_dir.glob("*.txt")):
        parsed = parse_annotation_summary(summary_path)
        for file_name, intervals in parsed.items():
            if file_name in combined:
                raise ValueError(f"Duplicate annotations found for {file_name}")
            combined[file_name] = intervals
    return combined
