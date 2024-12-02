import json
import pandas as pd
#import openai
import requests
import random
from pydantic import BaseModel  # 确保正确导入
from typing import Optional, List
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from langchain.prompts import PromptTemplate
from langchain.llms.base import LLM
from langchain.chains import LLMChain


#function to send the prompt
def get_completion( prompt,  model="llama3.2", url="http://localhost:11434/api/generate", temperature=0, max_tokens=100000, timeout=10):

    headers = {
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "prompt": prompt,
        "temperature": temperature,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(url, headers=headers, data=json.dumps(payload), timeout=timeout)
        response.raise_for_status() 

        raw_content = response.text.splitlines()
        generated_text = ""
        for line in raw_content:
            try:
                json_line = json.loads(line)
                if "response" in json_line:
                    generated_text += json_line["response"]
                if json_line.get("done", False):
                    break  
            except json.JSONDecodeError:
                print(f"Skipping invalid JSON line: {line}")
                continue

        return generated_text.strip()

    except requests.exceptions.RequestException as e:
        print(f"Error communicating with the LLaMA server: {e}")
        return None
    
class OllamaLLM(LLM, BaseModel):
    @property
    def _llm_type(self) -> str:
        return "ollama"
    
    def _call(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        return self.invoke(prompt)

    def invoke(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        response = get_completion(prompt=prompt)
        if response is None:
            raise ValueError("Failed to get a valid response from LLaMA server.")
        return response


#get the top 5 similar key
def getSimilarDes(source, mimic_att_info, omop_att_info, top_n=5):

    #source key (input)
    source_key = tuple(source)
    
    #get the description for source key
    source_desc = mimic_att_info.get(source_key, "")
    if not source_desc:
        raise ValueError(f"Attribute {source_key} not found in MIMIC attribute information.")

    #get all the omop key description
    omop_keys = list(omop_att_info.keys())
    omop_descriptions = [desc if isinstance(desc, str) else "" for desc in omop_att_info.values()]

    if source_desc == "":
        return ""

    #print(f"Source description: {source_desc}")

    #Calculate Similarity and select top 5 similarity item
    vectorizer = TfidfVectorizer()
    tfidf_matrix = vectorizer.fit_transform([source_desc] + omop_descriptions)

    similarities = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:]).flatten()
    top_indices = similarities.argsort()[-top_n:][::-1]

    similar_attributes = [
        (omop_keys[i], omop_descriptions[i]) for i in top_indices
    ]

    return source_desc, similar_attributes



if __name__ == "__main__":
    llm = OllamaLLM(model_name="llama32")

    df = pd.read_csv('data/Cleaned_Mapping.csv')

    src = df.iloc[:, :2].values.tolist()  
    tgt = df.iloc[:, 2:4].values.tolist()  

    random_data_item = random.choice(src)
    random_data_item = src[0]

    flat_tgt = [" ".join(map(str, row)) for row in tgt]  
    vocabulary = "\n".join(flat_tgt)  

    mimic_path = 'data/MIMIC_III_Schema.csv'
    mimic_schema = pd.read_csv(mimic_path)
    mimic_dict = {
        (row['TableName'], row['ColumnName']): row['ColumnDesc'] 
        for _, row in mimic_schema.iterrows()
    }


    omop_path = 'data/OMOP_Schema.csv'
    omop_schema = pd.read_csv(omop_path)
    omop_dict = {
        (row['TableName'], row['ColumnName']): row['ColumnDesc'] 
        for _, row in omop_schema.iterrows()
    }

    #get the top 5 similar items
    source_desc, topFiveSimilarDes = getSimilarDes(random_data_item, mimic_dict, omop_dict)

    #use in the templete
    prompt = PromptTemplate(
    input_variables=["data_item", "vocabulary", "source_desc","topFiveSimilarDes"],
    template=(
        "You are mapping a dataset to a controlled vocabulary.\n"
        "Given the data item '{data_item}', suggest a best match from the following controlled vocabulary:\n\n"
        "{vocabulary}\n\n"
        "The description of '{data_item}' is '{source_desc}'\n"
        "The top five similar description in vocabulary are '{topFiveSimilarDes}'\n"
        ""
        )
    )

    print("--------------------------------")

    print("Randomly Selected Data Item:", random_data_item)

    mapping_chain = LLMChain(llm=llm, prompt=prompt)
    result = mapping_chain.run(data_item=random_data_item, vocabulary=vocabulary, source_desc=source_desc,topFiveSimilarDes=topFiveSimilarDes)
    print("Mapping Suggestion:", result)

    print("---------------------------------")

    second_prompt = PromptTemplate(
    input_variables=["data_item", "mapping_result"],
    template=(
        "You are converting mapping results into a structured dictionary format.\n"
        "Do not give my code just give me the result.\n"
        "Given the input data item {data_item} and its mapping result {mapping_result},\n"
        "directly output a dictionary in the following format:\n"
        "  'input': [SRC_ENT, SRC_ATT],\n"
        "  'mapping_result': [TGT_ENT, TGT_ATT]\n"
        "Ensure the dictionary values accurately reflect the given data."
        )
    )

    refine_chain = LLMChain(llm=llm, prompt=second_prompt)
    refined_result = refine_chain.run(data_item=random_data_item, mapping_result=result)
    print("Refined Dictionary Output:", refined_result)




   


