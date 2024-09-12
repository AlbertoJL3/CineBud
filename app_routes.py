from flask import Flask, jsonify, render_template, url_for, request
from flask_cors import CORS
from backend import insert_movie, get_movie, get_all_movies, update_movie, delete_movie, fetch_movie_data, process_movies
from backend import register_user, login_user, get_user_profile, update_user_profile
from flask import render_template
import pandas as pd
from backend import fetch_movie_data, get_chatgpt_response, handle_prompt, load_movies_from_json
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity, create_access_token, create_refresh_token
from backend.controllers import get_watchlist, add_to_watchlist, remove_from_watchlist, process_cached_movies
import os
from dotenv import load_dotenv
import bson.errors as bson_errors
from bson import ObjectId, json_util
from datetime import timedelta
import json


load_dotenv()

app = Flask(__name__)

# Allow CORS for all domains on all routes
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

# Setup the Flask-JWT-Extended extension
SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
if not SECRET_KEY:
    raise ValueError("No JWT_SECRET_KEY set for JWT authentication")

app.config['JWT_SECRET_KEY'] = SECRET_KEY
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
app.config['JWT_REFRESH_TOKEN_EXPIRES'] = timedelta(days=30)
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    user, status_code = register_user(data['username'], data['email'], data['password'])
    return jsonify(user), status_code

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user_input = data.get('username', '').lower()  # This could be either username or email
    password = data.get('password')

    # First, try to login with the input as username
    result, status_code = login_user(user_input, password)

    if status_code != 200:
        # If login with username failed, try with email
        result, status_code = login_user(user_input, password, is_email=True)

    if status_code == 200:
        # Create access token using the user_id from the result
        access_token = create_access_token(identity=result['user_id'])
        result['access_token'] = access_token

    return jsonify(result), status_code

@app.route('/refresh-token', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    new_access_token = create_access_token(identity=current_user)
    return jsonify(access_token=new_access_token), 200

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    user, status_code = get_user_profile()
    return jsonify(user), status_code

@app.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    data = request.get_json()
    result, status_code = update_user_profile(data)
    return jsonify(result), status_code

@app.route('/movies', methods=['POST'])
@jwt_required()
def add_movie():
    movie_title = request.json['title']
    movie_data = fetch_movie_data(movie_title)
    if movie_data:
        inserted_movie = insert_movie(movie_data)
        return jsonify(inserted_movie), 201
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['GET'])
@jwt_required()
def get_movie_by_id(movie_id):
    movie = get_movie(movie_id)
    if movie:
        return jsonify(movie)
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies', methods=['GET'])
@jwt_required()
def get_movies():
    movies = get_all_movies()
    return jsonify(movies)

@app.route('/movies/<movie_id>', methods=['PUT'])
@jwt_required()
def update_movie_by_id(movie_id):
    update_data = request.json
    updated = update_movie(movie_id, update_data)
    if updated:
        return jsonify({'message': 'Movie updated successfully'})
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movies/<movie_id>', methods=['DELETE'])
@jwt_required()
def delete_movie_by_id(movie_id):
    deleted = delete_movie(movie_id)
    if deleted:
        return jsonify({'message': 'Movie deleted successfully'})
    return jsonify({'error': 'Movie not found'}), 404

@app.route('/movie_results', methods=['POST'])
@jwt_required()
def movie_results():
    prompt = request.form['prompt']
    
    handle_prompt(prompt)
    movies = []
    try:
        movies_data = pd.read_csv('movies.csv')
        movies_data = movies_data.drop_duplicates(subset=['title'])
        print(movies_data)
        for _, row in movies_data.iterrows():
            movie_data = process_movies(row['title'], str(row['year']))
            movies.append(movie_data)

        flattened_movies = []
        for sublist in movies:
            if isinstance(sublist, list):
                flattened_movies.extend(movie for movie in sublist if movie)
            elif sublist:
                flattened_movies.append(sublist)
        return flattened_movies
    except Exception as e:
        print(e)

