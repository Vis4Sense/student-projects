```json
{
sensemaking_project/
│
├── data/                  # For storing raw and preprocessed data
│   ├── raw/               # Raw data obtained from the Google Knowledge Graph API
│   └── processed/         # Preprocessed data ready for model consumption
│
├── models/                # Contains model definitions and training scripts
│   ├── rnn_model.py       # RNN model definition and training process
│   └── tokenizer.pickle   # Saved tokenizer instance for converting text to sequences
│
├── notebooks/             # Jupyter notebooks for exploratory data analysis and prototyping
│   └── data_preprocessing.ipynb
│
├── utils/                 # Utility scripts for tasks like data loading and preprocessing
│   └── data_utils.py
│
└── requirements.txt       # Project dependencies
}
