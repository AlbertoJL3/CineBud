import requests
from config import OMDB_API_KEY

def fetch_movie_data(movie_title):
    url = f'http://www.omdbapi.com/?t={movie_title}&apikey={OMDB_API_KEY}&plot=full'
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        if data['Response'] == 'True':
            return {
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
    return None