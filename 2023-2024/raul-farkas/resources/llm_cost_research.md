# Cost of using LLM for sentiment analysis

Before adopting these LLM it is important to take into consideration the various ways in which these LLMs can be adopted and their cost.

The cost of using these LLMs greatly depends on the way they are being used and they way the LLM service is provided. Generally, there are three approaches to using them:

* Through a web API
  * This is the ideal approach as it is the simplest in terms of usage
  * The models are ready to be used
  * No flexible configuration
  * Examples of models are hosted by a company that exposes a web API include:
    * Open AI provides
      * GPT-3.5 Turbo (ChatGPT)
      * GPT-4
    * Google AI provides
      * PaLM2 for chat
* Self-hosting
  * This is the most complicated approach
    * It involves buying a host with powerful GPUs
    * Deploying the model
  * Any model that can be downloaded is suitable
  * Potentially the most expensive
* Hybrid
  * Requires the model to be publicly available
  * There are platforms such as Replicate and Inference Endpoints which allow you to upload a model and automatically deploy it
    * The deployment automatically exposes Web API endpoints
    * The cost is generally per second of usage or per minute
      * Example:
        * Replicate
          *  GPU config: Nvidia A40 (Large) 
          * Run-time: 0.000725$/sec
        * Inference Endpoints
          * Uses aws, azure or gcloud underneath
          * GPU: Nvidia T4
          * Run-time: 0.6$/hour ~= 0.000167$/sec (you pay by the minute so 0.01$/min)

**Cost analysis was done for 4 different models:**

To simulate the usage of LLMs for sentiment analysis of news headlines the following scenario was used to calculate a sample total cost for a day of trading.

**Scenario:**

* 10 symbols
* 50 articles per symbol
* 30 words prompt per article (including instructions)
* 5 words output per article (what the model produces)
* 5 characters on avg per word (for pricing models based on characters)
* 1000 tokens = 750 words (For Open AI APIs)

**Example calculation for the GPT-3.5 Turbo model:**

Input: (10 symbols * 50 articles * 30 words prompt) / 750 words = 10k tokens

Output: (10 symbols * 50 articles * 5 words prompt) / 750 words = 3.3k tokens

Input cost: 10k tokens * 0.0015$/1k tokens = 0.015$

Output cost: 3.3k tokens * 0.002$/1k tokens = 0.0066$

Total cost: 0.0366$

**Table:**

| Model                              | Type    | Provider                                                   | Unit cost                                              | Example cost                                                              |
| ---------------------------------- | ------- | ---------------------------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------- |
| GPT-3.5 Turbo (ChatGPT) 4k context | Web API | OpenAI API                                                 | Input: 0.0015$/1k tokens<br />Output: 0.002$/1k tokens | Input: 10k tokens<br />Output: 3.3k tokens<br /><br />Cost: 0.0366$ total |
| GPT-4                              | Web API | OpenAI API                                                 | Input: 0.03$/1k tokens<br />Output: 0.06$/1k tokens    | Input: 10k tokens<br />Output: 3.3k tokens<br /><br />Cost: 0.198$ total  |
| PaLM2 for Chat                     | Web API | Google API                                                 | Input: $0.0005/1k char<br />Output: $0.0005/1k char    | Input: 75k char<br />Output: 12.5k char<br /><br />Cost: 0.0438$ total    |
| Meta/llama-2-70b-chat              | Hybrid  | Replicate through API<br /> GPU config: Nvidia A40 (Large) | Run-time: 0.000725$/sec                                | Input: 500 inputs of 30 words each Run-time: ~1s<br /> Cost: 0.365$       |