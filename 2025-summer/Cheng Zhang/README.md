# LLM for Natural-Language Product Discovery

This project explores the use of Large Language Models (LLMs) to improve product discovery on e-commerce platforms. Instead of keyword search, users can describe their needs in natural language, and the browser extension will find, extract, and highlight relevant product data in real time.


# Current progress:

Chrome plugin framework completed, supporting natural language input of shopping requirements;

Keyword extraction implemented using KeyBERT + MiniLM, no manual word list required;

Lightweight model used;

SerpAPI integrated, search limited to e-commerce sites (Amazon / BestBuy / Walmart);

Product semantic scoring implemented, sorted and displayed by score (MiniLM + cosine);

Implemented recommendation reason generation + multi-product comparison table functionality (brand/feature fields, etc.);

The current plugin supports the complete closed-loop process of natural language → search → sorting → comparison → recommendation.


# Current challenges

Since Google Search returns unstructured web page summaries, it is currently difficult to accurately extract price and rating fields.

Whether the lightweight model can achieve the expected results.

If you have any suggestions or comments, I look forward to hearing from you. Thank you!
