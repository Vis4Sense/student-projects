# Notes of Development (NoD)
<ul>
  <li>COMP4026 RsrchProj-Comp Sci (AI)  2024/25</li>
</ul>

## framework.py
<ul>
  <li>When saving the configuration in the Streamlit hosted webpage, the YAML config file's contents are saved in alphabetical order.</li>
  <li>Configuration was simplified to test partial functionality of a simple workflow (to be expanded as the weeks pass by).</li>
  <li>Dashboard can only be customised to an extent since it doesn't support CSS/JavaScript like HTML does.</li>
</ul>

## scraping.py
<ul>
  <li>Reddit has implemented features to prevent bots/crawlers from scraping.</li>
  <li>By extracting the browser's User-Agent information, we can avoid being blocked from scraping.</li>
  <li>Up-to-date Reddit does not display more than 4-5 posts without having to scroll down (infinitely), due to this, scraping old Reddit is the better option since it uses 'Next' buttons to view more posts.</li>
</ul>

## llm_selection.py
<ul>
  <li>Created new token on personal Hugging Face account, called 'Thesis.Token'.</li>
  <li>Requested access to LLaMA 3 ("meta-llama/Meta-Llama-3-8B") model -> permission granted.</li>
  <li>Downloaded Mixtral ("mistralai/Mixtral-8x7B-Instruct-v0.1") and BLOOMZ ("bigscience/bloomz-7b1-mt") models.</li>
</ul>

## prompt.py
<ul>
  <li>...</li>
</ul>

## extraction.py
<ul>
  <li>...</li>
</ul>

[Last updated: 07/07/2025 07:37]
