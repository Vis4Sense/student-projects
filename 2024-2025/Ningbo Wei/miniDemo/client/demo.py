from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow CORS in FLask

# store the titles sent by chrom extention
tab_titles = []

@app.route('/tabs', methods=['POST'])  # use POST method to gain data(these data are sent from google extention)
def receive_tabs():
    global tab_titles
    data = request.json
    tab_titles = data.get('titles', [])
    return jsonify({"message": "Titles received successfully!"})

@app.route('/')
def display_tabs():
    global tab_titles
    return jsonify({'titles': tab_titles})

if __name__ == '__main__':
    app.run(port=8080)