@app.route('/popular-movies', methods=['GET'])
@jwt_required()
def popular_movies():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('backend/curation/data/popularity_movies.csv')

        movies = []
        for _, row in movies_data.iterrows():
            print('fetching: ', row['title'])
            # Fetch detailed movie data using the process_movies function
            movie_data = process_cached_movies(row)
            # clean movie_data information of [, and '
            
            movies.append(movie_data)
        
        # Convert the list of movies to a JSON-serializable format
        json_compatible_movies = json.loads(json_util.dumps(movies))
        
        return jsonify(json_compatible_movies)
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred processing the request'}), 500

@app.route('/watchlist', methods=['GET'])
@jwt_required()
def get_user_watchlist():
    return get_watchlist()

@app.route('/watchlist', methods=['POST'])
@jwt_required()
def add_movie_to_watchlist():
    movie_id = request.json.get('movieId')
    try:
        ObjectId(movie_id)
    except bson_errors.InvalidId:
        return jsonify({'error': 'Invalid movie ID'}), 400
    return add_to_watchlist(movie_id)

@app.route('/watchlist/<movie_id>', methods=['DELETE'])
@jwt_required()
def remove_movie_from_watchlist(movie_id):
    try:
        ObjectId(movie_id)
    except bson_errors.InvalidId:
        return jsonify({'error': 'Invalid movie ID'}), 400
    return remove_from_watchlist(movie_id)

@app.route('/top-rated-movies', methods=['GET'])
@jwt_required()
def top_rated_movies():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('backend/curation/data/top_rated_movies.csv')

        movies = []
        for _, row in movies_data.iterrows():
            print('fetching: ', row['title'])
            # Fetch detailed movie data using the process_movies function
            movie_data = process_cached_movies(row)
            # clean movie_data information of [, and '
            
            movies.append(movie_data)
        
        # Convert the list of movies to a JSON-serializable format
        json_compatible_movies = json.loads(json_util.dumps(movies))
        
        return jsonify(json_compatible_movies)
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred processing the request'}), 500

@app.route('/best-of-70s', methods=['GET'])
def getBestOf70s():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('backend/curation/data/Best_of_70s.csv')
        movies = []
        for _, row in movies_data.iterrows():
            print('fetching: ', row['title'])
            # Fetch detailed movie data using the process_movies function
            movie_data = process_cached_movies(row)
            # clean movie_data information of [, and '
            
            movies.append(movie_data)
        
        # Convert the list of movies to a JSON-serializable format
        json_compatible_movies = json.loads(json_util.dumps(movies))
        
        return jsonify(json_compatible_movies)
    except Exception as e:
        print(e)
        return str(e), 500

@app.route('/best-of-80s', methods=['GET'])
def getBestOf80s():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('backend/curation/data/Best_of_80s.csv')
        movies = []
        for _, row in movies_data.iterrows():
            print('fetching: ', row['title'])
            # Fetch detailed movie data using the process_movies function
            movie_data = process_cached_movies(row)
            # clean movie_data information of [, and '
            
            movies.append(movie_data)
        
        # Convert the list of movies to a JSON-serializable format
        json_compatible_movies = json.loads(json_util.dumps(movies))
        
        return jsonify(json_compatible_movies)
    except Exception as e:
        print(e)
        return str(e), 500

@app.route('/best-of-90s', methods=['GET'])
def getBestOf90s():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('backend/curation/data/Best_of_90s.csv')
        movies = []
        for _, row in movies_data.iterrows():
            print('fetching: ', row['title'])
            # Fetch detailed movie data using the process_movies function
            movie_data = process_cached_movies(row)
            # clean movie_data information of [, and '
            
            movies.append(movie_data)
        
        # Convert the list of movies to a JSON-serializable format
        json_compatible_movies = json.loads(json_util.dumps(movies))
        
        return jsonify(json_compatible_movies)
    except Exception as e:
        print(e)
        return str(e), 500


if __name__ == '__main__':
    app.run(debug=True, port=5001)