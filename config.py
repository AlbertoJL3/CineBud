import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.environ.get('MONGO_URI')
OMDB_API_KEY = os.environ.get('OMDB_API_KEY')