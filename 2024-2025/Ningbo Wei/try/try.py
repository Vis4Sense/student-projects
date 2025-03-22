from openai import AzureOpenAI
from config import apiBase, apiKey, deploymentName, apiVersion, deploymentName_embedding
import math
import numpy as np

def getEmbedding(inputText):
    client = AzureOpenAI(azure_endpoint=apiBase, api_key=apiKey, api_version=apiVersion)

    response = client.embeddings.create(
        input=inputText,
        dimensions=300,
        model=deploymentName_embedding
    )

    # print(response.data[0].embedding)
    return response.data[0].embedding

def cosine_similarity_np(a, b):
    a = np.array(a)
    b = np.array(b)
    if np.linalg.norm(a) == 0 or np.linalg.norm(b) == 0:
        return 0.0
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

sentences = [
    "today is a good day",
    "artificial intelligence is the future",
    "machine learning helps us understand data",
    "the quick brown fox jumps over the lazy dog",
    "人工智能引领我们走向未来"
]

userInput = "artificial intelligence"
sentences_embedding = dict()
all_embeddings = []
cosineresult = []
input_embedding = getEmbedding(userInput)
for sentence in sentences:
    getEmbeddingResult = getEmbedding(sentence)
    # sentences_embedding[getEmbeddingResult] = sentence
    all_embeddings.append(getEmbeddingResult)
    cosineresult.append(cosine_similarity_np(input_embedding, getEmbeddingResult))
print(cosineresult)


# {
#   "summary": [
#     {
#       "shortSummary": "戒社 focuses on personal stories about gambling and debt struggles affecting families and individuals, often shared through videos.",
#       "longSummary": "The website 戒社 features various narratives about individuals dealing with gambling addictions and heavy debts, highlighting the impact on their families. Users share personal experiences, revealing stories of borrowing money for gambling, academic struggles, and the emotional toll of these issues. The platform appears to serve as a space for awareness and discussion around gambling addiction and its consequences."
#     }
#   ]
# }

# "{
#   "summary": [
#     {
#       "shortSummary": "A comprehensive to-do list including academic, social tasks, and project deadlines for final year students."
#     },
#     {
#       "longSummary": "This website features a detailed to-do list for a variety of tasks related to final year projects, academic assignments, and social obligations. Key points include project deadlines, graduation preparations, and personal tasks like travel planning and living arrangements. Specific items like report submissions, bug fixes, and user research for an intelligent agent are also highlighted."
#     }
#   ]
# }"