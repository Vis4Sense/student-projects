import pandas as pd

def csv_to_xlsx(file_path):
    # read csv
    df = pd.read_csv(file_path)
    
    xlsx_file_path = file_path.rsplit('.', 1)[0] + '.xlsx'
    
    # save data to xlsx
    df.to_excel(xlsx_file_path, index=False)
    
    print(f"File saved as: {xlsx_file_path}")

csv_to_xlsx('data/OMOP_Schema.csv')
