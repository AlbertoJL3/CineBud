from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import PyMongoError
from config import MONGO_URI
from backend.movie_services import fetch_movie_data
import certifi

try:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tlsCAFile=certifi.where())
    db = client['moviesdb']
    collection = db['movies']
except PyMongoError as e:
    print(f"Failed to connect to the database: {str(e)}")

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
            print('inserted_movie:', inserted_movie)
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
