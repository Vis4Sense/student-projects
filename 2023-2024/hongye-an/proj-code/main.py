import json

import chromadb

COLLECTION_NAME = 'default'
FETCH_RESULT_NUM = 5


def load_test_data(db_file_path: str):
    file_based_client = chromadb.PersistentClient(path=db_file_path)
    collection = file_based_client.create_collection(COLLECTION_NAME)

    with open('./arxiv_test.json') as f:
        test_data = json.loads(f.read())

    for item in test_data:
        collection.add(
            documents=[item.get('summary')],
            ids=[item.get('id')],
            metadatas=[item]
        )


if __name__ == '__main__':
    file_based_client = chromadb.PersistentClient(path='./test.db')
    collection = file_based_client.get_collection(COLLECTION_NAME)

    while True:
        input_text = input("type word for test, type 'quit' for quit : ")
        if input_text == 'quit':
            break

        fetch_result = collection.query(query_texts=[input_text], n_results=FETCH_RESULT_NUM,)

        result_data_clean = []
        for idx in range(FETCH_RESULT_NUM):
            metadata = fetch_result['metadatas'][0][idx]

            result_data_clean.append({
                'distance': fetch_result['distances'][0][idx],
                'title': metadata['title'],
                'link': metadata['link'],
                'summary': metadata['summary']
            })

        print(json.dumps(result_data_clean, indent=2))
