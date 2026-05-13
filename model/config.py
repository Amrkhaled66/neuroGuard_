from pathlib import Path


BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent.parent
DATA_DIR = BASE_DIR / "data"
EDF_DIR = DATA_DIR / "edf"
ANNOTATIONS_DIR = DATA_DIR / "annotations"
PROCESSED_DIR = DATA_DIR / "processed"
MODELS_DIR = BASE_DIR / "models"
MODEL_PATH = MODELS_DIR / "seizure_detector.pkl"
SESSION_DIR = PROJECT_ROOT / "Session"

DEFAULT_WINDOW_SIZE_SECONDS = 10
DEFAULT_STEP_SIZE_SECONDS = 5
DEFAULT_MERGE_GAP_SECONDS = 10
RANDOM_STATE = 42

FEATURE_NAMES = ("mean", "std", "min", "max", "var", "energy")
