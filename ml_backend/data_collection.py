# Script to collect movie data from TMDb API
import requests
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables from the .env file
load_dotenv()

# Mongo Atlas URI
uri = os.environ.get('MONGO_URI')
# Set up the TMDb API key
api_key = os.getenv('OMDB_API_KEY')

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))
db = client['moviesdb']
collection = db['movies']

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

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
                'release_date': data['Released'], 
                'rotten_tomatoes': data['Ratings'][1]['Value'] if len(data['Ratings']) > 1 else None,
                'poster': data['Poster'],
                'runtime': data['Runtime'],
                'imdb_rating': data['imdbRating'],
            }
            collection.insert_one(movie_data)
            print(f'Inserted {movie_title} to DB')
        else:
            print(f"Movie not found: {movie_title}")
    else:
        print(f"Failed to fetch data for: {movie_title}")

# List of movies to fetch data for
movies = ['The Shawshank Redemption', 'The Godfather', 'Pulp Fiction'] 
for movie in movies: 
    fetch_and_store_movie_data(movie)