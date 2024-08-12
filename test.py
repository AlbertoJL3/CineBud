# I need to troubleshoot this api call 
import requests
import os
from dotenv import load_dotenv

load_dotenv()

movie_title = "The Matrix"
year = "1999"
OMDP_API_KEY = os.getenv('OMDP_API_KEY')

print(OMDP_API_KEY)

url = f'http://www.omdbapi.com/?t={movie_title}&apikey={OMDP_API_KEY}&plot=full&y={year}'
response = requests.get(url)

print(response)
print(response.json())