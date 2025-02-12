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
        {
            "tabId": "0005",
            "tab_Summary": "LeetCode: Classic Interviews - 150 Questions. Master all the interview knowledge points. Valid address and contact information given"
        }
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
What you need to do is do a classification of these tabs based on city. You need to consider information in the summarise, like city name, famous places, train station, air port or famous people. 
These tabs might belongs to different cities.
There might have several tabs is not about traveling in a city, you need to ignore them. But some tabs related to traveling should be remained, including the introduction of the city, famous places, train station, air port, famous people, tickets and hotel booking.
You need to return a list of dictionaries, each dictionary contains a city name and a list of tabId. Please return the result in Json format. 
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
            "tab_Summary": "this web page introduce the Golden Gate Bridge, which was built in 1930s. It connectss San Francisco Bay and the Pacific Ocean in California, United States. "
        },
        {
            "tabId": "13000_4",
            "tab_Summary": "this web page introduce the Haneda Airport "
        },
        {
            "tabId": "13000_8",
            "tab_Summary": "The content on the webpage is about the problem of finding the longest common prefix in a list of strings."
        }
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
