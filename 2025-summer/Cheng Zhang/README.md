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


# Recent Optimizations & Updates （After 8.11 meeting）

Enhanced multi-turn interaction: The system now guides the user to provide additional brand, price range, and color preferences before search execution, improving result relevance.

Brand-priority sorting: Search results are re-ordered so that products from the user’s preferred brand appear first, followed by others sorted by score.

Strict price filtering: Products are now strictly limited to the specified price range instead of allowing a tolerance margin.

# Display improvements:

Replaced the price chart in the comparison view with a clear, multi-column table showing title, brand, price, rating, and features.

Added collapsible “Features” section to keep the view clean.

Increased sidebar width to display all columns without truncation.

AI-generated recommendations: Integrated OpenAI API to produce natural-language recommendation reasons, with “AI Generated” label shown in the UI.

# Next Steps

Conduct user testing to evaluate functionality, usability, and relevance.

Use questionnaires to collect user feedback and satisfaction scores for further optimization.
