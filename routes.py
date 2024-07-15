from flask import Flask, jsonify, request

from backend.data_collection import insert_movie, get_movie, get_all_movies, update_movie, delete_movie
from backend.movie_service import fetch_movie_data

app = Flask(__name__)

@app.route('/movies', methods=['POST'])
def add_movie():
    movie_title = request.json['title']
    movie_data = fetch_movie_data(movie_title)
    if movie_data:
        insert_movie(movie_data)
        return jsonify(movie_data), 201
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['GET'])
def get_movie_by_id(movie_id):
    movie = get_movie(movie_id)
    if movie:
        return jsonify(movie)
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies', methods=['GET'])
def get_movies():
    movies = get_all_movies()
    return jsonify(movies)

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
    app.run(debug=True)