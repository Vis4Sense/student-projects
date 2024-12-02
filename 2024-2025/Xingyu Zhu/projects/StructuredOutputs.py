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


if __name__ == "__main__":
    llm = OllamaLLM(model_name="llama32")

    # 读取 CSV 文件
    df = pd.read_csv('data/Cleaned_Mapping.csv')

    # 将第一列和第二列内容分别存入列表
    src = df.iloc[:, :2].values.tolist()  # 第一列和第二列
    tgt = df.iloc[:, 2:4].values.tolist()  # 第三列和第四列

    #print(src)
    #print(tgt)

    random_data_item = random.choice(src)
    #先稳定选择第一个
    random_data_item = src[0]
    #print(random_data_item)

    #mapping的对象
    flat_tgt = [" ".join(map(str, row)) for row in tgt]  # 每行的元素合并为字符串
    vocabulary = "\n".join(flat_tgt)  # 以换行符拼接每行

    #print(vocabulary)
    
    #设置第一轮输入的格式
    prompt = PromptTemplate(
    input_variables=["data_item", "vocabulary"],
    template=(
        "You are mapping a dataset to a controlled vocabulary.\n"
        "Given the data item '{data_item}', suggest a best match from the following controlled vocabulary:\n\n"
        "{vocabulary}\n\n"
        )
    )

    print("--------------------------------")

    print("Randomly Selected Data Item:", random_data_item)

    mapping_chain = LLMChain(llm=llm, prompt=prompt)
    result = mapping_chain.run(data_item=random_data_item, vocabulary=vocabulary)
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


    # 第二轮：调用 LLM 提炼结果
    refine_chain = LLMChain(llm=llm, prompt=second_prompt)
    refined_result = refine_chain.run(data_item=random_data_item, mapping_result=result)
    print("Refined Dictionary Output:", refined_result)
   


