# I need to troubleshoot this api call 
import requests
import os
from dotenv import load_dotenv
import pandas as pd

load_dotenv()

movie_data = pd.read_csv('popularity_movies.csv')
movie_data = movie_data.dropna()
movie_data = movie_data.drop_duplicates(subset='title')
movie_data['year'] = movie_data['release_date'].apply(lambda x: x.split('-')[0])
OMDP_API_KEY = os.getenv('OMDP_API_KEY')
YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

import requests
from bs4 import BeautifulSoup
import re
import time

def search_youtube_trailer(movie_title):
    query = f"{movie_title} official trailer"
    search_url = f"https://www.youtube.com/results?search_query={query.replace(' ', '+')}"
    
    response = requests.get(search_url)
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # Find all script tags
    scripts = soup.find_all('script')
    
    # Look for the script that contains video information
    for script in scripts:
        if 'var ytInitialData = ' in script.text:
            # Extract the JSON-like string
            json_text = script.text.split('var ytInitialData = ')[1].split(';</script>')[0]
            
            # Use regex to find video IDs
            video_ids = re.findall(r'"videoId":"(.*?)"', json_text)

            if video_ids:
                # For some hilarious reason Wicked is a very popular trailer that shows up in the search results
                if video_ids[0] != '6COmYeLsz4c':
                    return f"https://www.youtube.com/watch?v={video_ids[0]}"
                else: 
                    return f"https://www.youtube.com/watch?v={video_ids[1]}"
    
    return None

def find_trailers(movie_data):
    count = 0 
    max = 25
    for index, row in movie_data.iterrows():
        if count >= max:
            break
        title = row['title']
        trailer = search_youtube_trailer(title)
       # save to movie data in DB

find_trailers(movie_data)