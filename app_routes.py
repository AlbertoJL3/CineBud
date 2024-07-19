from flask import Flask, jsonify, request
from flask_cors import CORS
from backend.controllers import insert_movie, get_movie, get_all_movies, update_movie, delete_movie
from backend.movie_service import fetch_movie_data
from bson import ObjectId
import json

app = Flask(__name__)

# Custom JSON Encoder to handle ObjectId serialization
class CustomJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Apply the custom JSON encoder to the Flask app
app.json_encoder = CustomJSONEncoder

# Allow CORS
CORS(app)

def convert_to_json_serializable(data):
    """Recursively convert MongoDB documents to a JSON serializable format."""
    if isinstance(data, list):
        return [convert_to_json_serializable(item) for item in data]
    if isinstance(data, dict):
        return {key: convert_to_json_serializable(value) for key, value in data.items()}
    if isinstance(data, ObjectId):
        return str(data)
    return data

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the movie API'})

@app.route('/movies', methods=['POST'])
def add_movie():
    movie_title = request.json['title']
    movie_data = fetch_movie_data(movie_title)
    if movie_data:
        inserted_movie = insert_movie(movie_data)
        return jsonify(convert_to_json_serializable(inserted_movie)), 201
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['GET'])
def get_movie_by_id(movie_id):
    movie = get_movie(movie_id)
    if movie:
        return jsonify(convert_to_json_serializable(movie))
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies', methods=['GET'])
def get_movies():
    # Get all movies
    movies = get_all_movies()
    return jsonify(convert_to_json_serializable(movies))

@app.route('/movies/<movie_id>', methods=['PUT'])
def update_movie_by_id(movie_id):
    update_data = request.json
    updated = update_movie(movie_id, update_data)
    if updated:
        return jsonify({'message': 'Movie updated successfully'})
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['DELETE'])
def delete_movie_by_id(movie_id):
    deleted = delete_movie(movie_id)
    if deleted:
        return jsonify({'message': 'Movie deleted successfully'})
    return jsonify({'error': 'Movie not found'}), 404

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change port if needed
