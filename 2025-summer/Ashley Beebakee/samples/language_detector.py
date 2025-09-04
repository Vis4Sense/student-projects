#-------------------------------------------------------------------------------#
# Name: Language Detector (Datasets)
# Description: This script detects the language of text data in a dataset by
#              analysing specific text columns and applying a majority vote
#              mechanism to determine the most likely language, which is then
#              mapped to a standardised set of language names onto a new column.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 01/09/2025
# Python Version: 3.10.6
# Packages Required: langdetect, pandas
# Variables (to modify): TEXT_COLS, path (parameter of main() function)
#-------------------------------------------------------------------------------#
# You can run this script from CMD to process your dataset in two ways:
# -> python lang_detector.py
# OR
# -> python lang_detector.py /path/to/your/dataset.xlsx
#-------------------------------------------------------------------------------#

# Import necessary libraries
from langdetect import detect, DetectorFactory, LangDetectException
from collections import Counter
import pandas as pd
import pathlib
import sys

# Make langdetect deterministic
DetectorFactory.seed = 0

# Define allowed languages based on your requirements
ALLOWED = {
    "en": "English",
    "de": "German",
    "fr": "French",
    "es": "Spanish",
    "it": "Italian",
}

# Define text columns to analyse for language detection
TEXT_COLS = ["Description", "Title", "Source"]  # Order them based on priority

def safe_detect(text: str):
    """Return a detected language code or None if uncertain."""
    if not isinstance(text, str):
        return None
    txt = text.strip()
    if not txt:
        return None
    try:
        code = detect(txt)
        return code if code in ALLOWED else None
    except LangDetectException:
        return None

def choose_language(row):
    """Pick the best language from Description, Title, Source (majority vote)."""
    votes = []
    for col in TEXT_COLS:
        code = safe_detect(row.get(col))
        if code:
            votes.append(code)

    if not votes:
        return None

    # Majority vote, if tie, respect TEXT_COLS priority (Description > Title > Source)
    counts = Counter(votes)
    top_count = max(counts.values())
    tied = [c for c, n in counts.items() if n == top_count]

    if len(tied) == 1:
        return ALLOWED[tied[0]]

    # Tie-break by first column that produced a tied code in priority order
    for col in TEXT_COLS:
        code = safe_detect(row.get(col))
        if code in tied:
            return ALLOWED[code]

    return None

# N.B: change the 'path' variable to your desired dataset
def main(path="./data/news_api_crypto_dataset.xlsx"):
    """Main function to read dataset, detect languages, and save results."""
    path = pathlib.Path(path)
    df = pd.read_excel(path)

    # Ensure that the 'Language' column exists
    if "Language" not in df.columns:
        df["Language"] = None

    # Fill-in only missing/blank values
    mask_missing = df["Language"].isna() | (df["Language"].astype(str).str.strip() == "")
    df_missing = df[mask_missing].copy()
    
    if not df_missing.empty:
        df.loc[mask_missing, "Language"] = df_missing.apply(choose_language, axis=1)

    # Normalise any pre-filled values to our allowed set (map common names/codes)
    norm_map = {
        "english": "English", "en": "English",
        "german": "German", "de": "German",
        "french": "French", "fr": "French",
        "spanish": "Spanish", "es": "Spanish",
        "italian": "Italian", "it": "Italian",
    }
    def normalize(val):
        if not isinstance(val, str):
            return val
        key = val.strip().lower()
        return norm_map.get(key, val)

    df["Language"] = df["Language"].apply(normalize)

    # Output file paths for .xlsx and .csv file versions
    out_base = path.with_name(path.stem + "_with_languages")
    xlsx = out_base.with_suffix(".xlsx")
    csv = out_base.with_suffix(".csv")

    # Create .xlsx .csv file versions
    df.to_excel(xlsx, index=False)
    df.to_csv(csv, index=False, encoding="utf-8")
    
    print(f"Wrote:\n- {xlsx}\n- {csv}")

if __name__ == "__main__":
    # Allow command line override but default to news_api dataset
    path = sys.argv[1] if len(sys.argv) > 1 else "./data/newsapi_crypto_dataset.xlsx" # Replace with your dataset's file path
    main(path)
