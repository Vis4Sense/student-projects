# LLMs Benchmark
**Objective**
To compare the performance of several LLMs in providing sentiment analysis of short financial articles.

**Test dataset**: [Financial Phrasebank](https://huggingface.co/datasets/financial_phrasebank) 
English sentences from financial news, and classified as either positive, negative, or neutral by researchers knowledgeable in the finance domain.

This benchmark **using 1,000 sample records** (random seed = 42) from **"sentence_allagree"** subset. 
The distribution of the test set is same as the subset population (Neutral: 61.4%, Positive: 25,2%, Negative: 13,4%)

the average number of word of the test dataset is 22 words/tokens
Prompt used are inspired from Wenxuan Zhang et al. Titled Sentiment Analysis in the Era of Large Language Models: A Reality Check:

The prompt:
"Please perform news sentiment classification task: \n\nNEWS: {news}'\n\n Assign a sentiment label from ['negative', 'neutral', 'positive']. Return label only without any other text.\nLABEL:"

dataset example:
| Sentence | Label |
| ------------ | ---- |
|The mall is part of the Baltic Pearl development project in the city of St Petersburg , where Baltic Pearl CJSC , a subsidiary of Shanghai Foreign Joint Investment Company , is developing homes for 35,000 people .|1 neutral|
|In the reporting period , net sales rose by 8 % year-on-year to EUR64 .3 m , due to the business acquisitions realized during the first half of 2008-09 , the effect of which was EUR10 .9 m in the review period .|2 positive|
|Pharmaceuticals group Orion Corp reported a fall in its third-quarter earnings that were hit by larger expenditures on R&D and marketing .|0 negative|

**LLMs Model tested:**
All the model tested are from [gpt4all.io](https://gpt4all.io/index.html) (4-bit Quantization) with current specification:
|No.| Model Name|Specs & Req|Remarks|Characteristics| Trained By| Commercial Uses|
|---|---|---|---|---|---|---|
|1.|orca-2-13b.Q4_0|13b, SIZE: 6.86 GB, RAM: 16 GB| N/A|Instruction based|Microsoft|No|
|2.|wizardlm-13b-v1.2.Q4_0|13b, SIZE: 6.86 GB, RAM: 16 GB| Best overall larger model|Instruction based, Gives very long responses, Finetuned with only 1k of high-quality data|Microsoft and Peking University|No|
|3.|nous-hermes-llama2-13b.Q4_0|13b, SIZE: 6.86 GB, RAM: 16 GB| Extremely good model|Instruction based, Gives very long responses, Curated with 300,000 uncensored instructions|Nous Research|No|
|4.|gpt4all-13b-snoozy-q4_0|13b, SIZE: 6.86 GB, RAM: 16 GB| Very good overall model|Instruction based, Based on the same dataset as Groovy, Slower than Groovy, with higher quality responses|Nomic AI|No|
|5.|mpt-7b-chat-merges-q4_0|7b, SIZE: 3.54 GB, RAM: 8 GB| Good model with novel architecture|Fast responses, Chat based|Mosaic ML|No|
|6.|orca-2-7b.Q4_0|7b, SIZE: 3.56 GB, RAM: 8 GB| N/A|Instruction based|Microsoft|No|
|7.|gpt4all-falcon-q4_0|7b, SIZE: 3.92 GB, RAM: 8 GB| Very fast model with good quality|Fastest responses, Instruction based|Trained by TII, Finetuned by Nomic AI|Yes|
|8.|mistral-7b-instruct-v0.1.Q4_0|7b, SIZE: 3.83 GB, RAM: 8 GB| Best overall fast instruction following model|Fast responses, Uncensored|Mistral AI|Yes|
|9.|mistral-7b-openorca.Q4_0|7b, SIZE: 3.83 GB, RAM: 8 GB| Best overall fast chat model|Fast responses, Chat based model|Trained by Mistral AI, Finetuned on OpenOrca dataset curated via Nomic Atlas|Yes|
|10.|orca-mini-3b-gguf2-q4_0|3b, SIZE: 1.84 GB, RAM: 4 GB| Small version of new model with novel dataset|Instruction based, Explain tuned datasets, Orca Research Paper dataset construction approaches|N/A|No|


**Hardware (Laptop) specs used for test:**

Windows 11

CPU: 12th Gen Intel i7-12700H 4.70 GHz

RAM: 32GB 4800Mhz DDR5

GPU: Nvidia RTX 3070 Ti 8Gb

Storage: 1TB M.2 SSD 

**Testing Environment**

Python 3.11.5

gpt4all 2.0.2

torch 2.1.1+cu121

**Zero-Shot Benchmark Result** (on progress) [Result Files](https://github.com/Vis4Sense/student-projects/tree/main/2023-2024/muhamad-hermawan/LLMs%20Benchmark/Results "Result Files")
| Model | Accuracy | Run Time | avg time/iter |Spec n requirement: Param/size/RAM|
| ------------ | ---- | ---- | ---- |---------|
| gpt4all-13b-snoozy-q4_0 |0.3670|5hr 37min|20.28s|13b/6.86 GB/16 GB|
| nous-hermes-llama2-13b.Q4_0  |0.6460|5hrs 42min|20.52s   |13b/6.86 GB/16 GB|
| wizardlm-13b-v1.2.Q4_0 |0.8170|5hr 36min|20.18s|13b/6.86 GB/16 GB|
| orca-2-13b.Q4_0 |0.8820|5hrs 43min|20.56s|13b/6.86 GB/16 GB|
| orca-2-7b.Q4_0 |0.5050|2hrs 53min|10.37s   |7b/3.56 GB/8 GB|
| mistral-7b-openorca.Q4_0 |0.6060   |3hrs 1min|10.88s|7b/3.83 GB/8 GB|
| mistral-7b-instruct-v0.1.Q4_0 |0.5520|3hrs 5min|11.10s|7b/3.83 GB/8 GB|
| gpt4all-falcon-q4_0 |0.1630|2hrs 49min|10.13s|7b/3.92 GB/8 GB|
| mpt-7b-chat-merges-q4_0 |0.1340|2hrs 31min|9.07s|7b/3.54 GB/8 GB|
| orca-mini-3b-gguf2-q4_0 |0.3990|1hr 27min|5.25s|3b/1.84 GB/4 GB|
