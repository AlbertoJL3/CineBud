from pymongo import MongoClient
from pymongo.server_api import ServerApi
from pymongo.errors import PyMongoError
from config import MONGO_URI
from backend.movie_services import fetch_movie_data
import certifi
from bson import ObjectId
from datetime import timedelta
import pandas as pd

try:
    client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tlsCAFile=certifi.where())
    db = client['moviesdb']
    collection = db['movies']
    users_collection = db['users']
except PyMongoError as e:
    print(f"Failed to connect to the database: {str(e)}")

def insert_movie(movie_data):
    result = collection.insert_one(movie_data)
    inserted_id = result.inserted_id
    inserted_movie = collection.find_one({"_id": inserted_id})
    if inserted_movie:
        inserted_movie['_id'] = str(inserted_movie['_id'])
    return inserted_movie

# Script that reads .csv with title and movie, fetches movie data, and saves it to the same csv
def process_movies(title, year):
    existing_movie = collection.find_one({'title': title, 'year': year})

    if existing_movie:
        existing_movie['_id'] = str(existing_movie['_id'])
        return existing_movie
    else:
        movie_data = fetch_movie_data(title, year)
        if movie_data:
            inserted_movie = insert_movie(movie_data)
            inserted_movie['_id'] = str(inserted_movie['_id'])
            return inserted_movie
        else: 
            return []
        
def process_csv(csv_file):
    df = pd.read_csv(csv_file)
    movies = []
    for i, row in df.iterrows():
        movie = process_movies(row['title'], row['release_date'][:4])
        print(row['title'])
        if movie:
            movies.append(movie)
    # write aditional data to csv
    df = pd.DataFrame(movies)
    print('saving')
    df.to_csv(f'{csv_file}', index=False)
    print(f'saved {csv_file}')

    return movies

# process_csv('backend/curation/data/Best_of_80s.csv')
process_csv('backend/curation/data/top_rated_movies.csv')