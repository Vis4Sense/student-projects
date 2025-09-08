#------------------------------------------------------------#
# Name: Sentiment Extraction Module
# Description: Bulk-extract sentiment scores for each row in 
#              an Excel dataset using local LLMs and prompt 
#              templates. Scores are written to a column named 
#              by model, e.g. 'Sentiment_Orca2'.
# Author: Ashley Beebakee (https://github.com/OmniAshley)
# Last Updated: 06/09/2025
# Python Version: 3.10.6
# Packages Required: pandas
#------------------------------------------------------------#

# Import necessary libraries
from __future__ import annotations
import pandas as pd
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
		"zero_shot": "CHAIN_OF_THOUGHT_ORCA",
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

# Define function to assign corresponding prompt template based on LLM
def select_template(model_key: str, mode: str = "zero-shot"):
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

# Define function to parse sentiment score from model output
# N.B: -> implies that the function is expected to return that type (hint) 
def parse_score(text: str) -> Optional[float]:
	# Return none if empty
	if not text:
		return None

	# Normalise Unicode (minus sign) to ASCII minus
	text = text.replace("−", "-").replace("–", "-").replace("—", "-")

	# Priority patterns with labels (support comma or dot decimals, and optional space after sign)
	label_patterns = [
		r"(?i)final\s*score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
		r"(?i)sentiment\s*score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
		r"(?i)score\s*[:\-]\s*([+-]?\s*\d+(?:[\.,]\d+)?)",
	]
	# Look for explicit labels i.e. Final Score, Sentiment score, Score (-1.0 to 1.0)
	for pat in label_patterns:
		m = re.search(pat, text)
		if m:
			try:
				val = float(m.group(1).replace(" ", "").replace(",", "."))
				# Look for first float between -1.0 and 1.0
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

# Define function to generate response from LLM
def generate_response(
	llm,
	prompt: str,
	*,
	max_tokens: int = 300,
	temperature: float = 0.7,
	top_p: float = 0.9,
	stop_after_newline: bool = False,
):
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

# Define function to save DataFrame to Excel with backup
def save_df(df: pd.DataFrame, path: Path | str):
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
	limit: Optional[int] = 10,
	skip_existing: bool = True,
	default_prompt: bool = False,
	gen_max_tokens: int = 24,
	gen_temperature: float = 0.2,
	gen_top_p: float = 0.9,
	checkpoint_every: Optional[int] = 10,
):
	if model_key not in MODEL_REGISTRY:
		raise ValueError(f"model_key must be one of {list(MODEL_REGISTRY)}")

	# Clarify value of the "input_path" variable (optional)
	input_path = Path(input_path)

	# Resolve model path relative to the parent of the script
	src_path = Path(__file__).resolve().parent.parent
	model_rel = MODEL_REGISTRY[model_key]["model_path"]
	model_path = (src_path / model_rel).resolve()
	output_col = MODEL_REGISTRY[model_key]["column"]

	# Load merged_crypto_dataset.xlsx
	df = pd.read_excel(input_path)

	# Ensure output column exists to selectively update it with sentiment scores
	create_new_col = False
	if output_col not in df.columns:
		df[output_col] = pd.NA
		create_new_col = True

	# Build list of candidate row indices to process
	cells = []
	# Treat only numeric values as "already scored" to avoid false positives
	existing_numeric = pd.to_numeric(df[output_col], errors="coerce") if output_col in df.columns else None
	for idx, text in enumerate(df[title_col].astype(str).tolist()):
		# Skip empty titles since they cannot be scored
		if not isinstance(text, str) or not text.strip():
			continue
		# Skip rows that have already been scored (if skip_existing boolean is set to "True")
		if skip_existing and existing_numeric is not None and pd.notna(existing_numeric.iloc[idx]):
			continue
		cells.append(idx)

	# Set specified limit for cells for which to extract sentiment scores from
	cells = cells[:limit]

	# Verify if the dataset's specified sentiment column is fully populated
	total = len(cells) 
	if total == 0:
		print("No rows to process (either all scored or titles empty).")
		saved_path = save_df(df, input_path)
		print(f"Wrote scores to: {saved_path}")
		return saved_path

	# Initiate Large Language Model (LLM)
	llm = llm_optimisation(str(model_path))

	# Utilise default prompt for quicker execution if requested
	if default_prompt:
		template = (
			"You are a sentiment scorer. Output only a numeric sentiment score between -1 and 1 (inclusive).\n"
			"Post: {post}\n"
			"Score:"
		)
	else:
		template = select_template(model_key, mode)

	# Initialise counters and error tracking
	processed_count = 0
	parse_failures = []
	for i, idx in enumerate(cells, start=1):
		text = str(df.loc[idx, title_col]).strip()
		prompt = template.format(post=text)
		output = generate_response(
			llm,
			prompt,
			max_tokens=gen_max_tokens,
			temperature=gen_temperature,
			top_p=gen_top_p,
			stop_after_newline=True if default_prompt else False,
		)
		score = parse_score(output)

		# If the parsing failed, try a stricter prompt one time
		if score is None:
			strict_prompt = (
				"Return ONLY a numeric sentiment score between -1 and 1. "
				"No words, no labels, first line only.\n"
				f"{text}\n"
			)
			strict_out = generate_response(
				llm,
				strict_prompt,
				max_tokens=min(8, gen_max_tokens),
				temperature=0.0,
				top_p=1.0,
				stop_after_newline=True,
			)
			score = parse_score(strict_out)
			if score is None:
				parse_failures.append({"row": idx, "out": output[:120], "fallback": strict_out[:120]})
		df.loc[idx, output_col] = score
		processed_count += 1

		# Progress with periodic checkpoint saves
		if (checkpoint_every and checkpoint_every > 0 and (i % checkpoint_every == 0)) or i == total:
			print(f"Processed {i}/{total} rows... last score={score}")
			save_df(df, input_path)

	# If a new sentiment column was created, move it next to other "Sentiment_" columns
	if create_new_col:
		cols = list(df.columns)
		sentiment_cols = [c for c in cols if c.lower().startswith("sentiment_") and c != output_col]
		if sentiment_cols:
			last_idx = max(cols.index(c) for c in sentiment_cols)

			# Move output_col just after the last existing sentiment column
			cols.remove(output_col)
			cols.insert(last_idx + 1, output_col)
			df = df[cols]
		else:
			# Place after title_col if present
			if title_col in df.columns:
				cols.remove(output_col)
				insert_pos = cols.index(title_col) + 1
				cols.insert(insert_pos, output_col)
				df = df[cols]

	# Save with openpyxl engine to preserve Excel format compatibility
	saved_path = save_df(df, input_path)

	# Print validation stats in the terminal
	total_rows = len(df)
	total_scored_numeric = pd.to_numeric(df[output_col], errors="coerce").notna().sum()
	remaining = total_rows - total_scored_numeric
	print(
		f"Run summary for {output_col}: processed={processed_count}, total_scored={total_scored_numeric}, remaining={remaining}, total_rows={total_rows}"
	)
	if parse_failures:
		print(f"Parse failures this run: {len(parse_failures)} (showing up to 5)")
		for item in parse_failures[:5]:
			print(f"  row={item['row']} out='{item['out']}' fallback='{item['fallback']}'")
	print(f"Wrote scores to: {saved_path}")

	return output_col, processed_count, total_scored_numeric, remaining, total_rows, saved_path