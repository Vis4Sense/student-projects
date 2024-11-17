import pandas as pd
import nltk, re, pprint, string
from nltk.tokenize import word_tokenize
from nltk.stem.wordnet import WordNetLemmatizer
from fuzzywuzzy import fuzz
import math

# read csv
df = pd.read_csv('data/MIMIC_to_OMOP_Mapping.csv')

attribute_mapping = dict(zip(df['SRC_ATT'], df['TGT_ATT']))

lemmatiser = WordNetLemmatizer()

#Pre process without remove stopwords
def process_keep_stopwords(text):
    # remove punctuation
    pattern = f"[{re.escape(string.punctuation)}]"  
    cleaned_text = re.sub(pattern, "", text)
    
    # tokenize word and lower all letter
    text_tokens = word_tokenize(cleaned_text)
    tokens_without_sw = [word.lower() for word in text_tokens]

    # rejoin all results
    return ' '.join(tokens_without_sw)

# use fuzzywuzzy to check similarity
def check_mapping(input_dict, attribute_mapping, threshold=80):

    total_number=0
    correct_number=0
    result_log = ""

    for src_att, tgt_att in input_dict.items():
        src_att_input = src_att
        tgt_att_input = tgt_att
    
        processed_src_input = process_keep_stopwords(src_att_input)
        processed_tgt_input = process_keep_stopwords(tgt_att_input)
    
        best_match = None
        highest_similarity = 0

        # get the highest similarity between src_att and database_src
        # if we find the most likely source Attribute ---> it's target Attribute is the standard answer
        for database_src, database_tgt in attribute_mapping.items():
           src_similarity = fuzz.ratio(processed_src_input, process_keep_stopwords(database_src))
           #print(src_similarity)
           if(src_similarity > highest_similarity):
            highest_similarity = src_similarity
            best_match = database_tgt

        # check best match
        #print(type(best_match))

        if(isinstance(best_match, float)):
            if math.isnan(best_match):
                best_match = "nan"
            else:
                best_match = str(best_match)
        
        if(isinstance(best_match, (float, int))):
            best_match = str(best_match)
           

        #print(best_match)
        #print(type(best_match))
            
        # check the similarity between our target Attribute and standard target Attribute
        if highest_similarity >= threshold:
            tgt_similarity = fuzz.ratio(processed_tgt_input, process_keep_stopwords(best_match))
            if(tgt_similarity>= threshold):            
                correct_number = correct_number + 1
                result_log += f"The mapping of {src_att} is True\n"
            else:
                result_log += f"The mapping of {src_att} is False\n"
        else:
            result_log += f"The mapping of {src_att} is False\n"
        #print("-----------")

        total_number = total_number + 1

    accuracy = correct_number / total_number if total_number > 0 else 0
    print(result_log)
    return accuracy


            
    
input_dict1 = {
    "HADM_ID": "visit_occurrence_id", #should right
    "ADMISSION_TYPE": "visit_type_concept_id", #should right
    "EDREGTIME" : "admitted_from_source_value", #should wrong
    "FLAG" : "0", #should right
    "SUBJECT_ID" : "nan", #should wrong
    "SPEC_ITEMID" : "specimen_type_concept_id" #should right
}

accuracy = check_mapping(input_dict1, attribute_mapping)
print(f"The accuracy is {accuracy:.2%}")