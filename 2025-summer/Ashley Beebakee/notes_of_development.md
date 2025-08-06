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
  <li>Refined LLM and prompt template selection logic due to addition of two other models.</li>
  <li>Added functionality to select how many Reddit posts to be scraped through the use of "st.slider".</li>
  <li>Modified Reddit scraping function and created constant for its dataset path.</li>
  <li>Created tabs to display scraping and historical datasets.</li>
  <li>Restructured the interface's tab naming relevancy with sub-tabs and descriptions for better comprehension of the system.</li>
  <li>Added subheaders to section the components.</li>
  <li>Added multiple language optionality for NewsAPI function call.</li>
  <li>Added subreddit selection for Reddit scraping function call.</li>
  <li>Integrated "historical.py" to allow the user to download time series data for their chosen cryptocurrency with custom date ranges and time interval.</li>
  <li>Created naming convention to save downloaded time series data based on parameters, i.e. "btc_dataest_20250101_20250701_1d".</li>
</ul>

## scraping.py
<ul>
  <li>Reddit has implemented features to prevent bots/crawlers from scraping.</li>
  <li>Inserting the browser "User-Agent" information, we can mimic a legitimate browser request to prevent Reddit from detecting our bot.</li>
  <li>Up-to-date Reddit does not display more than four/five posts without having to scroll down (infinitely), due to this, scraping old Reddit is the better option since it uses 'Next' buttons to view more posts.</li>
  <li>Old Reddit has pagination of up to 789 posts, while new Reddit has pagination of up to only 500 posts. Reddit API is not free-to-use.</li>
  <li>Created scraping_dataset.xlsx for the Reddit posts, the function was modified to remove duplicate posts (with validation) and sort them with the inclusion of their timestamp, including their IDs.</li>
  <li>The function now returns the number of "new" scraped posts since the dataset can be visualised in Streamlit at all times.</li>
  <li>Reddit bot protection may cause "Failed with status code: 429" if too many requests are sent using the function.</li>
  <li>The scraping loop "for thing in things" can be refined for faster execution by reducing pagination.</li>
  <li>Generated API key for NewsAPI, it can only get news headlines from the past 30 days.</li>
  <li>Optimised its functionality, each news source has its own dataset (i.e. reddit_crypto_dataset.xlsx).</li>
  <li>There are multiple language options for NewsAPI to get headlines from, ensure that the selected languages are compatible with one of the available LLMs.</li>
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
  <li>Removed all previously downloaded hugging face models due to incompatibility with AMD/required more VRAM.</li>
  <li>Downloaded quantised 4-bit fine-tuned Llama 3.1 instruct model for AMD ("Llama-3.1-8B-Instruct-bf16-q4_k.gguf").</li>
  <li>To use CPU only, run: "pip install llama-cpp-python".</li>
  <li>To use GPU acceleration, run (Windows Powershell): $env:CMAKE_ARGS="-DLLAMA_CLBLAST=on". Then, run this command "pip install llama-cpp-python --force-reinstall --no-cache-dir".</li>
  <li>Configured optimised LLM settings for 'AMD RX6600 XT GPU'.</li>
  <li>Downloaded quantised 2-bit fine-tuned Llama 3.1 instruct model for AMD ("Llama-3.1-8B-Instruct-iq2_xxs.gguf").</li>
  <li>Downloaded quantised 4-bit BLLOMZ 7B model for AMD ("bloomz-7b1-mt-Q4_K_M.gguf").</li>
  <li>Downloaded quantised 6-bit Orca 2 7B model for AMD ("orca-2-7b.Q6_K.gguf").</li>
</ul>

## prompt.py
<ul>
  <li>Defined prompt templates for Zero-shot, Few-shot and Chain-of-Thought (CoT) engineering techniques.</li>
  <li>Assigned prompt templates for LLaMA 3.1 (4-bit, 2-bit) and BLOOMZ models.</li>
  <li>Refined prompt templates to extract sentiment with numerical values from -1 (negative), 0 (neutral) to 1 (positive).</li>
  <li>BLOOMZ prompt templates need debugging since they do not output a numerical value for the sentiment score.</li>
  <li>Assigned prompt templates for Orca 2 (6-bit) model.</li>
</ul>

## extraction.py
<ul>
  <li>...</li>
</ul>

## historical.py
<ul>
  <li>Visual Studio Code (VS Code) can glitch and not properly activate conda environments causing import errors.</li>
  <li>The path in which the 'thesis' conda environment searches for packages is "C:/Users/zetra/anaconda3/envs/thesis/Lib/site-packages"</li>
  <li>Run this command to ensure correct path installation: pip install --target "C:/Users/zetra/anaconda3/envs/thesis/Lib/site-packages" [package_name].</li>
  <li>Saved BTC-USD dataset of 6 months with 1-day interval to "btc_dataset_6m-1d.csv".</li>
  <li>Added comments for the fetch_price_data() and preprocess_data() functions.</li>
  <li>Removed commented sections of code for saving datasets to .csv file type.</li>
</ul>

[Last updated: 06/08/2025 12:58]
