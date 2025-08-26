#------------------------------------------------------------#
# Name: Sentiment Extraction Module
# Description: Bulk-extract sentiment scores for each row in an
#              Excel dataset using local LLMs and prompt templates.
#              Scores are written to a column named by model, e.g.,
#              'Sentiment_Orca2'.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 26/08/2025
# Python Version: 3.10.6
# Packages Required: pandas, openpyxl, llama-cpp-python
#------------------------------------------------------------#

# Import necessary libraries
from __future__ import annotations
import pandas as pd
import random
import re

# Import required modules
from models.llm_selection import llm_optimisation
from models import prompt as prompt_templates
from typing import Dict, Optional
from datetime import datetime
from pathlib import Path

# Define dictionary for LLM model paths and configurations
MODEL_REGISTRY: Dict[str, Dict[str, str]] = {
	# Orca 2 7B (Q6_K)
	"orca2": {
		"model_path": str(Path("models") / "orca-2-7b.Q6_K.gguf"),
		"column": "Sentiment_Orca2",
		"zero_shot": "CHAIN_OF_THOUGHT_ORCA",  # default to CoT-style reasoning for better consistency
	},
	# Llama 3.1 8B Instruct (Q4_K)
	"llama31_q4": {
		"model_path": str(Path("models") / "Llama-3.1-8B-Instruct-bf16-q4_k.gguf"),
		"column": "Sentiment_Llama31Q4",
		"zero_shot": "ZERO_SHOT_LLAMA",
	},
	# Llama 3.1 8B Instruct (IQ2-xxs)
	"llama31_iq2": {
		"model_path": str(Path("models") / "Llama-3.1-8B-Instruct-iq2_xxs.gguf"),
		"column": "Sentiment_Llama31IQ2",
		"zero_shot": "ZERO_SHOT_LLAMA",
	},
	# Bloomz 7b1 (Q4_K_M)
	"bloomz_7b1": {
		"model_path": str(Path("models") / "bloomz-7b1-mt-Q4_K_M.gguf"),
		"column": "Sentiment_Bloomz7b1",
		"zero_shot": "ZERO_SHOT_BLOOMZ",
	},
}

# Define internal function to assign corresponding prompt template based on LLM
def _select_template(model_key: str, mode: str = "zero-shot") -> str:
	"""Return the template string name for the given model and mode.

	mode can be one of: "zero-shot" (default), "few-shot", "cot".
	"""
	mode = mode.lower()
	if model_key == "orca2":
		if mode == "few-shot":
			return prompt_templates.FEW_SHOT_ORCA
		if mode in ("cot", "chain-of-thought", "chain_of_thought"):
			return prompt_templates.CHAIN_OF_THOUGHT_ORCA
		return prompt_templates.ZERO_SHOT_ORCA

	if model_key in ("llama31_q4", "llama31_iq2"):
		if mode == "few-shot":
			return prompt_templates.FEW_SHOT_LLAMA
		if mode in ("cot", "chain-of-thought", "chain_of_thought"):
			return prompt_templates.CHAIN_OF_THOUGHT_LLAMA
		return prompt_templates.ZERO_SHOT_LLAMA

	if model_key == "bloomz_7b1":
		if mode == "few-shot":
			return prompt_templates.FEW_SHOT_BLOOMZ
		if mode in ("cot", "chain-of-thought", "chain_of_thought"):
			return prompt_templates.CHAIN_OF_THOUGHT_BLOOMZ
		return prompt_templates.ZERO_SHOT_BLOOMZ

	raise ValueError(f"Unknown model key: {model_key}")

# Define internal function to parse sentiment score from model output
def _parse_score(text: str) -> Optional[float]:
	"""Extract the first numeric sentiment score in [-1.0, 1.0] from model output.

	Strategy:
	1) Look for explicit labels like 'Final Score:' or 'Sentiment score:'
	2) Fallback: first float between -1 and 1.
	- Handles unicode minus and comma decimals, and optional space after sign.
	Returns None if not found.
	"""
	# Return none if empty
	if not text:
		return None

	# Normalize unicode (minus sign) to ASCII minus
	text = text.replace("−", "-").replace("–", "-").replace("—", "-")

	# Priority patterns with labels (support comma or dot decimals, and optional space after sign)
	label_patterns = [
		r"(?i)final\s*score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
		r"(?i)sentiment\s*score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
		r"(?i)score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
	]
	for pat in label_patterns:
		m = re.search(pat, text)
		if m:
			try:
				val = float(m.group(1).replace(" ", "").replace(",", "."))
				if -1.0 <= val <= 1.0:
					return val
			except ValueError:
				pass

	# Generic float fallback to allow optional space after sign and comma decimals
	for m in re.finditer(r"([+-]?\s*\d+(?:[\.,]\d+)?)", text):
		try:
			val = float(m.group(1).replace(" ", "").replace(",", "."))
			if -1.0 <= val <= 1.0:
				return val
		except ValueError:
			continue

	return None

