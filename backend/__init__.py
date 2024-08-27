# backend/__init__.py

from .controllers import insert_movie, get_movie, get_all_movies, update_movie, delete_movie, process_movies
from .controllers import register_user, login_user, get_user_profile, update_user_profile
from .movie_services import fetch_movie_data
from .models.gpt import get_chatgpt_response, handle_prompt, load_movies_from_json
__all__ = [
    'insert_movie', 'get_movie', 'get_all_movies', 'update_movie', 'delete_movie', 'process_movies'
    'fetch_movie_data',
    'get_chatgpt_response', 'handle_prompt', 'load_movies_from_json',
    'register_user', 'login_user', 'get_user_profile', 'update_user_profile'
]
