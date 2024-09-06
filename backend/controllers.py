from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import PyMongoError
from config import MONGO_URI
from backend.movie_services import fetch_movie_data
import certifi
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from bson import ObjectId

try:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tlsCAFile=certifi.where())
    db = client['moviesdb']
    collection = db['movies']
    users_collection = db['users']
except PyMongoError as e:
    print(f"Failed to connect to the database: {str(e)}")


def register_user(username, email, password):
    try:
        existing_user = users_collection.find_one({'$or': [{'username': username}, {'email': email}]})
        if existing_user:
            return {'error': 'Username or email already exists'}, 400

        hashed_password = generate_password_hash(password)
        new_user = {
            'username': username,
            'email': email,
            'password': hashed_password
        }
        result = users_collection.insert_one(new_user)
        new_user['_id'] = str(result.inserted_id)
        del new_user['password']  # Don't send password back to client
        return new_user, 201
    except PyMongoError as e:
        print(f"Username or email already exists: {str(e)}")
        return {'error': 'Registration failed'}, 500
    
def login_user(user_input, password, is_email=False):
    try:
        if is_email:
            user = users_collection.find_one({'email': user_input.lower()})
        else:
            user = users_collection.find_one({'username': user_input.lower()})

        if user and check_password_hash(user['password'], password):
            access_token = create_access_token(identity=str(user['_id']))
            return {'access_token': access_token}, 200
        else:
            return {'error': 'Invalid username/email or password'}, 401
    except PyMongoError as e:
        print(f"Invalid username/email or password: {str(e)}")
        return {'error': 'Login failed'}, 500

@jwt_required()
def get_user_profile():
    try:
        current_user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': current_user_id})
        if user:
            user['_id'] = str(user['_id'])
            del user['password']  # Don't send password back to client
            return user, 200
        else:
            return {'error': 'User not found'}, 404
    except PyMongoError as e:
        print(f"An error occurred while fetching the user profile: {str(e)}")
        return {'error': 'Failed to fetch user profile'}, 500

@jwt_required()
def update_user_profile(update_data):
    try:
        current_user_id = get_jwt_identity()
        result = users_collection.update_one({'_id': current_user_id}, {'$set': update_data})
        if result.modified_count:
            return {'message': 'Profile updated successfully'}, 200
        else:
            return {'error': 'No changes made to the profile'}, 400
    except PyMongoError as e:
        print(f"An error occurred while updating the user profile: {str(e)}")
        return {'error': 'Failed to update user profile'}, 500

def process_movies(title, year):

    existing_movie = collection.find_one({'title': title, 'year': year})

    if existing_movie:
        # Convert ObjectId to string for JSON serialization
        existing_movie['_id'] = str(existing_movie['_id'])
        
        return existing_movie
    else:
        # Step 3: Fetch movie data from OMDb API
        movie_data = fetch_movie_data(title, year)

        if movie_data:
            # Step 4: Insert the new movie into the database
            inserted_movie = insert_movie(movie_data)
            inserted_movie['_id'] = str(inserted_movie['_id'])
            return inserted_movie
        else: 
            return []

def insert_movie(movie_data):
    result = collection.insert_one(movie_data)
    inserted_id = result.inserted_id
    inserted_movie = collection.find_one({"_id": inserted_id})
    if inserted_movie:
        inserted_movie['_id'] = str(inserted_movie['_id'])
    return inserted_movie

def get_movie(movie_id):
    try:
        return collection.find_one({'id': movie_id})
    except PyMongoError as e:
        print(f"An error occurred while fetching the movie: {str(e)}")
        return None

def get_all_movies():
    try:
        movies = list(collection.find())
        for movie in movies:
            movie['_id'] = str(movie['_id'])
        return movies
    except Exception as e:
        print(f"An error occurred: {str(e)}")
        return []

def update_movie(movie_id, update_data):
    try:
        result = collection.update_one({'id': movie_id}, {'$set': update_data})
        return result.modified_count
    except PyMongoError as e:
        print(f"An error occurred while updating the movie: {str(e)}")
        return 0

def delete_movie(movie_id):
    try:
        result = collection.delete_one({'id': movie_id})
        return result.deleted_count
    except PyMongoError as e:
        print(f"An error occurred while deleting the movie: {str(e)}")
        return 0
    
@jwt_required()
def get_watchlist():
    try:
        current_user_id = get_jwt_identity()
        user = users_collection.find_one({'_id': ObjectId(current_user_id)})
        if user and 'watchlist' in user:
            watchlist_ids = [ObjectId(movie_id) for movie_id in user['watchlist']]
            watchlist_movies = list(collection.find({'_id': {'$in': watchlist_ids}}))
            for movie in watchlist_movies:
                movie['_id'] = str(movie['_id'])
            return watchlist_movies, 200
        else:
            return [], 200
    except PyMongoError as e:
        print(f"An error occurred while fetching watchlist: {str(e)}")
        return {'error': 'Failed to fetch watchlist'}, 500

@jwt_required()
def add_to_watchlist(movie_id):
    try:
        current_user_id = get_jwt_identity()
        movie_object_id = ObjectId(movie_id)
        print(movie_id)
        # First, check if the movie exists in the movies collection
        movie = collection.find_one({'_id': movie_object_id})
        if not movie:
            return {'error': 'Movie not found'}, 404

        # Then, update the user's watchlist
        result = users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$addToSet': {'watchlist': str(movie_object_id)}}
        )
        
        if result.modified_count:
            # Fetch the updated user document
            updated_user = users_collection.find_one({'_id': ObjectId(current_user_id)})
            return {'message': 'Movie added to watchlist', 'watchlist': updated_user.get('watchlist', [])}, 200
        else:
            return {'message': 'Movie already in watchlist'}, 200
    except PyMongoError as e:
        print(f"An error occurred while adding to watchlist: {str(e)}")
        return {'error': 'Failed to add movie to watchlist'}, 500

@jwt_required()
def remove_from_watchlist(movie_id):
    try:
        current_user_id = get_jwt_identity()
        result = users_collection.update_one(
            {'_id': ObjectId(current_user_id)},
            {'$pull': {'watchlist': str(movie_id)}}
        )
        if result.modified_count:
            return {'message': 'Movie removed from watchlist'}, 200
        else:
            return {'message': 'Movie not in watchlist'}, 200
    except PyMongoError as e:
        print(f"An error occurred while removing from watchlist: {str(e)}")
        return {'error': 'Failed to remove movie from watchlist'}, 500