# Define internal function to generate response from LLM
def _generate_response(
	llm,
	prompt: str,
	*,
	max_tokens: int = 300,
	temperature: float = 0.7,
	top_p: float = 0.9,
	stop_after_newline: bool = False,
) -> str:
	"""Call llama.cpp model and return text output."""
	try:
		stops = ["<|eot_id|>", "<|end_of_text|>", "\n\nUser:", "\n\nHuman:"]
		if stop_after_newline:
			stops = ["\n"] + stops
		res = llm(
			prompt,
			max_tokens=max_tokens,
			temperature=temperature,
			top_p=top_p,
			repeat_penalty=1.15,
			stop=stops,
			echo=False,
		)
		return res.get("choices", [{}])[0].get("text", "").strip()
	except Exception as e:
		return f"ERROR: {e}"

# Define internal function to save DataFrame to Excel with backup
def _save_df(df: pd.DataFrame, path: Path | str) -> Path:
	path = Path(path)
	try:
		df.to_excel(path, index=False, engine="openpyxl")
		return path
	except Exception as e:
		backup = path.with_name(path.stem + f"_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}" + path.suffix)
		try:
			df.to_excel(backup, index=False, engine="openpyxl")
			print(f"Primary save failed to {path} ({e}); wrote backup to: {backup}")
			return backup
		except Exception as e2:
			print(f"Backup save failed as well: {e2}")
			raise

