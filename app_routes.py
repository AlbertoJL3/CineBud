from flask import Flask, jsonify, render_template, url_for, request
from flask_cors import CORS
from backend import insert_movie, get_movie, get_all_movies, update_movie, delete_movie, fetch_movie_data, process_movies
from backend import register_user, login_user, get_user_profile, update_user_profile
from flask import render_template
import pandas as pd
from backend import fetch_movie_data, get_chatgpt_response, handle_prompt, load_movies_from_json
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity


app = Flask(__name__)

# Allow CORS for all domains on all routes
CORS(app)

@app.route('/')
def index():
    return render_template('index.html')

# Setup the Flask-JWT-Extended extension
app.config['JWT_SECRET_KEY'] = 'ronswansonrox12345'  # Change this!
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
        # You might need to create a new function `login_user_by_email` in controllers.py
        # or modify the existing `login_user` function to handle both cases
        result, status_code = login_user(user_input, password, is_email=True)

    return jsonify(result), status_code

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

        # Remove duplicates from movies.csv
        movies_data = movies_data.drop_duplicates(subset=['title'])
        print(movies_data)
        for _, row in movies_data.iterrows():
            movie_data = process_movies(row['title'], str(row['year']))
            movies.append(movie_data)

        flattened_movies = []
        for sublist in movies:
            if isinstance(sublist, list):
                flattened_movies.extend(movie for movie in sublist if movie)
            elif sublist:  # If it's not a list but still a truthy value
                flattened_movies.append(sublist)
        return flattened_movies
    except Exception as e:
        print(e)

@app.route('/popular-movies', methods=['GET'])
def popular_movies():
    try:
        # Read the CSV file
        movies_data = pd.read_csv('popularity_movies.csv')
        
        # Remove duplicates and extract the year from the release_date
        movies_data = movies_data.drop_duplicates(subset=['title'])
        movies_data['year'] = pd.to_datetime(movies_data['release_date']).dt.year

        # Get pagination parameters from request
        page = int(request.args.get('page', 1))
        per_page = int(request.args.get('per_page', 15))  # Default to 50 movies per page

        # Calculate start and end index for pagination
        start = (page - 1) * per_page
        end = start + per_page

        movies = []
        for _, row in movies_data.iloc[start:end].iterrows():
            # Fetch detailed movie data using the fetch_movie_data function
            movie_data = fetch_movie_data(row['title'], str(row['year']))
            if movie_data:
                movies.append(movie_data)

        return jsonify(movies)
    except Exception as e:
        print(e)
        return jsonify({'error': 'An error occurred processing the request'}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Change port if needed