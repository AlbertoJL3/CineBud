# Script to collect movie data from TMDb API
import requests
import pymongo
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from the .env file
load_dotenv()

# Set up the TMDb API key
api_key = os.getenv('OMDB_API_KEY')

#Connect to MongoDB
client  = MongoClient('mongodb://localhost:27017/')
db = client['movie_recommendation']
collection = db['movies']

def fetch_and_store_movie_data(movie_title):
    url = f'http://www.omdbapi.com/?t={movie_title}&apikey={api_key}&plot=full'
    print(url)
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['Response'] == 'True':
            movie_data = {
                'id': data['imdbID'],
                'title': data['Title'],
                'genres': data['Genre'].split(', '),
                'actors': data['Actors'].split(', '),
                'director': data['Director'].split(', '),
                'plot': data['Plot'],
                'release_date': data['Released']
            }
            collection.insert_one(movie_data)
            print(f'Inserted {movie_title} to DB')
        else:
            print(f"Movie not found: {movie_title}")
    else:
        print(f"Failed to fetch data for: {movie_title}")


# Example: Fetch and store data for a list of movie titles
movie_titles = ['The Matrix', 'Inception', 'Interstellar']  # Example movie titles
for title in movie_titles:
    fetch_and_store_movie_data(title)