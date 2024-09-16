
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import certifi

uri = ""

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'), tlsCAFile=certifi.where())
db = client['moviesdb']
collection = db['movies']
users = db['users']
user = users.find_one({'email': '363alberto@gmail.com'})

# Send a ping to confirm a successful connection
try:
    print(user)
    # print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)
