import json
import pandas as pd
#import openai
import requests
import random
from pydantic import BaseModel  # 确保正确导入
from typing import Optional, List
from langchain.schema import Document

from langchain.prompts import PromptTemplate
from langchain.llms.base import LLM
from langchain.chains import LLMChain

from langchain_community.vectorstores import FAISS
from langchain.embeddings.openai import OpenAIEmbeddings
from langchain.text_splitter import CharacterTextSplitter

from sentence_transformers import SentenceTransformer

class LocalEmbeddings:
    def __init__(self):
        self.model = SentenceTransformer('all-MiniLM-L6-v2')

    def embed_documents(self, texts):
        return self.model.encode(texts)

# 替代 OpenAIEmbeddings
embeddings = LocalEmbeddings()

def get_completion( prompt,  model="llama3.2", url="http://localhost:11434/api/generate", temperature=0, max_tokens=100000, timeout=10):

    #指定请求类型
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
        response.raise_for_status()  # 检查 HTTP 请求是否成功

        # 逐行处理流式 JSON 响应
        raw_content = response.text.splitlines()
        generated_text = ""
        for line in raw_content:
            try:
                json_line = json.loads(line)
                if "response" in json_line:
                    generated_text += json_line["response"]
                if json_line.get("done", False):
                    break  # 完成时停止读取
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
        # 调用 invoke 以满足 LangChain 的需求
        return self.invoke(prompt)

    def invoke(self, prompt: str, stop: Optional[List[str]] = None) -> str:
        # 使用 get_completion 函数处理请求
        response = get_completion(prompt=prompt)
        if response is None:
            raise ValueError("Failed to get a valid response from LLaMA server.")
        return response
    

#k为检测文档的数量
def map_column_with_rag(
    mimic_file: str,
    omop_file: str,
    column_to_map: str,
    llm,
    retriever_k: int = 5,
):
    mimic_schema = pd.read_csv(mimic_file)
    omop_schema = pd.read_csv(omop_file)

    mimic_schema["doc"] = mimic_schema["ATT"] + ": " + mimic_schema["DES"]
    omop_schema["doc"] = omop_schema["ATT"] + ": " + omop_schema["DES"]

    docs = pd.concat([mimic_schema[["doc"]], omop_schema[["doc"]]], ignore_index=True)
    documents = [Document(page_content=doc) for doc in docs["doc"].tolist()]

    text_splitter = CharacterTextSplitter(chunk_size=100, chunk_overlap=10)
    split_documents = text_splitter.split_documents(documents)

    embeddings = LocalEmbeddings()
    db = FAISS.from_texts(
    texts=[doc.page_content for doc in split_documents],
    embedding=embeddings.embed_documents 
    )   

    retriever = db.as_retriever(search_type="similarity", search_kwargs={"k": retriever_k})

    def retrieve_context(column_name, retriever):
        query = f"Find relevant columns for '{column_name}'"
        results = retriever.get_relevant_documents(query)
        return "\n".join([result.page_content for result in results])

    context = retrieve_context(column_to_map, retriever)

    prompt = PromptTemplate(
        input_variables=["column_name", "context"],
        template=(
            "You are mapping a column from the MIMIC dataset to the OMOP dataset.\n"
            "Here is the MIMIC column you need to map: '{column_name}'.\n"
            "Relevant OMOP columns are provided below:\n"
            "{context}\n\n"
            "Based on this context, suggest the best mapping."
        )
    )

    mapping_chain = RunnableSequence([prompt, llm])
    result = mapping_chain.invoke({"column_name": column_to_map, "context": context})

    return result



    #VALUENUM:value_as_number




if __name__ == "__main__":
    #print(get_completion("What is 1+10"))

    llm = OllamaLLM(model_name="llama32")
    #response = llm.invoke("What is LangChain?")
    #print(response)

    # 读取 CSV 文件
    df = pd.read_csv('data/Cleaned_Mapping.csv')

    # 将第一列和第二列内容分别存入列表
    src = df.iloc[:, 0].tolist()  # 第一列
    tgt = df.iloc[:, 1].tolist()  # 第二列

    # 随机选择一个数据项
    random_data_item = random.choice(src)
    random_data_item = "VALUENUM"

    #random_data_item = "SUBJECT_ID"

    # 提取目标词汇表作为 vocabulary
    vocabulary = "\n".join(tgt)

    # 定义 PromptTemplate
    prompt = PromptTemplate(
    input_variables=["data_item", "vocabulary"],
    template=(
        "You are mapping a dataset to a controlled vocabulary.\n"
        "Given the data item '{data_item}', suggest a best match from the following controlled vocabulary:\n\n"
        "{vocabulary}\n\n"
        )
    )


    print("Randomly Selected Data Item:", random_data_item)
    #print("Generated Prompt:")
    #print(prompt_text)

    mapping_chain = LLMChain(llm=llm, prompt=prompt)
    result = mapping_chain.run(data_item=random_data_item, vocabulary=vocabulary)
    print("Mapping Suggestion:", result)

    #print("----------------")
    #map_column_with_rag("data/Cleaned_MIMIC.csv","data/Cleaned_OMOP_Schema.csv",random_data_item, llm )


