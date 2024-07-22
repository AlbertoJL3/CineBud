from flask import Flask, jsonify, render_template, url_for, request
from flask_cors import CORS
from backend import insert_movie, get_movie, get_all_movies, update_movie, delete_movie, fetch_movie_data, process_movies
from flask import render_template
import pandas as pd
from backend import fetch_movie_data, get_chatgpt_response, handle_prompt, load_movies_from_json

app = Flask(__name__)

# Allow CORS
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/movies', methods=['POST'])
def add_movie():
    movie_title = request.json['title']
    movie_data = fetch_movie_data(movie_title)
    if movie_data:
        inserted_movie = insert_movie(movie_data)
        return jsonify(inserted_movie), 201
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['GET'])
def get_movie_by_id(movie_id):
    movie = get_movie(movie_id)
    if movie:
        return jsonify(movie)
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies', methods=['GET'])
def get_movies():
    # Get all movies
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

@app.route('/movie_results', methods=['POST'])
def movie_results():
    prompt = request.form['prompt']
    
    # Handle the prompt and write to JSON
    handle_prompt(prompt)
    movies = []
    # Load the movies from the csv file
    try:
        movies_data = pd.read_csv('movies.csv')
        
        for _, row in movies_data.iterrows():
            movie_data = process_movies(row['title'], str(row['year']))
            if movie_data:
                movies.append(movie_data)

    except FileNotFoundError:
        return render_template('error.html', message="Movie data not found.")
    
    except Exception as e:
        return render_template('error.html', message="An error occurred while processing movie data.")
    
    print("test: ", movies)
    flattened_movies = [movie for sublist in movies for movie in sublist]
    
    return render_template('movie_results.html', movies=flattened_movies)

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change port if needed