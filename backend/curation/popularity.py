import requests
#import key from .env   file
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

tmdb_api_key = os.getenv('TMDB_API_KEY')

# Fetch movies released between 2022 and 2024 from TMDb
tmdb_base_url = 'https://api.themoviedb.org/3/discover/movie'

#only english and spanish movies sort by rotten tomatoes rating minimum 100 votes
tmdb_params = {
    'api_key': tmdb_api_key,
    'sort_by': 'popularity.desc',
    'vote_count.gte': 100,
    'primary_release_date.gte': '2021-01-01',
    'primary_release_date.lte': '2024-12-31',
   }
def get_imdb_id(movie_id):
    tmdb_movie_url = f'https://api.themoviedb.org/3/movie/{movie_id}/external_ids'
    tmdb_params = {
        'api_key': tmdb_api_key
    }
    tmdb_response = requests.get(tmdb_movie_url, params=tmdb_params)
    tmdb_movie_data = tmdb_response.json()
    imdb_id = tmdb_movie_data.get('imdb_id')
    return imdb_id

# needs id of movie to get more information
def show_pages(pages, title):
    movies = []
    for page in range(1, pages + 1):
        tmdb_params['page'] = page
        tmdb_response = requests.get(tmdb_base_url, params=tmdb_params)
        tmdb_movies = tmdb_response.json().get('results', [])
   
        for movie in tmdb_movies:
            #print movie title and year
            print(f"{movie['title']} ({movie['release_date'][:4]})  {movie['id']}")
            #write to csv
            movies.append(movie)

    # Read OMDB API and get imdb_id and add as column
    for movie in movies:
        imdb_id = get_imdb_id(movie['id'])
        movie['imdb_id'] = imdb_id
    # only save title, year, imdb_id to csv
    movies_data = pd.DataFrame(movies)
    movies_data = movies_data[['title', 'release_date', 'id', 'imdb_id']]
    movies_data.to_csv(f'{title}.csv', index=False)

show_pages(30, 'popularity_movies')
