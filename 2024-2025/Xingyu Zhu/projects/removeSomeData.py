import pandas as pd
import math

df = pd.read_csv('data/MIMIC_to_OMOP_Mapping.csv')

attribute_mapping = dict(zip(df['SRC_ATT'], df['TGT_ATT']))

#remove all the nan
cleaned_mapping = {k: v for k, v in attribute_mapping.items() if not pd.isna(v)}

cleaned_df = pd.DataFrame(cleaned_mapping.items(), columns=['SRC_ATT', 'TGT_ATT'])

cleaned_df.to_csv('data/Cleaned_Mapping.csv', index=False)

print("clean over！")


df2 = pd.read_csv('data/MIMIC_III_Schema.csv')

attribute_mapping = dict(zip(df2['ColumnName'], df2['ColumnDesc']))

#remove all the nan
cleaned_mapping = {k: v for k, v in attribute_mapping.items() if not pd.isna(v)}

cleaned_df = pd.DataFrame(cleaned_mapping.items(), columns=['ATT', 'DES'])

cleaned_df.to_csv('data/Cleaned_MIMIC.csv', index=False)


df3 = pd.read_csv('data/OMOP_Schema.csv')

attribute_mapping = dict(zip(df3['ColumnName'], df3['ColumnDesc']))

#remove all the nan
cleaned_mapping = {k: v for k, v in attribute_mapping.items() if not pd.isna(v)}

cleaned_df = pd.DataFrame(cleaned_mapping.items(), columns=['ATT', 'DES'])

cleaned_df.to_csv('data/Cleaned_OMOP_Schema.csv', index=False)

print("over")
