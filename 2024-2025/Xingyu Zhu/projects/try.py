import json
import pandas as pd
from openai import OpenAI

# generate prompt
def generate_prompt(column1, column2, raw_data):
    #prompt with full list
    #the performance is bad
    full_prompt_string = f"For each item in {raw_data}, select the most similar one in {column2} and give the answer of selection.\n"

    full_prompt = (
        full_prompt_string 
    )

    #use shorter prompt
    #only include 10 items in the set
    column2_subset = ["person_id", "visit_occurrence_id", "visit_start_datetime", "visit_end_datetime", "visit_type_concept_id", "admitted_from_source_value", "discharge_to_concept_id"]
    
    #better than full prompt
    short_prompt = (
        f"Select the most similar item in {column2_subset} to {raw_data[0]}.\n"
        "If no match is found, return 'NA'.\n"
        "Just tell me the most similar item.\n"
        "Do not provide code or explanations." #For example, if the input is 'SUBJECT_ID', the output should look like this: {'SUBJECT_ID': ['person_id']}"
    ) 

    greeting = ("Hello! How can you help me?")

    return short_prompt

#read from csv
def read_columns_from_csv(file1, file2, col1, col2):
    try:
        df1 = pd.read_csv(file1)
        df2 = pd.read_csv(file2)
        column1 = df1[col1].tolist()
        column2 = df2[col2].tolist()
        return column1, column2
    except Exception as e:
        print(f"Error reading CSV files: {str(e)}")
        return [], []
    
client = OpenAI(
    #llama API
    base_url="http://localhost:11434/v1",  
    api_key='ollama',
)

if __name__ == "__main__":
    # read file
    file1 = "data/MIMIC_III_Schema.csv"
    file2 = "data/OMOP_Schema.csv"
    col1 = "ColumnName" 
    col2 = "ColumnName" 
    
    column1, column2 = read_columns_from_csv(file1, file2, col1, col2)

    #print(column2)

    #raw data
    raw_data = ["SUBJECT_ID"] 

    if column2:
        # generate prompt
        prompt = generate_prompt(column1, column2, raw_data)
        
        #call the API and get the result
        response = client.chat.completions.create(
            model="llama3.2",
            messages=[
                {"role": "system", "content": "You are friendly LLM"},
                {"role": "user", "content": prompt},
            ]
        )
        
        #Print the result
        try:
            print(raw_data[0]+"\n")
            mapped_result = response.choices[0].message.content
            print(f"Mapping result: {mapped_result}")
        except Exception as e:
            print(f"Error parsing response: {str(e)}")
    else:
        print("Error: Failed to load columns from the CSV files.")
