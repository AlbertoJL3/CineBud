from pymongo import MongoClient
from pymongo.server_api import ServerApi
from config import MONGO_URI
import certifi

def remove_duplicate_movies():
    try:
        # Connect to MongoDB
        client = MongoClient(MONGO_URI, server_api=ServerApi('1'), tlsCAFile=certifi.where())
        db = client['moviesdb']
        collection = db['movies']

        # Find duplicate movies based on title and year
        pipeline = [
            {
                "$group": {
                    "_id": {"title": "$title", "year": "$year"},
                    "uniqueIds": {"$addToSet": "$_id"},
                    "count": {"$sum": 1}
                }
            },
            {
                "$match": {
                    "count": {"$gt": 1}
                }
            }
        ]

        duplicate_groups = list(collection.aggregate(pipeline))

        total_duplicates = 0
        for group in duplicate_groups:
            # Keep the first occurrence and remove the rest
            duplicate_ids = group['uniqueIds'][1:]
            total_duplicates += len(duplicate_ids)
            collection.delete_many({"_id": {"$in": duplicate_ids}})

        print(f"Removed {total_duplicates} duplicate movies.")

        # Optionally, you can also remove movies with missing essential fields
        missing_fields_query = {
            "$or": [
                {"title": {"$exists": False}},
                {"year": {"$exists": False}},
                {"title": ""},
                {"year": ""}
            ]
        }
        result = collection.delete_many(missing_fields_query)
        print(f"Removed {result.deleted_count} movies with missing essential fields.")

    except Exception as e:
        print(f"An error occurred: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    remove_duplicate_movies()