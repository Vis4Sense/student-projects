from openai import AzureOpenAI
from config import apiBase, apiKey, deploymentName, apiVersion, deploymentName_embedding


client = AzureOpenAI(azure_endpoint=apiBase, api_key=apiKey, api_version=apiVersion)

response = client.embeddings.create(
    input="Your text string goes here",
    model=deploymentName_embedding
)

print(response.data[0].embedding)