import os

db_dir = "./db"
db_file = "data.db"
db_path = os.path.join(db_dir, db_file)

project_dir = os.path.dirname(os.path.abspath(__file__))

queue_maxsize = 10000

debug = True if os.environ.get("DEBUG", 0) == "1" else False
