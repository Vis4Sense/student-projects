# LLMs Benchmark
**Objective**
To compare the performance of several LLMs in providing sentiment analysis of short financial articles.

**Test dataset**: [Financial Phrasebank](https://huggingface.co/datasets/financial_phrasebank) 
English sentences from financial news, and classified as either positive, negative, or neutral by researchers knowledgeable in the finance domain.

This benchmark **using 1,000 sample records** (random seed = 42) from **"sentence_allagree"** subset. 
The distribution of the test set is same as the subset population (Neutral: 61.4%, Positive: 25,2%, Negative: 13,4%)

the average number of word of the test dataset is

dataset example:
| Sentence | Label |
| ------------ | ---- |
|The mall is part of the Baltic Pearl development project in the city of St Petersburg , where Baltic Pearl CJSC , a subsidiary of Shanghai Foreign Joint Investment Company , is developing homes for 35,000 people .|1 neutral|
|In the reporting period , net sales rose by 8 % year-on-year to EUR64 .3 m , due to the business acquisitions realized during the first half of 2008-09 , the effect of which was EUR10 .9 m in the review period .|2 positive|
|Pharmaceuticals group Orion Corp reported a fall in its third-quarter earnings that were hit by larger expenditures on R&D and marketing .|0 negative|

**LLMs Model tested are from gpt4all.io (4-bit Quantization)**

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