# Define function to analyse sentiment within 'merged_crypto_dataset.xlsx'
def score_excel(
	input_path: Path | str = Path("data") / "merged_crypto_dataset.xlsx",
	model_key: str = "llama31_iq2",
	mode: str = "zero-shot",
	title_col: str = "Title",
	output_path: Optional[Path | str] = None,
	limit: Optional[int] = 10,
	skip_existing: bool = True,
	concise: bool = True,
	gen_max_tokens: int = 24,
	gen_temperature: float = 0.2,
	gen_top_p: float = 0.9,
	in_place: bool = True,
	checkpoint_every: Optional[int] = 10,
	select_strategy: str = "sequential",
	random_seed: Optional[int] = None,
) -> Path:
	if model_key not in MODEL_REGISTRY:
		raise ValueError(f"model_key must be one of {list(MODEL_REGISTRY)}")

	input_path = Path(input_path)
	scored_path = input_path.with_name(input_path.stem + "_scored" + input_path.suffix)
	# Decide baseline (what we read) and write target (where we save)
	if in_place:
		baseline_path = input_path
		write_path = input_path
	else:
		# Prefer to read from existing scored file so skipping works across runs
		baseline_path = scored_path if scored_path.exists() else input_path
		if output_path is None:
			output_path = scored_path
		write_path = Path(output_path)

	# Resolve model path relative to this file's parent (project src root)
	src_root = Path(__file__).resolve().parent.parent  # .../src
	model_rel = MODEL_REGISTRY[model_key]["model_path"]
	model_path = (src_root / model_rel).resolve()
	out_col = MODEL_REGISTRY[model_key]["column"]

	# Load data
	df = pd.read_excel(baseline_path)
	if title_col not in df.columns:
		raise KeyError(f"Column '{title_col}' not found in {input_path.name}. Available: {list(df.columns)}")

	# Ensure output column exists so we can selectively update
	new_col_created = False
	if out_col not in df.columns:
		df[out_col] = pd.NA
		new_col_created = True

	# Build list of candidate row indices to process
	candidates = []
	# Treat only numeric values as "already scored" to avoid false positives
	existing_numeric = pd.to_numeric(df[out_col], errors="coerce") if out_col in df.columns else None
	for idx, text in enumerate(df[title_col].astype(str).tolist()):
		# Skip empty titles
		if not isinstance(text, str) or not text.strip():
			continue
		# Skip already-scored rows if requested
		if skip_existing and existing_numeric is not None and pd.notna(existing_numeric.iloc[idx]):
			continue
		candidates.append(idx)

	# Apply selection strategy and limit if provided
	if select_strategy.lower() == "random":
		if random_seed is not None:
			random.seed(random_seed)
		random.shuffle(candidates)
	elif select_strategy.lower() != "sequential":
		print(f"Unknown select_strategy '{select_strategy}', defaulting to 'random'")
		random.shuffle(candidates)

	if limit is not None:
		if limit <= 0:
			print("Limit <= 0 specified; nothing to do.")
			# Still write out unchanged file for transparency
			saved_path = _save_df(df, write_path)
			print(f"Wrote scores to: {saved_path}")
			return saved_path
		candidates = candidates[:limit]

	total = len(candidates)
	if total == 0:
		print("No rows to process (either all scored or titles empty).")
		saved_path = _save_df(df, write_path)
		print(f"Wrote scores to: {saved_path}")
		return saved_path

	# Initiate LLM one time
	llm = llm_optimisation(str(model_path))
	# Utilise concise prompt for quicker execution if requested
	if concise:
		template = (
			"You are a sentiment scorer. Output only a numeric sentiment score between -1 and 1 (inclusive).\n"
			"Post: {post}\n"
			"Score:"
		)
	else:
		template = _select_template(model_key, mode)

	processed_count = 0
	parse_failures = []
	for i, idx in enumerate(candidates, start=1):
		text = str(df.loc[idx, title_col]).strip()
		prompt = template.format(post=text)
		output = _generate_response(
			llm,
			prompt,
			max_tokens=gen_max_tokens,
			temperature=gen_temperature,
			top_p=gen_top_p,
			stop_after_newline=True if concise else False,
		)
		score = _parse_score(output)

		# If parsing failed, try a stricter prompt once
		if score is None:
			strict_prompt = (
				"Return ONLY a numeric sentiment score between -1 and 1. "
				"No words, no labels, first line only.\n"
				f"{text}\n"
			)
			strict_out = _generate_response(
				llm,
				strict_prompt,
				max_tokens=min(8, gen_max_tokens),
				temperature=0.0,
				top_p=1.0,
				stop_after_newline=True,
			)
			score = _parse_score(strict_out)
			if score is None:
				parse_failures.append({"row": idx, "out": output[:120], "fallback": strict_out[:120]})
		df.loc[idx, out_col] = score
		processed_count += 1

		# Progress with periodic checkpoint saves
		if (checkpoint_every and checkpoint_every > 0 and (i % checkpoint_every == 0)) or i == total:
			print(f"Processed {i}/{total} rows... last score={score}")
			_save_df(df, write_path)

	# If a new sentiment column was created, move it next to other Sentiment_* columns
	if new_col_created:
		cols = list(df.columns)
		sentiment_cols = [c for c in cols if c.lower().startswith("sentiment_") and c != out_col]
		if sentiment_cols:
			last_idx = max(cols.index(c) for c in sentiment_cols)

			# Move out_col just after the last existing sentiment column
			cols.remove(out_col)
			cols.insert(last_idx + 1, out_col)
			df = df[cols]
		else:
			# Place after title_col if present
			if title_col in df.columns:
				cols.remove(out_col)
				insert_pos = cols.index(title_col) + 1
				cols.insert(insert_pos, out_col)
				df = df[cols]

	# Save with openpyxl engine to preserve Excel format compatibility
	saved_path = _save_df(df, write_path)

	# Print validation stats in the terminal
	total_rows = len(df)
	total_scored_numeric = pd.to_numeric(df[out_col], errors="coerce").notna().sum()
	remaining = total_rows - total_scored_numeric
	print(
		f"Run summary for {out_col}: processed={processed_count}, total_scored={total_scored_numeric}, remaining={remaining}, total_rows={total_rows}"
	)
	if parse_failures:
		print(f"Parse failures this run: {len(parse_failures)} (showing up to 5)")
		for item in parse_failures[:5]:
			print(f"  row={item['row']} out='{item['out']}' fallback='{item['fallback']}'")
	print(f"Wrote scores to: {saved_path}")
	return saved_path