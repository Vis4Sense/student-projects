import openai
from openai import AzureOpenAI
from miniDemo.config import api_base, api_key

api_base = api_base
api_key = api_key
deployment_name = "gpt-35-turbo-16k"  
api_version = "2023-06-01-preview"

client = AzureOpenAI(azure_endpoint=api_base, api_key=api_key, api_version=api_version)

import json

tabs_data = {
    "tabs": [
        {
            "tabId": "1234",
            "tab_Summary": "this web page is a wiki pedia page introducing London"
        },
        {
            "tabId": "0002",
            "tab_Summary": "this web page is the official web page of Jubilee line in London underground, showing it prices"
        },
        {
            "tabId": "0003",
            "tab_Summary": "this web page introduce The Forbidden city"
        },
        {
            "tabId": "0004",
            "tab_Summary": "this web page introduce the Buckingham Palace"
        },
    ]
}

output_example = {
    "output": [
        {
            "location": "London",
            "tabId": ["1234", "0002", "0004"]
        },
        {
            "location": "Beijing",
            "tabId": ["0003"]
        }
    ]
}

tabs_data_text = json.dumps(tabs_data, indent=2)
output_example_text = json.dumps(output_example, indent=2)

begin_prompt = f"""
You are a helpful assisitant in web tabs clustering. 
You will be given several summaries of different web tabs.
These tabs are usually about traveling. 
What you need to do is do a classification of these tabs based on city information. 
Please return the result in Json format. 
Following is an example:
###### example input #######
{tabs_data_text}
###### example output #######
{output_example_text}
"""

input_prompt_tabs = {
    "tabs": [
        {
            "tabId": "13000_1",
            "tab_Summary": "this web page is a wiki pedia page introducing Tokyo"
        },
        {
            "tabId": "13000_2",
            "tab_Summary": "this web page is the official web page of Tokyo Disneyland, showing it prices"
        },
        {
            "tabId": "13000_3",
            "tab_Summary": "this web page introduce The Golden Gate Bridge, which was built in 1930s"
        },
        {
            "tabId": "13000_4",
            "tab_Summary": "this web page introduce the Haneda Airport "
        },
    ]
}


prompt = json.dumps(input_prompt_tabs, indent=2)

response = client.chat.completions.create(
        model=deployment_name, 
        messages=[
            {"role": "system", "content": begin_prompt}, 
            {"role": "user", "content": prompt}
        ],
        max_tokens=500
    )   

#去除回复中的所有\n以及结尾的空格
mapped_value = response.choices[0].message.content.strip().replace("\n", "")
print(mapped_value) 


# print(prompt)
