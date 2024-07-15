from pymongo import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URI


client = MongoClient(MONGO_URI, server_api=ServerApi('1'))
db = client['moviesdb']
collection = db['movies']

def insert_movie(movie_data):
    if collection.find_one({'id': movie_data['id']}) is None:
        collection.insert_one(movie_data)
        print(f'Inserted {movie_data["title"]} to DB')
    else:
        print(f'Movie already exists in DB: {movie_data["title"]}')

def get_movie(movie_id):
    return collection.find_one({'id': movie_id})


def get_all_movies():
    movies = list(collection.find())
    for movie in movies:
        movie['_id'] = str(movie['_id'])
    return movies

def update_movie(movie_id, update_data):
    result = collection.update_one({'id': movie_id}, {'$set': update_data})
    return result.modified_count

def delete_movie(movie_id):
    result = collection.delete_one({'id': movie_id})
    return result.deleted_count