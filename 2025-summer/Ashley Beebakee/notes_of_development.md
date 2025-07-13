# Notes of Development (NoD)
<ul>
  <li>COMP4026 RsrchProj-Comp Sci (AI)  2024/25</li>
</ul>

## framework.py
<ul>
  <li>When saving the configuration in the Streamlit hosted webpage, the YAML config file's contents are saved in alphabetical order.</li>
  <li>Configuration was simplified to test partial functionality of a simple workflow (to be expanded as the weeks pass by).</li>
  <li>Streamlit dashboard can only be customised to an extent since it doesn't support CSS/JavaScript (unsafe option can be toggled) like HTML does.</li>
  <li>Integrated "scraping.py" to scrape cryptocurrency related reddit posts.</li>
  <li>Added "run" buttons with configured columns to visualise the outputs.</li>
  <li>Integrated "prompt.py" and "llm_selection" to allow Llama 3.1 .gguf model to analyse 1st scraped reddit post and output on column2 of the Streamlit dashboard.</li>
</ul>

## scraping.py
<ul>
  <li>Reddit has implemented features to prevent bots/crawlers from scraping.</li>
  <li>Insertion of the browser's "User-Agent" information, we can mimic a browser request to prevent Reddit from detecting our bot.</li>
  <li>Up-to-date Reddit does not display more than four/five posts without having to scroll down (infinitely), due to this, scraping old Reddit is the better option since it uses 'Next' buttons to view more posts.</li>
</ul>

## llm_selection.py
<ul>
  <li>Created new token on personal Hugging Face account, called 'Thesis.Token'.</li>
  <li>Requested access to LLaMA 3 ("meta-llama/Meta-Llama-3-8B") model -> permission granted.</li>
  <li>Attempted to download Mixtral ("mistralai/Mixtral-8x7B-Instruct-v0.1") and BLOOMZ ("bigscience/bloomz-7b1-mt") models.</li>
  <li>Downloading the LLMs above result in an 'os error 1455', 'The paging file is too small for this operation to complete' due to low VRAM.</li>
  <li>Full-sized 7B, 13B models will cause the same error even if ran on CPU with the system's RAM.</li>
  <li>Quantised Mixtral ("TheBloke/Mixtral-8x7B-Instruct-v0.1-GPTQ") and BLOOMZ models were downloaded.</li>
  <li>Optimum library enables faster CPU/GPU inference.</li>
  <li>Removed all previously downloaded hugging face models and downloaded quantised 4-bit fine-tuned Llama 3.1 instruct model for AMD ("Llama-3.1-8B-Instruct-bf16-q4_k.gguf").</li>
  <li>To use CPU only, run: "pip install llama-cpp-python".</li>
  <li>To use GPU acceleration, run (Windows Powershell): $env:CMAKE_ARGS="-DLLAMA_CLBLAST=on". Then, run this command "pip install llama-cpp-python --force-reinstall --no-cache-dir".</li>
  <li>Configured optimised LLM settings for 'AMD RX6600 XT GPU'.</li>
  <li>n_gpu_layers = 0 (CPU), -1 (GPU), 25 (GPU layers).</li>
  <li></li>
</ul>

## prompt.py
<ul>
  <li>Created prompt templates for Zero-shot, Few-shot and Chain-of-Thought (CoT) techniques.</li>
</ul>

## extraction.py
<ul>
  <li>...</li>
</ul>

[Last updated: 13/07/2025 15:33]
