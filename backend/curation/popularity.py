import requests
#import key from .env   file
from dotenv import load_dotenv
import os
import pandas as pd

load_dotenv()

tmdb_api_key = os.getenv('TMDB_API_KEY')

# Fetch movies released between 2022 and 2024 from TMDb
tmdb_base_url = 'https://api.themoviedb.org/3/discover/movie'
#only english and spanish movies sort by rotten tomatoes rating
tmdb_params = {
    'api_key': tmdb_api_key,
    'sort_by': 'popularity.desc',
    'primary_release_date.gte': '2024-01-01',
    'primary_release_date.lte': '2024-12-31',
   }

def show_pages(pages, title):
    movies = []
    for page in range(1, pages + 1):
        tmdb_params['page'] = page
        tmdb_response = requests.get(tmdb_base_url, params=tmdb_params)
        tmdb_movies = tmdb_response.json().get('results', [])
        count = 0
        for movie in tmdb_movies:
            count += 1
            print(f"{movie['title']} ({movie['release_date'][:4]})")
            #write to csv
            movies.append(movie)
    #only save title and year of movie
    df = pd.DataFrame(movies)
    df = df[['title','release_date']]
    df.to_csv(f'{title}.csv', index=False)

show_pages(50, 'popularity_movies_2021_2024')